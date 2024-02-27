import { Model } from "./model";

export interface Sale extends Model{
    paymentMethod: string,
    discount: number,
    total: number
}