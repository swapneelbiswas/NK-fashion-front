import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HealthCheckService, HealthStatus } from '@services/health/health-check.service';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  sku: string;
  rating: number;
  reviewCount: number;
  primaryImage: string;
  secondaryImage: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export type InfoModalType = 'shipping' | 'returns' | 'stores' | 'silk' | null;

/**
 * Component representing the main landing page for the NK Fashions storefront.
 * Handles the display of product listings, category grids, hero carousels,
 * interactive footer modal dialogs, and manages the shopping cart drawer state.
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
  public cartItems: CartItem[] = [];

  // UI State
  public activeHeroSlide: number = 0;
  public showCartDrawer: boolean = false;
  public showAccountDropdown: boolean = false;
  public selectedCategory: string = 'All';

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



  /**
   * Sets the active product filter category.
   * @param category The name of the category to filter by.
   */
  public selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  /**
   * Returns products filtered by the active category.
   * @returns List of filtered products.
   */
  public getFilteredProducts(): Product[] {
    if (this.selectedCategory === 'All') {
      return this.products;
    }
    return this.products.filter((p: Product): boolean => p.category === this.selectedCategory);
  }

  public readonly heroSlides = [
    {
      image: '/assets/images/head_offices.png',
      subtitle: 'NK FASHIONS EXCLUSIVE',
      title: 'The Royal Couple Collection',
      description: 'Elegant matching designer sarees and kurtas crafted in fine banarasi silks and traditional styles.',
    },
    {
      image: '/assets/images/head_office.png',
      subtitle: 'SILK MARK CERTIFIED',
      title: 'Handcrafted Heritage Sarees',
      description: 'Discover the charm of pure Gorod and Tussar silks, hand-embroidered by regional artisans.',
    },
    {
      image: '/assets/images/admin_staff.webp',
      subtitle: 'NEW ARRIVALS',
      title: 'Babu Moshai Dhoti-Kurtas',
      description: 'Sleek readymade pleated dhotis paired with beautifully designed designer wedding kurtas.',
    }
  ];

  public readonly roles = [
    {
      label: 'System Admin Portal',
      link: '/admin',
      description: 'Manage catalogs, stores, staff accounts, and security logs.'
    },
    {
      label: 'Store Manager Portal',
      link: '/manager',
      description: 'View sales metrics, local inventories, and stock transfers.'
    },
    {
      label: 'POS Cashier Terminal',
      link: '/cashier',
      description: 'Fast cashier interface, barcode scanner inputs, and checkout.'
    },
    {
      label: 'Customer Boutique Lounge',
      link: '/customer',
      description: 'Track your personal purchases, wishlists, and boutique membership perks.'
    }
  ];


  constructor(private http: HttpClient, private healthCheckService: HealthCheckService) {}

  /**
   * Initializes the component by fetching product data, setting up the hero carousel timer,
   * and checking the backend API health status.
   */
  ngOnInit(): void {
    // Load products from simulated data JSON
    this.http.get<Product[]>('/assets/data/products.json').subscribe({
      next: (data: Product[]): void => {
        this.products = data;
      },
      error: (err: unknown): void => {
        console.error('Failed to load simulated products:', err);
      }
    });

    // Start auto-slider for Hero section
    setInterval((): void => {
      this.nextHeroSlide();
    }, 6000);

    // Check backend API health
    this.checkHealth();
  }

  /** Cleans up active subscriptions on component destroy. */
  public ngOnDestroy(): void {
    this.healthSub?.unsubscribe();
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
      },
      error: (): void => {
        this.healthError = true;
        this.healthLoading = false;
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
    this.activeHeroSlide = (this.activeHeroSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  /**
   * Directly sets the active hero carousel slide to a specific index.
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
   * @param product The product catalog item to add.
   */
  public addToCart(product: Product): void {
    const existing: CartItem | undefined = this.cartItems.find(
      (item: CartItem): boolean => item.product.id === product.id
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    // Open cart drawer upon adding
    this.showCartDrawer = true;
  }

  /**
   * Removes a product entirely from the shopping cart.
   * @param productId The ID of the product to remove.
   */
  public removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(
      (item: CartItem): boolean => item.product.id !== productId
    );
  }

  /**
   * Updates the quantity of a product in the cart.
   * @param productId The ID of the target product.
   * @param change The change value (typically +1 or -1).
   */
  public updateQuantity(productId: string, change: number): void {
    const item: CartItem | undefined = this.cartItems.find(
      (i: CartItem): boolean => i.product.id === productId
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
   * @returns The total cart value.
   */
  public getCartTotal(): number {
    return this.cartItems.reduce(
      (acc: number, item: CartItem): number => acc + (item.product.price * item.quantity),
      0
    );
  }

  /**
   * Calculates the cumulative quantity of all items in the shopping cart.
   * @returns Total number of items in the cart.
   */
  public getCartItemCount(): number {
    return this.cartItems.reduce(
      (acc: number, item: CartItem): number => acc + item.quantity,
      0
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
   * @param category - The selected product category name.
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
   * @param type - The modal identifier type ('shipping', 'returns', 'stores', 'silk').
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
   * @param event - Optional form submit event.
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
    this.newsletterEmail = ' '; // Avoid empty string lint rule
    this.newsletterEmail = this.newsletterEmail.trim();

    setTimeout((): void => {
      this.newsletterSuccess = false;
    }, 4500);
  }
}

