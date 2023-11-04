import { Component } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public email: any;
    public pass: any;
    public message: any;
    public isError: boolean;

    constructor(
        private api: ServicesService,
        private router: Router,
        private toast: ToastrService) {
        this.email = null;
        this.pass = null;
        this.message = null;
        this.isError = false;
    }

    login() {
        if (this.pass == null || this.email == null) {
            this.toast.warning("You must enter email and Password", "Warning");
            return;
        }
        const Logindata = [
            {
                spName: 'email',
                spParam: this.email,
                type: 'NVarChar'
            },
            {
                spName: 'pass',
                spParam: btoa(this.pass),
                type: 'NVarChar'
            },
        ];
        this.api.login(Logindata).subscribe((response: any) => {
            let res = response.data;
            res = this.api.get(res);
            res = res != null ? JSON.parse(res) : res;
            if (response.code == 200) {
                let data = res[0];
                this.api.setUser(data);
                this.router.navigate(['/home']);
                this.toast.success("LogIn Correct", "Correct");
            } else {
                this.toast.warning("Invalid Credentials", "Warning");
            }
        });
    }
}
