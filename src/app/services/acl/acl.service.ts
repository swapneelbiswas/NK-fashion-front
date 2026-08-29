import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AclNavigationItem, RoleAclConfig, RootAclConfig } from '@models/acl.model';

const FALLBACK_ACL: RootAclConfig = {
  version: '1.0.0',
  appName: 'NK Fashions - Australian Retail Boutique & POS',
  roles: {
    admin: {
      id: 'admin',
      name: 'System Administrator',
      roleCode: '0',
      entryUrl: '/admin',
      defaultRoute: '/admin/summary',
      loginTitle: 'System Admin Control Room',
      loginSubtitle: 'Enter administrative credentials for system governance and branch oversight',
      loginImage: '/assets/images/head_offices_admin.webp',
      allowedPages: [
        'summary-list',
        'branch-list',
        'hospital-list',
        'leader-list',
        'service-list',
        'option-list',
        'user-list',
        'user-nk-staff',
        'user-hospital-staff',
        'bill-closing',
        'acl',
      ],
      permissions: {
        canManageUsers: true,
        canManageStores: true,
        canOverridePrices: true,
        canApproveTransfers: true,
        canViewAuditLogs: true,
        canExportReports: true,
        canProcessPOS: true,
        canViewOrders: true,
        canConfigureAcl: true,
      },
      navigation: [
        { label: 'Executive Overview', route: '/admin/summary', page: 'summary-list', icon: 'fa-chart-pie' },
        { label: 'Stores & Boutiques', route: '/admin/branch', page: 'branch-list', icon: 'fa-store' },
        { label: 'Regional Hubs', route: '/admin/hospital', page: 'hospital-list', icon: 'fa-map-location-dot' },
        { label: 'Store Managers', route: '/admin/leader-list', page: 'leader-list', icon: 'fa-user-tie' },
        { label: 'Product Catalog', route: '/admin/service-list', page: 'service-list', icon: 'fa-shirt' },
        { label: 'Attribute Master', route: '/admin/option-list', page: 'option-list', icon: 'fa-sliders' },
        {
          label: 'User Accounts',
          route: null,
          page: 'user-list',
          icon: 'fa-users',
          children: [
            { label: 'Staff Accounts', route: '/admin/user-nk-staff', page: 'user-nk-staff', icon: 'fa-id-badge' },
            { label: 'Customer Accounts', route: '/admin/user-hospital-staff', page: 'user-hospital-staff', icon: 'fa-user-check' },
          ],
        },
        { label: 'Audit & Financial Logs', route: '/admin/bill-closing', page: 'bill-closing', icon: 'fa-file-invoice-dollar' },
      ],
    },
    manager: {
      id: 'manager',
      name: 'Store Manager',
      roleCode: '1',
      entryUrl: '/manager',
      defaultRoute: '/manager/summary',
      loginTitle: 'Store Manager Operations Portal',
      loginSubtitle: 'Access regional store inventory, transfers, and cashier action oversight',
      loginImage: '/assets/images/head_office_leader.webp',
      allowedPages: [
        'summary-list',
        'completed-distribution-list',
        'incomplete-distribution-list',
        'user-list',
        'user-nk-staff',
        'user-hospital-staff',
        'hospital-list',
        'service-list',
        'option-list',
        'bill-closing',
      ],
      permissions: {
        canManageUsers: false,
        canManageStores: false,
        canOverridePrices: true,
        canApproveTransfers: true,
        canViewAuditLogs: true,
        canExportReports: true,
        canProcessPOS: false,
        canViewOrders: true,
        canConfigureAcl: false,
      },
      navigation: [
        { label: 'Store Operations', route: '/manager/summary', page: 'summary-list', icon: 'fa-warehouse' },
        { label: 'Approved Stock', route: '/manager/completed-distribution-list', page: 'completed-distribution-list', icon: 'fa-circle-check' },
        { label: 'Pending Transfers', route: '/manager/incomplete-distribution-list', page: 'incomplete-distribution-list', icon: 'fa-clock' },
        { label: 'Cashier Oversight', route: '/manager/bill-closing', page: 'bill-closing', icon: 'fa-shield-halved' },
        { label: 'Store Inventory', route: '/manager/service-list', page: 'service-list', icon: 'fa-boxes-stacked' },
      ],
    },
    cashier: {
      id: 'cashier',
      name: 'POS Cashier',
      roleCode: '2',
      entryUrl: '/cashier',
      defaultRoute: '/cashier/terminal',
      loginTitle: 'POS Cashier Terminal',
      loginSubtitle: 'Retail store checkout register, barcode scanner, and split billing',
      loginImage: '/assets/images/admin_staff.webp',
      allowedPages: [
        'delivery-request-list',
        'completed-distribution-list',
        'incomplete-distribution-list',
        'user-list',
        'hospital-list',
        'service-list',
        'option-list',
      ],
      permissions: {
        canManageUsers: false,
        canManageStores: false,
        canOverridePrices: false,
        canApproveTransfers: false,
        canViewAuditLogs: false,
        canExportReports: false,
        canProcessPOS: true,
        canViewOrders: false,
        canConfigureAcl: false,
      },
      navigation: [
        { label: 'POS Register', route: '/cashier/terminal', page: 'delivery-request-list', icon: 'fa-cash-register' },
        { label: 'Completed Sales', route: '/cashier/completed-distribution-list', page: 'completed-distribution-list', icon: 'fa-receipt' },
        { label: 'Stock Catalog', route: '/cashier/service-list', page: 'service-list', icon: 'fa-tags' },
      ],
    },
    customer: {
      id: 'customer',
      name: 'Registered Customer',
      roleCode: '3',
      entryUrl: '/customer',
      defaultRoute: '/customer/portal',
      loginTitle: 'Customer Boutique Lounge',
      loginSubtitle: 'Track your orders, saved wishlists, and boutique membership benefits',
      loginImage: '/assets/images/hospital_staff.png',
      allowedPages: [
        'after-delivery-list',
        'user-list',
        'hospital-staff-classification-list',
        'option-list',
        'invoice-confirmation-list',
      ],
      permissions: {
        canManageUsers: false,
        canManageStores: false,
        canOverridePrices: false,
        canApproveTransfers: false,
        canViewAuditLogs: false,
        canExportReports: false,
        canProcessPOS: false,
        canViewOrders: true,
        canConfigureAcl: false,
      },
      navigation: [
        { label: 'My Orders & Tracking', route: '/customer/portal', page: 'after-delivery-list', icon: 'fa-box-open' },
        { label: 'Saved Wishlist', route: '/customer/portal', page: 'option-list', icon: 'fa-heart' },
        { label: 'Address Book', route: '/customer/portal', page: 'invoice-confirmation-list', icon: 'fa-address-book' },
      ],
    },
  },
  aliases: {
    leader: 'manager',
    staff: 'cashier',
    'hospital-staff': 'customer',
  },
};

