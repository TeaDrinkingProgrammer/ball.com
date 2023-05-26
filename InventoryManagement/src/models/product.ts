import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ProductQuantityPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsNumber()
  quantity: number;
  @IsString()
  supplier: string;
}

export class ProductQuantity {
  id: string;
  quantity: number;
  supplier: string;

  constructor(payload: ProductQuantityPayload) {
    this.id = payload.id;
    this.quantity = payload.quantity;
    this.supplier = payload.supplier;
  }
}

export class ProductCategoryPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  category: string;
  @IsString()
  manufacturer: string;
}
  
export class ProductCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

  constructor(payload: ProductCategoryPayload) {
    this.id = payload.id;
    this.name = payload.name;
    this.description = payload.description;
    this.price = payload.price;
    this.category = payload.category;
    this.manufacturer = payload.manufacturer;
  }
}

export class ProductDeletedPayload {
  @IsString()
  @IsUUID()
  id: string;
}

export class ProductDeleted {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

// export type ProductCreated = ProductCategory & ProductQuantity;
// export type ProductCreatedPayload = ProductCategoryPayload & ProductQuantityPayload;
export class ProductCreatedPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsNumber()
  quantity: number;
  @IsString()
  supplier: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsString()
  category: string;
  @IsString()
  manufacturer: string;
}
export class ProductCreated {
  id: string;
  quantity: number;
  supplier: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

  constructor(payload: ProductCreatedPayload) {
    this.id = payload.id;
    this.quantity = payload.quantity;
    this.supplier = payload.supplier;
    this.name = payload.name;
    this.description = payload.description;
    this.price = payload.price;
    this.category = payload.category;
    this.manufacturer = payload.manufacturer;
  }
}