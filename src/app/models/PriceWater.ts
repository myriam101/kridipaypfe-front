import { EnergyBill } from "./EnergyBill";
import { TrancheEau } from "./enum/TrancheEau";

export interface PriceWater{
id:number;
price: number;
tranche_eau: TrancheEau;
energy_bill: EnergyBill;

}