import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container not-found">
        <p class="section__eyebrow">Error 404</p>
        <h1>No encontramos esa página.</h1>
        <p>
          La ruta que buscas se movió o ya no existe. Si llegaste por un enlace antiguo, escríbenos
          y lo corregimos.
        </p>
        <div class="not-found__actions">
          <a routerLink="/" class="btn btn--accent">
            Ir al inicio
            <app-icon name="arrow-right" />
          </a>
          <a routerLink="/menu" class="btn btn--ghost">Ver la carta</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      max-width: 640px;
      margin: 0 auto;
      padding-block: clamp(3rem, 6vw, 5rem);
    }

    .not-found h1 {
      font-size: clamp(2.4rem, 5vw, 3.4rem);
      margin: 0.4rem 0 1rem;
    }

    .not-found p {
      color: var(--c-muted);
      margin: 0 0 1.6rem;
      font-size: 1rem;
    }

    .not-found__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      border-top: 1px solid var(--c-line);
      padding-top: 1.6rem;
    }
  `,
})
export class NotFoundComponent {}
