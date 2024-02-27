import { SaleDetailsItemResponse } from "./sale-details-item.response";

export interface SaleDetailsResponse {
    sellerName: string,
    items: SaleDetailsItemResponse[]
}