import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/* dialogs */
import { MatDialog } from '@angular/material/dialog';
import { DialogSendPetitionComponent } from '../components/dialogs/dialog-send-petition/dialog-send-petition.component';


@Injectable({
    providedIn: 'root'
})
export class CommonModelService {
    public option: any;

    constructor(public dialog: MatDialog) {
        this.option = null;
    }
    openDialogconfirmation(response: any, data_: any): Observable<any> {
        const dialogRef = this.dialog.open(DialogSendPetitionComponent, {
            data: {
                option: this.option,
                state: response,
                data: data_
            }
        });
        return dialogRef.afterClosed();
    }

}
