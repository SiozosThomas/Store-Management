import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
  user: User;
  isAuth = true;

  constructor(private authService: AuthService, private router: Router, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#2d4059';
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit(): void {
    console.log(this.authForm);
    //this.authService.signup(this.authForm.controls.email.value, this.authForm.controls.password.value);
    this.authService.login(this.authForm.controls.email.value, this.authForm.controls.password.value);
    setTimeout(() => {
      this.isAuth = this.authService.getIsAuthenticated();
    }, 500);
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "white";
  }
}