/**
 * Service to manage Access Control List (ACL) configurations.
 */
@Injectable({ providedIn: 'root' })
export class AclService {
  private readonly ACL_PATH = '/assets/data/acl.json';
  private cachedAcl: RootAclConfig = FALLBACK_ACL;
  private aclSubject$ = new BehaviorSubject<RootAclConfig>(FALLBACK_ACL);

  constructor(private http: HttpClient) {
    this.loadAcl();
  }

  /**
   * Loads ACL from JSON static asset file.
   *
   * @returns Observable of the root ACL configuration.
   */
  public loadAcl(): Observable<RootAclConfig> {
    return this.http.get<RootAclConfig>(this.ACL_PATH).pipe(
      tap((acl: RootAclConfig): void => {
        if (acl && acl.roles) {
          this.cachedAcl = acl;
          this.aclSubject$.next(acl);
        }
      }),
      catchError((err: unknown): Observable<RootAclConfig> => {
        console.warn('[AclService] Could not load static acl.json, using fallback ACL:', err);
        return of(this.cachedAcl);
      }),
      shareReplay(1),
    );
  }

  /**
   * Resolves canonical role name taking legacy aliases into account.
   *
   * @param role - The input role name to resolve.
   * @returns The canonical role string.
   */
  public resolveCanonicalRole(role: string): string {
    if (!role) return 'customer';
    const cleanRole: string = role.toLowerCase().trim();
    const alias: string | undefined = this.cachedAcl.aliases?.[cleanRole];
    if (alias) return alias;
    if (this.cachedAcl.roles[cleanRole]) return cleanRole;
    return cleanRole;
  }

  /**
   * Returns full ACL configuration.
   *
   * @returns Observable of RootAclConfig.
   */
  public getAcl(): Observable<RootAclConfig> {
    return this.aclSubject$.asObservable();
  }

  /**
   * Returns role configuration for given role.
   *
   * @param role - The role name.
   * @returns Observable of RoleAclConfig or null.
   */
  public getRoleConfig(role: string): Observable<RoleAclConfig | null> {
    const canonical: string = this.resolveCanonicalRole(role);
    return this.getAcl().pipe(
      map((acl: RootAclConfig): RoleAclConfig | null => acl.roles[canonical] || null),
    );
  }

  /**
   * Synchronous accessor for role ACL configuration.
   *
   * @param role - The role name.
   * @returns The RoleAclConfig object or null.
   */
  public getRoleConfigSync(role: string): RoleAclConfig | null {
    const canonical: string = this.resolveCanonicalRole(role);
    return this.cachedAcl.roles[canonical] || null;
  }

  /**
   * Returns list of allowed page keys for a role.
   *
   * @param role - The role name.
   * @returns Array of allowed page string identifiers.
   */
  public getAllowedPages(role: string): string[] {
    const config: RoleAclConfig | null = this.getRoleConfigSync(role);
    return config?.allowedPages || [];
  }

  /**
   * Checks whether a role has a specific permission flag enabled.
   *
   * @param role - The role name.
   * @param permissionKey - The feature permission key.
   * @returns True if permitted, false otherwise.
   */
  public hasPermission(role: string, permissionKey: string): boolean {
    const config: RoleAclConfig | null = this.getRoleConfigSync(role);
    if (!config || !config.permissions) return false;
    return !!config.permissions[permissionKey];
  }

  /**
   * Returns sidebar navigation items for a given role.
   *
   * @param role - The role name.
   * @returns Array of AclNavigationItem objects.
   */
  public getNavigation(role: string): AclNavigationItem[] {
    const config: RoleAclConfig | null = this.getRoleConfigSync(role);
    return config?.navigation || [];
  }

  /**
   * Returns default redirect route for role.
   *
   * @param role - The role name.
   * @returns The URL path string.
   */
  public getDefaultRoute(role: string): string {
    const config: RoleAclConfig | null = this.getRoleConfigSync(role);
    return config?.defaultRoute || '/landing';
  }
}

