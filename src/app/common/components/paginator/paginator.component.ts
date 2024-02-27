import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input({ required: true }) public actualPage!: number
  @Input({ required: true }) public totalPages!: number
  @Output() public changePageEvent = new EventEmitter<number>()
  

  protected shouldDisableIncrementButton(): boolean {
    return this.actualPage >= this.totalPages
  }

  public incrementPage(): void {
    this.actualPage++
    this.changePageEvent.emit(this.actualPage)
  }

  protected shouldDisableDecrementButton(): boolean {
    return this.actualPage <= 1
  }

  public decrementPage(): void {
    this.actualPage--
    this.changePageEvent.emit(this.actualPage)
  }

}
