import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { finalize } from 'rxjs';
import { RoleAclConfig } from '@models/acl.model';
import { AuthLoginRequest } from '@models/auth.model';
// service
import { AclService } from '@services/acl/acl.service';
import { AuthState, UserType } from '@services/auth/auth-role';

import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';
import { SessionSyncService } from '@services/auth/session-sync-service';
// shared components
import { LoaderComponent } from '@shared-components/loader/loader';
import { Toaster } from '@shared-components/toaster/toaster';
import { maxLengthFromConfig } from '@utils/input-validation/common.validator';
import { HalfWidthInputDirective } from '@utils/input-validation/half-width-input.directive';
import { VALIDATION_LIMITS } from '@utils/input-validation/validation.config';
import { LoginLabels, ToasterMessages } from '@utils/ln/jp-localization';

export type ApiRole = '0' | '1' | '2' | '3';

export const UI_TO_API_ROLE: Record<UserType, ApiRole> = {
  admin: '0',
  manager: '1',
  cashier: '2',
  customer: '3',
  leader: '1',
  staff: '2',
  'hospital-staff': '3',
};

interface DeviceInfo {
  userAgent: string;
  os: string;
  os_version: string;
  browser: string;
  browser_version: string;
  device: string;
  model: string | null;
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  type: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Login component responsible for displaying
 * role-based login information and handling
 * navigation after login.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, Toaster, HalfWidthInputDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form!: FormGroup;

  public LIMITS = VALIDATION_LIMITS;
  public readonly labels = LoginLabels;

  deviceInfo: DeviceInfo | undefined;

  passwordVisible = false;
  loading = false;

  toasterMessage: string | null = null;
  toasterType: 'error' | 'success' | 'info' = 'error';

  showPasswordField: boolean = false;

  /**
   * Current user role derived from the route parameter or data.
   */
  userType!: UserType;
  /**
   * Image path displayed on the login screen based on user role.
   */
  loginImage: string | null = null;
  /**
   * Localized text label displayed for the selected user role.
   */
  loginText: string | null = null;
  loginTitle: string = 'LOGIN';
  loginSubtitle: string = 'Enter credentials to proceed';

