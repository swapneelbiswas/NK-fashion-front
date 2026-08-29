export type UserType =
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'customer'
  | 'leader'
  | 'staff'
  | 'hospital-staff';

/** Login & session response from API */
export interface AuthMeResponse {
  user: {
    role: string;
    full_name: string;
  };
  permission: {
    allowed_pages: string[];
    allowed_actions: string[];
  };
}

/** Application auth state */
export interface AuthState {
  role: UserType;
  user_name?: string;
  /** The ID the user logged in with, shown under their name in the sidebar. */
  login_id?: string;
  allowedPages: string[];
  allowedActions: string[];
  permissions?: Record<string, boolean>;
  hospital_code?: string;
  hospital_id?: string;
  branch_id?: string;
  branch_code?: string;
  branch_name?: string;
}

/** Application user role mapped from API code */
export const ROLE_MAP: Record<string, UserType> = {
  '0': 'admin',
  '1': 'manager',
  '2': 'cashier',
  '3': 'customer',
};

