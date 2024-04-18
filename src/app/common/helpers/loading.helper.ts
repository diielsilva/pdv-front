import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingHelper {
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isLoading(): boolean {
    return this.loading.getValue();
  }

  public display(): void {
    this.loading.next(true);
  }

  public hidden(): void {
    this.loading.next(false);
  }
}
