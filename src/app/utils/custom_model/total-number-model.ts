export interface SetTable {
  title: string;
  sizes: string[];
  rows: {
    name: string;
    values: number[];
  }[];
}
