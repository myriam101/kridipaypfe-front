import { EnergyClass } from "./enum/EnergyClass";
import { Typefeature } from "./enum/Typefeature";

export interface Feature{
    id:number;
    weight:number;
    noise:number;
    power:number;
    consumption_liter:number;
    consumption_watt:number;
    hdr_consumption:number;
    sdr_consumption:number;
    capacity:number;
    dimension:number;
    volume_refrigeration: number;
    volume_freezer:number;
    volume_collect:number;
    seer:number;
    scop:number;
    cycle_duration:number;
    nbr_couvert:number;
    nb_bottle:number;
    resolution:number;
    diagonale:number;
    condens_perform:EnergyClass;
    spindry_class:EnergyClass;
    steam_class:EnergyClass;
    light_class:EnergyClass;
    filtre_class:EnergyClass;
    type:Typefeature;
    id_product:number;
    


}