import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, Subscription } from 'rxjs';
import {
  CategoryResponse,
  JewelleryItemResponse,
  JewelleryItemStatus,
  MetalRateResponse,
  PRODUCT_TYPE_LABELS,
  ProductResponse,
  ProductType,
  ProductVariantResponse,
} from '@models/nk-fashion.model';
import { CategoryService } from '@services/category/category.service';
import { HealthCheckService, HealthStatus } from '@services/health/health-check.service';
import { JewelleryService } from '@services/jewellery/jewellery.service';
import { MetalService } from '@services/metal/metal.service';
import { ProductService } from '@services/product/product.service';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  currencyCode?: string;
  sku: string;
  rating: number;
  reviewCount: number;
  primaryImage: string;
  secondaryImage: string;
  description: string;
  productType?: ProductType;
  categoryIds?: number[];
  isFeatured?: boolean;
  variants?: ProductVariantResponse[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export type InfoModalType = 'shipping' | 'returns' | 'stores' | 'silk' | null;

const FALLBACK_IMAGES: Array<{ primary: string; secondary: string }> = [
  { primary: '/assets/images/hospital_staff.png', secondary: '/assets/images/admin_staff.webp' },
  { primary: '/assets/images/head_office_leader.webp', secondary: '/assets/images/leader.webp' },
  { primary: '/assets/images/head_office.png', secondary: '/assets/images/head_office.webp' },
  { primary: '/assets/images/head_offices.png', secondary: '/assets/images/head_offices.webp' },
  { primary: '/assets/images/staff.png', secondary: '/assets/images/staff.webp' },
];

/**
 * Component representing the main landing page for the NK Fashions storefront.
 * Connects to the NK Fashion REST API for products, variants, categories, metal rates,
 * and jewellery items, with graceful fallback to demo storefront data when offline.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class Landing implements OnInit, OnDestroy {
  public products: Product[] = [];
  public apiCategories: CategoryResponse[] = [];
  public flatCategories: CategoryResponse[] = [];
  public activeMetalRates: MetalRateResponse[] = [];
  public jewelleryItems: JewelleryItemResponse[] = [];
  public cartItems: CartItem[] = [];

  // UI State
  public activeHeroSlide: number = 0;
  public showCartDrawer: boolean = false;
  public showAccountDropdown: boolean = false;
  public selectedCategory: string = 'All';
  public selectedProductType: ProductType | null = null;
  public searchQuery: string = String();
  public catalogLoading: boolean = false;
  public isLiveApiCatalog: boolean = false;

  // Footer & Modal State
  public activeModal: InfoModalType = null;
  public newsletterEmail!: string;
  public newsletterSuccess: boolean = false;
  public newsletterError: string | null = null;

  // API Health Check
  public healthStatus: HealthStatus | null = null;
  public healthLoading: boolean = true;
  public healthError: boolean = false;
  private healthSub?: Subscription;
  private catalogSub?: Subscription;
  private heroTimerId?: ReturnType<typeof setInterval>;

  public readonly productTypeOptions: Array<{ label: string; value: ProductType | null }> = [
    { label: 'All Types', value: null },
    { label: PRODUCT_TYPE_LABELS[ProductType.Clothing], value: ProductType.Clothing },
    { label: PRODUCT_TYPE_LABELS[ProductType.Jewellery], value: ProductType.Jewellery },
    { label: PRODUCT_TYPE_LABELS[ProductType.Accessories], value: ProductType.Accessories },
  ];

  public readonly heroSlides: Array<{
    image: string;
    subtitle: string;
    title: string;
    description: string;
  }> = [
    {
      image: '/assets/images/head_offices.png',
      subtitle: 'NK FASHIONS EXCLUSIVE',
      title: 'The Royal Couple Collection',
      description:
        'Elegant matching designer sarees and kurtas crafted in fine banarasi silks and traditional styles.',
    },
    {
      image: '/assets/images/head_office.png',
      subtitle: 'SILK MARK CERTIFIED',
      title: 'Handcrafted Heritage Sarees',
      description:
        'Discover the charm of pure Gorod and Tussar silks, hand-embroidered by regional artisans.',
    },
    {
      image: '/assets/images/admin_staff.webp',
      subtitle: 'NEW ARRIVALS',
      title: 'Babu Moshai Dhoti-Kurtas',
      description:
        'Sleek readymade pleated dhotis paired with beautifully designed designer wedding kurtas.',
    },
  ];

  public readonly roles: Array<{
    label: string;
    link: string;
    description: string;
  }> = [
    {
      label: 'System Admin Portal',
      link: '/admin',
      description: 'Manage catalogs, stores, staff accounts, and security logs.',
    },
    {
      label: 'Store Manager Portal',
      link: '/manager',
      description: 'View sales metrics, local inventories, and stock transfers.',
    },
    {
      label: 'POS Cashier Terminal',
      link: '/cashier',
      description: 'Fast cashier interface, barcode scanner inputs, and checkout.',
    },
    {
      label: 'Customer Boutique Lounge',
      link: '/customer',
      description: 'Track your personal purchases, wishlists, and boutique membership perks.',
    },
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly healthCheckService: HealthCheckService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly metalService: MetalService,
    private readonly jewelleryService: JewelleryService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  /**
   * Initializes the component by loading live API catalog data, setting up the hero carousel timer,
   * and checking the backend API health status.
   */
  public ngOnInit(): void {
    this.loadStorefrontCatalog();

    this.heroTimerId = setInterval((): void => {
      this.nextHeroSlide();
      this.cd.detectChanges();
    }, 6000);

    this.checkHealth();
  }

  /**
   * Cleans up active subscriptions and timers on component destroy.
   */
  public ngOnDestroy(): void {
    this.healthSub?.unsubscribe();
    this.catalogSub?.unsubscribe();
    if (this.heroTimerId) {
      clearInterval(this.heroTimerId);
    }
  }

  /**
   * Loads products, categories, metal rates, and in-stock jewellery items from the API.
   * Falls back to simulated storefront JSON if the API is offline or returns no products.
   */
  public loadStorefrontCatalog(): void {
    this.catalogLoading = true;
    this.cd.detectChanges();

    this.catalogSub?.unsubscribe();
    this.catalogSub = forkJoin({
      products: this.productService.getProducts({ isActive: true }).pipe(catchError(() => of(null))),
      categories: this.categoryService.getActiveCategoryTree().pipe(catchError(() => of([]))),
      rates: this.metalService.getMetalRates().pipe(catchError(() => of([]))),
      jewellery: this.jewelleryService
        .getJewelleryItems({ status: JewelleryItemStatus.InStock, page: 1, pageSize: 12 })
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: (res: {
        products: ProductResponse[] | null;
        categories: CategoryResponse[];
        rates: MetalRateResponse[];
        jewellery: { items: JewelleryItemResponse[] } | null;
      }): void => {
        this.apiCategories = res.categories;
        this.flatCategories = this.flattenCategories(res.categories);
        this.activeMetalRates = res.rates.filter((r: MetalRateResponse): boolean => !r.effectiveToUtc);
        this.jewelleryItems = res.jewellery?.items ?? [];

        if (res.products && res.products.length > 0) {
          this.isLiveApiCatalog = true;
          this.hydrateProductsWithVariants(res.products);
        } else {
          this.isLiveApiCatalog = false;
          this.loadFallbackProducts();
        }
      },
      error: (): void => {
        this.isLiveApiCatalog = false;
        this.loadFallbackProducts();
      },
    });
  }

  /**
   * Fetches variants for each live API product to populate prices and SKUs.
   *
   * @param apiProducts Active products returned by GET /api/products.
   */
  private hydrateProductsWithVariants(apiProducts: ProductResponse[]): void {
    const variantCalls: Array<Observable<ProductVariantResponse[]>> = apiProducts.map(
      (p: ProductResponse): Observable<ProductVariantResponse[]> =>
        this.productService.getProductVariants(p.id).pipe(catchError(() => of([]))),
    );

    forkJoin(variantCalls)
      .pipe(
        map((variantsList: ProductVariantResponse[][]): Product[] =>
          apiProducts.map((p: ProductResponse, idx: number): Product => {
            const variants: ProductVariantResponse[] = variantsList[idx].filter(
              (v: ProductVariantResponse): boolean => v.isActive,
            );
            const primaryVariant: ProductVariantResponse | undefined = variants[0] ?? variantsList[idx][0];
            const imgPair: { primary: string; secondary: string } =
              FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
            const primaryCategory: string =
              p.categories && p.categories.length > 0
                ? p.categories[0].name
                : PRODUCT_TYPE_LABELS[p.productType] || 'Collection';

            return {
              id: p.id.toString(),
              name: p.name,
              category: primaryCategory,
              brand: p.brand || 'NK Fashions',
              price: primaryVariant?.price ?? 0,
              currencyCode: 'AUD',
              sku: primaryVariant?.sku ?? p.slug,
              rating: 5,
              reviewCount: variants.length > 0 ? variants.length * 4 : 8,
              primaryImage: imgPair.primary,
              secondaryImage: imgPair.secondary,
              description: p.description || 'Crafted with NK Fashions heritage standards.',
              productType: p.productType,
              categoryIds: p.categories.map((c: { id: number }): number => c.id),
              isFeatured: p.isFeatured,
              variants,
            };
          }),
        ),
      )
      .subscribe({
        next: (mapped: Product[]): void => {
          this.products = mapped;
          this.catalogLoading = false;
          this.cd.detectChanges();
        },
        error: (): void => {
          this.catalogLoading = false;
          this.loadFallbackProducts();
        },
      });
  }

  /**
   * Loads simulated products JSON when the live API is unavailable or empty.
   */
  private loadFallbackProducts(): void {
    this.http.get<Product[]>('/assets/data/products.json').subscribe({
      next: (data: Product[]): void => {
        this.products = data;
        this.catalogLoading = false;
        this.cd.detectChanges();
      },
      error: (err: unknown): void => {
        console.error('Failed to load simulated products:', err);
        this.catalogLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Flattens a nested category tree into a single selectable list.
   *
   * @param tree Nested category array.
   * @returns Flattened category array.
   */
  private flattenCategories(tree: CategoryResponse[]): CategoryResponse[] {
    const result: CategoryResponse[] = [];
    for (const node of tree) {
      result.push(node);
      if (node.subCategories && node.subCategories.length > 0) {
        result.push(...this.flattenCategories(node.subCategories));
      }
    }
    return result;
  }

  /**
   * Sets the active product filter category.
   *
   * @param category The name of the category to filter by.
   */
  public selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  /**
   * Filters catalog by ProductType enum value.
   *
   * @param productType Target ProductType or null for all.
   */
  public selectProductType(productType: ProductType | null): void {
    this.selectedProductType = productType;
  }

  /**
   * Returns products filtered by category, productType, and search query.
   *
   * @returns List of filtered products.
   */
  public getFilteredProducts(): Product[] {
    const query: string = this.searchQuery.trim().toLowerCase();

    return this.products.filter((p: Product): boolean => {
      const matchesCategory: boolean =
        this.selectedCategory === 'All' ||
        p.category.toLowerCase().includes(this.selectedCategory.toLowerCase());

      const matchesType: boolean =
        this.selectedProductType === null ||
        p.productType === this.selectedProductType ||
        (this.selectedProductType === ProductType.Jewellery &&
          p.category.toLowerCase().includes('jewel'));

      const matchesQuery: boolean =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      return matchesCategory && matchesType && matchesQuery;
    });
  }

  /**
   * Calls the health check API and updates the health status state.
   */
  public checkHealth(): void {
    this.healthLoading = true;
    this.healthError = false;
    this.healthSub = this.healthCheckService.getHealth().subscribe({
      next: (data: HealthStatus): void => {
        this.healthStatus = data;
        this.healthLoading = false;
        this.cd.detectChanges();
      },
      error: (): void => {
        this.healthError = true;
        this.healthLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  /**
   * Changes the active hero carousel slide to the next one.
   */
  public nextHeroSlide(): void {
    this.activeHeroSlide = (this.activeHeroSlide + 1) % this.heroSlides.length;
  }

  /**
   * Changes the active hero carousel slide to the previous one.
   */
  public prevHeroSlide(): void {
    this.activeHeroSlide =
      (this.activeHeroSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  /**
   * Directly sets the active hero carousel slide to a specific index.
   *
   * @param index The index of the target slide.
   */
  public setHeroSlide(index: number): void {
    this.activeHeroSlide = index;
  }

  /**
   * Toggles the visibility of the shopping cart drawer.
   */
  public toggleCartDrawer(): void {
    this.showCartDrawer = !this.showCartDrawer;
  }

  /**
   * Toggles the visibility of the portal login dropdown.
   */
  public toggleAccountDropdown(): void {
    this.showAccountDropdown = !this.showAccountDropdown;
  }

  /**
   * Adds a product to the shopping cart or increments its quantity if it already exists in the cart.
   *
   * @param product The product catalog item to add.
   */
  public addToCart(product: Product): void {
    const existing: CartItem | undefined = this.cartItems.find(
      (item: CartItem): boolean => item.product.id === product.id,
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.showCartDrawer = true;
  }

  /**
   * Adds an individually tracked jewellery piece to the shopping bag.
   *
   * @param item Live jewellery item from GET /api/jewellery-items.
   */
  public addJewelleryItemToCart(item: JewelleryItemResponse): void {
    const product: Product = {
      id: `JEWEL-${item.id}`,
      name: `${item.productName} (${item.metalType} ${item.metalPurity})`,
      category: 'Jewellery',
      brand: 'NK Fine Jewellery',
      price: item.sellingPrice,
      currencyCode: item.currencyCode,
      sku: item.barcode,
      rating: 5,
      reviewCount: 1,
      primaryImage: '/assets/images/logo.png',
      secondaryImage: '/assets/images/head_offices.png',
      description: `Gross ${item.grossWeightGrams}g / Net ${item.netMetalWeightGrams}g`,
      productType: ProductType.Jewellery,
    };
    this.addToCart(product);
  }

  /**
   * Removes a product entirely from the shopping cart.
   *
   * @param productId The ID of the product to remove.
   */
  public removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(
      (item: CartItem): boolean => item.product.id !== productId,
    );
  }

  /**
   * Updates the quantity of a product in the cart.
   *
   * @param productId The ID of the target product.
   * @param change The change value (typically +1 or -1).
   */
  public updateQuantity(productId: string, change: number): void {
    const item: CartItem | undefined = this.cartItems.find(
      (i: CartItem): boolean => i.product.id === productId,
    );
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      }
    }
  }

  /**
   * Calculates the total cost of all products currently in the shopping cart.
   *
   * @returns The total cart value.
   */
  public getCartTotal(): number {
    return this.cartItems.reduce(
      (acc: number, item: CartItem): number => acc + item.product.price * item.quantity,
      0,
    );
  }

  /**
   * Calculates the cumulative quantity of all items in the shopping cart.
   *
   * @returns Total number of items in the cart.
   */
  public getCartItemCount(): number {
    return this.cartItems.reduce(
      (acc: number, item: CartItem): number => acc + item.quantity,
      0,
    );
  }

  /**
   * Clears all items from the shopping cart.
   */
  public clearCart(): void {
    this.cartItems = [];
  }

  /**
   * Sets category filter and scrolls smoothly to the catalog section.
   *
   * @param category The selected product category name.
   */
  public selectCategoryAndScroll(category: string): void {
    this.selectedCategory = category;
    this.scrollToCatalog();
  }

  /**
   * Scrolls smoothly to the bestselling catalog section.
   */
  public scrollToCatalog(): void {
    const el: HTMLElement | null = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Opens an information modal popup.
   *
   * @param type The modal identifier type ('shipping', 'returns', 'stores', 'silk').
   */
  public openInfoModal(type: InfoModalType): void {
    this.activeModal = type;
  }

  /**
   * Closes the open information modal popup.
   */
  public closeInfoModal(): void {
    this.activeModal = null;
  }

  /**
   * Handles newsletter subscription submissions.
   *
   * @param event Optional form submit event.
   */
  public onSubscribeNewsletter(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.newsletterError = null;

    const email: string = this.newsletterEmail.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      this.newsletterError = 'Please enter a valid email address.';
      return;
    }

    this.newsletterSuccess = true;
    this.newsletterEmail = ' ';
    this.newsletterEmail = this.newsletterEmail.trim();

    setTimeout((): void => {
      this.newsletterSuccess = false;
    }, 4500);
  }
}
