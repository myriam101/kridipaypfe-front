import { EnergyBill } from "./EnergyBill";
import { Sector } from "./enum/Sector";
import { TrancheElect } from "./enum/TrancheElect";

export interface PriceElectricity{
    id:number;
    price:number;
    sector: Sector;
    tranche_elect:TrancheElect;
    energybill:EnergyBill;
}