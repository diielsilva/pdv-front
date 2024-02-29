import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionHelper {
  private subscriptions: Subscription[] = []

  public add(subscription: Subscription): void {
    this.subscriptions.push(subscription)
  }

  public clean(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    
    this.subscriptions = []
  }
}
