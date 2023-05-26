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

<<<<<<< HEAD
export class ProductMetadataPayload {
=======
export class ProductCategoryPayload {
>>>>>>> feature/inventorymanagement
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
  
<<<<<<< HEAD
export class ProductMetaData {
=======
export class ProductCategory {
>>>>>>> feature/inventorymanagement
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

<<<<<<< HEAD
  constructor(id: string, payload: ProductMetadataPayload) {
=======
  constructor(id: string, payload: ProductCategoryPayload) {
>>>>>>> feature/inventorymanagement
    this.id = id;
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
<<<<<<< HEAD
=======
}

// export type ProductCreated = ProductCategory & ProductQuantity;
export type ProductCreatedPayload = ProductCategoryPayload & ProductQuantityPayload;

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
>>>>>>> feature/inventorymanagement
}