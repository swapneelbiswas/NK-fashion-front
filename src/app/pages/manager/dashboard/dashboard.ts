import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared-components/sidebar/sidebar';

interface LocalStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
}

interface StockTransferItem {
  id: string;
  from: string;
  to: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface CashierLogItem {
  id: string;
  cashier: string;
  action: string;
  details: string;
  timestamp: string;
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
export class ManagerDashboard {
  public activeTab: 'stock' | 'transfers' | 'logs' = 'stock';
  public storeName = 'NK Fashions Kolkata Store (NK-KOL-01)';

  // Mock Data
  public stockItems: LocalStockItem[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', sku: 'NF-SAR-001', category: 'Saree', physicalStock: 25, reservedStock: 3, availableStock: 22 },
    { id: '2', name: '2 States - Designer Kurta+Dhoti Set', sku: 'NF-MEN-001', category: 'Men', physicalStock: 15, reservedStock: 1, availableStock: 14 },
    { id: '3', name: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', category: 'Saree', physicalStock: 8, reservedStock: 0, availableStock: 8 },
    { id: '4', name: 'Lal Sada Matching Couple Set', sku: 'NF-COP-001', category: 'Couple', physicalStock: 5, reservedStock: 2, availableStock: 3 },
    { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', category: 'Men', physicalStock: 30, reservedStock: 5, availableStock: 25 }
  ];

  public transfers: StockTransferItem[] = [
    { id: 'TR-301', from: 'Central Warehouse', to: 'NK-KOL-01', product: 'Hakoba Saree', quantity: 10, status: 'Pending' },
    { id: 'TR-302', from: 'Central Warehouse', to: 'NK-KOL-01', product: 'Lavender Ash Polo', quantity: 15, status: 'Approved' },
    { id: 'TR-303', from: 'NK-MUM-02', to: 'NK-KOL-01', product: 'Gorod Silk Saree', quantity: 2, status: 'Pending' }
  ];

  public cashierLogs: CashierLogItem[] = [
    { id: 'L-201', cashier: 'Suhana Das', action: 'PRICE_OVERRIDE', details: 'Lavender Ash Polo manual discount Rs. 150', timestamp: '2026-08-28 16:15' },
    { id: 'L-202', cashier: 'Suhana Das', action: 'TRANSACTION_HOLD', details: 'Cart held with 3 items (Ref: H-882)', timestamp: '2026-08-28 15:40' },
    { id: 'L-203', cashier: 'Suhana Das', action: 'CASH_DRAWER_OPEN', details: 'Manual drawer open for cash change', timestamp: '2026-08-28 11:20' }
  ];

  constructor() {}

  /**
   * Switches the active tab view.
   * @param tab Target tab to switch to.
   */
  public switchTab(tab: 'stock' | 'transfers' | 'logs'): void {
    this.activeTab = tab;
  }

  /**
   * Simulates approving a pending stock transfer.
   * @param transfer The transfer record to approve.
   */
  public approveTransfer(transfer: StockTransferItem): void {
    if (transfer.status === 'Pending') {
      transfer.status = 'Approved';
      // Find local stock and add the transferred quantity
      const match: LocalStockItem | undefined = this.stockItems.find(
        (item: LocalStockItem): boolean => item.name.toLowerCase().includes(transfer.product.toLowerCase().substring(0, 5))
      );
      if (match) {
        match.physicalStock += transfer.quantity;
        match.availableStock += transfer.quantity;
      }
    }
  }
}
