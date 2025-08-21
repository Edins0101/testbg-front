import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ui-input',
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf],
  template: `
  <div class="space-y-2">
    <!-- Label mejorado -->
    <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>{{ label }}</span>
      <span *ngIf="required" class="text-red-500 text-xs">*</span>
      <span *ngIf="hint" class="text-xs text-slate-500 font-normal">({{ hint }})</span>
    </label>

    <!-- Input container -->
    <div class="relative group">
      <!-- Icon izquierdo -->
      <div *ngIf="leftIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
        <span class="text-lg">{{ leftIcon }}</span>
      </div>

      <!-- Input field -->
      <input 
        [type]="type" 
        [formControl]="control"
        [placeholder]="placeholder"
        [readonly]="readonly"
        [attr.aria-describedby]="error ? 'error-' + label : null"
        class="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200
               focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed
               placeholder:text-slate-400"
        [class.pl-11]="leftIcon"
        [class.pr-11]="rightIcon || showClearButton"
        [ngClass]="inputClasses" />

      <!-- Icon derecho o botón clear -->
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <!-- Clear button -->
        <button *ngIf="showClearButton && control?.value" 
                type="button"
                (click)="clearValue()"
                class="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Right icon -->
        <span *ngIf="rightIcon" class="text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg">
          {{ rightIcon }}
        </span>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Error message mejorado -->
    <div *ngIf="error" 
         [id]="'error-' + label"
         class="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {{ error }}
    </div>

    <!-- Help text -->
    <div *ngIf="helpText && !error" class="text-xs text-slate-500 flex items-center gap-1">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {{ helpText }}
    </div>
  </div>
  `
})
export class InputComponent {
  @Input() label = '';
  @Input() type: string = 'text';
  @Input() control: any;
  @Input() error?: string | null;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() helpText?: string;
  @Input() required = false;
  @Input() readonly = false;
  @Input() loading = false;
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Input() showClearButton = false;

  get inputClasses(): string {
    if (this.error) {
      return 'border-red-300 focus:border-red-500 bg-red-50/50';
    }
    if (this.control?.valid && this.control?.touched) {
      return 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/50';
    }
    return 'border-slate-300 focus:border-blue-500 bg-white hover:border-slate-400';
  }

  clearValue(): void {
    if (this.control) {
      this.control.setValue('');
    }
  }
}