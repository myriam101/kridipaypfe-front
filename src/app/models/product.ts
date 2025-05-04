import { Catalog } from "./Catalog";
import { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    description?: string;
    short_description?: string;
    price: number;
    brand: string;
    bonifpoint: number;
    bonifvisible: boolean;
    reference: string;
    id_catalog: number;
    categories: Category[];
    id_provider:number;
  
  }
  