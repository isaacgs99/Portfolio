import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SnackBar } from "nativescript-snackbar";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";

import * as ApplicationSettings from '@nativescript/core/application-settings';
import { User } from "../services/user.model";
import { UtilityService } from "../services/utility.service";
import { LoginService } from "../services/login.service"
import { ApiService } from "../services/api.service";
import { Username } from "../services/username.model";



@Component({
  moduleId: module.id,
  selector: "ns-login",
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {

  public input: any;

  user: User;
  username: Username;

  public constructor(
    private router: RouterExtensions,
    private utilityService: UtilityService,
    private userService: LoginService,
    private postService: ApiService
  ) {
    this.user = new User();
    this.user.email = "";
    this.user.password = "";

    this.username = new Username();
    this.username.username = "";
    this.username.password = "";
  }

  public ngOnInit() {
    if (ApplicationSettings.getBoolean("authenticated") && ApplicationSettings.getBoolean("Remember")) {
      this.router.navigate(["/secure"], { clearHistory: true });
    }
  }

  public loginAPI() {
    if (this.username.username && this.username.password) {
      this.postService.postData(this.username)
        .then(status => {
          console.log(status)
          ApplicationSettings.setString("user_id", this.username.username);
          ApplicationSettings.setBoolean("authenticated", true);
          ApplicationSettings.setString("JWT", status.id_token);

          this.router.navigate(["/secure"], { clearHistory: true });

        }, err => {
          alert("Unfortunately we were unable to find your contact.")
        });
      // let account = JSON.parse(ApplicationSettings.getString(this.user.email, "{}"));
    } else {
      (new SnackBar()).simple("All Fields Required!");
    }

  }

  public login() {
    const isValidEmail = this.utilityService.isValidEmail(this.user.email);
    if (this.user.email && this.user.password) {
      if (isValidEmail == true) {
        this.userService.login(this.user)
          .then(status => {
            ApplicationSettings.setString("user_id", this.user.email);
            ApplicationSettings.setBoolean("authenticated", true);
            this.router.navigate(["/secure"], { clearHistory: true });
          }, err => {
            alert("Unfortunately we could not find your account.");
          });
      } else {
        (new SnackBar()).simple("Your email is written incorrectly!");
      }
      // let account = JSON.parse(ApplicationSettings.getString(this.user.email, "{}"));
    } else {
      (new SnackBar()).simple("All Fields Required!");
    }
  }


  onCheckedChange(args: EventData) {
    let sw = args.object as Switch;
    let isChecked = sw.checked; // boolean
    ApplicationSettings.setBoolean("Remember", isChecked);
    console.log(ApplicationSettings.getBoolean("Remember", true));
  }

}