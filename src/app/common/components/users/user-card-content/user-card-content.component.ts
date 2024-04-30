import { Component, Input } from '@angular/core';
import { User } from '../../../../core/models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-card-content',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-card-content.component.html',
  styleUrl: './user-card-content.component.css'
})
export class UserCardContentComponent {
  @Input({ required: true }) public user!: User;
}
