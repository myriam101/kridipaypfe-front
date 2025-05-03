import { BillCategory } from "./enum/BillCategory";

export interface EnergyBill{

id:number;
amount_bill:number;
amount_gaz:number;
amount_electr:number;
amount_water:number;
bill_category: BillCategory;
pricewater_id:number;
pricegaz_id:number;
priceelectricity_id:number;
simulation_id:number

}