/**
 * Navigation item definition from ACL.
 */
export interface AclNavigationItem {
  label: string;
  route: string | null;
  page: string;
  icon: string;
  children?: AclNavigationItem[];
  activeRoutes?: string[];
}

/**
 * Feature permissions for a role in ACL.
 */
export interface AclPermissions {
  canManageUsers?: boolean;
  canManageStores?: boolean;
  canOverridePrices?: boolean;
  canApproveTransfers?: boolean;
  canViewAuditLogs?: boolean;
  canExportReports?: boolean;
  canProcessPOS?: boolean;
  canViewOrders?: boolean;
  canConfigureAcl?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Role definition within the Access Control List.
 */
export interface RoleAclConfig {
  id: string;
  name: string;
  roleCode: string;
  entryUrl: string;
  defaultRoute: string;
  loginTitle: string;
  loginSubtitle: string;
  loginImage: string;
  allowedPages: string[];
  permissions: AclPermissions;
  navigation: AclNavigationItem[];
}

/**
 * Master Root ACL Schema.
 */
export interface RootAclConfig {
  version: string;
  appName: string;
  roles: Record<string, RoleAclConfig>;
  aliases: Record<string, string>;
}
