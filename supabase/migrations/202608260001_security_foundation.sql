-- PropFind security foundation. Run with the Supabase CLI; never expose service_role to clients.
create extension if not exists pgcrypto;
create type public.user_role as enum ('member','owner','agent','admin');
create type public.account_status as enum ('active','suspended','deleted');
create type public.listing_status as enum ('draft','published','suspended','archived');
create type public.report_reason as enum ('fraud','duplicate','incorrect','unavailable','abuse','other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 100),
  role public.user_role not null default 'member',
  status public.account_status not null default 'active',
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.publisher_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  kind public.user_role not null check (kind in ('owner','agent')),
  agency text check (char_length(agency) <= 120), ppra_ffc_number text check (char_length(ppra_ffc_number) <= 80),
  bio text check (char_length(bio) <= 1000), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.listings (
  id uuid primary key default gen_random_uuid(), publisher_id uuid not null references public.profiles(id),
  status public.listing_status not null default 'draft', title text not null check (char_length(title) between 10 and 120),
  mode text not null check (mode in ('buy','rent','commercial')), property_type text not null check (char_length(property_type) <= 80),
  price numeric(14,2) not null check (price > 0 and price <= 1000000000), price_suffix text check (char_length(price_suffix) <= 40),
  suburb text not null, city text not null, province text not null, address text not null,
  latitude numeric(9,6) check (latitude between -90 and 90), longitude numeric(9,6) check (longitude between -180 and 180),
  bedrooms int not null default 0 check (bedrooms between 0 and 100), bathrooms int not null default 0 check (bathrooms between 0 and 100),
  garages int not null default 0 check (garages between 0 and 100), floor_size int not null default 0 check (floor_size between 0 and 1000000),
  description text not null check (char_length(description) between 30 and 5000), amenities text[] not null default '{}', featured boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
create table public.listing_images (
  id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique, alt_text text not null check (char_length(alt_text) <= 200), position int not null check (position between 0 and 19),
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')), byte_size int not null check (byte_size between 1 and 10485760), created_at timestamptz not null default now(), unique(listing_id, position)
);
create table public.favorites (user_id uuid references public.profiles(id) on delete cascade, listing_id uuid references public.listings(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,listing_id));
create table public.enquiries (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), listing_id uuid not null references public.listings(id), message text not null check (char_length(message) between 10 and 2000), created_at timestamptz not null default now());
create table public.reports (id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id), listing_id uuid references public.listings(id), reported_user_id uuid references public.profiles(id), reason public.report_reason not null, details text check (char_length(details) <= 2000), created_at timestamptz not null default now(), resolved_at timestamptz, check (num_nonnulls(listing_id, reported_user_id) = 1));
create table public.audit_events (id bigint generated always as identity primary key, actor_id uuid references public.profiles(id), action text not null, target_type text not null, target_id text not null, reason text, metadata jsonb not null default '{}', created_at timestamptz not null default now());

-- Security-definer projections expose only explicitly public fields. Base-table policies remain private.
create view public.public_publishers as select id,display_name,role,(phone_verified_at is not null) as phone_verified from public.profiles where status='active' and role in ('owner','agent');
create view public.published_listings as select id,publisher_id,status,title,mode,property_type,price,price_suffix,suburb,city,province,(suburb||', '||city) as address,round(latitude,2) as latitude,round(longitude,2) as longitude,bedrooms,bathrooms,garages,floor_size,description,amenities,featured,created_at,updated_at,published_at from public.listings where status='published';
revoke all on public.public_publishers from public; revoke all on public.published_listings from public;
grant select on public.public_publishers to anon,authenticated; grant select on public.published_listings to anon,authenticated;

