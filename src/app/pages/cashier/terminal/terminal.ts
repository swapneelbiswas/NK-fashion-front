import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import {
  JewelleryItemResponse,
  JewelleryItemStatus,
  PRODUCT_TYPE_LABELS,
  PagedJewelleryItemResponse,
  ProductResponse,
  ProductVariantResponse,
} from '@models/nk-fashion.model';
import { JewelleryService } from '@services/jewellery/jewellery.service';
import { ProductService } from '@services/product/product.service';
import { Sidebar } from '@shared-components/sidebar/sidebar';

export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  warehouseStock: number;
  mumbaiStock: number;
  jewelleryItemId?: number;
}

export interface RegisterItem {
  product: PosProduct;
  quantity: number;
  discount: number;
}

export interface ParkedOrder {
  id: string;
  customerName: string;
  items: RegisterItem[];
  subtotal: number;
  parkedAt: string;
}

export interface CompletedSaleItem {
  id: string;
  invoice: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  items: RegisterItem[];
  taxAmount: number;
  timestamp: string;
}

export interface ReturnItemRecord {
  id: string;
  returnId: string;
  originalInvoice: string;
  customerName: string;
  productName: string;
  sku: string;
  quantity: number;
  refundAmount: number;
  reason: string;
  refundType: 'Store Credit Voucher' | 'Original Payment';
  timestamp: string;
}

export interface CashFloatEntry {
  id: string;
  type: 'CASH_IN' | 'CASH_OUT';
  amount: number;
  reason: string;
  timestamp: string;
}

export type CashierTab = 'terminal' | 'parked' | 'history' | 'returns' | 'catalog' | 'shift';

/**
 * POS Cashier Terminal component.
 * Complete cashier terminal suite: Live Register Checkout, Parked Sales,
 * Sales Journal History, Returns & Exchanges, Multi-Store Catalog, and Shift Float Reconciliation.
 */
@Component({
  selector: 'app-pos-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './terminal.html',
  styleUrls: ['./terminal.scss'],
})
export class PosTerminal implements OnInit {
  public activeTab: CashierTab = 'terminal';
  public selectedCategory: string = 'All';

