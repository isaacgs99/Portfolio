import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { DatePipe } from "@angular/common";
import { NativeScriptDateTimePickerModule } from "nativescript-datetimepicker/angular";

import { authProviders, AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ApiComponent } from "./api.component";
import { UtilityService } from "./services/utility.service";
import { SecureComponent } from "./secure/secure.component";
import { LoginService } from "./services/login.service";
import { DatabaseService } from "./database/sqlite.service";

// Uncomment and add to NgModule imports if you need to use two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { BackendService } from "./services/backend.service";
import { AddComponent } from "./secure/add/add.component";
import { SecureService } from "./services/secure.service";
import { ApiService } from "./services/api.service";
import { EditComponent } from "./secure/edit/edit.component";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule,
        NativeScriptDateTimePickerModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        SecureComponent,
        AddComponent,
        EditComponent,
        ApiComponent
    ],
    providers: [
        authProviders,
        UtilityService,
        LoginService,
        DatabaseService,
        BackendService,
        SecureService,
        DatePipe,
        ApiService

    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }


