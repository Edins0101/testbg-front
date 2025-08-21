import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
// importa TODO desde tu barrel de interfaces
import {
    General, PageResult, PageQuery,
    // Auth
    LoginReq, LoginRes,
    // Products
    Product, ProductCreate, ProductUpdate,
    // Suppliers
    Supplier, SupplierCreate, SupplierUpdate,
    // Product-Suppliers
    ProductSupplier, ProductSupplierCreate, ProductSupplierUpdate, StockAdjust,
} from '../interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Services {
    private http = inject(HttpClient);
    private base = environment.apiBaseUrl; // e.g. https://localhost:7173/api
    private readonly TOKEN_KEY = 'auth_token';
    // helper pa’ construir HttpParams sin desorden
    private params(pairs: PageQuery | Record<string, any>) {
        let p = new HttpParams();
        Object.entries(pairs ?? {}).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '') return;
            p = p.set(k, String(v));
        });
        return p;
    }

    // ==================== AUTH ====================
    public readonly auth = {
        login: (body: LoginReq): Observable<General<LoginRes>> =>
            this.http.post<General<LoginRes>>(`${this.base}/Users/login`, body).pipe(
                tap((res) => {
                    if (res.success && res.data?.token) {
                        localStorage.setItem(this.TOKEN_KEY, res.data.token);
                    }
                })
            ),

        logout: () => {
            localStorage.removeItem(this.TOKEN_KEY);
        },

        isLoggedIn: (): boolean => {
            return !!localStorage.getItem(this.TOKEN_KEY);
        },

        getToken: (): string | null => {
            return localStorage.getItem(this.TOKEN_KEY);
        }

    };

    // =================== PRODUCTS =================
    public readonly products = {
        list: (q: PageQuery = {}) =>
            this.http.get<General<PageResult<Product>>>(`${this.base}/products`, {
                params: this.params(q),
            }),

        getById: (id: string) =>
            this.http.get<General<Product>>(`${this.base}/products/${id}`),

        create: (body: ProductCreate) =>
            this.http.post<General<Product>>(`${this.base}/products`, body),

        update: (id: string, body: ProductUpdate) =>
            this.http.put<General<any>>(`${this.base}/products/${id}`, body),
    };

    // =================== SUPPLIERS =================
    public readonly suppliers = {
        list: (q: PageQuery = {}) =>
            this.http.get<General<PageResult<Supplier>>>(`${this.base}/suppliers`, {
                params: this.params(q),
            }),

        getById: (id: string) =>
            this.http.get<General<Supplier>>(`${this.base}/suppliers/${id}`),

        create: (body: SupplierCreate) =>
            this.http.post<General<Supplier>>(`${this.base}/suppliers`, body),

        update: (id: string, body: SupplierUpdate) =>
            this.http.put<General<any>>(`${this.base}/suppliers/${id}`, body),
    };

    // ============== PRODUCT–SUPPLIERS (PS) ==============
    public readonly ps = {
        // listado por producto
        listByProduct: (productId: string, q: PageQuery = {}) =>
            this.http.get<General<PageResult<ProductSupplier>>>(
                `${this.base}/productsuppliers/by-product/${productId}`,
                { params: this.params(q) }
            ),

        create: (body: ProductSupplierCreate) =>
            this.http.post<General<ProductSupplier>>(`${this.base}/productsuppliers`, body),

        update: (id: string, body: ProductSupplierUpdate) =>
            this.http.put<General<any>>(`${this.base}/productsuppliers/${id}`, body),

        // ajuste de stock (Increase=1, Decrease=2)
        adjustStock: (body: StockAdjust) =>
            this.http.post<General<any>>(`${this.base}/productsuppliers/stock/adjust`, body),
    };
}
