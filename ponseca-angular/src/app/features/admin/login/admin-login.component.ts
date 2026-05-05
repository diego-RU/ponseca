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
    <section class="section">
      <div class="container login">
        <div class="login__card card">
          <h1>Acceso staff</h1>
          <p>
            Panel para administración y recepción. Si eres cliente, vuelve al
            <a routerLink="/">inicio</a>.
          </p>

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
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
            </button>
          </form>

          <details class="hint">
            <summary>Usuarios de demostración</summary>
            <p>
              <strong>admin@recreoponceca.pe</strong> / <code>admin123</code><br />
              <strong>recepcion@recreoponceca.pe</strong> / <code>recep123</code>
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
    .login__card {
      max-width: 460px;
      margin: 0 auto;
      padding: 1.6rem;
    }

    .hint {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgba(168, 66, 26, 0.08);
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
    }

    .hint summary {
      cursor: pointer;
      font-weight: 600;
      color: var(--color-primary-dark);
    }

    .hint code {
      background: rgba(31, 26, 23, 0.07);
      padding: 0 0.3rem;
      border-radius: 4px;
    }

    .muted {
      color: var(--color-muted);
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
