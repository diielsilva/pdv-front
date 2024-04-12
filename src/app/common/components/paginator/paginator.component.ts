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
  @Input({ required: true }) public currentPage!: number;
  @Input({ required: true }) public totalOfPages!: number;
  @Output() public notifyParentToChangePage: EventEmitter<number> = new EventEmitter<number>();

  public nextPage(): void {
    this.currentPage++;
    this.notifyParentToChangePage.emit(this.currentPage);
  }

  public previousPage(): void {
    this.currentPage--;
    this.notifyParentToChangePage.emit(this.currentPage);
  }

}
