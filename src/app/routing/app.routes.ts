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
  {
    path: AppRoutes.ADMIN,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.ADMIN },
    children: [
      {
        path: AppRoutes.ADMIN_CHILDREN.SUMMARY,
        component: AdminDashboard,
        data: { page: 'summary-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BRANCH,
        component: AdminDashboard,
        data: { page: 'branch-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL,
        component: AdminDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.ROOM_LIST,
        component: AdminDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        component: AdminDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.LEADER_LIST,
        component: AdminDashboard,
        data: { page: 'leader-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SERVICE_LIST,
        component: AdminDashboard,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SET_LIST,
        component: AdminDashboard,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.OPTION_LIST,
        component: AdminDashboard,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_ADMIN_STAFF,
        component: AdminDashboard,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.USER_HOSPITAL_STAFF,
        component: AdminDashboard,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.BILL_CLOSING,
        component: AdminDashboard,
        data: { page: 'bill-closing' },
      },
    ],
  },
  {
    path: AppRoutes.LEADER,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.LEADER },
    children: [
      {
        path: AppRoutes.LEADER_CHILDREN.SUMMARY,
        component: ManagerDashboard,
        data: { page: 'summary-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        component: ManagerDashboard,
        data: { page: 'completed-distribution-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        component: ManagerDashboard,
        data: { page: 'incomplete-distribution-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.USER_ADMIN_STAFF,
        component: ManagerDashboard,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.USER_HOSPITAL_STAFF,
        component: ManagerDashboard,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.HOSPITAL,
        component: ManagerDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.ROOM_LIST,
        component: ManagerDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        component: ManagerDashboard,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.SERVICE_LIST,
        component: ManagerDashboard,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.SET_LIST,
        component: ManagerDashboard,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.OPTION_LIST,
        component: ManagerDashboard,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.LEADER_CHILDREN.BILL_CLOSING,
        component: ManagerDashboard,
        data: { page: 'bill-closing' },
      },
    ],
  },
  {
    path: AppRoutes.STAFF,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.STAFF },
    children: [
      {
        path: AppRoutes.STAFF_CHILDREN.DELIVERY_REQUEST,
        component: PosTerminal,
        data: { page: 'delivery-request-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.COMPLETED_DISTRIBUTION_LIST,
        component: PosTerminal,
        data: { page: 'completed-distribution-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.INCOMPLETE_DISTRIBUTION_LIST,
        component: PosTerminal,
        data: { page: 'incomplete-distribution-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.USER_LIST,
        component: PosTerminal,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.HOSPITAL,
        component: PosTerminal,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.ROOM_LIST,
        component: PosTerminal,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        component: PosTerminal,
        data: { page: 'hospital-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.SERVICE_LIST,
        component: PosTerminal,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.ADMIN_CHILDREN.SET_LIST,
        component: PosTerminal,
        data: { page: 'service-list' },
      },
      {
        path: AppRoutes.STAFF_CHILDREN.OPTION_LIST,
        component: PosTerminal,
        data: { page: 'option-list' },
      },
    ],
  },
  {
    path: AppRoutes.HOSPITAL_STAFF,
    canActivate: [RoleGuard],
    canActivateChild: [PageGuard],
    data: { title: AppRoutes.HOSPITAL_STAFF },
    children: [
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.AFTER_DELIVERY,
        component: CustomerPortal,
        data: { page: 'after-delivery-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.USER_LIST,
        component: CustomerPortal,
        data: { page: 'user-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.HOSPITAL_CLASSIFICATION_LIST,
        component: CustomerPortal,
        data: { page: 'hospital-staff-classification-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.OPTION_LIST,
        component: CustomerPortal,
        data: { page: 'option-list' },
      },
      {
        path: AppRoutes.HOSPITAL_STAFF_CHILDREN.INVOICE_CONFIRMATION_LIST,
        component: CustomerPortal,
        data: { page: 'invoice-confirmation-list' },
      },
    ],
  },
  {
    path: '**',
    canActivate: [RoleRedirectGuard],
    component: Landing,
  },
];
