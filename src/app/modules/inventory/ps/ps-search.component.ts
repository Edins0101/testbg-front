import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Services } from '../../../shared/services/services';
import { Product } from '../../../shared/interfaces';
import { InputComponent } from '../../../shared/components/input.component';
import { BtnComponent } from '../../../shared/components/btn.component';
import { TableComponent } from '../../../shared/components/table.component';
import { NgIf, NgFor } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, InputComponent, BtnComponent, TableComponent],
  template: `
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Productos y Proveedores</h1>
        <p class="text-slate-600">Gestiona las relaciones entre productos y proveedores</p>
      </div>
    </div>

    <!-- Métodos de búsqueda -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
        <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div class="w-2 h-6 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-full"></div>
          Seleccionar Producto
        </h2>
        <p class="text-sm text-slate-600 mt-1">Busca el producto para gestionar sus proveedores</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Método 1: Búsqueda inteligente -->
        <div class="space-y-4">
          <h3 class="text-md font-medium text-slate-700 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
            Búsqueda por nombre o SKU
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-2">
              <ui-input
                label="Buscar producto"
                placeholder="Ingresa nombre o SKU del producto..."
                [(ngModel)]="searchTerm"
                [loading]="searchLoading"
                leftIcon="🔍"
                [showClearButton]="true"
                hint="Los resultados aparecen automáticamente">
              </ui-input>
            </div>
            <ui-btn
              variant="secondary"
              [disabled]="!searchTerm || searchLoading"
              (click)="searchProducts()">
              Buscar
            </ui-btn>
          </div>
        </div>

        <!-- Resultados de búsqueda -->
        <div *ngIf="searchResults.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-slate-600">Resultados de búsqueda:</h4>
          <div class="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <ui-table
              [headers]="['SKU', 'Nombre', 'UM', 'Estado']"
              [keys]="['sku', 'name', 'unitOfMeasure', 'isActive']"
              [rows]="searchResults"
              [loading]="searchLoading"
              [actionHeader]="'Acción'"
              [actionTpl]="searchActionsTpl"
              [emptyText]="'No se encontraron productos'">
            </ui-table>
          </div>
        </div>

        <!-- Separador -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-4 text-slate-500">o también puedes</span>
          </div>
        </div>

        <!-- Método 2: ID directo -->
        <div class="space-y-4">
          <h3 class="text-md font-medium text-slate-700 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center">2</span>
            Acceso directo por ID
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-2">
              <ui-input
                label="Product ID"
                placeholder="Ingresa el GUID del producto..."
                [(ngModel)]="directProductId"
                leftIcon="🆔"
                [showClearButton]="true"
                hint="Para acceso directo con ID conocido">
              </ui-input>
            </div>
            <ui-btn
              variant="primary"
              [disabled]="!directProductId"
              (click)="goToProduct(directProductId)">
              Abrir Proveedores
            </ui-btn>
          </div>
        </div>

        <!-- Acceso rápido a productos recientes -->
        <div *ngIf="recentProducts.length > 0" class="space-y-4">
          <h3 class="text-md font-medium text-slate-700 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">⭐</span>
            Productos recientes
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div *ngFor="let product of recentProducts" 
                 class="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                 (click)="goToProduct(product.productId)">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center">
                  <span class="text-xs font-mono">{{ product.sku.substring(0, 3) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-slate-800 truncate">{{ product.name }}</div>
                  <div class="text-xs text-slate-500">{{ product.sku }}</div>
                </div>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-blue-800 mb-2">¿Qué puedes hacer aquí?</h3>
          <div class="text-sm text-blue-700 space-y-1">
            <div>• Asociar productos con sus proveedores</div>
            <div>• Configurar precios por proveedor</div>
            <div>• Gestionar stock de cada proveedor</div>
            <div>• Ajustar inventario en tiempo real</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Template para acciones de búsqueda -->
  <ng-template #searchActionsTpl let-product>
    <ui-btn
      variant="primary"
      size="sm"
      (click)="goToProduct(product.productId)">
      Ver Proveedores
    </ui-btn>
  </ng-template>
  `
})
export class PsSearchComponent implements OnInit {
  constructor(private router: Router, private svc: Services) {}

  // Búsqueda inteligente
  searchTerm = '';
  searchLoading = false;
  searchResults: Product[] = [];

  // Acceso directo
  directProductId = '';

  // Productos recientes (simulado - en producción vendría del localStorage o API)
  recentProducts: Product[] = [];

  ngOnInit() {
    // Cargar productos recientes del localStorage si existen
    this.loadRecentProducts();
  }

  searchProducts() {
    if (!this.searchTerm.trim()) return;
    
    this.searchLoading = true;
    this.svc.products
      .list({ page: 1, pageSize: 10, search: this.searchTerm })
      .subscribe({
        next: (response) => {
          this.searchResults = response.data.items;
          this.searchLoading = false;
        },
        error: () => {
          this.searchResults = [];
          this.searchLoading = false;
        }
      });
  }

  goToProduct(productId: string) {
    if (!productId) return;
    
    // Guardar en productos recientes
    this.addToRecentProducts(productId);
    
    // Navegar
    this.router.navigate(['/inventory/product-suppliers', productId]);
  }

  private loadRecentProducts() {
    // En producción, esto vendría del localStorage o una API
    // Por ahora simulamos algunos productos recientes
    this.recentProducts = [];
  }

  private addToRecentProducts(productId: string) {
    // En producción, guardarías en localStorage
    // localStorage.setItem('recentProductSuppliers', JSON.stringify(recent));
  }
}