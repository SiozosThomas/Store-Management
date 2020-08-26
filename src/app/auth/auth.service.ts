import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { User } from "./user.model";
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    
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
        const inf = this.getAuthData();
        if (inf) {
            if (inf.token) {
                this.token = inf.token;
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/tables-list']);
            }
        }
    }

    signup(email: string, password: string) {
        const user: User = ({
            email,
            password
        });
        this.http.post<{message: string}>("http://localhost:3000/api/users/signup", user)
            .subscribe(resData => {
                //this.userUpdated.next(user);
            });
    }

    login(email: string, password: string) {
        const user: User = ({
            email: email,
            password: password
        });
        this.http.post<{message: string, token: string}>("http://localhost:3000/api/users/login", user)
            .subscribe(resData => {
                this.token = resData.token;
                this.isAuthenticated = true;
                this.saveAuthData(this.token);
                this.authStatusListener.next(true);
                this.router.navigate(['/tables-list']);
            });
    }

    private saveAuthData(token: string) {
        localStorage.setItem('token', token);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        return {
            token
        };
    }
}