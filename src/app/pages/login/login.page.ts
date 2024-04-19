import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginFormComponent } from '../../common/components/login-form/login-form.component';
import { LoginRequest } from '../../common/dtos/login/login.request';
import { LoginResponse } from '../../common/dtos/login/login.response';
import { SecurityService } from '../../core/services/security.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage implements OnInit {

  public constructor(
    protected securityService: SecurityService,
    protected router: Router,
  ) { }

  public ngOnInit(): void {
    this.securityService.logout();
  }

  protected login(dto: LoginRequest): void {
    this.securityService.login(dto).pipe(take(1)).subscribe({
      next: (response: LoginResponse) => {
        this.securityService.initSession(response);
        this.router.navigate(['/pdv']);
      }
    });
  }

}
