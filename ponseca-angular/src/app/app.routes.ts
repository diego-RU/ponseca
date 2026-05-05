import { Routes } from '@angular/router';

import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Recreo Ponceca · Andahuaylas',
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    title: 'Nosotros · Recreo Ponceca',
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu-list.component').then((m) => m.MenuListComponent),
    title: 'Menú · Recreo Ponceca',
  },
  {
    path: 'galeria',
    loadComponent: () =>
      import('./features/gallery/gallery.component').then((m) => m.GalleryComponent),
    title: 'Galería · Recreo Ponceca',
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./features/booking/booking.component').then((m) => m.BookingComponent),
    title: 'Reservas y eventos · Recreo Ponceca',
  },
  {
    path: 'reservas/exito',
    loadComponent: () =>
      import('./features/booking/booking-success.component').then((m) => m.BookingSuccessComponent),
    title: 'Reserva confirmada · Recreo Ponceca',
  },
  {
    path: 'ubicacion',
    loadComponent: () =>
      import('./features/location/location.component').then((m) => m.LocationComponent),
    title: 'Cómo llegar · Recreo Ponceca',
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contacto · Recreo Ponceca',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Acceso staff · Recreo Ponceca',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
        title: 'Panel · Recreo Ponceca',
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/admin/bookings/admin-bookings.component').then(
            (m) => m.AdminBookingsComponent,
          ),
        title: 'Reservas · Panel',
      },
      {
        path: 'menu',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/menu/admin-menu.component').then((m) => m.AdminMenuComponent),
        title: 'Menú · Panel',
      },
      {
        path: 'galeria',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/admin/gallery/admin-gallery.component').then(
            (m) => m.AdminGalleryComponent,
          ),
        title: 'Galería · Panel',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página no encontrada',
  },
];
