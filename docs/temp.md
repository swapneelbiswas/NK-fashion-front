[23-Aug-26 11:02 AM] Swapneel-aust: Shelf/Rack
Product attributes
For fashion:
Colour
Size
Material
Fabric
Pattern
Occasion
Gender
Season
For jewellery:
Metal
Purity
Weight
Stone
Stone Weight
Size
Finish
Plating
You don’t want to hard-code every possible attribute.
Instead, make the system support:
Product Attributes
        │
        ├── Colour
        ├── Size
        ├── Material
        ├── Weight
        └── Purity
That makes your system reusable.
 
⸻
 
6. Product variants
This is extremely important.
Suppose you have:
Saree A
Variants:
Red
Blue
Green
Or clothing:
Product: Kurta

Size: S
Size: M
Size: L
Size: XL
Each variant should have its own:
Variant ID
SKU
Barcode
Price
Cost
Stock
Weight
So:
Product
   │
   ├── Variant S
   ├── Variant M
   ├── Variant L
   └── Variant XL
This becomes critical for barcode/POS.
 
⸻
 
7. Barcode system
I would make barcode a first-class feature, not something you add later.
Your inventory item should look roughly like:
Product
-------------------------
Product ID
Name
Category

Variant
-------------------------
Variant ID
SKU
Barcode
Price
Cost
Quantity
Example:
SKU: NF-SAR-001-RED
Barcode: 9341234567890
Product: Banarasi Saree
Colour: Red
Size: Free Size
Stock: 4
Price: $249
Then at POS:
Scan barcode
      ↓
API finds Variant
      ↓
Product added to cart
      ↓
Price loaded
      ↓
Stock checked
      ↓
Sale completed
      ↓
Stock decreases
That’s the core workflow.
 
⸻
 
8. Barcode printing
Admin should have:
Generate barcode
Generate SKU
Generate barcode
Print labels
Support:
Product name
SKU
Barcode
Price
Size
Colour
Brand
Example:
┌──────────────────────┐
│ Nakshatra Fashion    │
│ Banarasi Saree       │
│ $249.00              │
│ NF-SAR-001           │
│ ||||||||||||||||||   │
│ 9341234567890        │
└──────────────────────┘
You can eventually support thermal printers.
 
⸻
 
9. Inventory management
This should be one of your biggest modules.
Inventory dashboard
Show:
Total Products
Total Units
Stock Value
Low Stock
Out of Stock
Today's Stock Movement
Stock operations
You need:
Stock In
Supplier
Purchase
Quantity
Cost
Date
Stock Out
Sale
Damage
Lost
Adjustment
Stock Transfer
Store A
     ↓
Store B
Stock Adjustment
System: 10
Physical: 9

Adjustment: -1
Reason: Missing
 
⸻
 
10. Stock movement ledger
This is extremely important for auditing.
Never simply change:
Quantity = 20
without recording why.
Instead:
StockMovement

+10 Purchase
-2 Sale
+5 Return
-1 Damage
-3 Transfer
Then:
Opening Stock
+ Purchases
+ Returns
- Sales
- Damaged
± Transfers
= Current Stock
This gives you a proper audit trail.
 
⸻
 
11. Purchase management
You will eventually need suppliers.
Supplier
Supplier ID
Name
Business Name
Phone
Email
Address
ABN/GSTIN
Purchase Order
PO Number
Supplier
Date
Items
Quantity
Cost
Tax
Total
Status
Workflow:
Create PO
   ↓
Send to Supplier
   ↓
Goods arrive
   ↓
Receive stock
   ↓
Stock increases
   ↓
Purchase recorded
 
⸻
 
12. Customer management
Create a CRM module.
Customer:
Customer ID
Name
Phone
Email
Address
Date of Birth
Then:
Customer
   │
   ├── Orders
   ├── Purchases
   ├── Returns
   ├── Loyalty Points
   ├── Wishlist
   └── Addresses
This becomes useful for both website and POS.
 
⸻
 
13. POS
Don’t build POS first.
Build your product/inventory/order system first.
Then POS becomes much easier.
The POS screen should be extremely fast.
Something like:
┌─────────────────────────────────────────────┐
│ Search / Scan Barcode                       │
├─────────────────────────────────────────────┤
│ Product          Qty     Price       Total  │
│ Saree Red         1      $249        $249   │
│ Necklace          2       $45         $90   │
├─────────────────────────────────────────────┤
│ Subtotal                         $339       │
│ Discount                         -$20       │
│ Tax                               $31       │
│ TOTAL                            $350       │
├─────────────────────────────────────────────┤
│ Cash | Card | EFTPOS | Split Payment       │
└─────────────────────────────────────────────┘
 
