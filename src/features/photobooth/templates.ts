export type TemplateId = 'pink' | 'cherry' | 'scrapbook' | 'dreamy';

export type BoothTemplate = {
  id: TemplateId;
  name: string;
  shortName: string;
  description: string;
  paper: string;
  ink: string;
  accent: string;
  soft: string;
  filter: string;
  label: string;
};

export const boothTemplates: BoothTemplate[] = [
  {
    id: 'pink', name: 'Pink Coquette', shortName: 'Sweet bows',
    description: 'Soft pink, cream, ribbons, hearts, pearls, and tiny sparkles.',
    paper: '#fff7fa', ink: '#5a3d43', accent: '#d88ca0', soft: '#f9e4eb', filter: 'none', label: 'PINK COQUETTE · 08 NOV',
  },
  {
    id: 'cherry', name: 'Cherry Vintage', shortName: 'Retro flair',
    description: 'Cherry red, cream, hearts, ribbons, and vintage checkerboard details.',
    paper: '#fff3f0', ink: '#47262c', accent: '#c73d4c', soft: '#f8d8d8', filter: 'contrast(1.08) saturate(1.2)', label: 'CHERRY VINTAGE · 08 NOV',
  },
  {
    id: 'scrapbook', name: 'Sweet Scrapbook', shortName: 'Memory pages',
    description: 'Pastel blooms, washi tape, doodles, stickers, and handwritten notes.',
    paper: '#fffdf7', ink: '#544b5e', accent: '#f2b7a5', soft: '#e8edf9', filter: 'none', label: 'SWEET SCRAPBOOK · 08 NOV',
  },
  {
    id: 'dreamy', name: 'Dreamy Sky', shortName: 'Soft clouds',
    description: 'Baby blue, white, clouds, stars, moons, and little hearts.',
    paper: '#f5fbff', ink: '#405a75', accent: '#a8bfe8', soft: '#eaf4ff', filter: 'none', label: 'DREAMY SKY · 08 NOV',
  },
];
