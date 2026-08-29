import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared-components/sidebar/sidebar';

interface CustomerOrderItem {
  id: string;
  orderNumber: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  date: string;
}

interface AddressItem {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  isDefault: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

/**
 * Customer Portal component.
 * Allows registered buyers to track orders, manage address listings, and evaluate their saved wishlists.
 */
@Component({
  selector: 'app-customer-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './portal.html',
  styleUrls: ['./portal.scss'],
})
export class CustomerPortal {
  public activeTab: 'orders' | 'addresses' | 'wishlist' = 'orders';
  public customerName = 'Siddharth Roy';
  public loyaltyId = 'NK-CUST-102';

  // Mock Data
  public orders: CustomerOrderItem[] = [
    { id: '1', orderNumber: 'NF-2026-8809', total: 5100, status: 'Shipped', trackingNumber: 'DHL-3982001', date: '2026-08-28' },
    { id: '2', orderNumber: 'NF-2026-8711', total: 3850, status: 'Delivered', trackingNumber: 'DHL-3971290', date: '2026-08-15' }
  ];

  public addresses: AddressItem[] = [
    { id: '1', label: 'Home Address', recipientName: 'Siddharth Roy', phone: '+91 98300 12345', postalCode: '700016', prefecture: 'West Bengal', city: 'Kolkata', street: '12A, Park Street', isDefault: true },
    { id: '2', label: 'Office Address', recipientName: 'Siddharth Roy', phone: '+91 98300 54321', postalCode: '700091', prefecture: 'West Bengal', city: 'Kolkata', street: 'Block EP & GP, Sector V, Salt Lake', isDefault: false }
  ];

  public wishlistItems: WishlistItem[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', price: 3850, image: '/assets/images/hospital_staff.png' },
    { id: '2', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', price: 1250, image: '/assets/images/staff.png' }
  ];

  // Forms
  public showAddAddress = false;
  public newAddress: AddressItem = { id: String(), label: String(), recipientName: String(), phone: String(), postalCode: String(), prefecture: 'West Bengal', city: 'Kolkata', street: String(), isDefault: false };

  constructor() {}

  /**
   * Switches the active tab view.
   * @param tab Target tab to switch to.
   */
  public switchTab(tab: 'orders' | 'addresses' | 'wishlist'): void {
    this.activeTab = tab;
  }

  /**
   * Simulates adding a new shipping address.
   */
  public addAddress(): void {
    if (this.newAddress.label && this.newAddress.recipientName && this.newAddress.street) {
      this.newAddress.id = (this.addresses.length + 1).toString();
      if (this.newAddress.isDefault) {
        this.addresses.forEach(addr => addr.isDefault = false);
      }
      this.addresses.push({ ...this.newAddress });
      this.newAddress = { id: String(), label: String(), recipientName: String(), phone: String(), postalCode: String(), prefecture: 'West Bengal', city: 'Kolkata', street: String(), isDefault: false };
      this.showAddAddress = false;
    }
  }

  /**
   * Simulates deleting a shipping address.
   * @param id The address ID to remove.
   */
  public deleteAddress(id: string): void {
    this.addresses = this.addresses.filter(addr => addr.id !== id);
  }

  /**
   * Simulates removing an item from the wishlist.
   * @param id Wishlist item ID.
   */
  public removeFromWishlist(id: string): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
  }
}
