import { EnergyBill } from "./EnergyBill";
import { Sector } from "./enum/Sector";
import { TrancheGaz } from "./enum/TrancheGaz";

export interface PriceGaz{

    id:number;
    price:number;
    tranche_gaz:TrancheGaz;
    sector:Sector;
    energy_bill: EnergyBill;
    

}