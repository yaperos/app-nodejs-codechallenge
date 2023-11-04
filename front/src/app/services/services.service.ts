import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
var CryptoJS = require("crypto-js");

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    constructor(
        private http: HttpClient,
        private router: Router,) {
    }
    public Api = environment.apiUrl;
    public ApiGraphQL = environment.apiGraphQL;
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'my-auth-token',
            'Cache-Control': 'no-cache , no-store, must-revalidate',
            "Pragma": "no-cache",
        })
    }
    login(params: any) {
        let urlApi = this.Api + "/login";
        const paramsSecurity = this.set(params);
        return this.http.post(urlApi, { params: paramsSecurity }, this.httpOptions);
    }
    logout() {
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
    }


    dinamicSpPost(params: any, SpName: any) {
        const paramsSecurity = this.set(params);
        return this.http.post(this.Api + '/putDinamicCallSPs', { paramsSQL: paramsSecurity, SpName: SpName }, this.httpOptions);
    }

    /* Graph Services */
    AntiFraud(params: any) {
        let urlApi = this.ApiGraphQL + "/antifraud";
        const paramsSecurity = params;
        return this.http.post(urlApi, { paramsSQL: paramsSecurity }, this.httpOptions);
    }
    readTransaction(params: any, SpName: any) {
        let urlApi = this.ApiGraphQL + "/readTransaction";
        const paramsSecurity = params;
        return this.http.post(urlApi, { paramsSQL: paramsSecurity, SpName: SpName }, this.httpOptions);
    }
    Approved(params: any, SpName: any) {
        let urlApi = this.ApiGraphQL + "/approvedTransaction";
        const paramsSecurity = params;
        return this.http.post(urlApi, { paramsSQL: paramsSecurity, SpName: SpName }, this.httpOptions);
    }

    //The set method is use for crypt the value.
    set(value: any) {
        try {
            var key = CryptoJS.enc.Utf8.parse(environment.secretKey);
            var iv = CryptoJS.enc.Utf8.parse(environment.IV);
            if (value != null && value.length > 0) {
                value.forEach((param: any) => {
                    Object.keys(param).forEach((index: any) => {
                        if (param[index] != null && param[index] != undefined) {
                            var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(param[index].toString()), key,
                                {
                                    keySize: 128 / 8,
                                    iv: iv,
                                    mode: CryptoJS.mode.CBC,
                                    padding: CryptoJS.pad.Pkcs7
                                });
                            param[index] = encrypted.toString()
                        }
                    });
                });
                return value;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }
    //The get method is use for decrypt the value.
    get(value: any) {
        try {
            var key = CryptoJS.enc.Utf8.parse(environment.secretKey);
            var iv = CryptoJS.enc.Utf8.parse(environment.IV);
            if (value != null) {
                var decrypted = CryptoJS.AES.decrypt(value, key, {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8);
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }


    setUser(data: any) {
        try {
            let dataUser = this.set([data]);
            sessionStorage.setItem('user', JSON.stringify(dataUser[0]));
        } catch (error) {
            console.log(error)
        }
    }

    getUser() {
        try {
            let dataUser: any = sessionStorage.getItem('user');
            return JSON.parse(dataUser);
        } catch (error) {
            console.log(error)
        }
    }
}
