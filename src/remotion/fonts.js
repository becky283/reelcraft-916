export const AVAILABLE_FONTS = [
  {
    id: 'Montserrat ExtraBold',
    name: 'Montserrat ExtraBold (Default)',
    family: "'Montserrat ExtraBold', 'Montserrat', sans-serif",
    file: 'Montserrat-ExtraBold.ttf',
  },
  {
    id: 'Anton',
    name: 'Anton (Impactful)',
    family: "'Anton', sans-serif",
    file: 'Anton-Regular.ttf',
  },
  {
    id: 'Bebas Neue',
    name: 'Bebas Neue (Clean Tall)',
    family: "'Bebas Neue', sans-serif",
    file: 'BebasNeue-Regular.ttf',
  },
  {
    id: 'Inter Bold',
    name: 'Inter Bold (Modern Sans)',
    family: "'Inter Bold', 'Inter', sans-serif",
    file: 'Inter-Bold.ttf',
  },
  {
    id: 'Impact',
    name: 'Impact (System)',
    family: "Impact, sans-serif",
  },
  {
    id: 'Arial Black',
    name: 'Arial Black (System)',
    family: "'Arial Black', sans-serif",
  }
];

export function getFontFamily(fontId) {
  const match = AVAILABLE_FONTS.find(f => f.id === fontId || f.name === fontId);
  return match ? match.family : (fontId || "'Montserrat ExtraBold', sans-serif");
}
