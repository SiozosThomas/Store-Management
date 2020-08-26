import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  authForm: FormGroup;
  private userSub: Subscription;
  user: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit(): void {
    console.log(this.authForm);
    //this.authService.signup(this.authForm.controls.email.value, this.authForm.controls.password.value);
    this.authService.login(this.authForm.controls.email.value, this.authForm.controls.password.value);
    // this.userSub = this.authService.getUserUpdatedListener()
    //   .subscribe(user => {
    //     this.user = user;
    //     this.router.navigate(['/']);
    //   });
  }

  ngOnDestroy(): void {
    //this.userSub.unsubscribe();
  }
}
