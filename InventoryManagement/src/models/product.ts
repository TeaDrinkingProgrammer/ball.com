import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ProductStockPayload {
  @IsString()
  @IsUUID()
  id: string;
  @IsNumber()
  quantity: number;
}

export class ProductStock {
  id: string;
  quantity: number;

  constructor(payload: ProductStockPayload) {
    this.id = payload.id;
    this.quantity = payload.quantity;
  }
}

export class ProductInfoPayload {
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
  
export class ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

  constructor(payload: ProductInfoPayload) {
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