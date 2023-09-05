import { Component } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-warning',
  templateUrl: './login-warning.component.html',
  styleUrls: ['./login-warning.component.scss']
})
export class LoginWarningComponent {
  // show = env.production
  show = true
  constructor(public loginservice: LoginService) {}
}
