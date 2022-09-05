import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { SnackBar } from "nativescript-snackbar";

import { LoginService } from "../services/login.service"
import { User } from "../services/user.model";
import { UtilityService } from "../services/utility.service";

@Component({
  moduleId: module.id,
  selector: "ns-register",
  templateUrl: "register.component.html",
})
export class RegisterComponent {

  public input: any;

  user: User;

  public constructor(
    private location: Location,
    private router: RouterExtensions,
    private utilityService: UtilityService,
    private userService: LoginService
  ) {
    this.user = new User();
  }

  public SignUp() {
    const isValidEmail = this.utilityService.isValidEmail(this.user.email);
    const isValidFName = this.user.isValidFName()
    const isValidLName = this.user.isValidLName()
    if (this.user.email && this.user.password && this.user.firstname && this.user.lastname) {
      if (isValidFName) {
        if (isValidLName) {
          if (isValidEmail == true) {
            this.userService.register(this.user)
              .then(status => {
                alert("Your account was successfully created.");
              }, err => {
                alert("Unfortunately we were unable to create your account.")
              });
            this.goBack()
          } else {
            (new SnackBar()).simple("Your email is written incorrectly!");
          }
        } else {
          (new SnackBar()).simple("Your Last Name is written incorrectly!");
        }
      } else {
        (new SnackBar()).simple("Your First Name is written incorrectly!");
      }
    } else {
      (new SnackBar()).simple("All Fields Required!");
    }
  }

  public goBack() {
    this.router.navigate(["/login"], { clearHistory: true });
  }

}
