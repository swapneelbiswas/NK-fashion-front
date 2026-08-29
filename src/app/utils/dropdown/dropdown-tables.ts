export type DropdownTable =
  | 'hospitals'
  | 'branches'
  | 'services'
  | 'options'
  | 'sets'
  | 'rooms'
  | 'patients'
  | 'hospital_classifications'
  | 'classification_rooms';

export const DROPDOWN_TABLE: {
  readonly HOSPITAL: DropdownTable;
  readonly BRANCH: DropdownTable;
  readonly SERVICE: DropdownTable;
  readonly OPTION: DropdownTable;
  readonly ROOM: DropdownTable;
  readonly SET: DropdownTable;
  readonly PATIENT: DropdownTable;
  readonly HOSPITAL_CLASSIFICATION: DropdownTable;
  readonly CLASSIFICATION_ROOM: DropdownTable;
} = {
  HOSPITAL: 'hospitals',
  BRANCH: 'branches',
  SERVICE: 'services',
  OPTION: 'options',
  ROOM: 'rooms',
  SET: 'sets',
  PATIENT: 'patients',
  HOSPITAL_CLASSIFICATION: 'hospital_classifications',
  CLASSIFICATION_ROOM: 'classification_rooms',
};
