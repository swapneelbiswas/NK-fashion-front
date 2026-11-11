import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import {
  BrandResponse,
  CategoryResponse,
  CreateBrandRequest,
  CreateCategoryRequest,
  CreateJewelleryDetailRequest,
  CreateJewelleryItemRequest,
  CreateMetalPurityRequest,
  CreateMetalRateRequest,
  CreateMetalTypeRequest,
  CreateProductRequest,
  CreateProductVariantRequest,
  ErrorMessage,
  GetJewelleryItemsQuery,
  GetProductsQuery,
  JEWELLERY_ITEM_STATUS_LABELS,
  JEWELLERY_PRICING_METHOD_LABELS,
  JewelleryDetailResponse,
  JewelleryItemResponse,
  JewelleryItemSortBy,
  JewelleryItemStatus,
  JewelleryPricingMethod,
  MetalPurityResponse,
  MetalRateResponse,
  MetalTypeResponse,
  PRODUCT_TYPE_LABELS,
  PagedJewelleryItemResponse,
  ProductResponse,
  ProductType,
  ProductVariantResponse,
  UpdateBrandRequest,
  UpdateCategoryRequest,
  UpdateProductRequest,
  UpdateProductVariantRequest,
} from '@models/nk-fashion.model';
import { BrandService } from '@services/brand/brand.service';
import { CategoryService } from '@services/category/category.service';
import { JewelleryService } from '@services/jewellery/jewellery.service';
import { MetalService } from '@services/metal/metal.service';
import { ProductService } from '@services/product/product.service';
import { Sidebar } from '@shared-components/sidebar/sidebar';

export interface LocationItem {
  id: string;
  name: string;
  code: string;
  type: 'Store' | 'Warehouse';
  address: string;
}

export interface StaffItem {
  id: string;
  name: string;
  role: 'Admin' | 'Store Manager' | 'POS Cashier' | 'Warehouse Lead';
  email: string;
  store: string;
}

export interface SupplierItem {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  leadTime: string;
}

export interface PurchaseOrderItem {
  id: string;
  poNumber: string;
  supplierName: string;
  destination: string;
  productName: string;
  sku: string;
  quantity: number;
  totalCost: number;
  status: 'Sent' | 'Approved' | 'Received';
  orderDate: string;
}

export interface AuditLogItem {
  id: string;
  action: 'PRICE_OVERRIDE' | 'STOCK_ADJUSTMENT' | 'PO_RECEIVED' | 'STAFF_ROLE_CHANGE' | 'LOCATION_CREATED';
  user: string;
  target: string;
  timestamp: string;
}

export interface FlatCategoryOption {
  id: number;
  name: string;
  depth: number;
  isActive: boolean;
  parentCategoryId?: number | null;
  slug: string;
}

export type AdminTab =
  | 'locations'
  | 'products'
  | 'brands-categories'
  | 'jewellery'
  | 'pos'
  | 'staff'
  | 'audit';

