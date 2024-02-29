import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingHelper } from '../../helpers/loading.helper';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  protected loader = inject(LoadingHelper)
}
