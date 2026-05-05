/**
 * Static, public configuration for Recreo Ponceca. Values that depend on
 * the environment (API base URL, payment keys, WhatsApp Business token, ...)
 * should be loaded via the typical Angular environment files or a runtime
 * `assets/config.json`. Public-facing strings live here so the team can
 * tweak them without touching templates.
 */
export const APP_CONFIG = {
  business: {
    name: 'Recreo Ponceca',
    tagline: 'Recreo y restaurante campestre en Andahuaylas',
    description:
      'Sabor regional con vista al valle: cuy, trucha, chairo, chicharrón, áreas verdes, zona infantil y mirador.',
    address: 'Avenida Santa Cruz 610, ref. estadio Curibamba',
    city: 'Andahuaylas',
    region: 'Apurímac',
    country: 'Perú',
    coordinates: { lat: -13.6553, lng: -73.3897 },
    phone: '+51 960 719 103',
    phoneHuman: '+51 960 719 103',
    phoneWhatsapp: '51960719103',
    email: 'reservas@recreoponceca.pe',
    hoursLabel: 'Lun – Dom · 09:00 a 18:00',
    rating: 4.8,
    ratingCount: 312,
  },
  reservations: {
    minPax: 1,
    maxPax: 30,
    leadTimeHours: 2,
    timeSlots: [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '16:00',
      '17:00',
    ],
  },
  social: {
    facebook: 'https://www.facebook.com/recreoponceca',
    instagram: 'https://www.instagram.com/recreoponceca',
    tripadvisor: 'https://www.tripadvisor.com/',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Recreo+Ponceca+Andahuaylas',
  },
  api: {
    /**
     * When the app is built with a real backend behind it, override this URL
     * via an environment file or a runtime config endpoint. While set to
     * `null` (default), the app uses an in-memory mock backend so the demo
     * works fully standalone.
     */
    baseUrl: null as string | null,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
