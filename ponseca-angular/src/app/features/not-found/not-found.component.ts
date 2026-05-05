import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container not-found">
        <h1>404</h1>
        <p>No encontramos lo que buscabas. Quizá quieras volver al inicio.</p>
        <a routerLink="/" class="btn">Ir al inicio</a>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      text-align: center;
      max-width: 480px;
      margin: 0 auto;
    }
    .not-found h1 {
      font-size: 4rem;
      margin-bottom: 0.5rem;
    }
  `,
})
export class NotFoundComponent {}
