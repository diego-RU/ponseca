# Recreo Ponceca

Aplicación web del **Recreo Ponceca**, recreo y restaurante campestre ubicado en Andahuaylas,
Apurímac, Perú. Está pensada para atraer visitas, facilitar reservas y permitir gestión
administrativa básica, con foco en diseño móvil, SEO local y contacto por WhatsApp.

El frontend Angular vive en [`ponseca-angular/`](./ponseca-angular).

## Estructura del repositorio

```
ponseca/
├── ponseca-angular/     # Aplicación Angular 21 + SSR (este readme principal apunta aquí)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Modelos, servicios, guards, interceptores, mocks
│   │   │   ├── features/    # Páginas: home, nosotros, menu, galeria, reservas, …
│   │   │   ├── shared/      # Header, footer, sticky CTA, pipes
│   │   │   ├── app.config*.ts
│   │   │   ├── app.routes*.ts
│   │   │   └── app.ts
│   │   ├── main.ts          # Bootstrap browser
│   │   ├── main.server.ts   # Bootstrap SSR
│   │   └── server.ts        # Express SSR
│   ├── public/              # robots.txt, sitemap.xml, favicon
│   ├── angular.json
│   └── package.json
└── README.md
```

## Stack

- **Angular 21** standalone components + signals
- **Angular SSR (Universal)** con Express y prerendering por ruta
- **Reactive Forms** y validaciones cliente
- **Backend mock in-memory** detrás de `ApiService`, listo para conectar a un API REST real
- **JWT mock** para el panel administrativo
- **Estilos puros** (CSS variables, sin frameworks pesados)

## Funcionalidades

### Sitio público (todas SEO-prerenderizadas)

- **Inicio** con hero image, valoraciones, amenities y CTAs Reservar / WhatsApp / Llamar
- **Sobre Nosotros** con historia y valores locales
- **Menú** con filtro por categoría, fotos y precios; botón **Descargar carta**
- **Galería** con filtro por categoría (lugar / platos / eventos) y *lazy loading*
- **Reservas** con formulario validado (nombre, teléfono peruano, fecha futura, hora, pax 1-50, notas) — al enviar se redirige a la página de éxito y se ofrece continuar la conversación por WhatsApp
- **Ubicación** con Google Maps embebido, referencias locales y enlace a Maps
- **Contacto** con formulario que abre WhatsApp prellenado
- Reseñas / testimonios mock (preparado para *embed* de Google Reviews / TripAdvisor — instrucciones abajo)

### CTAs móvil siempre visibles

Barra fija inferior en mobile con tres botones: **Reservar**, **WhatsApp**, **Llamar**. Se oculta en
breakpoint desktop y en rutas administrativas.

### Panel administrativo `/admin`

- Login JWT (mock) en `/admin/login`
- **Dashboard** con resumen de reservas
- **Reservas** con filtros por estado, acción rápida “WhatsApp al cliente” y cambios de estado
- **Menú (rol admin)** — CRUD completo
- **Galería (rol admin)** — alta y eliminación de fotos
- Roles: `admin` y `recepcionista`. Recepcionista accede sólo a reservas

#### Usuarios de demostración

| Email                        | Contraseña | Rol           |
| ---------------------------- | ---------- | ------------- |
| `admin@recreoponceca.pe`     | `admin123` | admin         |
| `recepcion@recreoponceca.pe` | `recep123` | recepcionista |

> Cambia / elimina estos usuarios y mueve la autenticación al backend real antes de salir a
> producción. La contraseña en el mock se guarda en `MOCK_USERS` en `core/data/mock-data.ts`.

### Backend mock vs. backend real

El servicio `ApiService` (`src/app/core/services/api.service.ts`) lee
`APP_CONFIG.api.baseUrl`. Si está vacío se usa una **base de datos en memoria** con latencia
simulada de 250 ms; si se define una URL, todas las llamadas se hacen vía `HttpClient` contra esa
API REST.

Para apuntar a un backend real:

```ts
// src/app/core/config/app-config.ts
api: {
  baseUrl: 'https://api.recreoponceca.pe', // o tu URL
  ...
}
```

## Endpoints REST esperados

Cuando conectes un backend real, expón estos endpoints. El frontend ya los consume en el modo HTTP:

| Método | Ruta                       | Body / Query                                    | Auth   | Respuesta                  |
| ------ | -------------------------- | ----------------------------------------------- | ------ | -------------------------- |
| GET    | `/api/menu`                | —                                               | público| `MenuItem[]`               |
| GET    | `/api/menu/{id}`           | —                                               | público| `MenuItem`                 |
| POST   | `/api/menu`                | `MenuItem` sin `id`                             | admin  | `MenuItem`                 |
| PUT    | `/api/menu/{id}`           | parcial                                         | admin  | `MenuItem`                 |
| DELETE | `/api/menu/{id}`           | —                                               | admin  | `{ ok: true }`             |
| GET    | `/api/gallery`             | —                                               | público| `GalleryImage[]`           |
| POST   | `/api/gallery`             | `{ url, alt, category }`                        | admin  | `GalleryImage`             |
| DELETE | `/api/gallery/{id}`        | —                                               | admin  | `{ ok: true }`             |
| GET    | `/api/reviews`             | —                                               | público| `Review[]`                 |
| POST   | `/api/bookings`            | `{ name, phone, email?, date, time, pax, notes? }` | público| `Booking`                  |
| GET    | `/api/bookings`            | —                                               | admin  | `Booking[]`                |
| PUT    | `/api/bookings/{id}/status`| `{ status }`                                    | admin  | `Booking`                  |
| POST   | `/api/auth/login`          | `{ email, password }`                           | público| `{ accessToken, user }`    |
| POST   | `/api/notify/whatsapp`     | `{ phone, message }`                            | admin  | `{ ok: true }`             |
| POST   | `/api/payments`            | (opcional Stripe/Culqi)                         | público| `{ paymentIntent, ... }`   |

