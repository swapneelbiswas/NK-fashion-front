import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthState, UserType } from '@services/auth/auth-role';
import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';
import { SessionSyncService } from '@services/auth/session-sync-service';
import { LoaderComponent } from '@shared-components/loader/loader';
import { SidebarLabels } from '@utils/ln/jp-localization';

/**
 * Sidebar navigation item definition.
 */
interface SidebarItem {
  /** Display label of the sidebar item */
  label: string;
  /** Router path — null for group parent items that have children */
  route: string | null;
  /** Page key used for permission filtering */
  page: string;
  /** FontAwesome icon class (without the fa-solid prefix) */
  icon: string;
  /** Child items rendered as an expandable sub-menu */
  children?: SidebarItem[];

  activeRoutes?: string[]; // additional URLs to mark as active
}

/**
 * Sidebar component responsible for displaying
 * role-based navigation items and handling
 * sidebar open/close behavior.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  public readonly labels = SidebarLabels;

  /**
   * Indicates whether the sidebar is collapsed to icon-only mode (desktop).
   */
  collapsed: boolean = false;

  /** True when the viewport is below the mobile breakpoint. */
  isMobile: boolean = false;

  /** Updates isMobile on every window resize. */
  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  /**
   * Current logged-in user role.
   */
  userType!: UserType;
  /** Display name of the logged-in user. */
  userName!: string | undefined;
  /** ID the user logged in with, shown under their name. */
  userLoginId?: string;
  userBranchName?: string;

  /**
   * Active sidebar items based on the current user role.
   */
  sidebarItems: SidebarItem[] = [];

  /**
   * Tracks which group labels are currently expanded.
   */
  expandedGroups: Set<string> = new Set();

  @Output() masterToggle = new EventEmitter<void>();

  /** True while a logout request is in flight. */
  loggingOut: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private authState: AuthStateService,
    private sessionSync: SessionSyncService,
    private cdr: ChangeDetectorRef,
  ) {}

  /**
   * Initializes the sidebar and loads role-based navigation items.
   */
  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    this.authState.auth$
      .pipe(filter((state): state is AuthState => !!state))
      .subscribe((state) => {
        this.userName = state.user_name;
        this.userLoginId = state.login_id;
        this.userBranchName = state.branch_name;

        this.userType = state.role;

          this.sidebarItems = this.getSidebarForRole(state.role).filter(
          (item) => {
            if (item.children) {
              item.children = item.children.filter((child) =>
                state.allowedPages.includes(child.page) || state.allowedPages.includes(item.page),
              );
              return item.children.length > 0;
            }
            return item.page === 'acl' || state.allowedPages.includes(item.page);
          },
        );

        // Re-sync this component's already-checked view immediately: this subscription
        // can fire after Sidebar's own view was checked but before Angular's dev-mode
        // checkNoChanges verification pass in the same tick, which otherwise trips NG0100.
        this.cdr.detectChanges();
      });
  }

  /**
   * Returns the default sidebar items for a given role.
   *
   * @param role - Current user role
   * @returns Sidebar items for that role
   */
  private getSidebarForRole(role: UserType): SidebarItem[] {
    const sidebars: Record<UserType, SidebarItem[]> = {
      admin: [
        {
          label: this.labels.TOP,
          route: '/admin/summary',
          page: 'summary-list',
          icon: 'fa-house',
        },
        {
          label: this.labels.BRANCH_LIST,
          route: '/admin/branch',
          page: 'branch-list',
          icon: 'fa-building',
        },
        {
          label: this.labels.HOSPITAL_LIST,
          route: '/admin/hospital',
          page: 'hospital-list',
          icon: 'fa-hospital',
          activeRoutes: ['/admin/room-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.LEADER_LIST,
          route: '/admin/leader-list',
          page: 'leader-list',
          icon: 'fa-user-tie',
        },
        {
          label: this.labels.SERVICE_LIST,
          route: '/admin/service-list',
          page: 'service-list',
          icon: 'fa-list-check',
          activeRoutes: ['/admin/set-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.OPTION_LIST,
          route: '/admin/option-list',
          page: 'option-list',
          icon: 'fa-sliders',
        },
        {
          label: this.labels.USER_LIST,
          route: null,
          page: 'user-list',
          icon: 'fa-users',
          children: [
            {
              label: this.labels.NK_STAFF,
              route: '/admin/user-nk-staff',
              page: 'user-nk-staff',
              icon: 'fa-user',
            },
            {
              label: this.labels.HOSPITAL_STAFF,
              route: '/admin/user-hospital-staff',
              page: 'user-hospital-staff',
              icon: 'fa-user-nurse',
            },
          ],
        },
        {
          label: this.labels.BILL_CLOSING,
          route: '/admin/bill-closing',
          page: 'bill-closing',
          icon: 'fa-file-invoice-dollar',
        },
      ],
      leader: [
        {
          label: this.labels.TOP,
          route: '/leader/summary',
          page: 'summary-list',
          icon: 'fa-house',
        },
        {
          label: this.labels.NK_COMPLETED_DISTRIBUTION_LIST,
          route: '/leader/completed-distribution-list',
          page: 'completed-distribution-list',
          icon: 'fa-circle-check',
        },
        {
          label: this.labels.NK_INCOMPLETE_DISTRIBUTION_LIST,
          route: '/leader/incomplete-distribution-list',
          page: 'incomplete-distribution-list',
          icon: 'fa-clock',
        },
        {
          label: this.labels.USER_LIST,
          route: null,
          page: 'user-list',
          icon: 'fa-users',
          children: [
            {
              label: this.labels.NK_STAFF,
              route: '/leader/user-nk-staff',
              page: 'user-nk-staff',
              icon: 'fa-user',
            },
            {
              label: this.labels.HOSPITAL_STAFF,
              route: '/leader/user-hospital-staff',
              page: 'user-hospital-staff',
              icon: 'fa-user-nurse',
            },
          ],
        },
        {
          label: this.labels.HOSPITAL_LIST,
          route: '/leader/hospital',
          page: 'hospital-list',
          icon: 'fa-hospital',
          activeRoutes: ['/leader/room-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.SERVICE_LIST,
          route: '/leader/service-list',
          page: 'service-list',
          icon: 'fa-list-check',
          activeRoutes: ['/leader/set-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.OPTION_LIST,
          route: '/leader/option-list',
          page: 'option-list',
          icon: 'fa-sliders',
        },
        {
          label: this.labels.BILL_CLOSING,
          route: '/leader/bill-closing',
          page: 'bill-closing',
          icon: 'fa-file-invoice-dollar',
        },
      ],
      staff: [
        {
          label: this.labels.DELIVERY_REQUEST_LIST,
          route: '/staff/delivery-request',
          page: 'delivery-request-list',
          icon: 'fa-clipboard-list',
        },
        {
          label: this.labels.COMPLETED_DISTRIBUTION_LIST,
          route: '/staff/completed-distribution-list',
          page: 'completed-distribution-list',
          icon: 'fa-circle-check',
        },
        {
          label: this.labels.INCOMPLETE_DISTRIBUTION_LIST,
          route: '/staff/incomplete-distribution-list',
          page: 'incomplete-distribution-list',
          icon: 'fa-circle-xmark',
        },
        {
          label: this.labels.USER_LIST,
          route: '/staff/user-list',
          page: 'user-list',
          icon: 'fa-users',
        },
        {
          label: this.labels.HOSPITAL_LIST,
          route: '/staff/hospital',
          page: 'hospital-list',
          icon: 'fa-hospital',
          activeRoutes: ['/staff/room-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.SERVICE_LIST,
          route: '/staff/service-list',
          page: 'service-list',
          icon: 'fa-list-check',
          activeRoutes: ['/staff/set-list'], // any URL prefix under which it stays active
        },
        {
          label: this.labels.OPTION_LIST,
          route: '/staff/option-list',
          page: 'option-list',
          icon: 'fa-sliders',
        },
      ],
      'hospital-staff': [
        {
          label: this.labels.AFTER_DELIVERY_LIST,
          route: '/hospital-staff/after-delivery',
          page: 'after-delivery-list',
          icon: 'fa-circle-check',
        },
        {
          label: this.labels.USER_LIST,
          route: '/hospital-staff/user-list',
          page: 'user-list',
          icon: 'fa-users',
        },
        {
          label: this.labels.INVOICE_CONFIRMATION_LIST,
          route: '/hospital-staff/invoice-confirmation-list',
          page: 'invoice-confirmation-list',
          icon: 'fa-file-invoice',
        },
        {
          label: this.labels.HOSPITAL_MASTER,
          route: '/hospital-staff/hospital-classification-list',
          page: 'hospital-staff-classification-list',
          icon: 'fa-hospital',
        },
        {
          label: this.labels.OPTION_MASTER,
          route: '/hospital-staff/option-list',
          page: 'option-list',
          icon: 'fa-sliders',
        },
      ],
    };

    return sidebars[role] || [];
  }

  /**
   * Toggles the sidebar collapsed/expanded state (desktop only).
   */
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  /**
   * True when the sidebar should show icons only —
   * either manually collapsed on desktop, or on a mobile viewport.
   *
   * @returns True if icon-only mode is active
   */
  get iconOnly(): boolean {
    return this.collapsed || this.isMobile;
  }

  /**
   * Toggles a group item's expanded/collapsed state.
   *
   * @param label - The label of the group to toggle
   */
  toggleGroup(label: string): void {
    if (this.expandedGroups.has(label)) {
      this.expandedGroups.delete(label);
    } else {
      this.expandedGroups.add(label);
    }
  }

  /**
   * Returns whether a group is currently expanded.
   *
   * @param label - The label of the group to check
   * @returns True if the group is expanded
   */
  isGroupExpanded(label: string): boolean {
    return this.expandedGroups.has(label);
  }

  /**
   * Returns whether any child of a group is the currently active route.
   *
   * @param item - The parent group item
   * @returns True if a child route is active
   */
  isGroupActive(item: SidebarItem): boolean {
    return item.children?.some((child) => this.isActive(child)) ?? false;
  }

  /**
   *
   * @param item - The route to check for active state
   * @returns True if the current route starts with the given route, false otherwise
   * This allows for highlighting parent routes when on nested pages
   */
  isActive(item: SidebarItem): boolean {
    if (!item.route) return false;
    const current: string = this.router.url.split('?')[0];
    if (current === item.route) return true;
    if (current.startsWith(item.route + '/')) return true;
    if (item.activeRoutes?.some((r) => current.startsWith(r))) return true;
    return false;
  }

  /**
   * Navigates to the appropriate top landing page
   */
  logout() {
    this.loggingOut = true;
    this.auth.logout().subscribe({
      next: () => {
        this.authState.clear();
        this.sessionSync.notifyChange();
        this.router.navigate(['/landing']);
      },
      error: () => {
        this.authState.clear();
        this.sessionSync.notifyChange();
        this.router.navigate(['/landing']);
      },
    });
  }
}
