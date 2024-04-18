import { Component, inject } from '@angular/core';
import { MessageHelper } from '../../helpers/message.helper';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  public constructor(protected messageHelper: MessageHelper) { }

}
