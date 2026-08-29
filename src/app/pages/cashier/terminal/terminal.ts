import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared-components/sidebar/sidebar';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface RegisterItem {
  product: Product;
  quantity: number;
  discount: number;
}

interface CompletedSaleItem {
  id: string;
  invoice: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  timestamp: string;
}

/**
 * POS Cashier Terminal component.
 * Fast keyboard-focused cashier register terminal with product lookup, payments, and receipt prints.
 */
@Component({
  selector: 'app-pos-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './terminal.html',
  styleUrls: ['./terminal.scss'],
})
export class PosTerminal {
  public activeTab: 'terminal' | 'history' = 'terminal';

  // Catalog for manual lookup
  public productsCatalog: Product[] = [
    { id: '1', name: 'Dheu Exclusive Signature Hakoba Saree', sku: 'NF-SAR-001', price: 3850, stock: 22 },
    { id: '2', name: '2 States - Designer Kurta+Dhoti Set', sku: 'NF-MEN-001', price: 2950, stock: 14 },
    { id: '3', name: 'Exclusive Gorod Silk Festive Saree', sku: 'NF-SAR-002', price: 5600, stock: 8 },
    { id: '4', name: 'Lal Sada Matching Couple Set', sku: 'NF-COP-001', price: 6400, stock: 3 },
    { id: '5', name: 'Single Jersey Knitted Cotton Polo - Lavender Ash', sku: 'NF-POLO-72591', price: 1250, stock: 25 }
  ];

  // Active Transaction State
  public cartItems: RegisterItem[] = [];
  public barcodeInput = String();
  public selectedCustomer = 'Walk-in Customer';
  public couponCode = String();
  public checkoutComplete = false;
  public completedInvoice = String();

  // Split Payment Config
  public paymentMethod: 'Cash' | 'Card' | 'Split' = 'Cash';
  public cashPaid = 0;
  public cardPaid = 0;

  // History State
  public salesHistory: CompletedSaleItem[] = [
    { id: '1', invoice: 'INV-2026-0089', customerName: 'Siddharth Roy', total: 5100, paymentMethod: 'Card', timestamp: '2026-08-28 17:30' },
    { id: '2', invoice: 'INV-2026-0088', customerName: 'Walk-in Customer', total: 1250, paymentMethod: 'Cash', timestamp: '2026-08-28 16:45' }
  ];

  constructor() {}

  /**
   * Switches the active tab view.
   * @param tab Target tab to switch to.
   */
  public switchTab(tab: 'terminal' | 'history'): void {
    this.activeTab = tab;
  }

  /**
   * Simulates scanning a product barcode SKU.
   */
  public scanBarcode(): void {
    const code: string = this.barcodeInput.trim().toUpperCase();
    if (!code) return;

    const match: Product | undefined = this.productsCatalog.find((p: Product): boolean => p.sku === code);
    if (match) {
      this.addProductToCart(match);
      this.barcodeInput = String();
    } else {
      alert(`Product SKU ${code} not found in catalog.`);
    }
  }

  /**
   * Adds product to active checkout register cart.
   * @param product The product item to add.
   */
  public addProductToCart(product: Product): void {
    const existing: RegisterItem | undefined = this.cartItems.find((item: RegisterItem): boolean => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1, discount: 0 });
    }
    this.cashPaid = this.getSubtotal();
  }

  /**
   * Removes item from checkout register cart.
   * @param productId The ID of the item to remove.
   */
  public removeCartItem(productId: string): void {
    this.cartItems = this.cartItems.filter((item: RegisterItem): boolean => item.product.id !== productId);
    this.cashPaid = this.getSubtotal();
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
    this.cashPaid = this.getSubtotal();
  }

  /**
   * Updates discount percentage for a cart item.
   * @param productId Target product ID.
   * @param discount Discount value in rupees.
   */
  public applyItemDiscount(productId: string, discount: number): void {
    const match: RegisterItem | undefined = this.cartItems.find((item: RegisterItem): boolean => item.product.id === productId);
    if (match) {
      match.discount = discount;
    }
    this.cashPaid = this.getSubtotal();
  }

  /**
   * Calculates subtotal of register cart.
   * @returns Total amount.
   */
  public getSubtotal(): number {
    return this.cartItems.reduce((acc: number, item: RegisterItem): number => {
      const price: number = item.product.price * item.quantity;
      return acc + (price - item.discount);
    }, 0);
  }

  /**
   * Processes the checkout transaction statically.
   */
  public processCheckout(): void {
    const total: number = this.getSubtotal();
    if (total <= 0) return;

    this.completedInvoice = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    this.salesHistory.unshift({
      id: (this.salesHistory.length + 1).toString(),
      invoice: this.completedInvoice,
      customerName: this.selectedCustomer,
      total,
      paymentMethod: this.paymentMethod,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    this.checkoutComplete = true;
  }

  /**
   * Resets active register cart for the next checkout transaction.
   */
  public nextTransaction(): void {
    this.cartItems = [];
    this.couponCode = String();
    this.selectedCustomer = 'Walk-in Customer';
    this.paymentMethod = 'Cash';
    this.checkoutComplete = false;
    this.cashPaid = 0;
    this.cardPaid = 0;
  }
}
