import { SaleItemRequest } from "./sale-item.request";

export interface SaleRequest {
    discount: number,
    paymentMethod: string,
    items: SaleItemRequest[]
}