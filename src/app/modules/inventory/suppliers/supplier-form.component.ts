import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Services } from '../../../shared/services/services';
import { NgIf } from '@angular/common';
import { InputComponent } from '../../../shared/components/input.component';
import { BtnComponent } from '../../../shared/components/btn.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, InputComponent, BtnComponent],
  template: `
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header con breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-slate-600 mb-2">
      <a routerLink="/inventory/suppliers" class="hover:text-slate-800 transition-colors">Proveedores</a>
      <span>›</span>
      <span class="text-slate-800 font-medium">{{ isEdit ? 'Editar proveedor' : 'Nuevo proveedor' }}</span>
    </div>

    <!-- Título principal -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          {{ isEdit ? 'Editar Proveedor' : 'Crear Nuevo Proveedor' }}
        </h1>
        <p class="text-slate-600">{{ isEdit ? 'Modifica la información del proveedor' : 'Completa la información del proveedor' }}</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
      <form (ngSubmit)="submit()" [formGroup]="form">
        <!-- Header del formulario -->
        <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <div class="w-2 h-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full"></div>
            Información del Proveedor
          </h2>
          <p class="text-sm text-slate-600 mt-1">Los campos marcados con * son obligatorios</p>
        </div>

        <!-- Campos del formulario -->
        <div class="p-6 space-y-6">
          <!-- Primera fila: Código y Nombre -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ui-input
              label="Código del Proveedor"
              placeholder="Ej: PROV-001"
              [control]="form.controls['code']"
              [error]="getError('code')"
              [required]="true"
              leftIcon="🏷️"
              helpText="Código único del proveedor">
            </ui-input>

            <ui-input
              label="Nombre de la Empresa"
              placeholder="Ej: Distribuidora ABC S.A."
              [control]="form.controls['name']"
              [error]="getError('name')"
              [required]="true"
              leftIcon="🏢"
              [showClearButton]="true"
              helpText="Razón social o nombre comercial">
            </ui-input>
          </div>

          <!-- Segunda fila: Información de contacto -->
          <div class="space-y-4">
            <h3 class="text-md font-medium text-slate-700 flex items-center gap-2">
              <div class="w-1.5 h-5 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"></div>
              Información de Contacto
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ui-input
                label="Teléfono"
                placeholder="Ej: +593 99 123 4567"
                type="tel"
                [control]="form.controls['phone']"
                leftIcon="📞"
                [showClearButton]="true"
                helpText="Número de contacto principal">
              </ui-input>

              <ui-input
                label="Correo Electrónico"
                placeholder="contacto@empresa.com"
                type="email"
                [control]="form.controls['email']"
                [error]="getError('email')"
                leftIcon="✉️"
                [showClearButton]="true"
                helpText="Email para comunicaciones">
              </ui-input>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-blue-800">Información sobre proveedores</div>
                <div class="text-xs text-blue-700 mt-1 space-y-1">
                  <div>• {{ isEdit ? 'Al editar un proveedor, el código no puede modificarse' : 'Una vez creado, el código no podrá modificarse' }}</div>
                  <div>• Los proveedores se crean activos por defecto</div>
                  <div>• El email es importante para notificaciones automáticas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <ui-btn
              variant="secondary"
              routerLink="/inventory/suppliers"
              [disabled]="loading">
              Cancelar
            </ui-btn>
            
            <ui-btn
              type="submit"
              variant="success"
              [loading]="loading"
              [disabled]="form.invalid || loading"
              icon="💾">
              {{ isEdit ? 'Guardar Cambios' : 'Crear Proveedor' }}
            </ui-btn>
          </div>
        </div>
      </form>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-red-800">Error al {{ isEdit ? 'guardar' : 'crear' }} el proveedor</div>
          <div class="text-sm text-red-600 mt-1">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Estado de éxito -->
    <div *ngIf="success" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div class="text-sm font-medium text-emerald-800">
          Proveedor {{ isEdit ? 'actualizado' : 'creado' }} exitosamente
        </div>
      </div>
    </div>
  </div>
  `
})
export class SupplierFormComponent {
  loading = false;
  error: string | null = null;
  success = false;
  isEdit = false;
  id?: string;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: Services,
    private ar: ActivatedRoute,
    private router: Router
  ) {
    // Inicializa el form
    this.form = this.fb.group({
      code: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
      name: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
      phone: this.fb.nonNullable.control<string>(''),
      email: this.fb.nonNullable.control<string>('', { validators: [Validators.email] }),
    });

    this.id = this.ar.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.form.controls['code'].disable();
    }
  }

  getError(field: keyof typeof this.form.controls & string): string | null {
  const c = this.form.controls[field];
  if (!(c.touched || c.dirty)) return null;
  if (c.hasError('required')) return `${this.pretty(field)} es requerido`;
  if (c.hasError('email')) return `Email inválido`;
  return null;
}

  private pretty(k: string) {
    switch (k) {
      case 'code': return 'Código';
      case 'name': return 'Nombre';
      case 'phone': return 'Teléfono';
      case 'email': return 'Email';
      default: return k;
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;
    this.success = false;

    const payload = this.form.getRawValue();

    const done = () => {
      this.loading = false;
      this.success = true;

      // Redirigir después de mostrar el éxito
      setTimeout(() => {
        this.router.navigateByUrl('/inventory/suppliers');
      }, 1500);
    };

    const fail = (e: any) => {
      this.loading = false;
      this.error = e?.error?.message ?? (this.isEdit ? 'Error al guardar el proveedor' : 'Error al crear el proveedor');
    };

    if (!this.isEdit) {
      this.svc.suppliers.create(payload as any).subscribe({ next: done, error: fail });
    } else {
      this.svc.suppliers.update(this.id!, payload as any).subscribe({ next: done, error: fail });
    }
  }
}