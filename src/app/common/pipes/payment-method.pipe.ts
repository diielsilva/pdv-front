import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
  standalone: true
})
export class PaymentMethodPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    switch (value) {
      case 'CARD':
        return 'Cartão'
      case 'PIX':
        return 'Pix'
      case 'CASH':
        return 'Dinheiro'
      default:
        return 'Método de Pagamento Inválido'
    }
  }

}
