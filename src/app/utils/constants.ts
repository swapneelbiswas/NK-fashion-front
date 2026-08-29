/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line @typescript-eslint/typedef
export const AppRoutes = {
  DEFAULT: '', // empty route (useful for redirects)

  LANDING: 'landing',
  LOGIN: 'login/:userType',

  // 1. System Administrator
  ADMIN: 'admin',
  ADMIN_CHILDREN: {
    SUMMARY: 'summary',
    BRANCH: 'branch',
    HOSPITAL: 'hospital',
    HOSPITAL_WITH_LEADER: 'hospital/:leaderId',
    ROOM_LIST: 'room-list/:hospitalId/:branchId/:id',
    HOSPITAL_CLASSIFICATION_LIST:
      'hospital-classification-list/:hospitalId/:branchId/:id',
    LEADER_LIST: 'leader-list',
    SERVICE_LIST: 'service-list',
    OPTION_LIST: 'option-list',
    SET_LIST: 'set-list/:serviceId',
    USER_ADMIN_STAFF: 'user-nk-staff',
    USER_HOSPITAL_STAFF: 'user-hospital-staff',
    ACL: 'acl',
    BILL_CLOSING: 'bill-closing',
  },

  // 2. Store Manager
  MANAGER: 'manager',
  MANAGER_CHILDREN: {
    SUMMARY: 'summary',
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    INCOMPLETE_DISTRIBUTION_LIST: 'incomplete-distribution-list',
    COMPLETED_USER_DISTRIBUTION_LIST: 'completed-user-distribution-list',
    HOSPITAL: 'hospital',
    ROOM_LIST: 'room-list/:hospitalId/:branchId/:id',
    HOSPITAL_CLASSIFICATION_LIST:
      'hospital-classification-list/:hospitalId/:branchId/:id',
    SERVICE_LIST: 'service-list',
    OPTION_LIST: 'option-list',
    SET_LIST: 'set-list/:serviceId',
    USER_ADMIN_STAFF: 'user-nk-staff',
    USER_HOSPITAL_STAFF: 'user-hospital-staff',
    BILL_CLOSING: 'bill-closing',
  },
  LEADER: 'leader',
  LEADER_CHILDREN: {
    SUMMARY: 'summary',
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    INCOMPLETE_DISTRIBUTION_LIST: 'incomplete-distribution-list',
    COMPLETED_USER_DISTRIBUTION_LIST: 'completed-user-distribution-list',
    HOSPITAL: 'hospital',
    ROOM_LIST: 'room-list/:hospitalId/:branchId/:id',
    HOSPITAL_CLASSIFICATION_LIST:
      'hospital-classification-list/:hospitalId/:branchId/:id',
    SERVICE_LIST: 'service-list',
    OPTION_LIST: 'option-list',
    SET_LIST: 'set-list/:serviceId',
    USER_ADMIN_STAFF: 'user-nk-staff',
    USER_HOSPITAL_STAFF: 'user-hospital-staff',
    BILL_CLOSING: 'bill-closing',
  },

  // 3. POS Cashier
  CASHIER: 'cashier',
  CASHIER_CHILDREN: {
    TERMINAL: 'terminal',
    DELIVERY_REQUEST: 'delivery-request',
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    INCOMPLETE_DISTRIBUTION_LIST: 'incomplete-distribution-list',
    USER_LIST: 'user-list',
    HOSPITAL: 'hospital',
    ROOM_LIST: 'room-list/:hospitalId/:branchId/:id',
    HOSPITAL_CLASSIFICATION_LIST:
      'hospital-classification-list/:hospitalId/:branchId/:id',
    SERVICE_LIST: 'service-list',
    OPTION_LIST: 'option-list',
    SET_LIST: 'set-list/:serviceId',
  },
  STAFF: 'staff',
  STAFF_CHILDREN: {
    DELIVERY_REQUEST: 'delivery-request',
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    INCOMPLETE_DISTRIBUTION_LIST: 'incomplete-distribution-list',
    USER_LIST: 'user-list',
    HOSPITAL: 'hospital',
    ROOM_LIST: 'room-list/:hospitalId/:branchId/:id',
    HOSPITAL_CLASSIFICATION_LIST:
      'hospital-classification-list/:hospitalId/:branchId/:id',
    SERVICE_LIST: 'service-list',
    OPTION_LIST: 'option-list',
    SET_LIST: 'set-list/:serviceId',
  },

  // 4. Customer Portal
  CUSTOMER: 'customer',
  CUSTOMER_CHILDREN: {
    PORTAL: 'portal',
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    USER_LIST: 'user-list',
    HOSPITAL_CLASSIFICATION_LIST: 'hospital-classification-list',
    OPTION_LIST: 'option-list',
    AFTER_DELIVERY: 'after-delivery',
    INVOICE_CONFIRMATION_LIST: 'invoice-confirmation-list',
  },
  HOSPITAL_STAFF: 'hospital-staff',
  HOSPITAL_STAFF_CHILDREN: {
    COMPLETED_DISTRIBUTION_LIST: 'completed-distribution-list',
    USER_LIST: 'user-list',
    HOSPITAL_CLASSIFICATION_LIST: 'hospital-classification-list',
    OPTION_LIST: 'option-list',
    AFTER_DELIVERY: 'after-delivery',
    INVOICE_CONFIRMATION_LIST: 'invoice-confirmation-list',
  },
};


export type DeliveryType = 1 | 2 | 3 | 4; // 1: TODAY, 2: TOMORROW, 3: DAY_AFTER_TOMORROW, 4: PAST_MISSED

export const DELIVERY_SECTION_KEYS: Record<DeliveryType, string> = {
  1: 'TODAY',
  2: 'TOMORROW',
  3: 'DAY_AFTER_TOMORROW',
  4: 'PAST_MISSED',
};

export type DeliverySectionKey =
  (typeof DELIVERY_SECTION_KEYS)[keyof typeof DELIVERY_SECTION_KEYS];
