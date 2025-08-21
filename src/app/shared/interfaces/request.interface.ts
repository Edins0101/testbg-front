export type LoginReq = {
  email: string;
  password: string;
};

export type ProductCreate = {
  sku: string;
  name: string;
  shortDesc?: string;
  longDesc?: string;
  unitOfMeasure?: string;
};

export type ProductUpdate = {
  name?: string;
  shortDesc?: string;
  longDesc?: string;
  isActive?: boolean;
};

export type SupplierCreate = {
  code: string;
  name: string;
  phone?: string;
  email?: string;
};

export type SupplierUpdate = {
  name?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
};

export type ProductSupplierCreate = {
  productId: string;
  supplierId: string;
  price: number;
  stockQty: number;
  currency?: string;
};

export type ProductSupplierUpdate = {
  price?: number;
  stockQty?: number;
  isActive?: boolean;
  currency?: string;
};

export type StockAdjust = {
  productSupplierId: string;
  quantity: number;
  operation: 1 | 2; // 1=Increase, 2=Decrease
};
