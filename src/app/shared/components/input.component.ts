import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
  <div class="w-full">
    <label *ngIf="label" class="block text-sm font-medium text-slate-700 mb-1">
      {{ label }} <span *ngIf="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- icono izquierdo -->
      <span *ngIf="leftIcon" class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <span class="text-slate-400 text-sm">{{ leftIcon }}</span>
      </span>

      <input
        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        [class.pl-9]="leftIcon"
        [class.pr-20]="showClearButton || loading || rightIcon"
        [attr.placeholder]="placeholder || null"
        [attr.type]="type"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="handleTouched()"
      />

      <!-- botón clear -->
      <button
        *ngIf="showClearButton && !!value"
        type="button"
        class="absolute inset-y-0 right-3 my-auto h-7 px-2 rounded-md text-xs border border-slate-300 bg-white hover:bg-slate-50"
        (click)="clear()">
        Limpiar
      </button>

      <!-- loading -->
      <div *ngIf="loading" class="absolute inset-y-0" [ngClass]="{'right-3': !showClearButton, 'right-20': showClearButton}">
        <div class="h-full flex items-center">
          <svg class="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      </div>

      <!-- icono derecho (opcional extra) -->
      <span *ngIf="rightIcon" class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <span class="text-slate-400 text-sm">{{ rightIcon }}</span>
      </span>
    </div>

    <!-- hint / error -->
    <p *ngIf="!!error" class="mt-1 text-xs text-red-600">{{ error }}</p>
    <p *ngIf="!error && !!hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  // Inputs que usas en plantillas
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: string = 'text';
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Input() hint?: string;
  @Input() error?: string | null = null;
  @Input() required = false;
  @Input() loading = false;
  @Input() showClearButton = false;

  // ControlValueAccessor
  value: any = '';
  disabled = false;

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  handleTouched() {
    this.onTouched();
  }

  clear() {
    this.value = '';
    this.onChange('');
    // opcional: disparar touched para que valide
    this.onTouched();
  }
}