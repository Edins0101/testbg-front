import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-btn',
  imports: [NgIf, NgClass],
  template: `
  <button [type]="type" 
          [disabled]="disabled"
          class="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm 
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                 active:scale-[0.98] transform-gpu"
          [ngClass]="buttonClasses">
    <!-- Loading spinner -->
    <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <!-- Icon slot -->
    <span *ngIf="icon" class="text-lg">{{ icon }}</span>
    
    <!-- Content -->
    <ng-content></ng-content>
    
    <!-- Ripple effect -->
    <span class="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 pointer-events-none"></span>
  </button>
  `
})
export class BtnComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon?: string;

  get buttonClasses(): string {
    const baseClasses = 'group relative overflow-hidden';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 focus:ring-slate-500',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }
}