import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';
  userFirstName: string = '';
  userLastName: string = '';

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

    this.oktaAuthService.authState$.subscribe(
      (result: any) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
    
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      this.oktaAuth.getUser().then(
        (res : any) => {
          this.userFullName = res.name;
          this.userFirstName = res.firstName
          this.userLastName = res.lastName

          const theEmail = res.email;

          this.storage.setItem('userEmail', JSON.stringify(theEmail));
          this.storage.setItem('userFirstName', JSON.stringify(this.userFirstName));
          this.storage.setItem('userLastName', JSON.stringify(this.userLastName));
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
