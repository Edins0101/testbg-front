import { Component, OnInit } from '@angular/core';
import { Services } from '../../../shared/services/services';
import { Product } from '../../../shared/interfaces';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { TableComponent } from '../../../shared/components/table.component';
import { InputComponent } from '../../../shared/components/input.component';
import { BtnComponent } from '../../../shared/components/btn.component';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, TableComponent, InputComponent, BtnComponent],
  template: `
  <div class="space-y-6">
    <!-- Header con título y estadísticas -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          Gestión de Productos
        </h1>
        <p class="text-slate-600 mt-1">Administra tu inventario de productos</p>
      </div>
      
      <!-- Estadísticas rápidas -->
      <div class="flex items-center gap-4 text-sm">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-xl border border-blue-200">
          <div class="text-blue-700 font-semibold">{{ total }}</div>
          <div class="text-blue-600 text-xs">Total productos</div>
        </div>
        <div class="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 rounded-xl border border-emerald-200">
          <div class="text-emerald-700 font-semibold">{{ getActiveCount() }}</div>
          <div class="text-emerald-600 text-xs">Activos</div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y acciones -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col sm:flex-row gap-4 items-end">
        <!-- Campo de búsqueda -->
        <div class="flex-1 max-w-md">
          <ui-input
            label="Buscar productos"
            placeholder="SKU, nombre o descripción..."
            [(ngModel)]="search"
            (keyup.enter)="load(true)"
            [leftIcon]="'🔍'"
            [showClearButton]="true"
            [loading]="loading"
            hint="Presiona Enter para buscar">
          </ui-input>
        </div>
        
        <!-- Botones de acción -->
        <div class="flex gap-3 items-center">
          <ui-btn 
            variant="secondary"
            [loading]="loading"
            [disabled]="loading"
            (click)="load(true)">
            Buscar
          </ui-btn>
          
          <ui-btn 
            variant="success"
            [disabled]="loading"
            icon="+"
            routerLink="/inventory/products/new">
            Nuevo Producto
          </ui-btn>
        </div>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <ui-table
        [headers]="['SKU','Nombre','UM','Estado']"
        [keys]="['sku','name','unitOfMeasure','isActive']"
        [rows]="rows"
        [loading]="loading"
        [actionHeader]="'Acciones'"
        [actionTpl]="actionsTpl"
        [emptyText]="search ? 'No se encontraron productos con ese criterio' : 'No hay productos registrados'">
      </ui-table>
    </div>

    <!-- Paginación mejorada -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Info de resultados -->
        <div class="text-sm text-slate-600 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-slate-400"></div>
          <span>
            Mostrando {{ getShowingFrom() }}-{{ getShowingTo() }} de {{ total }} productos
          </span>
        </div>
        
        <!-- Controles de paginación -->
        <div class="flex items-center gap-3">
          <ui-btn
            variant="outline"
            size="sm"
            [disabled]="page <= 1 || loading"
            (click)="prev()">
            ← Anterior
          </ui-btn>
          
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
            <span class="text-sm text-slate-600">Página</span>
            <span class="text-sm font-semibold text-slate-800">{{ page }}</span>
            <span class="text-sm text-slate-600">de {{ getTotalPages() }}</span>
          </div>
          
          <ui-btn
            variant="outline"
            size="sm"
            [disabled]="page * pageSize >= total || loading"
            (click)="next()">
            Siguiente →
          </ui-btn>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium text-red-800">Error al cargar productos</div>
          <div class="text-sm text-red-600">{{ error }}</div>
        </div>
        <ui-btn
          variant="outline"
          size="sm"
          (click)="load(true)"
          class="ml-auto">
          Reintentar
        </ui-btn>
      </div>
    </div>
  </div>

  <!-- Template para acciones -->
  <ng-template #actionsTpl let-r>
    <div class="flex items-center gap-2">
      <ui-btn
        variant="secondary"
        size="sm"
        [routerLink]="['/inventory/products', r.productId, 'edit']">
        Editar
      </ui-btn>
    </div>
  </ng-template>
  `
})
export class ProductListComponent implements OnInit {
  constructor(private svc: Services) {}

  rows: Product[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  error: string | null = null;
  loading = false;

  ngOnInit() { this.load(); }

  load(reset = false) {
    if (reset) this.page = 1;
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    this.svc.products
      .list({ page: this.page, pageSize: this.pageSize, search: this.search })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: r => {
          this.rows = r.data.items;
          this.total = r.data.totalCount;
        },
        error: e => {
          this.error = e?.error?.message ?? 'Error cargando productos';
          this.rows = [];
          this.total = 0;
        }
      });
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  next() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
      this.load();
    }
  }

  getActiveCount(): number {
    return this.rows.filter(r => r.isActive).length;
  }

  getShowingFrom(): number {
    return Math.min((this.page - 1) * this.pageSize + 1, this.total);
  }

  getShowingTo(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}