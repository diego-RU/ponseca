import { Booking } from '../models/booking.model';
import { GalleryImage } from '../models/gallery-image.model';
import { MenuItem } from '../models/menu-item.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';

/**
 * In-memory dataset used by the mock API. Replace this with a live
 * backend by setting `APP_CONFIG.api.baseUrl` and wiring `ApiService`
 * to use HttpClient.
 */

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'cuy-al-horno',
    name: 'Cuy al horno',
    description:
      'Cuy entero dorado al horno de barro, acompañado de papa nativa, mote y ensalada criolla.',
    price: 65,
    category: 'platos-principales',
    imageUrl:
      'https://images.unsplash.com/photo-1604908554007-9c4d4dca1c00?auto=format&fit=crop&w=900&q=70',
    highlight: true,
    available: true,
    tags: ['recomendado', 'tradicional'],
  },
  {
    id: 'trucha-frita',
    name: 'Trucha frita',
    description: 'Trucha fresca de la laguna de Pacucha, frita y servida con yuca dorada y arroz.',
    price: 38,
    category: 'platos-principales',
    imageUrl:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=70',
    highlight: true,
    available: true,
    tags: ['del valle'],
  },
  {
    id: 'chairo-apurimeno',
    name: 'Chairo apurimeño',
    description: 'Sopa andina con carne de cordero, chuño, trigo y verduras de la chacra.',
    price: 22,
    category: 'sopas',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=70',
    available: true,
    tags: ['caliente', 'tradicional'],
  },
  {
    id: 'chicharron-cerdo',
    name: 'Chicharrón de cerdo',
    description: 'Chicharrón crocante con mote, cebolla encurtida y ají de huacatay casero.',
    price: 32,
    category: 'criollos',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70',
    available: true,
    tags: ['popular'],
  },
  {
    id: 'parrilla-andina',
    name: 'Parrilla andina',
    description: 'Selección de carnes a la brasa con choclo, papa nativa y salsa de huacatay.',
    price: 58,
    category: 'platos-principales',
    imageUrl:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=70',
    available: true,
    tags: ['compartir'],
  },
  {
    id: 'caldo-gallina',
    name: 'Caldo de gallina',
    description: 'Caldo casero con presa de gallina, fideos, papa y huevo. Perfecto para empezar.',
    price: 18,
    category: 'sopas',
    imageUrl:
      'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
  {
    id: 'humitas-dulces',
    name: 'Humitas dulces',
    description: 'Humitas envueltas en hoja de choclo, dulces y aromáticas.',
    price: 12,
    category: 'entradas',
    imageUrl:
      'https://images.unsplash.com/photo-1601315377906-0b6e1d2862e3?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
  {
    id: 'rocoto-relleno',
    name: 'Rocoto relleno',
    description: 'Rocoto relleno con carne, queso y pastel de papa.',
    price: 28,
    category: 'criollos',
    imageUrl:
      'https://images.unsplash.com/photo-1626202378175-fbc40ff84094?auto=format&fit=crop&w=900&q=70',
    spicy: true,
    available: true,
  },
  {
    id: 'chicha-morada',
    name: 'Chicha morada (jarra)',
    description: 'Chicha morada casera, fresca y especiada con piña y canela.',
    price: 18,
    category: 'bebidas',
    imageUrl:
      'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
  {
    id: 'mate-muna',
    name: 'Mate de muña',
    description: 'Infusión local de muña, ideal para la altura.',
    price: 6,
    category: 'bebidas',
    imageUrl:
      'https://images.unsplash.com/photo-1617196039897-cdc44d2bdd17?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
  {
    id: 'mazamorra',
    name: 'Mazamorra morada',
    description: 'Postre tradicional a base de maíz morado y frutas.',
    price: 10,
    category: 'postres',
    imageUrl:
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
  {
    id: 'arroz-con-leche',
    name: 'Arroz con leche',
    description: 'Cremoso arroz con leche con canela y pasas.',
    price: 10,
    category: 'postres',
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=70',
    available: true,
  },
];

export const MOCK_GALLERY: GalleryImage[] = [
  {
    id: 'g1',
    url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=70',
    alt: 'Vista del recreo con áreas verdes y mesas al aire libre',
    category: 'lugar',
  },
  {
    id: 'g2',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70',
    alt: 'Mesa servida con platos regionales',
    category: 'platos',
  },
  {
    id: 'g3',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=70',
    alt: 'Mirador del recreo con vista al valle de Andahuaylas',
    category: 'lugar',
  },
  {
    id: 'g4',
    url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=70',
    alt: 'Cuy al horno servido con papas nativas',
    category: 'platos',
  },
  {
    id: 'g5',
    url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=70',
    alt: 'Familia disfrutando del almuerzo',
    category: 'eventos',
  },
  {
    id: 'g6',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=70',
    alt: 'Zona infantil con áreas para niños',
    category: 'lugar',
  },
  {
    id: 'g7',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=70',
    alt: 'Trucha frita con guarniciones',
    category: 'platos',
  },
  {
    id: 'g8',
    url: 'https://images.unsplash.com/photo-1514516816566-de580c8c2702?auto=format&fit=crop&w=1200&q=70',
    alt: 'Celebración de aniversario en el recreo',
    category: 'eventos',
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'María Quispe',
    rating: 5,
    comment:
      'La mejor trucha de Andahuaylas. El lugar es hermoso, los niños se divierten en la zona infantil mientras disfrutamos.',
    source: 'Google',
    date: '2025-09-12',
    avatarInitial: 'M',
  },
  {
    id: 'r2',
    author: 'Carlos Huamán',
    rating: 5,
    comment:
      'El cuy al horno es una delicia. Atención muy amable y la vista desde el mirador es espectacular.',
    source: 'TripAdvisor',
    date: '2025-08-30',
    avatarInitial: 'C',
  },
  {
    id: 'r3',
    author: 'Lucía Salas',
    rating: 4,
    comment:
      'Recomendado al 100%. El chairo apurimeño me transportó a la casa de mi abuela. Buen estacionamiento.',
    source: 'Google',
    date: '2025-07-21',
    avatarInitial: 'L',
  },
  {
    id: 'r4',
    author: 'Andrés Páucar',
    rating: 5,
    comment:
      'Hicimos un evento familiar con 25 personas. Todo coordinado por WhatsApp y la atención fue excelente.',
    source: 'Facebook',
    date: '2025-06-10',
    avatarInitial: 'A',
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b-001',
    name: 'Familia Romero',
    phone: '+51 987 654 321',
    email: 'romero@example.com',
    date: nextDateOffset(2),
    time: '13:00',
    pax: 8,
    notes: 'Mesa cerca del mirador, por favor.',
    status: 'confirmada',
    createdAt: new Date().toISOString(),
    source: 'web',
  },
  {
    id: 'b-002',
    name: 'Jorge Aguilar',
    phone: '+51 944 112 233',
    date: nextDateOffset(4),
    time: '12:30',
    pax: 4,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    source: 'web',
  },
];

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'u-admin',
    name: 'Administrador',
    email: 'admin@recreoponceca.pe',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'u-recep',
    name: 'Recepción',
    email: 'recepcion@recreoponceca.pe',
    role: 'recepcionista',
    password: 'recep123',
  },
];

function nextDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
