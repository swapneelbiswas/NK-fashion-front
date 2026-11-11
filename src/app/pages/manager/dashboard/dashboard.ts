import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import {
  PRODUCT_TYPE_LABELS,
  PagedJewelleryItemResponse,
  ProductResponse,
  ProductVariantResponse,
} from '@models/nk-fashion.model';
import { JewelleryService } from '@services/jewellery/jewellery.service';
import { ProductService } from '@services/product/product.service';
import { Sidebar } from '@shared-components/sidebar/sidebar';

export interface LocalStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
}

export interface StockTransferItem {
  id: string;
  from: string;
  to: string;
  product: string;
  sku: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
}

export interface CashierLogItem {
  id: string;
  cashier: string;
  action: 'PRICE_OVERRIDE' | 'TRANSACTION_HOLD' | 'CASH_DRAWER_OPEN' | 'REFUND_PROCESSED';
  details: string;
  timestamp: string;
}

export interface ShiftReconciliation {
  openingFloat: number;
  cashSales: number;
  cardSales: number;
  upiSales: number;
  expectedCashInDrawer: number;
  actualCountedCash: number;
  isBalanced: boolean;
}

/**
 * Store Manager Dashboard component.
 * Manages store stock allocations, accepts inventory transfers, and monitors cashier actions.
 */
