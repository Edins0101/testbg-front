import { Component, Input, TemplateRef } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet, NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ui-table',
  imports: [NgFor, NgIf, NgTemplateOutlet, NgClass],
  template: `
  <div class="overflow-hidden rounded-2xl border border-slate-200/60 shadow-lg bg-white">
    
    <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
      <table class="min-w-full">
        <thead>
          <tr class="text-slate-700">
            <th *ngFor="let h of headers; let i = index"
                class="text-left px-6 py-4 font-semibold text-sm tracking-wide"
                [class.border-r]="i < headers.length - 1 || actionTpl"
                [class.border-slate-200/40]="i < headers.length - 1 || actionTpl">
              <div class="flex items-center gap-2">
                <span>{{ h }}</span>
                <div class="w-1 h-4 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full opacity-40"></div>
              </div>
            </th>
            <th *ngIf="actionTpl" 
                class="text-left px-6 py-4 font-semibold text-sm tracking-wide">
              <div class="flex items-center gap-2">
                <span>{{ actionHeader || 'Acciones' }}</span>
                <div class="w-1 h-4 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-full opacity-40"></div>
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="max-h-[600px] overflow-y-auto">
      <table class="min-w-full text-sm">
        <tbody class="divide-y divide-slate-100/60">
          <tr *ngIf="loading">
            <td [attr.colspan]="headers.length + (actionTpl ? 1 : 0)" class="p-6">
              <div class="space-y-4">
                <div *ngFor="let _ of [1,2,3]" class="animate-pulse flex items-center gap-4">
                  <div class="w-8 h-8 bg-slate-200 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 bg-slate-200 rounded-lg w-3/4"></div>
                    <div class="h-2 bg-slate-200 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr *ngFor="let row of rows; let i = index; trackBy: trackByFn"
              class="transition-all duration-200 group"
              [ngClass]="{
                'bg-white': !striped || i % 2 === 0,
                'bg-slate-50/30': striped && i % 2 === 1,
                'hover:bg-blue-50/40 hover:shadow-sm': hover
              }">
            <td *ngFor="let key of keys; let j = index"
                class="px-6 py-4 align-middle transition-colors duration-200"
                [class.border-r]="j < keys.length - 1 || actionTpl"
                [class.border-slate-100/60]="j < keys.length - 1 || actionTpl"
                [ngClass]="cellAlignClass(row[key])">

              <ng-container *ngIf="isBoolean(row[key]); else checkOtherTypes">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
                      [ngClass]="row[key] ? 
                        'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/50 hover:bg-emerald-200' : 
                        'bg-rose-100 text-rose-800 ring-1 ring-rose-200/50 hover:bg-rose-200'">
                  <div class="w-1.5 h-1.5 rounded-full"
                       [ngClass]="row[key] ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                  {{ row[key] ? 'Activo' : 'Inactivo' }}
                </span>
              </ng-container>

              <ng-template #checkOtherTypes>
                <ng-container *ngIf="isNumber(row[key]); else normalCell">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-medium">
                    {{ formatNumber(row[key]) }}
                  </span>
                </ng-container>

                <ng-template #normalCell>
                  <div class="group relative">
                    <div class="truncate max-w-[20ch] text-slate-700" 
                         [title]="row[key] ?? ''"
                         [ngClass]="{'text-slate-400 italic': !row[key]}">
                      {{ row[key] || '—' }}
                    </div>
                    <div *ngIf="(row[key] || '').length > 20"
                         class="absolute left-0 top-full mt-1 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                      {{ row[key] }}
                    </div>
                  </div>
                </ng-template>
              </ng-template>
            </td>

            <td *ngIf="actionTpl" class="px-6 py-4 align-middle">
              <div class="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                <ng-container *ngTemplateOutlet="actionTpl; context: { $implicit: row, index: i }"></ng-container>
              </div>
            </td>
          </tr>

          <tr *ngIf="!loading && (!rows || rows.length === 0)">
            <td [attr.colspan]="headers.length + (actionTpl ? 1 : 0)"
                class="px-6 py-16 text-center">
              <div class="flex flex-col items-center gap-4 text-slate-500">
                <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-slate-700 mb-1">Sin datos disponibles</div>
                  <div class="text-sm text-slate-500">{{ emptyText || 'No hay información para mostrar' }}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class TableComponent {
  @Input() headers: string[] = [];
  @Input() keys: string[] = [];
  @Input() rows: any[] = [];
  @Input() actionHeader?: string;
  @Input() actionTpl?: TemplateRef<any>;
  @Input() loading = false;
  @Input() striped = true;
  @Input() hover = true;
  @Input() emptyText?: string;

  isBoolean(v: unknown): v is boolean { 
    return typeof v === 'boolean'; 
  }
  
  isNumber(v: unknown): v is number { 
    return typeof v === 'number' && Number.isFinite(v as number); 
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-EC', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    }).format(value);
  }

  cellAlignClass(value: unknown) {
    return this.isNumber(value) ? 'text-right tabular-nums' : 'text-left';
  }

  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }
}