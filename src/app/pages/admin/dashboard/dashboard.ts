import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared-components/sidebar/sidebar';

interface LocationItem {
  id: string;
  name: string;
  code: string;
  type: 'Store' | 'Warehouse';
  address: string;
}

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
}

interface StaffItem {
  id: string;
  name: string;
  role: string;
  email: string;
  store: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
}

/**
 * System Admin Dashboard component.
 * Allows managing stores, catalog feeds, employee accounts, and audit log reports.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class AdminDashboard {
  public activeTab: 'locations' | 'products' | 'staff' | 'audit' = 'locations';

  // Mock Data
  public locations: LocationItem[] = [
    { id: '1', name: 'NK Fashions Kolkata Store', code: 'NK-KOL-01', type: 'Store', address: 'Park Street, Kolkata' },
    { id: '2', name: 'NK Fashions Central Warehouse', code: 'NK-WH-01', type: 'Warehouse', address: 'Salt Lake Sec V, Kolkata' },
    { id: '3', name: 'NK Fashions Mumbai Hub', code: 'NK-MUM-02', type: 'Store', address: 'Bandra, Mumbai' }
  ];

  public products: ProductItem[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', brand: 'NK Signature', price: 3850, category: 'Saree', stock: 45 },
    { id: '2', name: '2 States - Designer Kurta+Dhoti Set', brand: 'Babu Mosai', price: 2950, category: 'Men', stock: 32 },
    { id: '3', name: 'Exclusive Gorod Silk Festive Saree', brand: 'Heritage', price: 5600, category: 'Saree', stock: 18 },
    { id: '4', name: 'Lal Sada Bengali Couple Matching Set', brand: 'NK Matching', price: 6400, category: 'Couple', stock: 15 },
    { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', brand: 'NK Premium', price: 1250, category: 'Men', stock: 60 }
  ];

  public staff: StaffItem[] = [
    { id: '1', name: 'Anik Sen', role: 'Store Manager', email: 'anik@nkfashions.com', store: 'NK-KOL-01' },
    { id: '2', name: 'Suhana Das', role: 'POS Cashier', email: 'suhana@nkfashions.com', store: 'NK-KOL-01' },
    { id: '3', name: 'Rahul Bose', role: 'Store Manager', email: 'rahul@nkfashions.com', store: 'NK-MUM-02' }
  ];

  public auditLogs: AuditLogItem[] = [
    { id: '101', action: 'PRICE_OVERRIDE', user: 'Anik Sen', target: 'Polo Shirt - Price: 1250 -> 1100', timestamp: '2026-08-28 15:32' },
    { id: '102', action: 'STOCK_ADJUSTMENT', user: 'Anik Sen', target: 'Hakoba Saree - Stock: 40 -> 45', timestamp: '2026-08-28 14:15' },
    { id: '103', action: 'STAFF_ROLE_CHANGE', user: 'System Admin', target: 'Suhana Das - POS Cashier', timestamp: '2026-08-28 10:05' }
  ];

  // Forms
  public showAddLocation = false;
  public newLocation: LocationItem = { id: String(), name: String(), code: String(), type: 'Store', address: String() };

  constructor() {}

  /**
   * Switches the active tab view.
   * @param tab Target tab to switch to.
   */
  public switchTab(tab: 'locations' | 'products' | 'staff' | 'audit'): void {
    this.activeTab = tab;
  }

  /**
   * Simulates adding a new location.
   */
  public addLocation(): void {
    if (this.newLocation.name && this.newLocation.code) {
      this.newLocation.id = (this.locations.length + 1).toString();
      this.locations.push({ ...this.newLocation });
      this.newLocation = { id: String(), name: String(), code: String(), type: 'Store', address: String() };
      this.showAddLocation = false;
    }
  }

  /**
   * Simulates deleting a location.
   * @param id The location ID to remove.
   */
  public deleteLocation(id: string): void {
    this.locations = this.locations.filter(loc => loc.id !== id);
  }
}
