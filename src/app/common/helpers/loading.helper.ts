import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingHelper {
  private isLoading = new BehaviorSubject<boolean>(false)

  isUnderLoading(): boolean {
    return this.isLoading.getValue()
  }

  displayLoading(): void {
    this.isLoading.next(true)
  }

  hiddenLoading(): void {
    this.isLoading.next(false)
  }
}