create or replace function public.on_auth_user_created() returns trigger language plpgsql security definer set search_path='' as $$ begin insert into public.profiles(id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'display_name','')); return new; end $$;
create trigger auth_user_created after insert on auth.users for each row execute function public.on_auth_user_created();
create or replace function public.is_active(uid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles where id=uid and status='active') $$;
create or replace function public.is_admin(uid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles where id=uid and role='admin' and status='active') $$;
create or replace function public.current_role(uid uuid) returns public.user_role language sql stable security definer set search_path='' as $$ select role from public.profiles where id=uid $$;
create or replace function public.current_status(uid uuid) returns public.account_status language sql stable security definer set search_path='' as $$ select status from public.profiles where id=uid $$;
create or replace function public.current_phone_verified_at(uid uuid) returns timestamptz language sql stable security definer set search_path='' as $$ select phone_verified_at from public.profiles where id=uid $$;
create or replace function public.is_public_listing(listing uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.listings where id=listing and status='published') $$;
create or replace function public.email_verified(uid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from auth.users where id=uid and email_confirmed_at is not null) $$;

alter table public.profiles enable row level security; alter table public.publisher_profiles enable row level security; alter table public.listings enable row level security;
alter table public.listing_images enable row level security; alter table public.favorites enable row level security; alter table public.enquiries enable row level security;
alter table public.reports enable row level security; alter table public.audit_events enable row level security;
create policy profiles_self_read on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin(auth.uid()));
create policy profiles_self_update on public.profiles for update to authenticated using (id=auth.uid() and public.is_active(auth.uid())) with check (id=auth.uid() and role=public.current_role(auth.uid()) and status=public.current_status(auth.uid()) and phone_verified_at is not distinct from public.current_phone_verified_at(auth.uid()));
create policy publisher_public_read on public.publisher_profiles for select using (exists(select 1 from public.profiles p where p.id=user_id and p.status='active'));
create policy publisher_self_insert on public.publisher_profiles for insert to authenticated with check (user_id=auth.uid() and kind in ('owner','agent') and public.is_active(auth.uid()));
create policy publisher_self_update on public.publisher_profiles for update to authenticated using(user_id=auth.uid() and public.is_active(auth.uid())) with check(user_id=auth.uid() and kind in ('owner','agent'));
create policy listings_private_read on public.listings for select to authenticated using(publisher_id=auth.uid() or public.is_admin(auth.uid()));
create policy listings_owner_insert on public.listings for insert to authenticated with check(publisher_id=auth.uid() and status='draft' and public.is_active(auth.uid()));
create policy listings_owner_update on public.listings for update to authenticated using(publisher_id=auth.uid() and public.is_active(auth.uid())) with check(publisher_id=auth.uid() and status in ('draft','archived'));
create policy images_public_read on public.listing_images for select using(public.is_public_listing(listing_id) or exists(select 1 from public.listings l where l.id=listing_id and (l.publisher_id=auth.uid() or public.is_admin(auth.uid()))));
create policy images_owner_write on public.listing_images for all to authenticated using(exists(select 1 from public.listings l where l.id=listing_id and l.publisher_id=auth.uid() and l.status='draft')) with check(exists(select 1 from public.listings l where l.id=listing_id and l.publisher_id=auth.uid() and l.status='draft'));
create policy favorites_self on public.favorites for all to authenticated using(user_id=auth.uid() and public.is_active(auth.uid())) with check(user_id=auth.uid() and public.is_active(auth.uid()));
create policy enquiries_self_read on public.enquiries for select to authenticated using(user_id=auth.uid() or public.is_admin(auth.uid()));
create policy enquiries_self_insert on public.enquiries for insert to authenticated with check(user_id=auth.uid() and public.is_active(auth.uid()) and public.is_public_listing(listing_id));
create policy reports_self_insert on public.reports for insert to authenticated with check(reporter_id=auth.uid() and public.is_active(auth.uid()) and resolved_at is null);
create policy reports_self_read on public.reports for select to authenticated using(reporter_id=auth.uid() or public.is_admin(auth.uid()));
create policy audit_admin_read on public.audit_events for select to authenticated using(public.is_admin(auth.uid()));

