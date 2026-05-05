import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section login">
      <div class="container login__inner">
        <div class="login__copy">
          <span class="section__eyebrow">Panel interno</span>
          <h1>Acceso staff.</h1>
          <p>
            Para administración y recepción. Si eres cliente, vuelve al
            <a routerLink="/">inicio</a> y agenda tu reserva desde la web pública.
          </p>
        </div>

        <div class="login__card">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="form-field">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                autocomplete="email"
                formControlName="email"
                required
              />
            </div>
            <div class="form-field">
              <label for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                autocomplete="current-password"
                formControlName="password"
                required
              />
            </div>

            @if (errorMessage(); as err) {
              <p class="error" role="alert">{{ err }}</p>
            }

            <button class="btn btn--block" type="submit" [disabled]="loading()">
              {{ loading() ? 'Ingresando…' : 'Ingresar al panel' }}
            </button>
          </form>

          <details class="hint">
            <summary>Usuarios de demostración</summary>
            <p>
              <strong>admin&#64;recreoponceca.pe</strong> / <code>admin123</code><br />
              <strong>recepcion&#64;recreoponceca.pe</strong> / <code>recep123</code>
            </p>
            <p class="muted">
              Cambia estas credenciales al conectar un backend real con almacenamiento seguro.
            </p>
          </details>
        </div>
      </div>
    </section>
  `,
  styles: `
    .login {
      background: var(--c-bg-alt);
      min-height: calc(100vh - 80px);
      display: grid;
      align-items: center;
    }

    .login__inner {
      display: grid;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 880px) {
      .login__inner {
        grid-template-columns: 1fr 1fr;
        gap: 5rem;
      }
    }

    .login__copy h1 {
      margin: 0.4rem 0 0.85rem;
    }

    .login__copy p {
      max-width: 42ch;
      color: var(--c-ink-soft);
    }

    .login__card {
      background: var(--c-surface);
      border: 1px solid var(--c-line);
      padding: 2rem;
      border-radius: var(--radius-sm);
      max-width: 460px;
      width: 100%;
    }

    .hint {
      margin-top: 1.2rem;
      padding: 0.85rem 0.95rem;
      background: var(--c-bg-alt);
      border: 1px solid var(--c-line);
      border-radius: var(--radius-xs);
      font-size: 0.88rem;
    }

    .hint summary {
      cursor: pointer;
      font-weight: 500;
      color: var(--c-ink);
      letter-spacing: 0.005em;
    }

    .hint code {
      background: rgba(28, 26, 23, 0.07);
      padding: 0.05rem 0.35rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .muted {
      color: var(--c-muted);
      font-size: 0.85rem;
    }
  `,
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['admin@recreoponceca.pe', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(4)]],
  });

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message ?? 'No se pudo iniciar sesión.');
      },
    });
  }
}
