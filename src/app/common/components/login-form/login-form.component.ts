import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { LoginRequest } from '../../dtos/login/login.request';
import { LoadingHelper } from '../../helpers/loading.helper';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, InputTextModule, ButtonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  protected form!: FormGroup;
  @Output() public notifyParentToLogin: EventEmitter<LoginRequest> = new EventEmitter<LoginRequest>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl<string | null>(null, [Validators.required]),
      password: new FormControl<string | null>(null, [Validators.required])
    });
  }

  protected login(): void {
    const dto: LoginRequest = { login: this.form.controls['login'].value, password: this.form.controls['password'].value };
    this.notifyParentToLogin.emit(dto);
    this.form.reset();
  }
}