Tipos de datos en `src/app/core/models/`.

## Variables de entorno

La aplicación funciona sin variables de entorno gracias al backend mock. Cuando conectes un
backend real, configúralas a través del archivo `src/app/core/config/app-config.ts` o, si prefieres
inyectarlas en build time, define un `environment.ts` y referencia esos valores desde el config.

| Clave                            | Descripción                                                | Ejemplo                          |
| -------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| `api.baseUrl`                    | URL base de la API REST                                    | `https://api.recreoponceca.pe`   |
| `business.phoneWhatsapp`         | Teléfono WhatsApp en formato internacional sin `+`         | `51960719103`                    |
| `business.phone`                 | Teléfono telefónico (con `+` para enlaces `tel:`)          | `+51960719103`                   |
| `social.googleMaps`              | Link absoluto a Google Maps                                | `https://maps.app.goo.gl/...`    |
| `seo.siteUrl`                    | URL pública del sitio (para meta tags y sitemap)           | `https://recreoponceca.pe`       |

## Ejecución local

Requisitos: **Node 22+** y npm 11+.

```bash
cd ponseca-angular
npm install
npm start                       # http://localhost:4200 (modo SPA dev)
```

### Build y servidor SSR

```bash
cd ponseca-angular
npm run build                   # genera dist/ponseca-angular (browser + server + prerender)
npm run serve:ssr               # arranca Express SSR en :4000
```

Por defecto se prerenderan las rutas públicas y el panel se sirve en modo `Server` para que la
sesión del usuario nunca se cachee. Configurable en `src/app/app.routes.server.ts`.

### Tests

```bash
npm test                        # vitest unit tests
npm run format:check            # prettier
```

## Despliegue

### Frontend en Vercel / Netlify

Ambos plataformas detectan Angular automáticamente. Configura:

- **Build command:** `npm run build`
- **Output directory (Vercel):** `dist/ponseca-angular/browser` (modo *static*) o usa el adaptador Node de Vercel para SSR.
- **Output directory (Netlify):** `dist/ponseca-angular/browser` y luego un Edge Function que llame a `dist/ponseca-angular/server/server.mjs`.

> Para SEO crítico funciona perfectamente desplegando sólo `dist/ponseca-angular/browser` (es la
> versión prerenderizada). Mantén el SSR para flujos dinámicos como `/admin`.

### API en Render / Heroku / AWS

Cuando tengas backend, despliega el servicio Express/Fastify/etc. en Render, Heroku, Fly o AWS y
apunta el frontend con la variable `api.baseUrl`.

### Almacenamiento de imágenes

Recomendado: **Amazon S3 + CloudFront** o **Cloudinary**. El frontend recibe URLs completas
(`GalleryImage.url`) y no necesita cambios cuando migres del mock.

### HTTPS, CORS, rate limiting, backups

Aspectos a configurar en el backend / proveedor:

- HTTPS obligatorio (Let’s Encrypt automático en Render/Vercel/Netlify)
- CORS limitado al dominio del frontend
- Rate limiting básico en endpoints `POST /api/bookings`, `POST /api/notify/whatsapp`, `POST /api/auth/login`
- Backups periódicos de la base de datos

## Integraciones externas

- **Google Maps** ya embebido. Para usar tu propia API key cambia `<iframe>` por `@angular/google-maps`.
- **WhatsApp Click-to-Chat** vía `wa.me/<numero>?text=...` ya implementado. Para mensajes salientes desde el server (Twilio / WhatsApp Business API) implementa `POST /api/notify/whatsapp` y la app lo llamará automáticamente al crear reservas.
- **Google Reviews / TripAdvisor**: hoy se muestran reviews desde el mock. Para embebido oficial puedes:
  1. Usar la **Place Details API** de Google (requiere API key) y cargarlas en `ReviewService.list()`.
  2. Pegar el snippet HTML de TripAdvisor / Google reviews en `HomeComponent` reemplazando el bloque actual.
- **Stripe / Culqi**: pendiente. Endpoint sugerido `POST /api/payments`.

## SEO local

- Meta tags (`title`, `description`, `og:*`, `twitter:*`, `canonical`) actualizados desde `SeoService` por cada ruta.
- JSON-LD `schema.org/Restaurant` en `src/index.html` con dirección, teléfono, horario y `acceptsReservations`.
- `public/robots.txt` permite indexación y enlaza al sitemap.
- `public/sitemap.xml` con 8 rutas y prioridades.
- Imágenes con `loading="lazy"` y `decoding="async"`.
- Prerendering por ruta para HTML estático con contenidos.

## Accesibilidad

- HTML semántico (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<address>`).
- Skip-link al inicio del DOM.
- ARIA labels en navegación, formularios y tabs de filtros.
- Roles `tablist` / `tab` para filtros de menú y galería.
- Focus visible en estilos globales (`.btn:focus-visible`).
- `prefers-reduced-motion` respetado por evitar animaciones automáticas.
- Contraste AA en paleta de colores (terracota `#a8421a` sobre crema, ink `#1f1a17`).

## Roadmap (opcionales del brief)

- [ ] Pago en línea para depósitos (Stripe/Culqi)
- [ ] Tour virtual 360°
- [ ] Backend real (Node/Express + Postgres) en `apps/api`
- [ ] Tests E2E (Playwright)
- [ ] PWA / offline first

## Licencia

Uso interno del Recreo Ponceca. Para terceros, contactar al equipo del recreo.
