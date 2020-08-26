import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    isAuthenticated = false;

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : boolean | Promise<boolean> | Observable<boolean> {
        const isAuth = this.authService.getIsAuthenticated();
        if (!isAuth) {
            this.router.navigate(['/auth']);
        }
        return isAuth;
    }
}