import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RouteRoutingModule } from './route/route-routing.module';
/* material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
/* http */
import {
    HttpClientModule,
    HTTP_INTERCEPTORS,
    HttpClientXsrfModule,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* alertas */
import { ToastrModule } from 'ngx-toastr';
/* interceptores */
import { LoaderService } from './services/loader.service';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
/* icon */
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
/* dialogs */
import { MatDialogModule } from '@angular/material/dialog';
/* interceptor */
import { ErrorInterceptor } from './services/error-interceptor';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        LoaderComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        RouteRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'CSRF-Token',
        }),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTooltipModule,
        ToastrModule.forRoot(),
        MatDialogModule,
    ],
    providers: [
        LoaderService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptorService,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    exports: [MatFormFieldModule, MatInputModule],
})
export class AppModule { }