⸻
 
14. POS features
Eventually include:
Sales
Barcode scanning
Product search
[23-Aug-26 11:02 AM] Swapneel-aust: Yes. If your goal is to build something inspired by DHeU but designed properly from the beginning for inventory, barcode and eventually POS, I would not treat this as just an e-commerce website.
I would design it as a retail management platform with an online storefront on top of it.
I checked DHeU’s current site and app. DHeU has product/catalogue functionality, SKU-based products, inventory quantities, discounts, cart/checkout, customer accounts, order tracking, wishlist, multiple payment options, shipping, exchanges and a loyalty programme. Their product pages also expose SKU, price, MRP, weight, tax status and inventory information. 
The important part is that your internal system should be the source of truth, rather than making the website, inventory system and POS three separate systems.
 
⸻
 
1. The architecture I recommend
For your situation, I would choose:
Backend
ASP.NET (http://asp.net/) Core Web API + Entity Framework Core + SQL Server
Frontend
React + TypeScript
Admin panel
React + TypeScript
Online store
React + TypeScript
Future POS
React + TypeScript, communicating with the same API
Database
SQL Server
Authentication
ASP.NET (http://asp.net/) Core Identity + JWT
Images/files
Initially local/cloud storage, later Azure Blob Storage or AWS S3
Barcode
Support:
EAN-13
UPC
Code 128
QR
internally generated SKU/barcodes
 
⸻
 
2. Why I wouldn’t make Blazor the main frontend
You already know .NET, so Blazor is tempting.
But for this particular project, I’d choose:
ASP.NET (http://asp.net/) Core Web API + React
rather than:
ASP.NET (http://asp.net/) Core + Blazor for everything
The reason is that you’re planning three different interfaces:
                    ┌────────────────────┐
                    │   ASP.NET CORE API  │
                    │      Backend        │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       Online Store       Admin Panel         POS
          React             React            React
             │                │                │
             └────────────────┼────────────────┘
                              │
                         SQL Server
That architecture gives you a huge advantage later.
Your POS doesn’t need its own database.
Your website doesn’t need a separate inventory.
Your admin panel doesn’t need duplicate product data.
Everything talks to the same backend.
 
⸻
 
3. The most important architectural decision
Don’t design your database around:
Website
Design it around:
Business
Then build the website, admin panel and POS around the business system.
Think of it like this:
                    BUSINESS PLATFORM
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       WEBSITE           ADMIN             POS
          │                │                │
          └────────────────┼────────────────┘
                           │
                         API
                           │
                    BUSINESS LOGIC
                           │
                     SQL DATABASE
This will save you a massive amount of rewriting later.
 
⸻
 
4. Full feature structure
I’d divide the project into 12 major modules.
Module 1: Online Store
This is the part customers see.
Homepage
Include:
Hero banner
Featured collections
New arrivals
Best sellers
Sale products
Category shortcuts
Promotional banners
Featured brands
Recently viewed products
Instagram/social section
Newsletter signup
Footer
For DHeU-style fashion retail, you could have:
Women
Men
Kids
Sarees
Jewellery
Accessories
Festive Collection
New Arrivals
Sale
 
⸻
 
5. Product catalogue
This is one of the most important modules.
Each product should have:
Basic information
Product ID
Product Name
SKU
Barcode
Category
Subcategory
Brand
Collection
Description
Short Description
Pricing
Cost Price
MRP
Selling Price
Discount
Tax
Tax-inclusive/exclusive
Wholesale Price
Inventory
Quantity
Reserved Quantity
Available Quantity
Low Stock Level
Warehouse
Store
[23-Aug-26 11:02 AM] Swapneel-aust: Customer selection
Quantity
Discounts
Coupons
Tax
Multiple payment methods
Split payments
Cash change calculation
Hold sale
Resume sale
Cancel sale
Refund
Exchange
Payment
Cash
Card
EFTPOS
Bank Transfer
Gift Card
Store Credit
Split Payment
Receipt
Print:
Thermal receipt
A4 invoice
Email receipt
PDF receipt
 
⸻
 
15. Online orders
Your website orders should enter the same order system.
For example:
Customer orders online
        ↓
Order created
        ↓
Stock reserved
        ↓
Payment confirmed
        ↓
Order processing
        ↓
Packed
        ↓
Shipped
        ↓
Delivered
And POS sales:
POS
 ↓
Order
 ↓
Payment
 ↓
Stock decrease
Both ultimately use the same Order and Inventory services.
 
⸻
 
16. Order management
Admin should have:
All Orders
Pending
Paid
Processing
Packed
Shipped
Delivered
Cancelled
Refunded
Order detail:
Order #10045

Customer
Products
Payment
Shipping
Discount
Tax
Total

Timeline:
Ordered
Paid
Packed
Shipped
Delivered
 
⸻
 
17. Shipping
Later integrate:
Shipping providers
Tracking number
Shipping labels
Delivery status
Shipping zones
Shipping rates
For Australia, you could eventually integrate Australia Post or another carrier.
Don’t hard-code shipping logic into the frontend.
 
⸻
 
18. Wishlist
Customer can:
♡ Add to wishlist
Then:
My Account
 ├── Orders
 ├── Wishlist
 ├── Addresses
 ├── Profile
 └── Loyalty
DHeU’s app specifically advertises wishlist, cart, order tracking, multiple payment methods and loyalty functionality. 
 
⸻
 
19. Promotions
Create a proper promotion engine.
Don’t simply put:
Price = $99
Instead support:
20% off
$20 off
Buy 1 Get 1
Buy 2 Get 1
Category discount
Brand discount
Coupon
First-order discount
Seasonal sale
Example:
SALE20

20% off
Minimum order: $100
Maximum discount: $50
Valid:
01/09/2026 - 30/09/2026
 
⸻
 
20. Loyalty programme
Eventually:
Customer buys $100
        ↓
Earn 100 points
Then:
1000 points
      ↓
$10 reward
Keep the loyalty engine separate so you can change the rules later.
 
⸻
 
21. Reviews
Online store:
★★★★★
Customer review
Verified purchase
Images
Admin:
Pending Reviews
Approved
Rejected
Reported
 
⸻
 
22. Admin dashboard
Your admin dashboard should show:
Today's Sales
Today's Orders
Today's Profit
Products Sold
Low Stock
Pending Orders
Returns
Top Products
Then charts:
Sales
│
│       ╭──╮
│    ╭──╯  ╰──╮
│ ╭──╯        ╰──
└──────────────────
   Mon Tue Wed Thu
 
⸻
 
23. Reports
Build reporting into the architecture from day one.
Sales reports
Daily sales
Weekly sales
Monthly sales
Product sales
Category sales
Staff sales
POS sales
Online sales
Inventory reports
Current stock
Low stock
Out of stock
Stock valuation
Stock movement
Dead stock
Fast-moving products
Slow-moving products
Financial
Revenue
Cost
Gross profit
Discounts
Tax
Payment methods
 
⸻
 
24. Staff management
Eventually:
Admin
Manager
Cashier
Inventory Manager
Marketing
Warehouse
And permissions:
Cashier
✓ Create sale
✓ Search products
✓ Process payment

✗ Delete product
✗ Change cost price
✗ Adjust stock
✗ View profit
This is much better than having only an Admin/User role.
 
⸻
 
25. Audit logs
This is something I strongly recommend.
Record:
Who
What
When
Before
After
IP
Example:
Swapneel
Changed product price
$250 → $230
23 Aug 2026 14:21
For stock:
John
Adjusted stock
10 → 8
Reason: Damaged
This becomes extremely useful once employees start using the system.
 
⸻
 
26. Database structure
A simplified version could look like:
Users
Roles
Permissions

Customers
CustomerAddresses

Products
ProductVariants
ProductImages
ProductAttributes
Categories
Brands
Collections

Barcodes

Suppliers
PurchaseOrders
PurchaseOrderItems

Inventory
InventoryLocations
StockMovements
StockAdjustments
StockTransfers

Orders
OrderItems
Payments
Refunds
Returns

Carts
CartItems
Wishlists
WishlistItems

Coupons
Promotions
PromotionProducts

LoyaltyAccounts
LoyaltyTransactions

Reviews

Shipping
Shipments

Stores
Warehouses

Employees

AuditLogs
 
⸻
 
27. One important improvement: separate Product from Inventory
Don’t do this:
Product
Quantity = 10
Instead:
Product
   ↓
Variant
   ↓
InventoryItem
   ↓
[23-Aug-26 11:02 AM] Swapneel-aust: Location
For example:
Banarasi Saree
     ↓
Red / Free Size
     ↓
SKU NF001
     ↓
Mawson Lakes Store = 4
     ↓
Warehouse = 8
Now when you add another store:
Adelaide Store = 3
Mawson Lakes = 4
Warehouse = 8
without redesigning your database.
 
⸻
 
28. Multi-store support
I would build this from the beginning even if you only have one shop.
Business
   │
   ├── Store 1
   ├── Store 2
   └── Warehouse
Then:
InventoryLocation
controls where stock belongs.
This will make your future expansion much easier.
 
⸻
 
29. Product lifecycle
A product should have a lifecycle:
Draft
 ↓
Active
 ↓
Out of Stock
 ↓
Archived
Don’t delete products when they’re sold out.
Otherwise historical orders will break.
 
⸻
 
30. Your API architecture
I would structure your ASP.NET (http://asp.net/) project something like:
FashionStore.sln

src/
│
├── FashionStore.API
│
├── FashionStore.Application
│
├── FashionStore.Domain
│
├── FashionStore.Infrastructure
│
└── FashionStore.Contracts
Domain
Business entities:
Product
Order
Customer
Inventory
Payment
Supplier
Application
Business logic:
ProductService
OrderService
InventoryService
PaymentService
CustomerService
Infrastructure
EF Core
SQL Server
File Storage
Email
Payment providers
Shipping providers
API
Controllers
Authentication
Authorization
Endpoints
 
⸻
 
31. API example
Your frontend shouldn’t directly access Entity Framework.
Instead:
React
 ↓
GET /api/products
 ↓
ProductController
 ↓
ProductService
 ↓
EF Core
 ↓
SQL Server
For POS:
POST /api/pos/sales
Backend:
Validate barcode
       ↓
Find product
       ↓
Check stock
       ↓
Create order
       ↓
Create payment
       ↓
Reduce inventory
       ↓
Create stock movement
       ↓
Return receipt
That entire operation should be transactional.
 
⸻
 
32. React frontend structure
I’d use:
React + TypeScript + Vite
And something like:
src/

components/
pages/
layouts/
features/
services/
hooks/
models/
utils/
auth/
Then:
features/
   products/
   inventory/
   customers/
   orders/
   pos/
   suppliers/
   reports/
   promotions/
This keeps the application manageable as it grows.
 
⸻
 
33. Admin URL structure
Something like:
/admin

/admin/dashboard

/admin/products
/admin/products/new
/admin/products/:id

/admin/inventory
/admin/inventory/movements
/admin/inventory/adjustments

/admin/orders
/admin/orders/:id

/admin/customers
/admin/suppliers

/admin/purchases

/admin/barcodes
/admin/barcodes/print

/admin/reports

/admin/users
/admin/settings
 
⸻
 
34. Customer website
/
 /shop
 /category/:slug
 /product/:slug

 /search

 /cart
 /checkout

 /account
 /account/orders
 /account/wishlist
 /account/profile

 /about
 /contact
 /faq
 
⸻
 
35. POS
Eventually:
/pos

/pos/sale
/pos/held-sales
/pos/returns
/pos/customers
/pos/products
/pos/end-of-day
I’d actually make the POS a separate React application or isolated frontend module, even though it uses the same API.
Why?
Because POS has very different UX requirements.
A website wants:
beautiful, visual, marketing-focused
POS wants:
extremely fast, keyboard-friendly, scanner-friendly
 
⸻
 
36. Barcode scanner workflow
Most USB barcode scanners behave like a keyboard.
So:
Scanner
 ↓
"9341234567890"
 ↓
React input
 ↓
API
 ↓
ProductVariant
 ↓
Add to POS cart
You don’t necessarily need complicated hardware integration initially.
Later you can add:
USB scanners
Bluetooth scanners
mobile camera scanning
QR scanning
 
⸻
 
37. Very important: don’t store only the barcode
Use:
SKU
Internal Product ID
Barcode
as separate concepts.
Example:
Product ID: 10452
SKU: NF-SAR-001
Barcode: 9341234567890
Why?
Because suppliers may change barcodes, or you may have products without manufacturer barcodes.
 
⸻
 
38. E-commerce + POS stock problem
This is where many systems become messy.
Suppose:
Stock = 5
Customer buys online:
Online order = 1
At the same time someone buys at POS:
POS = 1
Your backend must handle this safely.
Use:
Available Stock
Reserved Stock
Sold Stock
For example:
Physical = 5
Reserved = 1
Available = 4
Then POS can only sell from available stock.
 
⸻
 
39. Order status design
Use an enum or status table:
Pending
Confirmed
[23-Aug-26 11:02 AM] Swapneel-aust: Paid
Processing
Packed
Shipped
Delivered
Cancelled
Returned
Refunded
But don’t make your frontend responsible for deciding which transitions are allowed.
The backend should enforce:
Pending → Confirmed
Confirmed → Paid
Paid → Processing
Processing → Packed
Packed → Shipped
Shipped → Delivered
 
⸻
 
40. Payment architecture
Don’t hard-code Stripe into Order.
Create:
IPaymentService
Then implementations:
StripePaymentService
PayPalPaymentService
EftposPaymentService
CashPaymentService
That gives you flexibility later.
 
⸻
 
41. What I would NOT build initially
This is important.
Don’t try to build all of this in version 1:
❌ AI recommendations ❌ Complex loyalty ❌ Advanced accounting ❌ Marketplace integrations ❌ Multi-country tax ❌ RFID ❌ Manufacturing ❌ Advanced warehouse automation ❌ Mobile app ❌ AI try-on
Jewellery ERP products now offer things like RFID, manufacturing, job cards and advanced analytics, but those are much later-stage features. 
Build the foundation first.
 
⸻
 
42. Development roadmap
I’d do it in this order.
Phase 1 — Foundation
ASP.NET Core API
SQL Server
EF Core
Authentication
React
Admin layout
Database architecture
Phase 2 — Product
Products
Categories
Variants
Images
SKU
Barcode
Pricing
Phase 3 — Inventory
Stock
Stock movement
Stock adjustment
Locations
Low stock
Inventory reports
Phase 4 — E-commerce
Homepage
Catalogue
Product page
Search
Cart
Checkout
Customer accounts
Orders
Phase 5 — Admin
Dashboard
Product management
Inventory management
Order management
Customer management
Supplier management
Reports
Phase 6 — Barcode
Barcode generation
Barcode scanning
Label printing
Barcode lookup
Phase 7 — POS
POS screen
Scanner
Cart
Payments
Receipts
Returns
Refunds
Phase 8 — Advanced
Promotions
Coupons
Loyalty
Multi-store
Purchase orders
Shipping integrations
Advanced reports
Audit logs
 
⸻
 
43. The final system
Eventually you’ll have:
                         CUSTOMER
                            │
                            ▼
                     ┌─────────────┐
                     │   WEBSITE   │
                     └──────┬──────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ ASP.NET CORE  │
                    │      API      │
                    └───────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
   INVENTORY              ORDERS                CRM
       │                    │                    │
       ├──────────┬─────────┤                    │
       │          │         │                    │
       ▼          ▼         ▼                    ▼
    WEBSITE      POS     SHIPPING            CUSTOMERS
       │          │
       └──────────┴──────────────┐
                                 ▼
                            SQL SERVER
And that’s the architecture I would build if you want this to eventually become a real retail system rather than just a DHeU clone.
 
⸻
 
My specific technology recommendation
Part
Technology
Backend
ASP.NET Core Web API
Language
C#
ORM
Entity Framework Core
Database
SQL Server
Frontend
React + TypeScript
UI
MUI / Tailwind
Authentication
ASP.NET Core Identity + JWT
API documentation
Swagger / OpenAPI
Barcode
Code128 + EAN-13 + QR
Image storage
Azure Blob/S3 later
POS
React
Admin
React
Online store
React
Deployment
Docker + IIS/Azure/Linux later
Version control
Git
CI/CD
GitHub Actions or Azure DevOps
One thing I’d change based on your existing .NET experience
Since you’ve already worked with Blazor, EF Core, SQL Server and ASP.NET, you could absolutely build the first version with Blazor.
But if you’re asking me what I would choose for this particular long-term project, I’d choose:
ASP.NET Core Web API + React/TypeScript + SQL Server + EF Core
and keep the backend completely independent of the frontend.
That gives you the cleanest path from:
DHeU-style website → inventory → barcode → POS → multi-store retail system.
[23-Aug-26 11:02 AM] Swapneel-aust: Also, current jewellery/retail systems show why combining inventory, barcode, POS, customer management and purchasing into one underlying platform is valuable: modern systems commonly treat SKU/barcode inventory, stock valuation, POS scanning, purchasing, customer records and reporting as connected modules rather than separate applications. 
If you want to actually start building this, the next thing I would do is design the complete SQL Server database/ERD first, including every table, primary key, foreign key, relationships and the stock/POS transaction logic. That will determine whether the whole project stays clean or becomes difficult to maintain later.