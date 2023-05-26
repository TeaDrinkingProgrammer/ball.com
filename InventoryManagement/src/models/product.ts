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

export class ProductMetadataPayload {
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
  
export class ProductMetaData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;

  constructor(id: string, payload: ProductMetadataPayload) {
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
}