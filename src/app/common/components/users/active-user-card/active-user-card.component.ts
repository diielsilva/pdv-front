import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { User } from '../../../../core/models/user';
import { UserCardContentComponent } from '../user-card-content/user-card-content.component';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-active-user-card',
  standalone: true,
  imports: [PanelModule, ButtonModule, UserCardContentComponent],
  templateUrl: './active-user-card.component.html',
  styleUrl: './active-user-card.component.css'
})
export class ActiveUserCardComponent {
  @Input({ required: true }) public user!: User;
  @Output() public notifyParentToDisplayModal: EventEmitter<void> = new EventEmitter<void>();

  public constructor(protected loadingHelper: LoadingHelper) { }
}
