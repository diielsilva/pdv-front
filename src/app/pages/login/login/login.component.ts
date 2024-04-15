import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { PasswordModule } from "primeng/password";
import { take } from 'rxjs';
import { LoadingComponent } from '../../../common/components/loading/loading.component';
import { MessageComponent } from '../../../common/components/message/message.component';
import { LoginRequest } from '../../../common/dtos/login/login.request';
import { LoginResponse } from '../../../common/dtos/login/login.response';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SecurityService } from '../../../core/services/security.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PanelModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageComponent, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  protected form!: FormGroup;

  public constructor(
    protected securityService: SecurityService,
    protected router: Router,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl<string | null>(null, { validators: Validators.required }),
      password: new FormControl<string | null>(null, { validators: Validators.required })
    })

    this.securityService.logout();
  }

  protected login(): void {
    const dto: LoginRequest = { login: this.form.controls['login'].value, password: this.form.controls['password'].value };

    this.securityService.login(dto).pipe(take(1)).subscribe({
      next: (response: LoginResponse) => {
        this.securityService.initSession(response);
        this.router.navigate(['/pdv']);
      }
    });
  }

}
