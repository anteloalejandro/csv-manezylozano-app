import { Component } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csv';
  url = env.baseUrl
  ignoreLogin = !env.production

  constructor (public loginService: LoginService) { }
}