  loginForm!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private authState: AuthStateService,
    private aclService: AclService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionSync: SessionSyncService,
    private cd: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
  ) {}

  /**
   * Indicates whether the currently authenticated user is an administrator.
   *
   * @returns True if admin.
   */
  get isAdmin(): boolean {
    return this.authState.role === 'admin';
  }

  /**
   * Indicates whether the currently authenticated user is a Manager.
   *
   * @returns True if manager or leader.
   */
  get isLeader(): boolean {
    return this.authState.role === 'manager' || this.authState.role === 'leader';
  }

  /**
   * Indicates whether the currently authenticated user is a Cashier / Staff.
   *
   * @returns True if cashier or staff.
   */
  get isStaff(): boolean {
    return this.authState.role === 'cashier' || this.authState.role === 'staff';
  }

  /**
   * Initializes the component by extracting the user type
   * from the route data or param and setting role-specific UI data from ACL.
   */
  ngOnInit(): void {
    this.initForm();

    // Capture device info on init
    this.deviceInfo = {
      userAgent: this.deviceService.userAgent(),
      os: this.deviceService.os(),
      os_version: this.deviceService.os_version(),
      browser: this.deviceService.browser(),
      browser_version: this.deviceService.browser_version(),
      device: this.deviceService.device(),
      model: null,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
      },
      type: this.deviceService.isMobile()
        ? 'mobile'
        : this.deviceService.isTablet()
          ? 'tablet'
          : 'desktop',
    };

    // Extract role from route data or paramMap
    const roleFromData: string | undefined = this.route.snapshot.data['role'] as string | undefined;
    const roleFromParam: string | null = this.route.snapshot.paramMap.get('userType');
    const urlSegment: string = this.router.url.split('/')[1]?.split('?')[0] || 'admin';

    const rawRole: string = roleFromData || roleFromParam || urlSegment || 'admin';
    const canonicalRole: string = this.aclService.resolveCanonicalRole(rawRole);
    this.userType = canonicalRole as UserType;

    const roleAcl: RoleAclConfig | null = this.aclService.getRoleConfigSync(canonicalRole);
    if (roleAcl) {
      this.loginTitle = roleAcl.loginTitle;
      this.loginSubtitle = roleAcl.loginSubtitle;
      this.loginImage = roleAcl.loginImage;
      this.loginText = roleAcl.name;
    } else {
      this.loginImage = '/assets/images/head_offices_admin.webp';
      this.loginText = 'System Admin';
      this.loginTitle = 'LOGIN';
      this.loginSubtitle = 'Enter your credentials to continue';
    }


    // Adjust validators dynamically
    if (this.userType === 'cashier' || this.userType === 'staff' || this.userType === 'hospital-staff') {
      this.loginForm.get('userId')?.clearValidators();
      this.loginForm.get('userId')?.updateValueAndValidity();

      this.loginForm.get('branchId')?.setValidators([Validators.required]);
      this.loginForm.get('hospitalId')?.setValidators([Validators.required]);
      this.showPasswordField = false; // show after next pressed
    } else {
      this.loginForm.get('userId')?.setValidators([Validators.required]);
      this.loginForm.get('userId')?.updateValueAndValidity();

      this.loginForm.get('branchId')?.clearValidators();
      this.loginForm.get('branchId')?.updateValueAndValidity();
      this.loginForm.get('hospitalId')?.clearValidators();
      this.loginForm.get('hospitalId')?.updateValueAndValidity();

      this.showPasswordField = true;
    }
  }

  /**
   * Initializes the reactive form with validation rules.
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      userId: [
        null,
        [
          Validators.required,
          maxLengthFromConfig(VALIDATION_LIMITS.DEFAULT_TEXT_MAX),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          maxLengthFromConfig(VALIDATION_LIMITS.DEFAULT_TEXT_MAX),
        ],
      ],
      branchId: [
        null,
        [
          Validators.required,
          maxLengthFromConfig(VALIDATION_LIMITS.DEFAULT_TEXT_MAX),
        ],
      ],
      hospitalId: [
        null,
        [
          Validators.required,
          maxLengthFromConfig(VALIDATION_LIMITS.DEFAULT_TEXT_MAX),
        ],
      ],
    });
  }

  /**
   * Navigates to the appropriate top landing page
   */
  goToLanding() {
    this.router.navigate(['/landing']);
  }

  /**
   * show/hide password functionality
   */
  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * login functionality
   */
  onLogin(): void {
    // Prevent double submit
    if (this.loading) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    let payload: AuthLoginRequest;

    if (this.userType === 'cashier' || this.userType === 'staff' || this.userType === 'hospital-staff') {
      payload = {
        branch_code: this.loginForm.value.branchId!,
        hospital_code: this.loginForm.value.hospitalId!,
        password: this.loginForm.value.password!,
        role: UI_TO_API_ROLE[this.userType] || '2',
      };
    } else {
      payload = {
        user_id: this.loginForm.value.userId!,
        password: this.loginForm.value.password!,
        role: UI_TO_API_ROLE[this.userType] || '0',
      };
    }

    this.auth.loginApi(payload).pipe(
      finalize(() => {
        this.loading = false;
        this.cd.detectChanges();
      }),
    ).subscribe({
      next: (state: AuthState) => {
        const target: string = this.aclService.getDefaultRoute(state.role);

        this.authState.set(state);
        this.sessionSync.notifyChange();

        this.router.navigateByUrl(target);
      },
      error: (err) => {
        console.error('[Login] onLogin error:', err);
        this.triggerToaster(err.error?.message || ToasterMessages['loginFailed'], 'error');
      },
    });
  }


  /**
   * Shows a toaster notification and auto-clears it after 3 seconds.
   *
   * @param message - The message to display in the toaster.
   * @param type - The type of toaster: 'error', 'success', or 'info'.
   */
  private triggerToaster(message: string, type: 'error' | 'success' | 'info'): void {
    this.toasterMessage = message;
    this.toasterType = type;
    this.cd.detectChanges();
    setTimeout(() => {
      this.toasterMessage = null;
      this.cd.detectChanges();
    }, 3000);
  }

  /**
   * Handles staff login step: show password field if branch/hospital filled,
   * otherwise submit login for non-staff or when password is already visible.
   *
   * @param event - optional, used to prevent default form submission
   */
  handleNextStep(event?: Event) {
    if (this.userType === 'staff' || this.userType === 'hospital-staff') {

      const branchFilled: boolean = !!this.loginForm.controls['branchId'].value;
      const hospitalFilled: boolean =
        !!this.loginForm.controls['hospitalId'].value;

      // Show errors if fields are empty
      if (!branchFilled || !hospitalFilled) {
        this.loginForm.controls['branchId'].markAsTouched();
        this.loginForm.controls['hospitalId'].markAsTouched();
        if (event) event.preventDefault();
        return;
      }

      // Show password field if not yet visible
      if (!this.showPasswordField) {
        this.showPasswordField = true;
        if (event) event.preventDefault();
        return;
      }
    }

    // Otherwise, submit login
    if (this.loginForm.valid) {
      this.onLogin();
    }
  }

  /**
   * Triggered when Enter key is pressed
   *
   * @param event - event
   */
  onEnterPress(event: Event) {
    this.handleNextStep(event);
  }

  /**
   * Determines whether the password field should be displayed in the login form.
   *
   * For non-staff users (`admin` or `leader`), the password field is always visible.
   * For staff users, the password field is only shown if `showPasswordField` is `true`.
   *
   * This getter is typically used in the template with `*ngIf` to conditionally render
   * the password input field.
   *
   * @returns `true` if the password field should be shown; `false` otherwise.
   */
  get showPassword(): boolean {
    if (this.userType !== 'staff' && this.userType !== 'hospital-staff') return true;
    return this.showPasswordField;
  }
}
