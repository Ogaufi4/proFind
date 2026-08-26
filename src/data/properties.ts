import type { Agent, Property } from '@/types';

const hero = require('../../assets/properties/hero-villa.png');
const classic = require('../../assets/properties/constantia-villa.png');
const modern = require('../../assets/properties/sandton-modern.png');
const amenities = (labels: string[]) => labels.map((label, index) => ({ id: `amenity-${index}-${label}`, label }));

export const agents: Agent[] = [
  { id: 'thabo', name: 'Thabo Nkosi', agency: 'RE/MAX Living', phone: '+27822345678', whatsapp: '27822345678', email: 'thabo@propfind.co.za', areas: ['Sandton', 'Johannesburg', 'Gauteng'] },
  { id: 'naledi', name: 'Naledi Jacobs', agency: 'Cape Prime Realty', phone: '+27711234567', whatsapp: '27711234567', email: 'naledi@propfind.co.za', areas: ['Cape Town', 'Clifton', 'Constantia'] },
  { id: 'sipho', name: 'Sipho Dlamini', agency: 'Urban Commercial SA', phone: '+27829876543', whatsapp: '27829876543', email: 'sipho@propfind.co.za', areas: ['Foreshore', 'Cape Town', 'Sandton'] },
];

export const properties: Property[] = [
  {
    id: 'sandton-modern-2-bed', title: 'Modern 2-Bedroom Apartment in Sandton CBD', mode: 'buy', type: 'Apartment', price: 1950000,
    suburb: 'Sandton', city: 'Johannesburg', province: 'Gauteng', address: 'Sandton City Residences, 5th Floor', latitude: -26.1076, longitude: 28.0567,
    featured: true, createdAt: '2026-08-21', agentId: 'thabo',
    images: [{ id: 's1', source: modern, alt: 'Contemporary Sandton home with glass walls and pool' }, { id: 's2', source: hero, alt: 'Modern villa at blue hour' }, { id: 's3', source: classic, alt: 'White villa and swimming pool' }],
    features: { bedrooms: 2, bathrooms: 2, garages: 1, floorSize: 95 },
    amenities: amenities(['24/7 Security', 'Gym', 'Rooftop Pool', 'Concierge', 'Fibre Internet', 'Underfloor Heating', 'Air Conditioning']),
    description: 'Contemporary apartment in the heart of Sandton. High-end finishes throughout with open-plan living, a gourmet kitchen, and stunning city views. Building features 24-hour security, gym, and rooftop pool.',
  },
  {
    id: 'clifton-luxury-villa', title: 'Luxury 5-Bedroom Villa in Clifton', mode: 'buy', type: 'Villa', price: 28500000,
    suburb: 'Clifton', city: 'Cape Town', province: 'Western Cape', address: 'Victoria Road, Clifton', latitude: -33.9398, longitude: 18.3776,
    featured: true, createdAt: '2026-08-19', agentId: 'naledi',
    images: [{ id: 'c1', source: hero, alt: 'Clifton villa overlooking the pool and mountain' }, { id: 'c2', source: modern, alt: 'Minimal modern terrace' }, { id: 'c3', source: classic, alt: 'Classic Cape villa' }],
    features: { bedrooms: 5, bathrooms: 5, garages: 3, floorSize: 1200 },
    amenities: amenities(['Ocean Views', 'Infinity Pool', 'Backup Power', 'Smart Home', 'Security']),
    description: 'A landmark contemporary villa with panoramic Atlantic views, expansive entertaining spaces and an exceptional pool terrace.',
  },
  {
    id: 'constantia-family-home', title: 'Stunning 4-Bedroom Family Home in Constantia', mode: 'buy', type: 'House', price: 4850000,
    suburb: 'Constantia', city: 'Cape Town', province: 'Western Cape', address: 'Alphen Estate, Constantia', latitude: -34.0285, longitude: 18.4184,
    featured: true, createdAt: '2026-08-16', agentId: 'naledi',
    images: [{ id: 'h1', source: classic, alt: 'White Constantia family home and pool' }, { id: 'h2', source: hero, alt: 'Cape Town villa at blue hour' }, { id: 'h3', source: modern, alt: 'Modern garden terrace' }],
    features: { bedrooms: 4, bathrooms: 3, garages: 2, floorSize: 950 },
    amenities: amenities(['Pool', 'Garden', 'Fireplace', 'Security', 'Solar Power']),
    description: 'A gracious family home set against the Constantia mountains, with generous living spaces, landscaped gardens and a sunlit pool.',
  },
  {
    id: 'foreshore-office', title: 'Prime Office Space in Cape Town CBD', mode: 'commercial', type: 'Office', price: 185, priceSuffix: 'per m² per month',
    suburb: 'Foreshore', city: 'Cape Town', province: 'Western Cape', address: 'Harbour Place, Foreshore', latitude: -33.9189, longitude: 18.4292,
    featured: true, commercial: true, createdAt: '2026-08-12', agentId: 'sipho',
    images: [{ id: 'o1', source: hero, alt: 'Premium commercial property with poolside architecture' }, { id: 'o2', source: modern, alt: 'Contemporary glazed building' }],
    features: { bedrooms: 0, bathrooms: 4, garages: 20, floorSize: 1800 },
    amenities: amenities(['Reception', 'Backup Power', 'Fibre Internet', 'Secure Parking']),
    description: 'Premium flexible office space in a landmark Foreshore building with secure parking, backup power and excellent transport access.',
  },
  {
    id: 'rosebank-rental', title: 'Designer 2-Bedroom Rental in Rosebank', mode: 'rent', type: 'Apartment', price: 24000, priceSuffix: 'per month',
    suburb: 'Rosebank', city: 'Johannesburg', province: 'Gauteng', address: 'The Parks, Rosebank', latitude: -26.1459, longitude: 28.0416,
    featured: false, createdAt: '2026-08-23', agentId: 'thabo',
    images: [{ id: 'r1', source: modern, alt: 'Designer residence with pool and terrace' }, { id: 'r2', source: classic, alt: 'Landscaped pool residence' }],
    features: { bedrooms: 2, bathrooms: 2, garages: 2, floorSize: 110 },
    amenities: amenities(['Gym', 'Concierge', 'Fibre Internet', 'Security']),
    description: 'A light-filled designer rental close to Rosebank Mall and the Gautrain, with secure parking and hotel-style amenities.',
  },
];