/**
 * System Admin Dashboard component.
 * Connects to the NK Fashion REST API for Brands, Categories, Products, Variants,
 * Metal Types/Purities/Rates, Jewellery Details, and tracked Jewellery Items,
 * alongside store operations tabs.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class AdminDashboard implements OnInit {
  public activeTab: AdminTab = 'products';

  // Global feedback & loading
  public apiLoading: boolean = false;
  public apiError: string | null = null;
  public apiSuccess: string | null = null;

  // Enum helpers for templates
  public readonly productTypeLabels: Record<ProductType, string> = PRODUCT_TYPE_LABELS;
  public readonly pricingMethodLabels: Record<JewelleryPricingMethod, string> =
    JEWELLERY_PRICING_METHOD_LABELS;
  public readonly jewelleryStatusLabels: Record<JewelleryItemStatus, string> =
    JEWELLERY_ITEM_STATUS_LABELS;
  public readonly productTypesList: Array<{ value: ProductType; label: string }> = [
    { value: ProductType.Clothing, label: 'Clothing' },
    { value: ProductType.Jewellery, label: 'Jewellery' },
    { value: ProductType.Accessories, label: 'Accessories' },
  ];
  public readonly jewelleryStatusOptions: Array<{ value: JewelleryItemStatus; label: string }> = [
    { value: JewelleryItemStatus.InStock, label: 'InStock' },
    { value: JewelleryItemStatus.Reserved, label: 'Reserved' },
    { value: JewelleryItemStatus.Sold, label: 'Sold' },
    { value: JewelleryItemStatus.Returned, label: 'Returned' },
    { value: JewelleryItemStatus.Damaged, label: 'Damaged' },
    { value: JewelleryItemStatus.Transferred, label: 'Transferred' },
  ];

  // Live API Data: Brands & Categories
  public brands: BrandResponse[] = [];
  public categoriesTree: CategoryResponse[] = [];
  public flatCategories: FlatCategoryOption[] = [];

  // Live API Data: Products & Variants
  public apiProducts: ProductResponse[] = [];
  public productFilterSearch: string = String();
  public productFilterCategoryId: number | null = null;
  public productFilterBrandId: number | null = null;
  public productFilterType: ProductType | null = null;
  public productFilterActive: boolean | null = null;

  public selectedProductForVariants: ProductResponse | null = null;
  public productVariants: ProductVariantResponse[] = [];
  public allVariantsCache: ProductVariantResponse[] = [];

  // Live API Data: Metals & Jewellery
  public metalTypes: MetalTypeResponse[] = [];
  public metalPurities: MetalPurityResponse[] = [];
  public metalRates: MetalRateResponse[] = [];
  public currentMetalRateResult: MetalRateResponse | null = null;
  public currentRateLookupMetalTypeId: number | null = null;
  public currentRateLookupPurityId: number | null = null;
  public currentRateLookupCurrency: string = 'AUD';

  public jewelleryDetails: JewelleryDetailResponse[] = [];
  public pagedJewelleryItems: PagedJewelleryItemResponse | null = null;
  public jewelleryItems: JewelleryItemResponse[] = [];
  public barcodeLookupInput: string = String();
  public barcodeLookupResult: JewelleryItemResponse | null = null;

  public jewellerySearch: string = String();
  public jewelleryFilterMetalTypeId: number | null = null;
  public jewelleryFilterStatus: JewelleryItemStatus | null = null;
  public jewellerySortBy: JewelleryItemSortBy = 'newest';
  public jewelleryPage: number = 1;
  public jewelleryPageSize: number = 10;

  // Modals: Brand
  public showBrandModal: boolean = false;
  public editingBrandId: number | null = null;
  public brandForm: { name: string; description: string; isActive: boolean } = {
    name: String(),
    description: String(),
    isActive: true,
  };

  // Modals: Category
  public showCategoryModal: boolean = false;
  public editingCategoryId: number | null = null;
  public categoryForm: {
    name: string;
    parentCategoryId: number | null;
    isActive: boolean;
  } = {
    name: String(),
    parentCategoryId: null,
    isActive: true,
  };

  // Modals: Product
  public showProductModal: boolean = false;
  public editingProductId: number | null = null;
  public productForm: {
    name: string;
    description: string;
    categoryIds: number[];
    brandId: number | null;
    productType: ProductType;
    isFeatured: boolean;
    isActive: boolean;
  } = {
    name: String(),
    description: String(),
    categoryIds: [],
    brandId: null,
    productType: ProductType.Clothing,
    isFeatured: false,
    isActive: true,
  };

  // Modals: Variant
  public showVariantModal: boolean = false;
  public editingVariantId: number | null = null;
  public variantForm: {
    sku: string;
    size: string;
    colour: string;
    price: number;
    isActive: boolean;
  } = {
    sku: String(),
    size: String(),
    colour: String(),
    price: 0,
    isActive: true,
  };

  // Modals: Metal Type / Purity / Rate
  public showMetalTypeModal: boolean = false;
  public metalTypeForm: CreateMetalTypeRequest = { name: String(), code: String() };

  public showMetalPurityModal: boolean = false;
  public metalPurityForm: CreateMetalPurityRequest = {
    metalTypeId: 0,
    name: String(),
    purityPercentage: 91.6,
  };

  public showMetalRateModal: boolean = false;
  public metalRateForm: CreateMetalRateRequest = {
    metalTypeId: 0,
    metalPurityId: 0,
    ratePerGram: 120,
    currencyCode: 'AUD',
    rateSource: 'Manual',
    isManualOverride: true,
  };

  // Modals: Jewellery Detail & Jewellery Item
  public showJewelleryDetailModal: boolean = false;
  public jewelleryDetailForm: CreateJewelleryDetailRequest = {
    productVariantId: 0,
    metalTypeId: 0,
    metalPurityId: 0,
    pricingMethod: JewelleryPricingMethod.WeightBased,
    makingChargePercentage: 12,
    stoneCharge: 0,
    certificationNumber: String(),
    isIndividuallyTracked: true,
  };

  public showJewelleryItemModal: boolean = false;
  public targetJewelleryDetailId: number = 0;
  public jewelleryItemForm: CreateJewelleryItemRequest = {
    grossWeightGrams: 10,
    netMetalWeightGrams: 9.5,
    stoneWeightCarats: 0,
    fixedSellingPrice: null,
    makingChargePercentage: null,
    stoneCharge: null,
    currencyCode: 'AUD',
  };

  // 1. Locations (existing store operations)
  public locations: LocationItem[] = [
    { id: '1', name: 'NK Fashions Kolkata Flagship', code: 'NK-KOL-01', type: 'Store', address: '12A Park Street, Kolkata' },
    { id: '2', name: 'NK Central Fulfillment Warehouse', code: 'NK-WH-01', type: 'Warehouse', address: 'Salt Lake Sector V, Kolkata' },
    { id: '3', name: 'NK Fashions Mumbai Hub', code: 'NK-MUM-02', type: 'Store', address: 'Bandra West, Mumbai' },
    { id: '4', name: 'NK Fashions Delhi Studio', code: 'NK-DEL-03', type: 'Store', address: 'Connaught Place, New Delhi' },
  ];

  // 3. Purchase Orders & Suppliers
  public suppliers: SupplierItem[] = [
    { id: 'S-1', companyName: 'Bishnupur Silk Weavers Guild', contactPerson: 'Manish Pal', email: 'manish@bishnupursilk.com', phone: '+91 94340 11223', category: 'Handloom Sarees', leadTime: '7 Days' },
    { id: 'S-2', companyName: 'Varanasi Zari Arts', contactPerson: 'Rameshwar Gupta', email: 'ramesh@varanasizari.in', phone: '+91 98390 44556', category: 'Banarasi & Brocade', leadTime: '10 Days' },
    { id: 'S-3', companyName: 'Tirupur Knits & Yarns Ltd', contactPerson: 'K. Balan', email: 'balan@tirupurknits.com', phone: '+91 94430 88990', category: 'Cotton Polos', leadTime: '5 Days' },
  ];

  public purchaseOrders: PurchaseOrderItem[] = [
    { id: '1', poNumber: 'PO-2026-0041', supplierName: 'Bishnupur Silk Weavers Guild', destination: 'NK Central Fulfillment Warehouse', productName: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', quantity: 20, totalCost: 64000, status: 'Sent', orderDate: '2026-08-26' },
    { id: '2', poNumber: 'PO-2026-0039', supplierName: 'Tirupur Knits & Yarns Ltd', destination: 'NK Central Fulfillment Warehouse', productName: 'Single Jersey Knitted Cotton Polo', sku: 'NF-POLO-72591', quantity: 50, totalCost: 29000, status: 'Received', orderDate: '2026-08-20' },
  ];

  // 4. Staff Accounts
  public staff: StaffItem[] = [
    { id: '1', name: 'Anik Sen', role: 'Store Manager', email: 'anik@nkfashions.com', store: 'NK-KOL-01' },
    { id: '2', name: 'Suhana Das', role: 'POS Cashier', email: 'suhana@nkfashions.com', store: 'NK-KOL-01' },
    { id: '3', name: 'Rahul Bose', role: 'Store Manager', email: 'rahul@nkfashions.com', store: 'NK-MUM-02' },
    { id: '4', name: 'Debjani Roy', role: 'Warehouse Lead', email: 'debjani@nkfashions.com', store: 'NK-WH-01' },
  ];

  // 5. Audit Trail
  public auditLogs: AuditLogItem[] = [
    { id: '101', action: 'PO_RECEIVED', user: 'Debjani Roy', target: 'PO-2026-0039 (50 pcs Cotton Polos into NK-WH-01)', timestamp: '2026-08-28 16:30' },
    { id: '102', action: 'PRICE_OVERRIDE', user: 'Anik Sen', target: 'Polo Shirt - Line Discount ₹150', timestamp: '2026-08-28 15:32' },
    { id: '103', action: 'STOCK_ADJUSTMENT', user: 'Anik Sen', target: 'Hakoba Saree - Stock: 40 -> 45 (+5 pcs)', timestamp: '2026-08-28 14:15' },
    { id: '104', action: 'LOCATION_CREATED', user: 'System Admin', target: 'New Branch: NK-DEL-03 (Connaught Place)', timestamp: '2026-08-28 11:20' },
    { id: '105', action: 'STAFF_ROLE_CHANGE', user: 'System Admin', target: 'Suhana Das assigned POS Cashier at NK-KOL-01', timestamp: '2026-08-28 10:05' },
  ];

  public auditFilter: string = 'ALL';

  // Store Ops Modals
  public showAddLocation: boolean = false;
  public newLocation: LocationItem = { id: String(), name: String(), code: String(), type: 'Store', address: String() };
  public showCreatePO: boolean = false;
  public newPoSupplier: string = 'Bishnupur Silk Weavers Guild';
  public newPoSku: string = 'NF-SAR-001';
  public newPoQty: number = 25;
  public showAddStaff: boolean = false;
  public newStaff: StaffItem = { id: String(), name: String(), email: String(), role: 'POS Cashier', store: 'NK-KOL-01' };

  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly metalService: MetalService,
    private readonly jewelleryService: JewelleryService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  /**
   * Initializes the dashboard by loading all live API resources.
   */
  public ngOnInit(): void {
    this.loadAllApiData();
  }

  /**
   * Loads Brands, Categories, Products, Metals, Jewellery Details, and Jewellery Items.
   */
  public loadAllApiData(): void {
    this.apiLoading = true;
    this.apiError = null;
    this.cd.detectChanges();

    forkJoin({
      brands: this.brandService.getBrands().pipe(catchError(() => of([]))),
      categories: this.categoryService.getCategories().pipe(catchError(() => of([]))),
      products: this.productService.getProducts().pipe(catchError(() => of([]))),
      metalTypes: this.metalService.getMetalTypes().pipe(catchError(() => of([]))),
      metalPurities: this.metalService.getMetalPurities().pipe(catchError(() => of([]))),
      metalRates: this.metalService.getMetalRates().pipe(catchError(() => of([]))),
      jewelleryDetails: this.jewelleryService.getJewelleryDetails().pipe(catchError(() => of([]))),
      jewelleryItems: this.jewelleryService
        .getJewelleryItems({ page: this.jewelleryPage, pageSize: this.jewelleryPageSize })
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: (res: {
        brands: BrandResponse[];
        categories: CategoryResponse[];
        products: ProductResponse[];
        metalTypes: MetalTypeResponse[];
        metalPurities: MetalPurityResponse[];
        metalRates: MetalRateResponse[];
        jewelleryDetails: JewelleryDetailResponse[];
        jewelleryItems: PagedJewelleryItemResponse | null;
      }): void => {
        this.brands = res.brands;
        this.categoriesTree = res.categories;
        this.flatCategories = this.flattenCategoryTree(res.categories);
        this.apiProducts = res.products;
        this.metalTypes = res.metalTypes;
        this.metalPurities = res.metalPurities;
        this.metalRates = res.metalRates;
        this.jewelleryDetails = res.jewelleryDetails;
        this.pagedJewelleryItems = res.jewelleryItems;
        this.jewelleryItems = res.jewelleryItems?.items ?? [];

        if (this.metalTypes.length > 0 && !this.metalPurityForm.metalTypeId) {
          this.metalPurityForm.metalTypeId = this.metalTypes[0].id;
          this.metalRateForm.metalTypeId = this.metalTypes[0].id;
          this.jewelleryDetailForm.metalTypeId = this.metalTypes[0].id;
          this.currentRateLookupMetalTypeId = this.metalTypes[0].id;
        }
        if (this.metalPurities.length > 0 && !this.metalRateForm.metalPurityId) {
          this.metalRateForm.metalPurityId = this.metalPurities[0].id;
          this.jewelleryDetailForm.metalPurityId = this.metalPurities[0].id;
          this.currentRateLookupPurityId = this.metalPurities[0].id;
        }
        if (this.jewelleryDetails.length > 0 && !this.targetJewelleryDetailId) {
          this.targetJewelleryDetailId = this.jewelleryDetails[0].id;
        }

        this.apiLoading = false;
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to load catalog data from API.');
        this.apiLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Switches the active tab view.
   *
   * @param tab Target tab.
   */
  public switchTab(tab: AdminTab): void {
    this.activeTab = tab;
    this.apiError = null;
  }

  // =========================================================================
  // PRODUCTS & VARIANTS (/api/products, /api/products/{productId}/variants)
  // =========================================================================

  /**
   * Queries GET /api/products using the current filter fields.
   */
  public searchProducts(): void {
    const query: GetProductsQuery = {};
    if (this.productFilterSearch.trim().length > 0) {
      query.search = this.productFilterSearch.trim();
    }
    if (this.productFilterCategoryId !== null) {
      query.categoryId = this.productFilterCategoryId;
    }
    if (this.productFilterBrandId !== null) {
      query.brandId = this.productFilterBrandId;
    }
    if (this.productFilterType !== null) {
      query.productType = this.productFilterType;
    }
    if (this.productFilterActive !== null) {
      query.isActive = this.productFilterActive;
    }

    this.apiLoading = true;
    this.cd.detectChanges();
    this.productService.getProducts(query).subscribe({
      next: (products: ProductResponse[]): void => {
        this.apiProducts = products;
        this.apiLoading = false;
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to search products.');
        this.apiLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Opens the Product creation modal.
   */
  public openCreateProductModal(): void {
    this.editingProductId = null;
    this.productForm = {
      name: String(),
      description: String(),
      categoryIds: this.flatCategories.length > 0 ? [this.flatCategories[0].id] : [],
      brandId: null,
      productType: ProductType.Clothing,
      isFeatured: false,
      isActive: true,
    };
    this.showProductModal = true;
  }

  /**
   * Opens the Product edit modal populated with an existing product.
   *
   * @param product Target ProductResponse.
   */
  public openEditProductModal(product: ProductResponse): void {
    this.editingProductId = product.id;
    this.productForm = {
      name: product.name,
      description: product.description || String(),
      categoryIds: product.categories.map((c: { id: number }): number => c.id),
      brandId: product.brandId ?? null,
      productType: product.productType,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    };
    this.showProductModal = true;
  }

  /**
   * Toggles a category ID inside the product form's selected categoryIds array.
   *
   * @param categoryId Category ID to toggle.
   */
  public toggleProductCategory(categoryId: number): void {
    const exists: boolean = this.productForm.categoryIds.includes(categoryId);
    if (exists) {
      this.productForm.categoryIds = this.productForm.categoryIds.filter(
        (id: number): boolean => id !== categoryId,
      );
    } else {
      this.productForm.categoryIds = [...this.productForm.categoryIds, categoryId];
    }
  }

  /**
   * Saves a new or updated product via POST/PUT /api/products.
   */
  public saveProduct(): void {
    if (!this.productForm.name.trim() || this.productForm.categoryIds.length === 0) {
      this.apiError = 'Product name and at least one category are required.';
      return;
    }

    this.apiError = null;
    if (this.editingProductId === null) {
      const payload: CreateProductRequest = {
        name: this.productForm.name.trim(),
        description: this.productForm.description.trim() || null,
        categoryIds: this.productForm.categoryIds,
        brandId: this.productForm.brandId,
        productType: this.productForm.productType,
        isFeatured: this.productForm.isFeatured,
      };
      this.productService.createProduct(payload).subscribe({
        next: (created: ProductResponse): void => {
          this.apiProducts = [created, ...this.apiProducts];
          this.showProductModal = false;
          this.notifySuccess(`Product "${created.name}" created.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to create product.');
          this.cd.detectChanges();
        },
      });
    } else {
      const payload: UpdateProductRequest = {
        name: this.productForm.name.trim(),
        description: this.productForm.description.trim() || null,
        categoryIds: this.productForm.categoryIds,
        brandId: this.productForm.brandId,
        productType: this.productForm.productType,
        isFeatured: this.productForm.isFeatured,
        isActive: this.productForm.isActive,
      };
      this.productService.updateProduct(this.editingProductId, payload).subscribe({
        next: (updated: ProductResponse): void => {
          this.apiProducts = this.apiProducts.map((p: ProductResponse): ProductResponse =>
            p.id === updated.id ? updated : p,
          );
          this.showProductModal = false;
          this.notifySuccess(`Product "${updated.name}" updated.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to update product.');
          this.cd.detectChanges();
        },
      });
    }
  }

  /**
   * Loads variants for the chosen product and shows the variants panel.
   *
   * @param product Target product.
   */
  public openVariantsPanel(product: ProductResponse): void {
    this.selectedProductForVariants = product;
    this.productVariants = [];
    this.cd.detectChanges();

    this.productService.getProductVariants(product.id).subscribe({
      next: (variants: ProductVariantResponse[]): void => {
        this.productVariants = variants;
        this.mergeVariantsCache(variants);
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to load product variants.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Opens modal to create a variant under the currently selected product.
   */
  public openCreateVariantModal(): void {
    this.editingVariantId = null;
    this.variantForm = {
      sku: String(),
      size: String(),
      colour: String(),
      price: 0,
      isActive: true,
    };
    this.showVariantModal = true;
  }

  /**
   * Opens modal to edit an existing product variant.
   *
   * @param variant Target variant.
   */
  public openEditVariantModal(variant: ProductVariantResponse): void {
    this.editingVariantId = variant.id;
    this.variantForm = {
      sku: variant.sku,
      size: variant.size || String(),
      colour: variant.colour || String(),
      price: variant.price,
      isActive: variant.isActive,
    };
    this.showVariantModal = true;
  }

  /**
   * Creates or updates a product variant via POST/PUT /api/products/{productId}/variants.
   */
  public saveVariant(): void {
    if (!this.selectedProductForVariants || !this.variantForm.sku.trim()) {
      this.apiError = 'Variant SKU is required.';
      return;
    }

    const productId: number = this.selectedProductForVariants.id;
    if (this.editingVariantId === null) {
      const payload: CreateProductVariantRequest = {
        sku: this.variantForm.sku.trim(),
        size: this.variantForm.size.trim() || null,
        colour: this.variantForm.colour.trim() || null,
        price: Number(this.variantForm.price),
      };
      this.productService.createProductVariant(productId, payload).subscribe({
        next: (created: ProductVariantResponse): void => {
          this.productVariants = [...this.productVariants, created];
          this.mergeVariantsCache([created]);
          this.showVariantModal = false;
          this.notifySuccess(`Variant "${created.sku}" created.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to create variant.');
          this.cd.detectChanges();
        },
      });
    } else {
      const payload: UpdateProductVariantRequest = {
        sku: this.variantForm.sku.trim(),
        size: this.variantForm.size.trim() || null,
        colour: this.variantForm.colour.trim() || null,
        price: Number(this.variantForm.price),
        isActive: this.variantForm.isActive,
      };
      this.productService
        .updateProductVariant(productId, this.editingVariantId, payload)
        .subscribe({
          next: (updated: ProductVariantResponse): void => {
            this.productVariants = this.productVariants.map(
              (v: ProductVariantResponse): ProductVariantResponse =>
                v.id === updated.id ? updated : v,
            );
            this.mergeVariantsCache([updated]);
            this.showVariantModal = false;
            this.notifySuccess(`Variant "${updated.sku}" updated.`);
          },
          error: (err: unknown): void => {
            this.apiError = this.extractErrorMessage(err, 'Failed to update variant.');
            this.cd.detectChanges();
          },
        });
    }
  }

  /**
   * Soft-deletes (deactivates) a product variant.
   *
   * @param variant Target variant.
   */
  public deactivateVariant(variant: ProductVariantResponse): void {
    if (!this.selectedProductForVariants) {
      return;
    }
    this.productService
      .deactivateProductVariant(this.selectedProductForVariants.id, variant.id)
      .subscribe({
        next: (): void => {
          this.productVariants = this.productVariants.map(
            (v: ProductVariantResponse): ProductVariantResponse =>
              v.id === variant.id ? { ...v, isActive: false } : v,
          );
          this.notifySuccess(`Variant "${variant.sku}" deactivated.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to deactivate variant.');
          this.cd.detectChanges();
        },
      });
  }

  /**
   * Formats category names for display in the product table.
   *
   * @param product ProductResponse item.
   * @returns Comma-separated category names.
   */
  public formatProductCategories(product: ProductResponse): string {
    if (!product.categories || product.categories.length === 0) {
      return 'Uncategorized';
    }
    return product.categories.map((c: { name: string }): string => c.name).join(', ');
  }

  // =========================================================================
  // BRANDS & CATEGORIES (/api/brands, /api/categories)
  // =========================================================================

  /**
   * Opens modal to create a new brand.
   */
  public openCreateBrandModal(): void {
    this.editingBrandId = null;
    this.brandForm = { name: String(), description: String(), isActive: true };
    this.showBrandModal = true;
  }

  /**
   * Opens modal to edit an existing brand.
   *
   * @param brand Target brand.
   */
  public openEditBrandModal(brand: BrandResponse): void {
    this.editingBrandId = brand.id;
    this.brandForm = {
      name: brand.name,
      description: brand.description || String(),
      isActive: brand.isActive,
    };
    this.showBrandModal = true;
  }

  /**
   * Saves a brand via POST/PUT /api/brands.
   */
  public saveBrand(): void {
    if (!this.brandForm.name.trim()) {
      this.apiError = 'Brand name is required.';
      return;
    }

    if (this.editingBrandId === null) {
      const payload: CreateBrandRequest = {
        name: this.brandForm.name.trim(),
        description: this.brandForm.description.trim() || null,
      };
      this.brandService.createBrand(payload).subscribe({
        next: (created: BrandResponse): void => {
          this.brands = [...this.brands, created];
          this.showBrandModal = false;
          this.notifySuccess(`Brand "${created.name}" created.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to create brand.');
          this.cd.detectChanges();
        },
      });
    } else {
      const payload: UpdateBrandRequest = {
        name: this.brandForm.name.trim(),
        description: this.brandForm.description.trim() || null,
        isActive: this.brandForm.isActive,
      };
      this.brandService.updateBrand(this.editingBrandId, payload).subscribe({
        next: (updated: BrandResponse): void => {
          this.brands = this.brands.map((b: BrandResponse): BrandResponse =>
            b.id === updated.id ? updated : b,
          );
          this.showBrandModal = false;
          this.notifySuccess(`Brand "${updated.name}" updated.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to update brand.');
          this.cd.detectChanges();
        },
      });
    }
  }

  /**
   * Deactivates a brand via DELETE /api/brands/{id}.
   *
   * @param brand Target brand.
   */
  public deactivateBrand(brand: BrandResponse): void {
    this.brandService.deactivateBrand(brand.id).subscribe({
      next: (): void => {
        this.brands = this.brands.map((b: BrandResponse): BrandResponse =>
          b.id === brand.id ? { ...b, isActive: false } : b,
        );
        this.notifySuccess(`Brand "${brand.name}" deactivated.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Cannot deactivate brand.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Opens modal to create a category.
   */
  public openCreateCategoryModal(): void {
    this.editingCategoryId = null;
    this.categoryForm = { name: String(), parentCategoryId: null, isActive: true };
    this.showCategoryModal = true;
  }

  /**
   * Opens modal to edit a category.
   *
   * @param cat Flattened category row.
   */
  public openEditCategoryModal(cat: FlatCategoryOption): void {
    this.editingCategoryId = cat.id;
    this.categoryForm = {
      name: cat.name,
      parentCategoryId: cat.parentCategoryId ?? null,
      isActive: cat.isActive,
    };
    this.showCategoryModal = true;
  }

  /**
   * Saves a category via POST/PUT /api/categories and refreshes the category tree.
   */
  public saveCategory(): void {
    if (!this.categoryForm.name.trim()) {
      this.apiError = 'Category name is required.';
      return;
    }

    if (this.editingCategoryId === null) {
      const payload: CreateCategoryRequest = {
        name: this.categoryForm.name.trim(),
        parentCategoryId: this.categoryForm.parentCategoryId,
      };
      this.categoryService.createCategory(payload).subscribe({
        next: (created: CategoryResponse): void => {
          this.showCategoryModal = false;
          this.refreshCategories();
          this.notifySuccess(`Category "${created.name}" created.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to create category.');
          this.cd.detectChanges();
        },
      });
    } else {
      const payload: UpdateCategoryRequest = {
        name: this.categoryForm.name.trim(),
        parentCategoryId: this.categoryForm.parentCategoryId,
        isActive: this.categoryForm.isActive,
      };
      this.categoryService.updateCategory(this.editingCategoryId, payload).subscribe({
        next: (updated: CategoryResponse): void => {
          this.showCategoryModal = false;
          this.refreshCategories();
          this.notifySuccess(`Category "${updated.name}" updated.`);
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to update category.');
          this.cd.detectChanges();
        },
      });
    }
  }

  /**
   * Deactivates a category via DELETE /api/categories/{id}.
   *
   * @param cat Target category.
   */
  public deactivateCategory(cat: FlatCategoryOption): void {
    this.categoryService.deactivateCategory(cat.id).subscribe({
      next: (): void => {
        this.refreshCategories();
        this.notifySuccess(`Category "${cat.name}" deactivated.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Cannot deactivate category.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Refreshes the nested category tree from GET /api/categories.
   */
  private refreshCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (tree: CategoryResponse[]): void => {
        this.categoriesTree = tree;
        this.flatCategories = this.flattenCategoryTree(tree);
        this.cd.detectChanges();
      },
    });
  }

  // =========================================================================
  // METALS & JEWELLERY (/api/metal*, /api/jewellerydetails, /api/jewellery-items)
  // =========================================================================

  /**
   * Creates a new metal type via POST /api/metaltypes.
   */
  public createMetalType(): void {
    if (!this.metalTypeForm.name.trim() || !this.metalTypeForm.code.trim()) {
      this.apiError = 'Metal type name and code are required.';
      return;
    }
    this.metalService.createMetalType(this.metalTypeForm).subscribe({
      next: (created: MetalTypeResponse): void => {
        this.metalTypes = [...this.metalTypes, created];
        this.metalTypeForm = { name: String(), code: String() };
        this.showMetalTypeModal = false;
        this.notifySuccess(`Metal type "${created.name}" created.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to create metal type.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Creates a new metal purity via POST /api/metalpurities.
   */
  public createMetalPurity(): void {
    if (!this.metalPurityForm.metalTypeId || !this.metalPurityForm.name.trim()) {
      this.apiError = 'Metal type and purity name are required.';
      return;
    }
    this.metalService.createMetalPurity(this.metalPurityForm).subscribe({
      next: (created: MetalPurityResponse): void => {
        this.metalPurities = [...this.metalPurities, created];
        this.metalPurityForm.name = String();
        this.showMetalPurityModal = false;
        this.notifySuccess(`Metal purity "${created.name}" created.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to create metal purity.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Creates a new metal rate via POST /api/metalrates.
   */
  public createMetalRate(): void {
    if (!this.metalRateForm.metalTypeId || !this.metalRateForm.metalPurityId) {
      this.apiError = 'Metal type and purity are required for a rate.';
      return;
    }
    this.metalService.createMetalRate(this.metalRateForm).subscribe({
      next: (created: MetalRateResponse): void => {
        this.metalRates = [created, ...this.metalRates];
        this.showMetalRateModal = false;
        this.notifySuccess(
          `Metal rate ${created.currencyCode} ${created.ratePerGram}/g saved.`,
        );
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to create metal rate.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Checks the currently active rate for the selected metal type and purity.
   */
  public lookupCurrentMetalRate(): void {
    if (!this.currentRateLookupMetalTypeId || !this.currentRateLookupPurityId) {
      this.apiError = 'Select a metal type and purity to look up the current rate.';
      return;
    }
    this.apiError = null;
    this.metalService
      .getCurrentMetalRate(
        this.currentRateLookupMetalTypeId,
        this.currentRateLookupPurityId,
        this.currentRateLookupCurrency,
      )
      .subscribe({
        next: (rate: MetalRateResponse): void => {
          this.currentMetalRateResult = rate;
          this.cd.detectChanges();
        },
        error: (err: unknown): void => {
          this.currentMetalRateResult = null;
          this.apiError = this.extractErrorMessage(err, 'No applicable metal rate found.');
          this.cd.detectChanges();
        },
      });
  }

  /**
   * Opens the Jewellery Detail creation modal and ensures variant options are loaded.
   */
  public openCreateJewelleryDetailModal(): void {
    this.showJewelleryDetailModal = true;
    if (this.allVariantsCache.length === 0 && this.apiProducts.length > 0) {
      const jewelleryProducts: ProductResponse[] = this.apiProducts.filter(
        (p: ProductResponse): boolean => p.productType === ProductType.Jewellery,
      );
      const sourceProducts: ProductResponse[] =
        jewelleryProducts.length > 0 ? jewelleryProducts : this.apiProducts.slice(0, 10);
      forkJoin(
        sourceProducts.map((p: ProductResponse) =>
          this.productService.getProductVariants(p.id).pipe(catchError(() => of([]))),
        ),
      ).subscribe((lists: ProductVariantResponse[][]): void => {
        for (const list of lists) {
          this.mergeVariantsCache(list);
        }
        if (this.allVariantsCache.length > 0 && !this.jewelleryDetailForm.productVariantId) {
          this.jewelleryDetailForm.productVariantId = this.allVariantsCache[0].id;
        }
        this.cd.detectChanges();
      });
    }
  }

  /**
   * Creates a jewellery configuration via POST /api/jewellerydetails.
   */
  public createJewelleryDetail(): void {
    if (!this.jewelleryDetailForm.productVariantId) {
      this.apiError = 'Product variant ID is required.';
      return;
    }
    this.jewelleryService.createJewelleryDetail(this.jewelleryDetailForm).subscribe({
      next: (created: JewelleryDetailResponse): void => {
        this.jewelleryDetails = [created, ...this.jewelleryDetails];
        this.targetJewelleryDetailId = created.id;
        this.showJewelleryDetailModal = false;
        this.notifySuccess(`Jewellery detail configured for SKU ${created.sku}.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to create jewellery detail.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Loads paginated/filtered jewellery items via GET /api/jewellery-items.
   *
   * @param page Target page number (defaults to 1).
   */
  public searchJewelleryItems(page: number = 1): void {
    this.jewelleryPage = page;
    const query: GetJewelleryItemsQuery = {
      sortBy: this.jewellerySortBy,
      page: this.jewelleryPage,
      pageSize: this.jewelleryPageSize,
    };
    if (this.jewellerySearch.trim().length > 0) {
      query.search = this.jewellerySearch.trim();
    }
    if (this.jewelleryFilterMetalTypeId !== null) {
      query.metalTypeId = this.jewelleryFilterMetalTypeId;
    }
    if (this.jewelleryFilterStatus !== null) {
      query.status = this.jewelleryFilterStatus;
    }

    this.jewelleryService.getJewelleryItems(query).subscribe({
      next: (paged: PagedJewelleryItemResponse): void => {
        this.pagedJewelleryItems = paged;
        this.jewelleryItems = paged.items;
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to fetch jewellery items.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Looks up a jewellery item by barcode via GET /api/jewellery-items/barcode/{barcode}.
   */
  public lookupJewelleryByBarcode(): void {
    const code: string = this.barcodeLookupInput.trim();
    if (!code) {
      return;
    }
    this.apiError = null;
    this.jewelleryService.getJewelleryItemByBarcode(code).subscribe({
      next: (item: JewelleryItemResponse): void => {
        this.barcodeLookupResult = item;
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        this.barcodeLookupResult = null;
        this.apiError = this.extractErrorMessage(
          err,
          `No jewellery item found with barcode "${code}".`,
        );
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Opens modal to create and price an individually tracked jewellery item.
   *
   * @param detailId Optional JewelleryDetail ID to pre-select.
   */
  public openCreateJewelleryItemModal(detailId?: number): void {
    if (detailId) {
      this.targetJewelleryDetailId = detailId;
    }
    this.showJewelleryItemModal = true;
  }

  /**
   * Creates an individually tracked jewellery item via POST /api/jewellery-items/{jewelleryDetailId}.
   */
  public createJewelleryItem(): void {
    if (!this.targetJewelleryDetailId) {
      this.apiError = 'Select a Jewellery Detail configuration first.';
      return;
    }
    this.jewelleryService
      .createJewelleryItem(this.targetJewelleryDetailId, this.jewelleryItemForm)
      .subscribe({
        next: (created: JewelleryItemResponse): void => {
          this.jewelleryItems = [created, ...this.jewelleryItems];
          this.showJewelleryItemModal = false;
          this.notifySuccess(
            `Jewellery item "${created.barcode}" created at ${created.currencyCode} ${created.sellingPrice}.`,
          );
        },
        error: (err: unknown): void => {
          this.apiError = this.extractErrorMessage(err, 'Failed to create jewellery item.');
          this.cd.detectChanges();
        },
      });
  }

  /**
   * Updates the inventory status of a jewellery item via PATCH /api/jewellery-items/{id}/status.
   *
   * @param item Target jewellery item.
   * @param statusValue Numeric JewelleryItemStatus value.
   */
  public updateJewelleryItemStatus(
    item: JewelleryItemResponse,
    statusValue: number,
  ): void {
    const status: JewelleryItemStatus = Number(statusValue) as JewelleryItemStatus;
    this.jewelleryService.updateJewelleryItemStatus(item.id, { status }).subscribe({
      next: (updated: JewelleryItemResponse): void => {
        this.jewelleryItems = this.jewelleryItems.map(
          (i: JewelleryItemResponse): JewelleryItemResponse =>
            i.id === updated.id ? updated : i,
        );
        this.notifySuccess(`Item ${updated.barcode} status updated to ${updated.status}.`);
      },
      error: (err: unknown): void => {
        this.apiError = this.extractErrorMessage(err, 'Failed to update item status.');
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Maps a status name string back to its numeric JewelleryItemStatus enum value.
   *
   * @param statusName Status string returned by API.
   * @returns Numeric JewelleryItemStatus enum value.
   */
  public getStatusEnumFromName(statusName: string): JewelleryItemStatus {
    const match: { value: JewelleryItemStatus; label: string } | undefined =
      this.jewelleryStatusOptions.find(
        (opt: { value: JewelleryItemStatus; label: string }): boolean =>
          opt.label === statusName,
      );
    return match ? match.value : JewelleryItemStatus.InStock;
  }

  // =========================================================================
  // EXISTING STORE OPERATIONS TABS (Locations, POs, Staff, Audit)
  // =========================================================================

  /**
   * Filtered audit logs.
   *
   * @returns Filtered audit items list.
   */
  public get filteredAuditLogs(): AuditLogItem[] {
    if (this.auditFilter === 'ALL') {
      return this.auditLogs;
    }
    return this.auditLogs.filter(
      (log: AuditLogItem): boolean => log.action === this.auditFilter,
    );
  }

  /**
   * Adds a new store or warehouse location.
   */
  public addLocation(): void {
    if (this.newLocation.name && this.newLocation.code) {
      this.newLocation.id = (this.locations.length + 1).toString();
      this.locations.push({ ...this.newLocation });

      this.auditLogs.unshift({
        id: `10${this.auditLogs.length + 1}`,
        action: 'LOCATION_CREATED',
        user: 'System Admin',
        target: `New ${this.newLocation.type}: ${this.newLocation.name} (${this.newLocation.code})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      this.newLocation = { id: String(), name: String(), code: String(), type: 'Store', address: String() };
      this.showAddLocation = false;
    }
  }

  /**
   * Deletes a location.
   *
   * @param id Target location ID.
   */
  public deleteLocation(id: string): void {
    this.locations = this.locations.filter((loc: LocationItem): boolean => loc.id !== id);
  }

  /**
   * Generates a new purchase order.
   */
  public createPurchaseOrder(): void {
    this.purchaseOrders.unshift({
      id: (this.purchaseOrders.length + 1).toString(),
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: this.newPoSupplier,
      destination: 'NK Central Fulfillment Warehouse',
      productName: 'Catalog Garment',
      sku: this.newPoSku,
      quantity: this.newPoQty,
      totalCost: 1500 * this.newPoQty,
      status: 'Sent',
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 10),
    });

    this.showCreatePO = false;
  }

  /**
   * Receives goods for a PO.
   *
   * @param po Target purchase order.
   */
  public receivePurchaseOrder(po: PurchaseOrderItem): void {
    if (po.status !== 'Received') {
      po.status = 'Received';

      this.auditLogs.unshift({
        id: `10${this.auditLogs.length + 1}`,
        action: 'PO_RECEIVED',
        user: 'System Admin',
        target: `${po.poNumber} received (${po.quantity} pcs ${po.sku} into warehouse)`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    }
  }

  /**
   * Adds staff member.
   */
  public addStaff(): void {
    if (this.newStaff.name && this.newStaff.email) {
      this.staff.push({
        id: (this.staff.length + 1).toString(),
        name: this.newStaff.name,
        email: this.newStaff.email,
        role: this.newStaff.role,
        store: this.newStaff.store,
      });

      this.auditLogs.unshift({
        id: `10${this.auditLogs.length + 1}`,
        action: 'STAFF_ROLE_CHANGE',
        user: 'System Admin',
        target: `${this.newStaff.name} assigned ${this.newStaff.role} at ${this.newStaff.store}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      this.newStaff = { id: String(), name: String(), email: String(), role: 'POS Cashier', store: 'NK-KOL-01' };
      this.showAddStaff = false;
    }
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  /**
   * Flattens a nested category tree into an ordered list with depth levels.
   *
   * @param tree Nested category array.
   * @param depth Current tree depth.
   * @returns Flattened list of categories.
   */
  private flattenCategoryTree(
    tree: CategoryResponse[],
    depth: number = 0,
  ): FlatCategoryOption[] {
    const result: FlatCategoryOption[] = [];
    for (const node of tree) {
      result.push({
        id: node.id,
        name: node.name,
        depth,
        isActive: node.isActive,
        parentCategoryId: node.parentCategoryId,
        slug: node.slug,
      });
      if (node.subCategories && node.subCategories.length > 0) {
        result.push(...this.flattenCategoryTree(node.subCategories, depth + 1));
      }
    }
    return result;
  }

  /**
   * Merges newly loaded variants into the variant dropdown cache.
   *
   * @param variants Variants to cache.
   */
  private mergeVariantsCache(variants: ProductVariantResponse[]): void {
    for (const v of variants) {
      if (!this.allVariantsCache.some((existing: ProductVariantResponse): boolean => existing.id === v.id)) {
        this.allVariantsCache.push(v);
      }
    }
  }

  /**
   * Displays a temporary success notification banner.
   *
   * @param message Notification text.
   */
  private notifySuccess(message: string): void {
    this.apiError = null;
    this.apiSuccess = message;
    this.cd.detectChanges();
    setTimeout((): void => {
      this.apiSuccess = null;
      this.cd.detectChanges();
    }, 4000);
  }

  /**
   * Extracts a readable error message from an HttpErrorResponse.
   *
   * @param err Unknown error object.
   * @param fallback Fallback message.
   * @returns Error text.
   */
  private extractErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body: ErrorMessage | undefined = err.error as ErrorMessage | undefined;
      if (body && typeof body.message === 'string' && body.message.trim().length > 0) {
        return body.message;
      }
    }
    return fallback;
  }
}
