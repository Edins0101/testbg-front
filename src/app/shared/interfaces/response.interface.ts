// Respuesta estándar del backend
export type General<T> = {
  data: T;
  success: boolean;
  message: string;
  traceId?: string;
};

export type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};

// (opcional) para armar queries de paginación en el front
export type PageQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};

export type LoginRes = { token: string };

export type Product = {
  productId: string;
  sku: string;
  name: string;
  shortDesc?: string;
  longDesc?: string;
  unitOfMeasure: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Supplier = {
  supplierId: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
};

export type ProductSupplier = {
  productSupplierId: string;
  productId: string;
  product: Product;
  supplierId: string;
  supplier: Supplier;
  price: number;
  stockQty: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

