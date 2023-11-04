import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServicesService } from '../../services/services.service';
/* encriptamiento */
var CryptoJS = require("crypto-js");
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private router: Router,private service:ServicesService) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let User: any = sessionStorage.getItem('user');
        User = User != null ? JSON.parse(User) : null;
        if (User != undefined || User != null) {
            return true;
        } else {
            this.router.navigate(['/login']);
            this.service.logout()
            return false;
        }
    }
}
