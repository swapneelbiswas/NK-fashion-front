import {
  DeliveryRequestForStaffOptionIdModel,
  DeliveryRequestForStaffServiceIdModel,
  DeliveryRequestListForStaffResponseInfo,
  DeliveryRequestListResponseDeliveryList,
} from '@models/delivery_request.model';

export interface FlattenedDeliveryRow {
  request: DeliveryRequestListForStaffResponseInfo;
  service?: DeliveryRequestForStaffServiceIdModel;
  option?: DeliveryRequestForStaffOptionIdModel;
  delivery_list?: DeliveryRequestListResponseDeliveryList[];
  isFirstRow: boolean;
  rowSpan: number;
}

export interface ServiceSetItem {
  itemId: string;
  itemSetId?: string;
  itemName: string;
  sizeOrType: string;
  checked: boolean;
  selectedSize?: string; // UI selection
}

export interface BuildingInfo {
  building: string | null;
  route: string | null;
  floor: string | null;
  room: string | null;
}

export interface ServiceBlock {
  service?: {
    service_id: string;
    service_name: string;
    daily_price: string;
  };
  showDetails: boolean;
  sets?: ServiceSetItem[];
  startDate?: string;
  endDate?: string;
  selectedDays: number[]; // 0 (Mon) → 6 (Sun)
  selectedServiceId?: string | null;
}

export interface OptionItem {
  option?: {
    option_id: string;
    option_name: string;
    price: number;
    // option_type: string;
  };
  selectedOptionId?: string | null;
  quantity: number;
  saleDate?: string | null;
}

export interface BillingContactInfo {
  sameAsPatient: boolean;
  lastName: string | null;
  firstName: string | null;
  kanaLastName: string | null;
  kanaFirstName: string | null;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  streetAddress: string | null;
  buildingRoom: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
}

/**
 * Creates a blank BillingContactInfo, defaulting 「同一内容」to unchecked.
 *
 * @returns A BillingContactInfo with all fields initialised to null/empty defaults
 */
export function createEmptyBillingInfo(): BillingContactInfo {
  return {
    sameAsPatient: false,
    lastName: null, firstName: null, kanaLastName: null, kanaFirstName: null,
    postalCode: null, prefecture: null, city: null, streetAddress: null, buildingRoom: null,
    homePhone: null, mobilePhone: null,
  };
}

export interface Delivery {
  patientId: string | null;
  patientName: string | null;
  kanaName: string | null;
  lastName: string | null;
  firstName: string | null;
  kanaLastName: string | null;
  kanaFirstName: string | null;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  streetAddress: string | null;
  buildingRoom: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  buildingInfo: BuildingInfo;
  billingInfo?: BillingContactInfo;
  serviceBlocks: ServiceBlock[];
  optionRows: OptionItem[];
  notes: string | null;
}
