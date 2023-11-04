import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    public rol: any;
    public name: any;
    constructor(private service: ServicesService, private toast: ToastrService) {
        this.rol = null;
        this.name = null;
    }

    /* servicios */
    cerrarSesion() {
        this.service.logout();
    }
    ngOnInit(): void {
        this.getUser();
    }

    getUser() {
        let dataUser: any = sessionStorage.getItem('user');
        dataUser = dataUser != null ? JSON.parse(dataUser) : null;
        if (dataUser == null) { this.toast.error('Error the data', 'Error'); this.service.logout(); }
        Object.keys(dataUser).forEach(index => {
            dataUser[index] = this.service.get(dataUser[index]);
        });
        this.rol = parseInt(dataUser.id_rol)
        this.name = dataUser.firstname+' '+dataUser.lastname;
    }
}
