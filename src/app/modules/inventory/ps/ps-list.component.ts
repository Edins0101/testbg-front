// ps-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Services } from '../../../shared/services/services';
import { ProductSupplier, Supplier } from '../../../shared/interfaces';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  template: `
  <div>
    <h2 class="text-xl font-semibold mb-4">Proveedores del producto</h2>

    <!-- Form para crear asociación -->
    <form class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4" (ngSubmit)="create()">
      <!-- Combo buscador de Supplier -->
      <div class="relative" (keydown.escape)="showSupplierDropdown=false">
        <input class="border rounded-xl px-3 py-2 w-full"
               placeholder="Buscar proveedor (nombre / código / email)"
               [(ngModel)]="supplierQuery"
               name="supplierSearch"
               (input)="supplierSearch$.next(supplierQuery)"
               (focus)="supplierSearch$.next(supplierQuery)"
               (blur)="closeSupplierDropdownLater()" />
        <!-- id real seleccionado -->
        <input type="hidden" [(ngModel)]="newSupplierId" name="supplierId" />

        <!-- Dropdown -->
        <div *ngIf="showSupplierDropdown"
             class="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-auto">
          <div *ngIf="supplierLoading" class="p-3 text-sm text-slate-500">Buscando…</div>

          <button type="button"
                  *ngFor="let s of supplierOptions"
                  class="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between gap-3"
                  (mousedown)="$event.preventDefault()"
                  (click)="selectSupplier(s)">
            <div class="min-w-0">
              <div class="font-medium truncate">{{ s.name }}</div>
              <div class="text-xs text-slate-500 truncate">
                {{ s.code }} • {{ s.email || s.phone || '—' }}
              </div>
            </div>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{{ s.isActive ? 'Activo' : 'Inactivo' }}</span>
          </button>

          <div *ngIf="!supplierLoading && supplierOptions.length === 0" class="p-3 text-sm text-slate-500">
            Sin resultados
          </div>
        </div>

        <!-- ayuda visual del seleccionado -->
        <div *ngIf="newSupplierId" class="mt-1 text-xs text-slate-500">Seleccionado: {{ supplierQuery }}</div>
      </div>

      <input class="border rounded-xl px-3 py-2" type="number" placeholder="Precio"
             [(ngModel)]="newPrice" name="price" min="0" step="0.01">
      <input class="border rounded-xl px-3 py-2" type="number" placeholder="Stock"
             [(ngModel)]="newStock" name="stock" min="0" step="1">
      <input class="border rounded-xl px-3 py-2" placeholder="Moneda"
             [(ngModel)]="newCurrency" name="currency" maxlength="3">

      <button class="px-4 py-2 rounded-xl text-white"
              [class.bg-emerald-600]="!creating"
              [class.bg-emerald-400]="creating"
              [disabled]="creating || !newSupplierId || newPrice <= 0">
        {{ creating ? 'Agregando…' : 'Agregar' }}
      </button>
    </form>

    <!-- Tabla -->
    <div class="overflow-auto rounded-xl border border-slate-200">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left px-4 py-3">Proveedor</th>
            <th class="text-left px-4 py-3">Precio</th>
            <th class="text-left px-4 py-3">Stock</th>
            <th class="text-left px-4 py-3">Moneda</th>
            <th class="text-left px-4 py-3">Activo</th>
            <th class="text-left px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of rows" class="border-t">
            <td class="px-4 py-2">{{ r.supplierId }}</td>
            <td class="px-4 py-2">{{ r.price }}</td>
            <td class="px-4 py-2">{{ r.stockQty }}</td>
            <td class="px-4 py-2">{{ r.currency }}</td>
            <td class="px-4 py-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-emerald-50]="r.isActive" [class.text-emerald-700]="r.isActive" [class.ring-emerald-200]="r.isActive"
                    [class.bg-rose-50]="!r.isActive" [class.text-rose-700]="!r.isActive" [class.ring-rose-200]="!r.isActive"
                    style="box-shadow: inset 0 0 0 1px currentColor; opacity:.25">
                {{ r.isActive ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-2 flex gap-2">
              <button class="px-3 py-1 rounded bg-slate-200" (click)="inc(r)" [disabled]="adjusting">+ Stock</button>
              <button class="px-3 py-1 rounded bg-slate-200" (click)="dec(r)" [disabled]="adjusting || r.stockQty<=0">- Stock</button>
            </td>
          </tr>
          <tr *ngIf="!rows.length"><td colspan="6" class="px-4 py-6 text-center text-slate-500">Sin datos</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-slate-600">Total: {{ total }}</div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 rounded bg-slate-200" (click)="prev()" [disabled]="page<=1 || loading">Prev</button>
        <span class="text-sm">Página {{ page }}</span>
        <button class="px-3 py-1 rounded bg-slate-200" (click)="next()" [disabled]="page*pageSize>=total || loading">Next</button>
      </div>
    </div>

    <div *ngIf="error" class="text-red-600 mt-3">{{ error }}</div>
  </div>
  `
})
export class PsListComponent implements OnInit, OnDestroy {
  // estado principal
  productId!: string;
  rows: ProductSupplier[] = [];
  total = 0; page = 1; pageSize = 10; error: string | null = null;
  loading = false; creating = false; adjusting = false;

