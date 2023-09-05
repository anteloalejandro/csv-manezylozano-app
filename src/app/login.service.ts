import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private url = env.baseUrl + '/login.php'
  private response?: LoginResponse

  constructor(private http: HttpClient) {
    this.checkLogin()
      .subscribe(response => {
        console.log(response)
        this.response = response
      })
  }

  checkLogin(): Observable<LoginResponse> {
    console.log('getting ' + this.url)
    return this.http.get<LoginResponse>(this.url)
  }

  getResponse() {
    return this.response
  }
}

type LoginResponse = {
  error: boolean,
  message: string,
  redirect_link: string
}

