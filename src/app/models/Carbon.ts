import { Badge } from "./enum/Badge";

export interface Carbon{

id: number;
date_update: Date;
date_add:Date;
value: number;
visible: boolean;
badge: Badge;
product: number;

}