export type UserType = 'admin' | 'leader' | 'staff' | 'hospital-staff';

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
  hospital_code?: string;
  hospital_id?: string;
  branch_id?: string;
  branch_code?: string;
  branch_name?: string;
}

/** Application user role */
export const ROLE_MAP: Record<string, UserType> = {
  '0': 'admin',
  '1': 'leader',
  '2': 'staff',
  '3': 'hospital-staff',
};
