import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Services } from '../../shared/services/services';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterLink, RouterOutlet],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg flex items-center justify-center">
                <div class="w-4 h-4 bg-white/90 rounded-sm"></div>
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-800">Admin Inventario</h1>
              <p class="text-xs text-slate-500">Sistema de gestión</p>
            </div>
          </div>
          
          <!-- Navegación -->
          <nav class="hidden md:flex items-center gap-1">
            <a routerLink="/inventory" 
               routerLinkActive="active"
               class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-current opacity-60"></div>
                Productos
              </span>
            </a>
            <a routerLink="/inventory/suppliers" 
               routerLinkActive="active"
               class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-current opacity-60"></div>
                Proveedores
              </span>
            </a>
            <a routerLink="/inventory/product-suppliers" 
               routerLinkActive="active"
               class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-current opacity-60"></div>
                Prod–Proveedores
              </span>
            </a>
            
            <!-- Separador -->
            <div class="mx-2 w-px h-6 bg-slate-300"></div>
            
            <!-- Botón de logout -->
            <button (click)="logout()" 
                    class="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-slate-200 hover:border-red-200 group">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-current opacity-60 group-hover:animate-pulse"></div>
                Salir
              </span>
            </button>
          </nav>
          
          <!-- Menú móvil (hamburger) -->
          <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" 
                  (click)="toggleMobileMenu()">
            <div class="w-5 h-5 flex flex-col justify-center gap-1">
              <div class="w-full h-0.5 bg-slate-600 rounded transition-all" 
                   [class.rotate-45]="mobileMenuOpen" 
                   [class.translate-y-1.5]="mobileMenuOpen"></div>
              <div class="w-full h-0.5 bg-slate-600 rounded transition-all" 
                   [class.opacity-0]="mobileMenuOpen"></div>
              <div class="w-full h-0.5 bg-slate-600 rounded transition-all" 
                   [class.-rotate-45]="mobileMenuOpen" 
                   [class.-translate-y-1.5]="mobileMenuOpen"></div>
            </div>
          </button>
        </div>
        
        <!-- Menú móvil expandido -->
        <nav class="md:hidden overflow-hidden transition-all duration-300" 
             [class.max-h-64]="mobileMenuOpen" 
             [class.max-h-0]="!mobileMenuOpen">
          <div class="pt-4 pb-2 space-y-1">
            <a routerLink="/inventory" 
               routerLinkActive="active"
               class="nav-link-mobile block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800"
               (click)="closeMobileMenu()">
              Productos
            </a>
            <a routerLink="/inventory/suppliers" 
               routerLinkActive="active"
               class="nav-link-mobile block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800"
               (click)="closeMobileMenu()">
              Proveedores
            </a>
            <a routerLink="/inventory/product-suppliers" 
               routerLinkActive="active"
               class="nav-link-mobile block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 active:text-blue-800"
               (click)="closeMobileMenu()">
              Prod–Proveedores
            </a>
            <div class="pt-2 mt-2 border-t border-slate-200">
              <button (click)="logout()" 
                      class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-slate-100 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                Salir
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
    
    <!-- Breadcrumb opcional -->
    <div class="max-w-7xl mx-auto px-6 py-2">
      <div class="text-xs text-slate-500 flex items-center gap-1">
        <span>Dashboard</span>
        <span>›</span>
        <span class="text-slate-700 font-medium">Inventario</span>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-6 pb-8">
      <router-outlet/>
    </main>
  </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Estilos para enlaces activos */
    .nav-link.active,
    .nav-link-mobile.active {
      @apply bg-blue-100 text-blue-800 border border-blue-200;
    }
    
    .nav-link.active .w-2,
    .nav-link-mobile.active::before {
      @apply bg-blue-600;
    }
    
    /* Animación del indicador activo */
    .nav-link-mobile.active {
      @apply relative;
    }
    
    .nav-link-mobile.active::before {
      content: '';
      @apply absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r;
    }
    
    /* Animaciones personalizadas */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    main > div {
      animation: fadeInUp 0.3s ease-out;
    }
    
    /* Hover effects mejorados */
    .nav-link:hover .w-2 {
      @apply scale-150;
    }
    
    /* Responsive mejoras */
    @media (max-width: 768px) {
      .nav-link-mobile {
        @apply border-l-4 border-transparent;
      }
      
      .nav-link-mobile.active {
        @apply border-l-blue-600 bg-blue-50;
      }
    }
  `]
})
export class ShellComponent {
  mobileMenuOpen = false;
  
  constructor(private services: Services) {}
  
  logout() { 
    this.services.auth.logout(); 
    location.href = '/login'; 
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}