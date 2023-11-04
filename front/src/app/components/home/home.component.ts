import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import * as e from 'express';
import { equal } from 'assert';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public disabledButtonSend: boolean = false;
    public putDataParams: any;
    public infoTransaction: any = [];
    constructor(private service: ServicesService, private toast: ToastrService) {
        this.putDataParams = {
            id_element: "",
            idccmsPo: null,
            comment: null,
        }
    }

    ngOnInit(): void {
        console.log('welcome Yaperos')
    }

    putData() {
        this.infoTransaction = [];
        if (this.putDataParams.tel == null || this.putDataParams.cash == null) {
            this.toast.warning("You must enter tel and cash", "Warning");
            return;
        }
        const params = [
            {
                spName: 'cash',
                spParam: this.putDataParams.cash,
                type: 'Int'
            }
        ];
        /* service AntiFraud */
        this.service.AntiFraud(params).subscribe((response: any) => {
            if (response.state == 1) {
                this.saveData(response.state);
                this.toast.info(response.msg, 'Info');
                setTimeout(() => {
                    this.readTransaction();
                }, 3000);
            } else {
                this.saveData(response.state);
                this.toast.error(response.msg, 'Error');
                setTimeout(() => {
                    this.approvedUpdate(this.infoTransaction.id, false);
                }, 3000);
            }
        });
    }
    readTransaction() {
        let user_data: any = this.service.getUser();
        const params = [
            {
                spName: 'accountExternalIdDebit',
                spParam: this.service.get(user_data.tel),
                type: 'VarChar'
            },
            {
                spName: 'accountExternalIdCredit',
                spParam: this.putDataParams.tel.toString(),
                type: 'VarChar'
            }
        ];
        let SpName = 'retrieveTransaction';
        this.service.readTransaction(params, SpName).subscribe((response: any) => {
            try {
                // colocar mas logica de validaciones
                ///
                ///
                this.infoTransaction = response.data[0];
                this.toast.info(response.msg, 'Info');
                if (this.infoTransaction != undefined) {
                    setTimeout(() => {
                        this.approvedUpdate(this.infoTransaction.id, true);
                    }, 3000);
                } else {
                    this.toast.error(response.msg, 'Error');
                }
            } catch (error) {
                console.log(error)
            }
        });
    }
    getData() {
        this.infoTransaction = [];
        let user_data: any = this.service.getUser();
        const params = [
            {
                spName: 'accountExternalIdDebit',
                spParam: this.service.get(user_data.tel),
                type: 'VarChar'
            },
            {
                spName: 'accountExternalIdCredit',
                spParam: this.putDataParams.tel.toString(),
                type: 'VarChar'
            }
        ];
        let SpName = 'retrieveTransaction';
        this.service.readTransaction(params, SpName).subscribe((response: any) => {
            try {
                this.infoTransaction = response.data[0];
            } catch (error) {
                console.log(error)
            }
        });
    }
    approvedUpdate(id: any, statePending: any) {
        const params = [
            {
                spName: 'id',
                spParam: id,
                type: 'Int'
            },
            {
                spName: 'statePending',
                spParam: statePending ? 2 : 3,
                type: 'Int'
            },
        ];
        let SpName = 'update_transaction';
        /* service AntiFraud */
        this.service.Approved(params, SpName).subscribe((response: any) => {
            if (response.state == 2) {
                this.toast.success(response.msg, 'Success Approved');
            } else {
                this.toast.error(response.msg, 'Error Rejected');
            }
            setTimeout(() => {
                this.getData();
            }, 3000);
        });
    }
    saveData(state: any) {
        let user_data: any = this.service.getUser();
        const params = [
            {
                spName: 'accountExternalIdDebit',
                spParam: this.service.get(user_data.tel),
                type: 'VarChar'
            },
            {
                spName: 'accountExternalIdCredit',
                spParam: this.putDataParams.tel.toString(),
                type: 'VarChar'
            },
            {
                spName: 'cash',
                spParam: this.putDataParams.cash,
                type: 'Int'
            },
            {
                spName: 'state',
                spParam: state,
                type: 'Int'
            },
        ];
        let SpName = 'put_transaction';
        this.service.dinamicSpPost(params, SpName).subscribe((response: any) => {
            let res = response.data;
            res = this.service.get(res);
            res = res != null ? JSON.parse(res) : res;
            if (response.code == 200) {
                this.toast.success("Save Correct", "Correct");
            } else {
                this.toast.warning("Save Incorrect", "Warning");
            }
        });
    }
}
