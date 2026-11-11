/**
 * NK Fashion API v1 TypeScript Models & Enums
 * Derived from docs/API DOCS/openapi.json (OpenAPI 3.0.3).
 */

/**
 * Standard API error payload.
 */
export interface ErrorMessage {
  message: string;
}

/**
 * Product classification enum (1 = Clothing, 2 = Jewellery, 3 = Accessories).
 */
export enum ProductType {
  Clothing = 1,
  Jewellery = 2,
  Accessories = 3,
}

/**
 * Display labels for ProductType enum values.
 */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.Clothing]: 'Clothing',
  [ProductType.Jewellery]: 'Jewellery',
  [ProductType.Accessories]: 'Accessories',
};

/**
 * Pricing method for jewellery variants (1 = FixedPrice, 2 = WeightBased).
 */
export enum JewelleryPricingMethod {
  FixedPrice = 1,
  WeightBased = 2,
}

/**
 * Display labels for JewelleryPricingMethod enum values.
 */
export const JEWELLERY_PRICING_METHOD_LABELS: Record<JewelleryPricingMethod, string> = {
  [JewelleryPricingMethod.FixedPrice]: 'Fixed Price',
  [JewelleryPricingMethod.WeightBased]: 'Weight Based',
};

/**
 * Inventory status enum for individually tracked jewellery items.
 */
export enum JewelleryItemStatus {
  InStock = 1,
  Reserved = 2,
  Sold = 3,
  Returned = 4,
  Damaged = 5,
  Transferred = 6,
}

/**
 * String status returned by JewelleryItemResponse.status.
 */
export type JewelleryItemStatusName =
  | 'InStock'
  | 'Reserved'
  | 'Sold'
  | 'Returned'
  | 'Damaged'
  | 'Transferred';

/**
 * Display labels for JewelleryItemStatus numeric values.
 */
export const JEWELLERY_ITEM_STATUS_LABELS: Record<JewelleryItemStatus, JewelleryItemStatusName> = {
  [JewelleryItemStatus.InStock]: 'InStock',
  [JewelleryItemStatus.Reserved]: 'Reserved',
  [JewelleryItemStatus.Sold]: 'Sold',
  [JewelleryItemStatus.Returned]: 'Returned',
  [JewelleryItemStatus.Damaged]: 'Damaged',
  [JewelleryItemStatus.Transferred]: 'Transferred',
};

/**
 * Brand entity returned by /api/brands endpoints.
 */
export interface BrandResponse {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
}

/**
 * Payload for creating a brand (POST /api/brands).
 */
export interface CreateBrandRequest {
  name: string;
  description?: string | null;
}

/**
 * Payload for updating a brand (PUT /api/brands/{id}).
 */
export interface UpdateBrandRequest {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

/**
 * Hierarchical category node returned by /api/categories endpoints.
 */
export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentCategoryId?: number | null;
  isActive: boolean;
  subCategories: CategoryResponse[];
}

/**
 * Payload for creating a category (POST /api/categories).
 */
export interface CreateCategoryRequest {
  name: string;
  parentCategoryId?: number | null;
}

/**
 * Payload for updating a category (PUT /api/categories/{id}).
 */
export interface UpdateCategoryRequest {
  name: string;
  parentCategoryId?: number | null;
  isActive?: boolean;
}

/**
 * Summary of a category attached to a product.
 */
export interface ProductCategoryResponse {
  id: number;
  name: string;
  slug: string;
}

/**
 * Product entity returned by /api/products endpoints.
 */
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  productType: ProductType;
  categories: ProductCategoryResponse[];
  brandId?: number | null;
  brand?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAtUtc: string;
}

/**
 * Query parameters for GET /api/products.
 */
