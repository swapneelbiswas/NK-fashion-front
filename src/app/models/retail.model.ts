/**
 * NK Fashions - Retail Domain Models & Interfaces
 */

export type StoreLocationType = 'Store' | 'Warehouse';

export interface StoreLocation {
  id: string;
  code: string;
  name: string;
  type: StoreLocationType;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  size: string;
  color: string;
  fabric?: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
}

export interface RetailProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  description: string;
  basePrice: number;
  images: string[];
  isActive: boolean;
  variants?: ProductVariant[];
}

export interface InventoryItem {
  id: string;
  locationId: string;
  locationName: string;
  variantId: string;
  sku: string;
  productName: string;
  category: string;
  physicalQty: number;
  reservedQty: number;
  availableQty: number;
  reorderPoint: number;
}

export type StockTransferStatus = 'Draft' | 'Pending' | 'InTransit' | 'Approved' | 'Received' | 'Rejected';

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  productName: string;
  sku: string;
  quantity: number;
  status: StockTransferStatus;
  requestedBy: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  category: string;
  leadTimeDays: number;
  rating: number;
}

export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'Approved' | 'Received' | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
  destinationWarehouse: string;
  itemsCount: number;
  orderDate: string;
  expectedDelivery: string;
}

export type CustomerLoyaltyTier = 'Silver' | 'Gold' | 'Platinum';

export interface CustomerLoyaltyAccount {
  id: string;
  customerId: string;
  tier: CustomerLoyaltyTier;
  pointsBalance: number;
  lifetimePointsEarned: number;
  ledger: LoyaltyLedgerEntry[];
}

export interface LoyaltyLedgerEntry {
  id: string;
  type: 'Earned' | 'Redeemed';
  points: number;
  description: string;
  timestamp: string;
}

export type OrderDeliveryStatus = 'Placed' | 'Processing' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'LoyaltyPoints' | 'Split';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  totalPrice: number;
}

export interface RetailOrder {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  channel: 'Online' | 'POS';
  status: OrderDeliveryStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'POS' | 'Warehouse';
  email: string;
  storeLocationId: string;
  storeLocationName: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: 'Stock Adjust' | 'Price Override' | 'Refund' | 'PO Received' | 'Role Change';
  user: string;
  target: string;
  details: string;
  timestamp: string;
}
