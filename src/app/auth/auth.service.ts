import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { User } from "./user.model";
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;
    
    constructor(private http: HttpClient, private router: Router) {}

    getToken(): string {
        return this.token;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    getIsAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    autoAuthUser() {
        if (this.checkLocalStorage()) {
            this.token = localStorage.getItem('token');
            const expiration = new Date(localStorage.getItem('expiration'));
            const now = new Date();
            const expiresIn = expiration.getTime() - now.getTime();
            if (expiresIn > 0) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.setAuthTimer(expiresIn / 1000);
                this.router.navigate(['/tables-list']);
            }
        }
    }

    // signup(email: string, password: string) {
    //     const user: User = ({
    //         email,
    //         password
    //     });
    //     this.http.post<{message: string}>(BACKEND_URL + "signup", user)
    //         .subscribe(resData => {
    //             //this.userUpdated.next(user);
    //         });
    // }

    login(email: string, password: string) {
        const user: User = ({
            email,
            password
        });
        const request = this.http.post<{message: string, token: string, expiresIn: number}>(BACKEND_URL + "/login", user)
        request.subscribe(resData => {
            this.isAuthenticated = true;
            this.token = resData.token;
            const expiresInDuration = resData.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(this.token, expDate);
            this.authStatusListener.next(true);
            this.router.navigate(['/tables-list']);
        }, () => {
            this.isAuthenticated = false;
        });
    }

    logout() {
        this.token = null;
        this.clearAuthData();
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expiration: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private setAuthTimer(duration: number) {
        console.log(duration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
      }

    private checkLocalStorage() {
        if (!localStorage.getItem('token')) {
            return false;
        }
        return true;
    }
}