-- Atomic, rate-limited publication. Phone confirmation is represented by protected phone_verified_at.
create or replace function public.publish_listing(target uuid) returns void language plpgsql security definer set search_path='' as $$
declare p public.profiles; recent_count int;
begin
 select * into p from public.profiles where id=auth.uid() for update;
 if p.status <> 'active' or p.role not in ('owner','agent') or p.phone_verified_at is null or not public.email_verified(auth.uid()) then raise exception 'Publisher verification required'; end if;
 if not exists(select 1 from public.publisher_profiles where user_id=auth.uid()) then raise exception 'Publisher profile required'; end if;
 select count(*) into recent_count from public.listings where publisher_id=auth.uid() and created_at > now()-interval '24 hours';
 if recent_count >= 10 then raise exception 'Publishing limit reached'; end if;
 update public.listings set status='published',published_at=now(),updated_at=now() where id=target and publisher_id=auth.uid() and status='draft';
 if not found then raise exception 'Listing unavailable'; end if;
 insert into public.audit_events(actor_id,action,target_type,target_id) values(auth.uid(),'listing.published','listing',target::text);
end $$;
revoke all on function public.publish_listing(uuid) from public; grant execute on function public.publish_listing(uuid) to authenticated;

create or replace function public.setup_publisher(requested_kind public.user_role, requested_agency text default null, requested_ffc text default null) returns void language plpgsql security definer set search_path='' as $$
begin
 if requested_kind not in ('owner','agent') or not public.is_active(auth.uid()) or not public.email_verified(auth.uid()) then raise exception 'Verified active account required'; end if;
 update public.profiles set role=requested_kind,updated_at=now() where id=auth.uid() and role in ('member','owner','agent');
 insert into public.publisher_profiles(user_id,kind,agency,ppra_ffc_number) values(auth.uid(),requested_kind,nullif(trim(requested_agency),''),nullif(trim(requested_ffc),''))
 on conflict(user_id) do update set kind=excluded.kind,agency=excluded.agency,ppra_ffc_number=excluded.ppra_ffc_number,updated_at=now();
 insert into public.audit_events(actor_id,action,target_type,target_id) values(auth.uid(),'publisher.configured','account',auth.uid()::text);
end $$;
revoke all on function public.setup_publisher(public.user_role,text,text) from public; grant execute on function public.setup_publisher(public.user_role,text,text) to authenticated;

create or replace function public.sync_phone_verification() returns void language plpgsql security definer set search_path='' as $$
declare verified timestamptz; normalized text;
begin
 select phone_confirmed_at,phone into verified,normalized from auth.users where id=auth.uid();
 if verified is null then raise exception 'Phone is not verified'; end if;
 update public.profiles set phone=normalized,phone_verified_at=verified,updated_at=now() where id=auth.uid();
end $$;
revoke all on function public.sync_phone_verification() from public; grant execute on function public.sync_phone_verification() to authenticated;

-- Admin mutations require an MFA-assured JWT and always create an audit record.
create or replace function public.admin_moderate(target_type text,target uuid,action text,reason text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_admin(auth.uid()) or coalesce(auth.jwt()->>'aal','aal1') <> 'aal2' then raise exception 'MFA administrator required'; end if;
 if target_type='listing' and action='suspend' then update public.listings set status='suspended',updated_at=now() where id=target;
 elsif target_type='account' and action='suspend' then update public.profiles set status='suspended',updated_at=now() where id=target;
 else raise exception 'Unsupported moderation action'; end if;
 insert into public.audit_events(actor_id,action,target_type,target_id,reason) values(auth.uid(),action,target_type,target::text,reason);
end $$;
revoke all on function public.admin_moderate(text,uuid,text,text) from public; grant execute on function public.admin_moderate(text,uuid,text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('listing-images','listing-images',false,10485760,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy listing_images_controlled_read on storage.objects for select using(bucket_id='listing-images' and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/' and (public.is_public_listing(((storage.foldername(name))[2])::uuid) or exists(select 1 from public.listings l where l.id=((storage.foldername(name))[2])::uuid and (l.publisher_id=auth.uid() or public.is_admin(auth.uid())))));
create policy listing_images_owner_storage on storage.objects for insert to authenticated with check(bucket_id='listing-images' and (storage.foldername(name))[1]=auth.uid()::text and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/' and exists(select 1 from public.listings l where l.id=((storage.foldername(name))[2])::uuid and l.publisher_id=auth.uid() and l.status='draft') and public.is_active(auth.uid()));
