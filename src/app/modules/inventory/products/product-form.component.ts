import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      <a routerLink="/inventory" class="hover:text-slate-800 transition-colors">Productos</a>
      <span>›</span>
      <span class="text-slate-800 font-medium">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</span>
    </div>

    <!-- Título principal -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          {{ isEdit ? 'Editar Producto' : 'Crear Nuevo Producto' }}
        </h1>
        <p class="text-slate-600">{{ isEdit ? 'Modifica la información del producto' : 'Completa la información del producto' }}</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
      <form (ngSubmit)="submit()" [formGroup]="form">
        <!-- Header del formulario -->
        <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <div class="w-2 h-6 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-full"></div>
            Información del Producto
          </h2>
          <p class="text-sm text-slate-600 mt-1">Los campos marcados con * son obligatorios</p>
        </div>

        <!-- Campos del formulario -->
        <div class="p-6 space-y-6">
          <!-- Primera fila: SKU y Nombre -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ui-input
              label="SKU"
              placeholder="Ej: PROD-001"
              [control]="form.controls['sku']"
              [error]="getError('sku')"
              [required]="true"
              leftIcon="🏷️"
              helpText="Código único del producto">
            </ui-input>

            <ui-input
              label="Nombre del Producto"
              placeholder="Ej: Laptop Dell Inspiron"
              [control]="form.controls['name']"
              [error]="getError('name')"
              [required]="true"
              leftIcon="📦"
              [showClearButton]="true"
              helpText="Nombre descriptivo del producto">
            </ui-input>
          </div>

          <!-- Segunda fila: Descripción -->
          <div class="grid grid-cols-1">
            <ui-input
              label="Descripción Corta"
              placeholder="Breve descripción del producto (opcional)"
              [control]="form.controls['shortDesc']"
              leftIcon="📝"
              [showClearButton]="true"
              helpText="Descripción opcional para facilitar la identificación">
            </ui-input>
          </div>

          <!-- Tercera fila: UM -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ui-input
              label="Unidad de Medida"
              placeholder="Ej: UN, KG, LT"
              [control]="form.controls['unitOfMeasure']"
              [error]="getError('unitOfMeasure')"
              [required]="true"
              leftIcon="📏"
              helpText="Unidad de medida para el inventario">
            </ui-input>
            
            <!-- Campo informativo -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-blue-800">Información</div>
                <div class="text-xs text-blue-700 mt-1">
                  {{ isEdit ? 'Al editar un producto, el SKU no puede modificarse' : 'Una vez creado, el SKU no podrá modificarse' }}
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
              routerLink="/inventory"
              [disabled]="loading">
              Cancelar
            </ui-btn>
            
            <ui-btn
              type="submit"
              variant="success"
              [loading]="loading"
              [disabled]="form.invalid || loading"
              icon="💾">
              {{ isEdit ? 'Guardar Cambios' : 'Crear Producto' }}
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
          <div class="text-sm font-medium text-red-800">Error al {{ isEdit ? 'guardar' : 'crear' }} el producto</div>
          <div class="text-sm text-red-600 mt-1">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Estado de éxito (opcional) -->
    <div *ngIf="success" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div class="text-sm font-medium text-emerald-800">
          Producto {{ isEdit ? 'actualizado' : 'creado' }} exitosamente
        </div>
      </div>
    </div>
  </div>
  `
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private svc = inject(Services);
  private ar = inject(ActivatedRoute);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  success = false;
  isEdit = false;
  id?: string;

  form = this.fb.nonNullable.group({
    sku: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    name: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    shortDesc: this.fb.nonNullable.control<string>(''),
    unitOfMeasure: this.fb.nonNullable.control<string>('UN', { validators: [Validators.required] }),
  });

  constructor() {
    this.id = this.ar.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.form.controls['sku'].disable();
      // Aquí cargarías los datos del producto
      // this.svc.products.getById(this.id!).subscribe(r => this.form.patchValue(r.data));
    }
  }

  getError(field: keyof typeof this.form.controls): string | null {
    const c = this.form.controls[field];
    if (!(c.touched || c.dirty)) return null;
    if (c.hasError('required')) return `${this.pretty(field)} es requerido`;
    if (c.hasError('email')) return `Email inválido`;
    return null;
  }

  private pretty(k: string) {
    switch (k) {
      case 'sku': return 'SKU';
      case 'name': return 'Nombre';
      case 'shortDesc': return 'Descripción corta';
      case 'unitOfMeasure': return 'Unidad de medida';
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
        this.router.navigateByUrl('/inventory');
      }, 1500);
    };
    
    const fail = (e: any) => {
      this.loading = false;
      this.error = e?.error?.message ?? (this.isEdit ? 'Error al guardar el producto' : 'Error al crear el producto');
    };

    if (!this.isEdit) {
      this.svc.products.create(payload as any).subscribe({ next: done, error: fail });
    } else {
      this.svc.products.update(this.id!, payload as any).subscribe({ next: done, error: fail });
    }
  }
}