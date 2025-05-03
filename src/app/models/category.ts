import { Designation } from "./enum/designation";

export interface Category {
    id: number;
    name: string;
    description: string;
    designation: Designation;
  }
  