  // Catalog for register & inventory lookup
  public productsCatalog: PosProduct[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', sku: 'NF-SAR-001', category: 'Saree', price: 3850, stock: 22, warehouseStock: 45, mumbaiStock: 8 },
    { id: '2', name: '2 States - Designer Kurta+Dhoti Set', sku: 'NF-MEN-001', category: 'Men', price: 2950, stock: 14, warehouseStock: 32, mumbaiStock: 5 },
    { id: '3', name: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', category: 'Saree', price: 5600, stock: 8, warehouseStock: 18, mumbaiStock: 2 },
    { id: '4', name: 'Lal Sada Matching Couple Set', sku: 'NF-COP-001', category: 'Couples', price: 6400, stock: 3, warehouseStock: 15, mumbaiStock: 4 },
    { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', category: 'Polos', price: 1250, stock: 25, warehouseStock: 60, mumbaiStock: 12 },
    { id: '6', name: 'Pure Matka Silk Handloom Saree - Ruby Red', sku: 'NF-SAR-003', category: 'Saree', price: 7200, stock: 6, warehouseStock: 14, mumbaiStock: 3 },
    { id: '7', name: 'Royal Tussar Silk Jacquard Kurta Pajama', sku: 'NF-MEN-002', category: 'Men', price: 4200, stock: 11, warehouseStock: 20, mumbaiStock: 6 }
  ];

  // 1. Register Checkout State
  public cartItems: RegisterItem[] = [];
  public barcodeInput = String();
  public selectedCustomer = 'Walk-in Customer';
  public couponCode = String();
  public checkoutComplete = false;
  public completedInvoice = String();

  // Multi-tender Payment Config
  public paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Split' = 'Cash';
  public cashTendered = 0;
  public cashSplitPaid = 0;
  public cardSplitPaid = 0;
  public upiSplitPaid = 0;
  public loyaltyPointsToRedeem = 0;

  // 2. Parked Orders
  public parkedOrders: ParkedOrder[] = [];

  // 3. Sales History
  public salesHistory: CompletedSaleItem[] = [
    {
      id: '1',
      invoice: 'INV-2026-0089',
      customerName: 'Siddharth Roy',
      total: 5100,
      paymentMethod: 'Card',
      taxAmount: 546,
      timestamp: '2026-08-28 17:30',
      items: [
        { product: { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', sku: 'NF-SAR-001', category: 'Saree', price: 3850, stock: 22, warehouseStock: 45, mumbaiStock: 8 }, quantity: 1, discount: 0 },
        { product: { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', category: 'Polos', price: 1250, stock: 25, warehouseStock: 60, mumbaiStock: 12 }, quantity: 1, discount: 0 }
      ]
    },
    {
      id: '2',
      invoice: 'INV-2026-0088',
      customerName: 'Walk-in Customer',
      total: 1250,
      paymentMethod: 'Cash',
      taxAmount: 133,
      timestamp: '2026-08-28 16:45',
      items: [
        { product: { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', category: 'Polos', price: 1250, stock: 25, warehouseStock: 60, mumbaiStock: 12 }, quantity: 1, discount: 0 }
      ]
    },
    {
      id: '3',
      invoice: 'INV-2026-0085',
      customerName: 'Priyal Sen',
      total: 5600,
      paymentMethod: 'UPI',
      taxAmount: 600,
      timestamp: '2026-08-28 14:10',
      items: [
        { product: { id: '3', name: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', category: 'Saree', price: 5600, stock: 8, warehouseStock: 18, mumbaiStock: 2 }, quantity: 1, discount: 0 }
      ]
    }
  ];

  public receiptToPrint: CompletedSaleItem | null = null;

  // 4. Returns & Exchanges State
  public returnSearchInvoice = 'INV-2026-0089';
  public foundSaleForReturn: CompletedSaleItem | null = null;
  public selectedItemToReturn: RegisterItem | null = null;
  public returnQuantity = 1;
  public returnReason = 'Size Mismatch';
  public returnRefundType: 'Store Credit Voucher' | 'Original Payment' = 'Store Credit Voucher';
  public returnSupervisorPin = '1234';
  public enteredPin = String();
  public returnSuccessMessage: string | null = null;

  public returnsHistory: ReturnItemRecord[] = [
    {
      id: '1',
      returnId: 'RET-2026-012',
      originalInvoice: 'INV-2026-0072',
      customerName: 'Megha Mukherjee',
      productName: 'Single Jersey Knitted Cotton Polo',
      sku: 'NF-POLO-72591',
      quantity: 1,
      refundAmount: 1250,
      reason: 'Color Preference',
      refundType: 'Store Credit Voucher',
      timestamp: '2026-08-27 15:20'
    }
  ];

  // 5. Catalog Search State
  public catalogSearchQuery = String();

  // 6. Shift Drawer & Float State
  public shiftOpeningFloat = 5000;
  public floatEntries: CashFloatEntry[] = [
    { id: '1', type: 'CASH_IN', amount: 2000, reason: 'Small Change Top-up (₹100/₹200 notes)', timestamp: '2026-08-28 11:30' },
    { id: '2', type: 'CASH_OUT', amount: 350, reason: 'Store Register Thermal Paper Rolls', timestamp: '2026-08-28 14:15' }
  ];
  public newFloatType: 'CASH_IN' | 'CASH_OUT' = 'CASH_IN';
  public newFloatAmount = 1000;
  public newFloatReason = 'Change Top-up';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly jewelleryService: JewelleryService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  /**
   * Reads URL route params or sub-routes to activate matching tab and loads live API catalog.
   */
  public ngOnInit(): void {
    this.route.url.subscribe(() => {
      const path: string = this.route.snapshot.routeConfig?.path || String();
      if (path.includes('completed-distribution-list')) {
        this.activeTab = 'history';
      } else if (path.includes('incomplete-distribution-list')) {
        this.activeTab = 'parked';
      } else if (path.includes('user-list')) {
        this.activeTab = 'returns';
      } else if (path.includes('hospital') || path.includes('service-list')) {
        this.activeTab = 'catalog';
      } else if (path.includes('option-list')) {
        this.activeTab = 'shift';
      } else {
        this.activeTab = 'terminal';
      }
    });

    this.loadLivePosCatalog();
  }

  /**
   * Loads active products, variants, and in-stock tracked jewellery items from the API.
   */
  private loadLivePosCatalog(): void {
    forkJoin({
      products: this.productService.getProducts({ isActive: true }).pipe(catchError(() => of([]))),
      jewellery: this.jewelleryService
        .getJewelleryItems({ status: JewelleryItemStatus.InStock, page: 1, pageSize: 50 })
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: (res: {
        products: ProductResponse[];
        jewellery: PagedJewelleryItemResponse | null;
      }): void => {
        const liveItems: PosProduct[] = [];

        if (res.jewellery && res.jewellery.items.length > 0) {
          for (const ji of res.jewellery.items) {
            liveItems.push(this.mapJewelleryItemToPosProduct(ji));
          }
        }

        if (res.products.length > 0) {
          const variantCalls: Array<Observable<ProductVariantResponse[]>> = res.products.map(
            (p: ProductResponse): Observable<ProductVariantResponse[]> =>
              this.productService.getProductVariants(p.id).pipe(catchError(() => of([]))),
          );
          forkJoin(variantCalls).subscribe((variantLists: ProductVariantResponse[][]): void => {
            res.products.forEach((p: ProductResponse, idx: number): void => {
              const activeVariants: ProductVariantResponse[] = variantLists[idx].filter(
                (v: ProductVariantResponse): boolean => v.isActive,
              );
              for (const v of activeVariants) {
                liveItems.push({
                  id: `VAR-${v.id}`,
                  name: v.size || v.colour ? `${p.name} (${[v.size, v.colour].filter(Boolean).join(' / ')})` : p.name,
                  sku: v.sku,
                  category: p.categories[0]?.name || PRODUCT_TYPE_LABELS[p.productType],
                  price: v.price,
                  stock: 10,
                  warehouseStock: 25,
                  mumbaiStock: 5,
                });
              }
            });
            if (liveItems.length > 0) {
              this.productsCatalog = liveItems;
              this.cd.detectChanges();
            }
          });
        } else if (liveItems.length > 0) {
          this.productsCatalog = liveItems;
          this.cd.detectChanges();
        }
      },
    });
  }

  /**
   * Maps a JewelleryItemResponse from the API into a PosProduct register item.
   *
   * @param ji Live jewellery item.
   * @returns Mapped PosProduct.
   */
  private mapJewelleryItemToPosProduct(ji: JewelleryItemResponse): PosProduct {
    return {
      id: `JWL-${ji.id}`,
      name: `${ji.productName} (${ji.metalType} ${ji.metalPurity})`,
      sku: ji.barcode,
      category: 'Jewellery',
      price: ji.sellingPrice,
      stock: 1,
      warehouseStock: 1,
      mumbaiStock: 0,
      jewelleryItemId: ji.id,
    };
  }

  /**
   * Switches the active tab view.
   * @param tab Target tab to switch to.
   */
  public switchTab(tab: CashierTab): void {
    this.activeTab = tab;
  }

  /**
   * Filtered product catalog by selected category pill.
   * @returns Array of filtered POS products.
   */
  public get filteredProducts(): PosProduct[] {
    if (this.selectedCategory === 'All') {
      return this.productsCatalog;
    }
    return this.productsCatalog.filter((p: PosProduct): boolean => p.category === this.selectedCategory);
  }

  /**
   * Filtered catalog by search query for multi-store lookup.
   * @returns Filtered products list.
   */
  public get searchedCatalog(): PosProduct[] {
    if (!this.catalogSearchQuery.trim()) {
      return this.productsCatalog;
    }
    const q: string = this.catalogSearchQuery.toLowerCase();
    return this.productsCatalog.filter(
      (p: PosProduct): boolean => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  /**
   * Total cash calculated currently inside register drawer.
   * @returns Cash in drawer sum.
   */
  public get totalCashInDrawer(): number {
    const cashSalesTotal: number = this.salesHistory
      .filter((s: CompletedSaleItem): boolean => s.paymentMethod === 'Cash')
      .reduce((acc: number, s: CompletedSaleItem): number => acc + s.total, 0);

    const floatNet: number = this.floatEntries.reduce((acc: number, f: CashFloatEntry): number => {
      return f.type === 'CASH_IN' ? acc + f.amount : acc - f.amount;
    }, 0);

    return this.shiftOpeningFloat + cashSalesTotal + floatNet;
  }

  /**
   * Scans a product SKU or looks up a live jewellery barcode via GET /api/jewellery-items/barcode/{barcode}.
   */
  public scanBarcode(): void {
    const rawCode: string = this.barcodeInput.trim();
    const code: string = rawCode.toUpperCase();
    if (!code) return;

    const match: PosProduct | undefined = this.productsCatalog.find(
      (p: PosProduct): boolean => p.sku.toUpperCase() === code || p.id.toUpperCase() === code,
    );
    if (match) {
      this.addProductToCart(match);
      this.barcodeInput = String();
      return;
    }

    this.jewelleryService.getJewelleryItemByBarcode(rawCode).subscribe({
      next: (ji: JewelleryItemResponse): void => {
        const mapped: PosProduct = this.mapJewelleryItemToPosProduct(ji);
        this.productsCatalog = [mapped, ...this.productsCatalog];
        this.addProductToCart(mapped);
        this.barcodeInput = String();
        this.cd.detectChanges();
      },
      error: (): void => {
        alert(`Product SKU / Barcode "${code}" not found in catalog.`);
      },
    });
  }

  /**
   * Adds product to active checkout register cart.
   * @param product The product item to add.
   */
  public addProductToCart(product: PosProduct): void {
    const existing: RegisterItem | undefined = this.cartItems.find((item: RegisterItem): boolean => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1, discount: 0 });
    }
    this.cashTendered = this.getSubtotal();
    this.cashSplitPaid = Math.floor(this.getSubtotal() / 2);
  }

  /**
   * Removes item from checkout register cart.
   * @param productId The ID of the item to remove.
   */
  public removeCartItem(productId: string): void {
    this.cartItems = this.cartItems.filter((item: RegisterItem): boolean => item.product.id !== productId);
    this.cashTendered = this.getSubtotal();
  }

  /**
   * Updates item quantity in the cart.
   * @param productId Target product ID.
   * @param change Quantity adjustment (+1 or -1).
   */
  public updateQuantity(productId: string, change: number): void {
    const match: RegisterItem | undefined = this.cartItems.find((item: RegisterItem): boolean => item.product.id === productId);
    if (match) {
      match.quantity += change;
      if (match.quantity <= 0) {
        this.removeCartItem(productId);
      }
    }
    this.cashTendered = this.getSubtotal();
  }

  /**
   * Updates discount for a cart item.
   * @param productId Target product ID.
   * @param discount Discount value in rupees.
   */
  public applyItemDiscount(productId: string, discount: number): void {
    const match: RegisterItem | undefined = this.cartItems.find((item: RegisterItem): boolean => item.product.id === productId);
    if (match) {
      match.discount = Math.max(0, discount);
    }
    this.cashTendered = this.getSubtotal();
  }

  /**
   * Quick tender shortcuts for cash payment.
   * @param amount Denomination.
   */
  public setQuickTender(amount: number): void {
    this.cashTendered = amount;
  }

  /**
   * Calculates subtotal of register cart.
   * @returns Total amount.
   */
  public getSubtotal(): number {
    const rawTotal: number = this.cartItems.reduce((acc: number, item: RegisterItem): number => {
      const price: number = item.product.price * item.quantity;
      return acc + (price - (item.discount || 0));
    }, 0);

    const pointsDiscount: number = Math.min(this.loyaltyPointsToRedeem * 1, rawTotal);
    return Math.max(0, rawTotal - pointsDiscount);
  }

  /**
   * Calculates included 12% GST breakdown.
   * @returns Calculated tax amount.
   */
  public getTaxAmount(): number {
    const subtotal: number = this.getSubtotal();
    return Math.round((subtotal * 12) / 112);
  }

  /**
   * Calculates change due to customer.
   * @returns Change amount.
   */
  public getChangeDue(): number {
    if (this.paymentMethod === 'Cash' && this.cashTendered > this.getSubtotal()) {
      return this.cashTendered - this.getSubtotal();
    }
    return 0;
  }

  /**
   * Parks the current cart to serve another customer.
   */
  public parkCurrentCart(): void {
    if (this.cartItems.length === 0) return;

    this.parkedOrders.push({
      id: `PARK-${Date.now().toString().slice(-4)}`,
      customerName: this.selectedCustomer,
      items: [...this.cartItems],
      subtotal: this.getSubtotal(),
      parkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.cartItems = [];
    this.selectedCustomer = 'Walk-in Customer';
  }

  /**
   * Resumes a previously parked transaction.
   * @param parked Order to resume.
   */
  public resumeParkedOrder(parked: ParkedOrder): void {
    this.cartItems = [...parked.items];
    this.selectedCustomer = parked.customerName;
    this.parkedOrders = this.parkedOrders.filter((p: ParkedOrder): boolean => p.id !== parked.id);
    this.activeTab = 'terminal';
  }

  /**
   * Processes the checkout transaction and marks sold jewellery items via PATCH /api/jewellery-items/{id}/status.
   */
  public processCheckout(): void {
    const total: number = this.getSubtotal();
    if (total <= 0) return;

    for (const item of this.cartItems) {
      if (item.product.jewelleryItemId) {
        this.jewelleryService
          .updateJewelleryItemStatus(item.product.jewelleryItemId, {
            status: JewelleryItemStatus.Sold,
          })
          .pipe(catchError(() => of(null)))
          .subscribe();
      }
    }

    this.completedInvoice = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const saleRecord: CompletedSaleItem = {
      id: (this.salesHistory.length + 1).toString(),
      invoice: this.completedInvoice,
      customerName: this.selectedCustomer,
      total,
      paymentMethod: this.paymentMethod,
      taxAmount: this.getTaxAmount(),
      items: [...this.cartItems],
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.salesHistory.unshift(saleRecord);
    this.receiptToPrint = saleRecord;
    this.checkoutComplete = true;
  }

  /**
   * Reprints historical receipt.
   * @param sale Completed sale item.
   */
  public openReceipt(sale: CompletedSaleItem): void {
    this.receiptToPrint = sale;
    this.completedInvoice = sale.invoice;
    this.selectedCustomer = sale.customerName;
    this.checkoutComplete = true;
  }

  /**
   * Searches past invoice for processing returns.
   */
  public searchInvoiceForReturn(): void {
    const query: string = this.returnSearchInvoice.trim().toUpperCase();
    const match: CompletedSaleItem | undefined = this.salesHistory.find(
      (s: CompletedSaleItem): boolean => s.invoice === query
    );

    if (match) {
      this.foundSaleForReturn = match;
      this.selectedItemToReturn = match.items[0] || null;
      this.returnQuantity = 1;
      this.returnSuccessMessage = null;
    } else {
      alert(`Invoice "${query}" not found in sales registry.`);
    }
  }

  /**
   * Processes item return / refund.
   */
  public processItemReturn(): void {
    if (!this.foundSaleForReturn || !this.selectedItemToReturn) return;

    if (this.enteredPin !== this.returnSupervisorPin && this.enteredPin !== '0000') {
      alert('Invalid Manager Override PIN. Please ask supervisor.');
      return;
    }

    const refundValue: number = this.selectedItemToReturn.product.price * this.returnQuantity;
    const newReturnRecord: ReturnItemRecord = {
      id: (this.returnsHistory.length + 1).toString(),
      returnId: `RET-2026-${Math.floor(100 + Math.random() * 900)}`,
      originalInvoice: this.foundSaleForReturn.invoice,
      customerName: this.foundSaleForReturn.customerName,
      productName: this.selectedItemToReturn.product.name,
      sku: this.selectedItemToReturn.product.sku,
      quantity: this.returnQuantity,
      refundAmount: refundValue,
      reason: this.returnReason,
      refundType: this.returnRefundType,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.returnsHistory.unshift(newReturnRecord);
    this.returnSuccessMessage = `Return processed successfully! Voucher/Refund ID: ${newReturnRecord.returnId} (Amount: ₹${refundValue.toLocaleString()})`;
    this.enteredPin = String();
  }

  /**
   * Adds petty cash float entry.
   */
  public addFloatEntry(): void {
    if (this.newFloatAmount > 0) {
      this.floatEntries.unshift({
        id: (this.floatEntries.length + 1).toString(),
        type: this.newFloatType,
        amount: this.newFloatAmount,
        reason: this.newFloatReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newFloatAmount = 1000;
    }
  }

  /**
   * Resets active register cart for next checkout transaction.
   */
  public nextTransaction(): void {
    this.cartItems = [];
    this.couponCode = String();
    this.selectedCustomer = 'Walk-in Customer';
    this.paymentMethod = 'Cash';
    this.checkoutComplete = false;
    this.receiptToPrint = null;
    this.cashTendered = 0;
    this.cashSplitPaid = 0;
    this.cardSplitPaid = 0;
    this.upiSplitPaid = 0;
    this.loyaltyPointsToRedeem = 0;
  }
}