@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class ManagerDashboard implements OnInit {
  public activeTab: 'stock' | 'transfers' | 'logs' | 'reconciliation' = 'stock';
  public storeName = 'NK Fashions Kolkata Flagship (NK-KOL-01)';
  public stockFilter: 'ALL' | 'LOW' | 'NORMAL' = 'ALL';

  // Stock items
  public stockItems: LocalStockItem[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', sku: 'NF-SAR-001', category: 'Saree', physicalStock: 25, reservedStock: 3, availableStock: 22, reorderPoint: 10 },
    { id: '2', name: '2 States - Designer Kurta+Dhoti Set', sku: 'NF-MEN-001', category: 'Men', physicalStock: 15, reservedStock: 1, availableStock: 14, reorderPoint: 8 },
    { id: '3', name: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', category: 'Saree', physicalStock: 4, reservedStock: 1, availableStock: 3, reorderPoint: 5 },
    { id: '4', name: 'Lal Sada Matching Couple Set', sku: 'NF-COP-001', category: 'Couple', physicalStock: 3, reservedStock: 2, availableStock: 1, reorderPoint: 5 },
    { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', category: 'Men', physicalStock: 30, reservedStock: 5, availableStock: 25, reorderPoint: 12 },
    { id: '6', name: 'Pure Matka Silk Handloom Saree - Ruby Red', sku: 'NF-SAR-003', category: 'Saree', physicalStock: 5, reservedStock: 0, availableStock: 5, reorderPoint: 6 }
  ];

  // Transfers
  public transfers: StockTransferItem[] = [
    { id: 'TR-301', from: 'Central Warehouse (Salt Lake)', to: 'NK-KOL-01', product: 'Hakoba Saree', sku: 'NF-SAR-001', quantity: 10, status: 'Pending', requestedAt: '2026-08-28 10:15' },
    { id: 'TR-302', from: 'Central Warehouse (Salt Lake)', to: 'NK-KOL-01', product: 'Lavender Ash Polo', sku: 'NF-POLO-72591', quantity: 15, status: 'Approved', requestedAt: '2026-08-27 14:30' },
    { id: 'TR-303', from: 'NK Fashions Mumbai Hub', to: 'NK-KOL-01', product: 'Gorod Silk Saree', sku: 'NF-SAR-002', quantity: 3, status: 'Pending', requestedAt: '2026-08-28 09:00' }
  ];

  // Cashier Shift Logs
  public cashierLogs: CashierLogItem[] = [
    { id: 'L-201', cashier: 'Suhana Das', action: 'PRICE_OVERRIDE', details: 'Lavender Ash Polo manual line discount ₹150 (Promo auth #88)', timestamp: '2026-08-28 16:15' },
    { id: 'L-202', cashier: 'Suhana Das', action: 'TRANSACTION_HOLD', details: 'Register cart held with 3 items (Hold ID: PARK-9201)', timestamp: '2026-08-28 15:40' },
    { id: 'L-203', cashier: 'Suhana Das', action: 'CASH_DRAWER_OPEN', details: 'Manual drawer kick for customer cash change break', timestamp: '2026-08-28 11:20' },
    { id: 'L-204', cashier: 'Suhana Das', action: 'REFUND_PROCESSED', details: 'Exchange refund processed for invoice INV-2026-0042 (₹1,250)', timestamp: '2026-08-28 10:35' }
  ];

  // Shift & Drawer Reconciliation
  public reconciliation: ShiftReconciliation = {
    openingFloat: 5000,
    cashSales: 18450,
    cardSales: 42300,
    upiSales: 16800,
    expectedCashInDrawer: 23450,
    actualCountedCash: 23450,
    isBalanced: true
  };

  // Modals State
  public showStockAdjustModal = false;
  public selectedStockItem: LocalStockItem | null = null;
  public adjustQuantity = 0;
  public adjustReason = 'Store Restock';

  public showTransferModal = false;
  public newTransferFrom = 'Central Warehouse (Salt Lake)';
  public newTransferSku = 'NF-SAR-002';
  public newTransferQty = 5;

  constructor(
    private readonly productService: ProductService,
    private readonly jewelleryService: JewelleryService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  /**
   * Loads live API products, variants, and tracked jewellery inventory on initialization.
   */
  public ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts({ isActive: true }).pipe(catchError(() => of([]))),
      jewellery: this.jewelleryService
        .getJewelleryItems({ page: 1, pageSize: 50 })
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: (res: {
        products: ProductResponse[];
        jewellery: PagedJewelleryItemResponse | null;
      }): void => {
        const mapped: LocalStockItem[] = [];

        if (res.jewellery && res.jewellery.items.length > 0) {
          for (const ji of res.jewellery.items) {
            const isAvailable: boolean = ji.status === 'InStock';
            const isReserved: boolean = ji.status === 'Reserved';
            mapped.push({
              id: `JWL-${ji.id}`,
              name: `${ji.productName} (${ji.metalType} ${ji.metalPurity})`,
              sku: ji.barcode,
              category: 'Jewellery',
              physicalStock: isAvailable || isReserved ? 1 : 0,
              reservedStock: isReserved ? 1 : 0,
              availableStock: isAvailable ? 1 : 0,
              reorderPoint: 1,
            });
          }
        }

        if (res.products.length > 0) {
          const variantCalls: Array<Observable<ProductVariantResponse[]>> = res.products.map(
            (p: ProductResponse): Observable<ProductVariantResponse[]> =>
              this.productService.getProductVariants(p.id).pipe(catchError(() => of([]))),
          );
          forkJoin(variantCalls).subscribe((variantLists: ProductVariantResponse[][]): void => {
            res.products.forEach((p: ProductResponse, idx: number): void => {
              for (const v of variantLists[idx]) {
                mapped.push({
                  id: `VAR-${v.id}`,
                  name: v.size || v.colour ? `${p.name} (${[v.size, v.colour].filter(Boolean).join(' / ')})` : p.name,
                  sku: v.sku,
                  category: p.categories[0]?.name || PRODUCT_TYPE_LABELS[p.productType],
                  physicalStock: v.isActive ? 15 : 0,
                  reservedStock: 2,
                  availableStock: v.isActive ? 13 : 0,
                  reorderPoint: 5,
                });
              }
            });
            if (mapped.length > 0) {
              this.stockItems = mapped;
              this.cd.detectChanges();
            }
          });
        } else if (mapped.length > 0) {
          this.stockItems = mapped;
          this.cd.detectChanges();
        }
      },
    });
  }

  /**
   * Switches the active tab view.
   * @param tab Target tab.
   */
  public switchTab(tab: 'stock' | 'transfers' | 'logs' | 'reconciliation'): void {
    this.activeTab = tab;
  }

  /**
   * Filtered stock items based on low stock or all.
   * @returns Array of filtered local stock items.
   */
  public get filteredStock(): LocalStockItem[] {
    if (this.stockFilter === 'LOW') {
      return this.stockItems.filter((item: LocalStockItem): boolean => item.availableStock <= item.reorderPoint);
    }
    if (this.stockFilter === 'NORMAL') {
      return this.stockItems.filter((item: LocalStockItem): boolean => item.availableStock > item.reorderPoint);
    }
    return this.stockItems;
  }

  /**
   * Counts of low stock items requiring replenishment.
   * @returns Total low stock count.
   */
  public get lowStockCount(): number {
    return this.stockItems.filter((item: LocalStockItem): boolean => item.availableStock <= item.reorderPoint).length;
  }

  /**
   * Opens stock adjustment modal.
   * @param item Target stock item.
   */
  public openAdjustStock(item: LocalStockItem): void {
    this.selectedStockItem = item;
    this.adjustQuantity = 0;
    this.showStockAdjustModal = true;
  }

  /**
   * Saves local stock adjustment.
   */
  public saveStockAdjustment(): void {
    if (this.selectedStockItem && this.adjustQuantity !== 0) {
      this.selectedStockItem.physicalStock += this.adjustQuantity;
      this.selectedStockItem.availableStock += this.adjustQuantity;
      const sign: string = this.adjustQuantity > 0 ? '+' : String();
      this.cashierLogs.unshift({
        id: `L-${Date.now().toString().slice(-3)}`,
        cashier: 'Store Manager',
        action: 'PRICE_OVERRIDE',
        details: `Manual inventory adjustment: ${this.selectedStockItem.sku} (${sign}${this.adjustQuantity}) - Reason: ${this.adjustReason}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }
    this.showStockAdjustModal = false;
  }

  /**
   * Approves a pending stock transfer.
   * @param transfer The transfer record.
   */
  public approveTransfer(transfer: StockTransferItem): void {
    if (transfer.status === 'Pending') {
      transfer.status = 'Approved';
      const match: LocalStockItem | undefined = this.stockItems.find(
        (item: LocalStockItem): boolean => item.sku === transfer.sku
      );
      if (match) {
        match.physicalStock += transfer.quantity;
        match.availableStock += transfer.quantity;
      }
    }
  }

  /**
   * Rejects a pending transfer.
   * @param transfer The transfer record.
   */
  public rejectTransfer(transfer: StockTransferItem): void {
    if (transfer.status === 'Pending') {
      transfer.status = 'Rejected';
    }
  }

  /**
   * Creates a new stock transfer request.
   */
  public createTransferRequest(): void {
    const matchedStock: LocalStockItem | undefined = this.stockItems.find((s: LocalStockItem): boolean => s.sku === this.newTransferSku);
    const productName: string = matchedStock ? matchedStock.name : 'Fashion Item';

    this.transfers.unshift({
      id: `TR-${Math.floor(400 + Math.random() * 500)}`,
      from: this.newTransferFrom,
      to: 'NK-KOL-01',
      product: productName,
      sku: this.newTransferSku,
      quantity: this.newTransferQty,
      status: 'Pending',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    this.showTransferModal = false;
  }

  /**
   * Recalculates drawer balance status.
   */
  public verifyReconciliation(): void {
    this.reconciliation.isBalanced = this.reconciliation.actualCountedCash === this.reconciliation.expectedCashInDrawer;
  }
}
