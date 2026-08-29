import { Routes } from '@angular/router';

// Premium NK Fashions components
import { AdminDashboard } from '@pages/admin/dashboard/dashboard';
import { PosTerminal } from '@pages/cashier/terminal/terminal';
import { Landing } from '@pages/common/landing/landing';
import { Login } from '@pages/common/login/login';
import { CustomerPortal } from '@pages/customer/portal/portal';
import { ManagerDashboard } from '@pages/manager/dashboard/dashboard';

// Route Guards & Constants
import { RoleGuard } from '@services/auth/auth-guard';
import { GuestGuard } from '@services/auth/guest-guard';
import { PageGuard } from '@services/auth/page-guard';
import { RoleRedirectGuard } from '@services/auth/role-redirect.guard';
import { SectionEntryGuard } from '@services/auth/section-entry.guard';
import { AppRoutes } from '@utils/constants';

export const routes: Routes = [
  {
    path: AppRoutes.DEFAULT,
    canActivate: [RoleRedirectGuard],
    component: Landing,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.LANDING,
    canActivate: [GuestGuard],
    component: Landing,
  },
  {
    path: AppRoutes.LOGIN,
    canActivate: [GuestGuard],
    component: Login,
  },

  // 1. System Administrator (/admin)
  {
    path: AppRoutes.ADMIN,
    children: [
      {
        path: AppRoutes.DEFAULT,
        pathMatch: 'full',
        canActivate: [SectionEntryGuard],
        component: Login,
        data: { role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SUMMARY,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'summary-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BRANCH,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'branch-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'hospital-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.ROOM_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'hospital-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'hospital-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.LEADER_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'leader-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SERVICE_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'service-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SET_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'service-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.OPTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'option-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_ADMIN_STAFF,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'user-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_HOSPITAL_STAFF,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'user-list', role: 'admin' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BILL_CLOSING,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: AdminDashboard,
        data: { page: 'bill-closing', role: 'admin' },
      },
    ],
  },

  // 2. Store Manager (/manager)
  {
    path: AppRoutes.MANAGER,
    children: [
      {
        path: AppRoutes.DEFAULT,
        pathMatch: 'full',
        canActivate: [SectionEntryGuard],
        component: Login,
        data: { role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.SUMMARY,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'summary-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'completed-distribution-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'incomplete-distribution-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.USER_ADMIN_STAFF,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'user-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.USER_HOSPITAL_STAFF,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'user-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.HOSPITAL,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'hospital-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.ROOM_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'hospital-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'hospital-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.SERVICE_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'service-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.SET_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'service-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.OPTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'option-list', role: 'manager' },
      },
      {
        path: AppRoutes.MANAGER_CHILDREN.BILL_CLOSING,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: ManagerDashboard,
        data: { page: 'bill-closing', role: 'manager' },
      },
    ],
  },
  // Legacy Leader route redirect
  {
    path: AppRoutes.LEADER,
    redirectTo: AppRoutes.MANAGER,
    pathMatch: 'prefix',
  },

  // 3. POS Cashier (/cashier)
  {
    path: AppRoutes.CASHIER,
    children: [
      {
        path: AppRoutes.DEFAULT,
        pathMatch: 'full',
        canActivate: [SectionEntryGuard],
        component: Login,
        data: { role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.TERMINAL,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'delivery-request-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.DELIVERY_REQUEST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'delivery-request-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'completed-distribution-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'incomplete-distribution-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.USER_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'user-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.HOSPITAL,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'hospital-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.ROOM_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'hospital-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'hospital-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.SERVICE_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'service-list', role: 'cashier' },
      },
      {
        path: AppRoutes.CASHIER_CHILDREN.OPTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: PosTerminal,
        data: { page: 'option-list', role: 'cashier' },
      },
    ],
  },
  // Legacy Staff route redirect
  {
    path: AppRoutes.STAFF,
    redirectTo: AppRoutes.CASHIER,
    pathMatch: 'prefix',
  },

  // 4. Customer Portal (/customer)
  {
    path: AppRoutes.CUSTOMER,
    children: [
      {
        path: AppRoutes.DEFAULT,
        pathMatch: 'full',
        canActivate: [SectionEntryGuard],
        component: Login,
        data: { role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.PORTAL,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'after-delivery-list', role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.AFTER_DELIVERY,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'after-delivery-list', role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.USER_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'user-list', role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'hospital-staff-classification-list', role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.OPTION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'option-list', role: 'customer' },
      },
      {
        path: AppRoutes.CUSTOMER_CHILDREN.INVOICE_CONFIRMATION_LIST,
        canActivate: [RoleGuard],
        canActivateChild: [PageGuard],
        component: CustomerPortal,
        data: { page: 'invoice-confirmation-list', role: 'customer' },
      },
    ],
  },
  // Legacy Hospital-staff route redirect
  {
    path: AppRoutes.HOSPITAL_STAFF,
    redirectTo: AppRoutes.CUSTOMER,
    pathMatch: 'prefix',
  },

  {
    path: '**',
    canActivate: [RoleRedirectGuard],
    component: Landing,
  },
];

