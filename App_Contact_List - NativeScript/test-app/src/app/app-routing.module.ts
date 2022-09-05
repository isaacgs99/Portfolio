import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SecureComponent } from "./secure/secure.component";
import { AuthGuard } from "./services/auth-guard.service";
import { AddComponent } from "./secure/add/add.component";
import { EditComponent } from "./secure/edit/edit.component";
import { ApiComponent } from "./api.component";

export const authProviders = [
    AuthGuard
];

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "secure", component: SecureComponent },
    { path: "add", component: AddComponent },
    { path: "edit", component: EditComponent },
    { path: "api", component: ApiComponent },
    { path: "edit/:items", component: EditComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})

export class AppRoutingModule { }
