import { Platform } from 'react-native';

export const colors = {
  blue: '#4163EB', blueDark: '#3150D9', ink: '#080E22', slate: '#6D7891',
  muted: '#9AA4B8', canvas: '#F7F8FA', softBlue: '#EEF2FC', white: '#FFFFFF',
  border: '#DDE3EF', amber: '#F2A900', purple: '#8A20E7', green: '#54BE83',
  footerText: '#AFC5EE', overlay: 'rgba(5,13,35,0.58)', danger: '#D64545',
};

export const fonts = {
  regular: 'Poppins_400Regular', medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold', bold: 'Poppins_700Bold',
};

export const shadow = Platform.select({
  ios: { shadowColor: '#10182D', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 12 },
  android: { elevation: 4 },
  default: { boxShadow: '0 5px 18px rgba(16,24,45,0.12)' },
});
