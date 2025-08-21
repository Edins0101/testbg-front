import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Services } from '../../shared/services/services';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input type="email" class="border rounded-xl px-3 py-2 w-full"
                 formControlName="email" autocomplete="username" />
          <div *ngIf="email.touched && email.invalid" class="text-xs text-red-600">
            {{ email.hasError('required') ? 'Email requerido' : 'Email inválido' }}
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1">Contraseña</label>
          <div class="relative">
            <input [type]="showPwd() ? 'text' : 'password'"
                   class="border rounded-xl px-3 py-2 w-full pr-10"
                   formControlName="password" autocomplete="current-password" />
            <button type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    (click)="togglePwd()">
              {{ showPwd() ? '🙈' : '👁️' }}
            </button>
          </div>
          <div *ngIf="password.touched && password.invalid" class="text-xs text-red-600">
            Contraseña requerida
          </div>
        </div>

        <button type="submit"
                [disabled]="form.invalid || loading()"
                class="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50">
          {{ loading() ? 'Ingresando...' : 'Entrar' }}
        </button>

        <div *ngIf="error()" class="text-red-600 text-sm text-center mt-2">{{ error() }}</div>
      </form>
    </div>
  </div>
  `
})
export class LoginComponent {
  // signals pa’ manejar estado fino
  loading = signal(false);
  error = signal<string | null>(null);
  showPwd = signal(false);

  form: LoginForm;

  constructor(
    private fb: FormBuilder,
    private svc: Services,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
      password: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    });

    // Si ya está logueado y entró a /login, mándalo pa’ donde iba
    if (this.svc.auth.isLoggedIn()) {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
      this.router.navigateByUrl(redirect);
    }
  }

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  togglePwd() { this.showPwd.update(v => !v); }

  submit() {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';

    this.svc.auth.login(this.form.getRawValue()).subscribe({
      next: _ => {
        this.loading.set(false);
        // listo, pa’ donde iba originalmente
        this.router.navigateByUrl(redirect);
      },
      error: e => {
        this.loading.set(false);
        this.error.set(e?.error?.message ?? 'Credenciales inválidas');
      }
    });
  }
}
