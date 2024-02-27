import { Model } from "./model";

export interface Product extends Model {
    description: string,
    amount: number,
    price: number,
}