  // form de creación
  newSupplierId = '';
  newPrice = 0;
  newStock = 0;
  newCurrency = 'USD';

  // combo buscador
  supplierQuery = '';
  supplierOptions: Supplier[] = [];
  supplierLoading = false;
  showSupplierDropdown = false;
  supplierSearch$ = new Subject<string>();
  private supplierSub?: Subscription;

  constructor(private svc: Services, private ar: ActivatedRoute) {
    this.productId = this.ar.snapshot.paramMap.get('productId')!;
  }

  ngOnInit() {
    this.load();

    // stream de búsqueda para el combo
    this.supplierSub = this.supplierSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => { this.supplierLoading = true; this.showSupplierDropdown = true; }),
        switchMap(term =>
          this.svc.suppliers.list({ page: 1, pageSize: 10, search: term || '' })
            .pipe(catchError(() => of({ data: { items: [], totalCount: 0 } } as any)))
        )
      )
      .subscribe(res => {
        this.supplierOptions = (res.data.items || []) as Supplier[];
        this.supplierLoading = false;
      });
  }

  ngOnDestroy() {
    this.supplierSub?.unsubscribe();
  }

  // data
  load() {
    this.loading = true;
    this.error = null;

    this.svc.ps
      .listByProduct(this.productId, { page: this.page, pageSize: this.pageSize })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: r => { this.rows = r.data.items; this.total = r.data.totalCount; },
        error: e => this.error = e?.error?.message ?? 'Error cargando'
      });
  }

  prev(){ if(this.page>1){ this.page--; this.load(); } }
  next(){ if(this.page*this.pageSize<this.total){ this.page++; this.load(); } }

  // crear asociación
  create(){
    if(!this.newSupplierId || this.newPrice<=0) return;
    this.creating = true; this.error = null;

    this.svc.ps.create({
      productId: this.productId,
      supplierId: this.newSupplierId,
      price: this.newPrice,
      stockQty: this.newStock,
      currency: this.newCurrency
    })
    .pipe(finalize(() => this.creating = false))
    .subscribe({
      next: _ => {
        // reset
        this.newSupplierId = '';
        this.supplierQuery = '';
        this.newPrice = 0;
        this.newStock = 0;
        this.newCurrency = 'USD';
        this.load();
      },
      error: e => this.error = e?.error?.message ?? 'Error creando'
    });
  }

  // ajustes de stock
  inc(r:ProductSupplier){
    if (this.adjusting) return;
    this.adjusting = true;
    this.svc.ps.adjustStock({ productSupplierId:r.productSupplierId, quantity:1, operation:1 })
      .pipe(finalize(()=> this.adjusting = false))
      .subscribe({ next:_=>this.load(), error: e => this.error = e?.error?.message ?? 'Error ajustando stock' });
  }
  dec(r:ProductSupplier){
    if (this.adjusting || r.stockQty<=0) return;
    this.adjusting = true;
    this.svc.ps.adjustStock({ productSupplierId:r.productSupplierId, quantity:1, operation:2 })
      .pipe(finalize(()=> this.adjusting = false))
      .subscribe({ next:_=>this.load(), error: e => this.error = e?.error?.message ?? 'Error ajustando stock' });
  }

  // typeahead helpers
  selectSupplier(s: Supplier) {
    this.newSupplierId = (s as any).supplierId ?? (s as any).id ?? '';
    this.supplierQuery = s.name;
    this.showSupplierDropdown = false;
  }
  closeSupplierDropdownLater() {
    setTimeout(() => this.showSupplierDropdown = false, 120);
  }
}
