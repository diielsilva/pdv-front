import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { PasswordModule } from "primeng/password";
import { LoadingComponent } from '../../../common/components/loading/loading.component';
import { MessageComponent } from '../../../common/components/message/message.component';
import { LoginRequest } from '../../../common/dtos/login/login.request';
import { LoginResponse } from '../../../common/dtos/login/login.response';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PanelModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageComponent, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  protected authService = inject(AuthService)
  protected router = inject(Router)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected loginForm!: FormGroup

  public ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl<string | null>(null, { validators: Validators.required }),
      password: new FormControl<string | null>(null, { validators: Validators.required })
    })

    this.authService.logout()
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected attemptAuthenticate(): void {
    const dto: LoginRequest = { login: this.loginForm.controls['login'].value, password: this.loginForm.controls['password'].value }

    const subscription = this.authService.login(dto)
      .subscribe({
        next: (response: LoginResponse) => {
          this.authService.onSuccessfulLogin(response)
          this.router.navigate(['/pdv'])
        },
        error: (response: HttpErrorResponse) => {
          this.messager.displayMessage(response.error.message, 'error')
        }
      })

    this.subscriber.add(subscription)
  }

}
