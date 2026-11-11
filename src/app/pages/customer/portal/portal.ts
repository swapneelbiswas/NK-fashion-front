import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared-components/sidebar/sidebar';

export interface CustomerOrderItem {
  id: string;
  orderNumber: string;
  items: { name: string; qty: number; price: number; sku: string }[];
  total: number;
  status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered';
  stepIndex: number; // 1: Placed, 2: Confirmed, 3: Dispatched, 4: Delivered
  courier: string;
  trackingNumber: string;
  date: string;
}

export interface AddressItem {
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

export interface WishlistItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface LoyaltyLedgerItem {
  id: string;
  type: 'Earned' | 'Redeemed';
  points: number;
  description: string;
  date: string;
}

/**
 * Customer Portal component.
 * Allows registered buyers to track order delivery timelines, manage address listings,
 * examine wishlists, and track NK Loyalty Rewards.
 */
@Component({
  selector: 'app-customer-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './portal.html',
  styleUrls: ['./portal.scss'],
})
export class CustomerPortal {
  public activeTab: 'orders' | 'addresses' | 'wishlist' | 'loyalty' = 'orders';
  public customerName = 'Siddharth Roy';
  public loyaltyId = 'NK-CUST-102';
  public loyaltyTier: 'Silver' | 'Gold' | 'Platinum' = 'Gold';
  public loyaltyPoints = 450;
  public toastMessage: string | null = null;

  // Orders
  public orders: CustomerOrderItem[] = [
    {
      id: '1',
      orderNumber: 'NF-2026-8809',
      items: [
        { name: 'Dheu Exclusive Signature Hakoba Saree', qty: 1, price: 3850, sku: 'NF-SAR-001' },
        { name: 'Single Jersey Knitted Cotton Polo', qty: 1, price: 1250, sku: 'NF-POLO-72591' }
      ],
      total: 5100,
      status: 'Dispatched',
      stepIndex: 3,
      courier: 'Blue Dart Express',
      trackingNumber: 'BLUEDART-8829101',
      date: '2026-08-28'
    },
    {
      id: '2',
      orderNumber: 'NF-2026-8711',
      items: [
        { name: 'Exclusive Gorod Silk Festive Saree', qty: 1, price: 5600, sku: 'NF-SAR-002' }
      ],
      total: 5600,
      status: 'Delivered',
      stepIndex: 4,
      courier: 'DHL Express',
      trackingNumber: 'DHL-3971290',
      date: '2026-08-15'
    }
  ];

  // Addresses
  public addresses: AddressItem[] = [
    { id: '1', label: 'Home Address', recipientName: 'Siddharth Roy', phone: '+91 98300 12345', postalCode: '700016', prefecture: 'West Bengal', city: 'Kolkata', street: '12A, Park Street', isDefault: true },
    { id: '2', label: 'Office Address', recipientName: 'Siddharth Roy', phone: '+91 98300 54321', postalCode: '700091', prefecture: 'West Bengal', city: 'Kolkata', street: 'Block EP & GP, Sector V, Salt Lake', isDefault: false }
  ];

  // Wishlist
  public wishlistItems: WishlistItem[] = [
    { id: '1', name: '2 States - Designer Kurta+Dhoti Set', sku: 'NF-MEN-001', category: 'Men', price: 2950, image: '/assets/images/hospital_staff.png', inStock: true },
    { id: '2', name: 'Lal Sada Bengali Couple Matching Set', sku: 'NF-COP-001', category: 'Couples', price: 6400, image: '/assets/images/staff.png', inStock: true }
  ];

  // Loyalty Ledger
  public loyaltyLedger: LoyaltyLedgerItem[] = [
    { id: '1', type: 'Earned', points: 150, description: 'Purchase Rewards on Order #NF-2026-8809', date: '2026-08-28' },
    { id: '2', type: 'Earned', points: 300, description: 'Festive Season Member Bonus', date: '2026-08-20' },
    { id: '3', type: 'Redeemed', points: 200, description: 'Discount Voucher Redeemed at Park St Store', date: '2026-08-10' }
  ];

  // Forms
  public showAddAddress = false;
  public newAddress: AddressItem = { id: String(), label: String(), recipientName: String(), phone: String(), postalCode: String(), prefecture: 'West Bengal', city: 'Kolkata', street: String(), isDefault: false };

  constructor() {}

  /**
   * Switches the active tab view.
   * @param tab Target tab.
   */
  public switchTab(tab: 'orders' | 'addresses' | 'wishlist' | 'loyalty'): void {
    this.activeTab = tab;
  }

  /**
   * Adds a new shipping address.
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
      this.showToast('Shipping address added successfully.');
    }
  }

  /**
   * Sets default address.
   * @param id Target ID.
   */
  public setDefaultAddress(id: string): void {
    this.addresses.forEach(a => a.isDefault = a.id === id);
    this.showToast('Default address updated.');
  }

  /**
   * Deletes a shipping address.
   * @param id The address ID.
   */
  public deleteAddress(id: string): void {
    this.addresses = this.addresses.filter(addr => addr.id !== id);
    this.showToast('Address removed.');
  }

  /**
   * Removes an item from the wishlist.
   * @param id Wishlist item ID.
   */
  public removeFromWishlist(id: string): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
    this.showToast('Item removed from wishlist.');
  }

  /**
   * Moves a wishlist item into active cart.
   * @param item Target wishlist item.
   */
  public moveToCart(item: WishlistItem): void {
    this.showToast(`"${item.name}" added to shopping bag!`);
  }

  /**
   * Displays temporary toast banner.
   * @param msg Message.
   */
  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
