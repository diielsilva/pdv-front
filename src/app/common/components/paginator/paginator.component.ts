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
  @Input({ required: true }) public currentPage!: number
  @Input({ required: true }) public totalOfPages!: number
  @Output() public changePageEvent = new EventEmitter<number>()

  public incrementPage(): void {
    this.currentPage++
    this.changePageEvent.emit(this.currentPage)
  }

  public decrementPage(): void {
    this.currentPage--
    this.changePageEvent.emit(this.currentPage)
  }

}