export interface GetProductsQuery {
  search?: string;
  categoryId?: number;
  brandId?: number;
  productType?: ProductType;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Payload for creating a product (POST /api/products).
 */
export interface CreateProductRequest {
  name: string;
  description?: string | null;
  categoryIds: number[];
  brandId?: number | null;
  productType?: ProductType;
  isFeatured?: boolean;
}

/**
 * Payload for updating a product (PUT /api/products/{id}).
 */
export interface UpdateProductRequest {
  name: string;
  description?: string | null;
  categoryIds: number[];
  brandId?: number | null;
  productType?: ProductType;
  isFeatured?: boolean;
  isActive?: boolean;
}

/**
 * Product variant entity returned by /api/products/{productId}/variants endpoints.
 */
export interface ProductVariantResponse {
  id: number;
  productId: number;
  sku: string;
  size?: string | null;
  colour?: string | null;
  price: number;
  isActive: boolean;
  createdAtUtc: string;
}

/**
 * Payload for creating a product variant (POST /api/products/{productId}/variants).
 */
export interface CreateProductVariantRequest {
  sku: string;
  size?: string | null;
  colour?: string | null;
  price?: number;
}

/**
 * Payload for updating a product variant (PUT /api/products/{productId}/variants/{id}).
 */
export interface UpdateProductVariantRequest {
  sku: string;
  size?: string | null;
  colour?: string | null;
  price?: number;
  isActive?: boolean;
}

/**
 * Precious metal type entity (e.g., Gold, Silver).
 */
export interface MetalTypeResponse {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

/**
 * Payload for creating a metal type (POST /api/metaltypes).
 */
export interface CreateMetalTypeRequest {
  name: string;
  code: string;
}

/**
 * Metal purity entity linked to a metal type (e.g., 22K, 18K).
 */
export interface MetalPurityResponse {
  id: number;
  metalTypeId: number;
  metalType: string;
  name: string;
  purityPercentage: number;
  isActive: boolean;
}

/**
 * Payload for creating a metal purity (POST /api/metalpurities).
 */
export interface CreateMetalPurityRequest {
  metalTypeId: number;
  name: string;
  purityPercentage?: number;
}

/**
 * Time-effective metal rate per gram.
 */
export interface MetalRateResponse {
  id: number;
  metalTypeId: number;
  metalType: string;
  metalPurityId: number;
  metalPurity: string;
  ratePerGram: number;
  currencyCode: string;
  effectiveFromUtc: string;
  effectiveToUtc?: string | null;
  rateSource: string;
  isManualOverride: boolean;
  createdAtUtc: string;
}

/**
 * Payload for creating a metal rate (POST /api/metalrates).
 */
export interface CreateMetalRateRequest {
  metalTypeId: number;
  metalPurityId: number;
  ratePerGram?: number;
  currencyCode: string;
  effectiveFromUtc?: string;
  rateSource: string;
  isManualOverride?: boolean;
}

/**
 * Jewellery configuration linked to a product variant.
 */
export interface JewelleryDetailResponse {
  id: number;
  productVariantId: number;
  sku: string;
  metalTypeId: number;
  metalType: string;
  metalPurityId: number;
  metalPurity: string;
  purityPercentage: number;
  pricingMethod: JewelleryPricingMethod;
  makingChargePercentage: number;
  stoneCharge: number;
  certificationNumber?: string | null;
  isIndividuallyTracked: boolean;
}

/**
 * Payload for creating a jewellery detail configuration (POST /api/jewellerydetails).
 */
export interface CreateJewelleryDetailRequest {
  productVariantId: number;
  metalTypeId: number;
  metalPurityId: number;
  pricingMethod?: JewelleryPricingMethod;
  makingChargePercentage?: number;
  stoneCharge?: number;
  certificationNumber?: string | null;
  isIndividuallyTracked?: boolean;
}

/**
 * Individually tracked, barcoded jewellery piece with live pricing breakdown.
 */
export interface JewelleryItemResponse {
  id: number;
  jewelleryDetailId: number;
  barcode: string;
  productName: string;
  metalType: string;
  metalPurity: string;
  grossWeightGrams: number;
  netMetalWeightGrams: number;
  stoneWeightCarats: number;
  goldRatePerGram: number;
  goldValue: number;
  makingChargePercentage: number;
  makingChargeAmount: number;
  stoneCharge: number;
  sellingPrice: number;
  currencyCode: string;
  rateSource: string;
  pricedAtUtc: string;
  status: JewelleryItemStatusName;
  createdAtUtc: string;
}

/**
 * Paginated jewellery items response from GET /api/jewellery-items.
 */
export interface PagedJewelleryItemResponse {
  items: JewelleryItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Sort options supported by GET /api/jewellery-items.
 */
export type JewelleryItemSortBy =
  | 'newest'
  | 'oldest'
  | 'price_low'
  | 'price_high'
  | 'name';

/**
 * Query parameters for GET /api/jewellery-items.
 */
export interface GetJewelleryItemsQuery {
  search?: string;
  metalTypeId?: number;
  metalPurityId?: number;
  status?: JewelleryItemStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: JewelleryItemSortBy;
  page?: number;
  pageSize?: number;
}

/**
 * Payload for creating an individually tracked jewellery item (POST /api/jewellery-items/{jewelleryDetailId}).
 */
export interface CreateJewelleryItemRequest {
  grossWeightGrams?: number;
  netMetalWeightGrams?: number;
  stoneWeightCarats?: number;
  fixedSellingPrice?: number | null;
  makingChargePercentage?: number | null;
  stoneCharge?: number | null;
  currencyCode?: string;
}

/**
 * Payload for updating a jewellery item's status (PATCH /api/jewellery-items/{id}/status).
 */
export interface UpdateJewelleryItemStatusRequest {
  status: JewelleryItemStatus;
}

/**
 * Sample weather forecast schema from /WeatherForecast.
 */
export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary?: string | null;
}

