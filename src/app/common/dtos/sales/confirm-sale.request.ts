export interface ConfirmSaleRequest {
  discount: number;
  paymentMethod: string;
  isOnline: boolean;
  hasDelivery: boolean;
}
