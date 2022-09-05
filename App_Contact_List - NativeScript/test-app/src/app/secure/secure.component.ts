import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationExtras } from "@angular/router";
import * as ApplicationSettings from '@nativescript/core/application-settings';
import { DatabaseService } from "../database/sqlite.service";
import { AddComponent } from "./add/add.component";
import { SecureService } from "~/app/services/secure.service";
import { isIOS, device } from "tns-core-modules/platform";
import { Contact } from "../services/contact.model";

declare const UIApplication: any;

@Component({
  moduleId: module.id,
  selector: "ns-secure",
  templateUrl: "secure.component.html",
  styleUrls: ["secure.component.css"]
})
export class SecureComponent implements OnInit {
  currentUser;
  currentContact: Contact;
  user_id: string;
  id;
  flag: boolean;
  items: Array<Contact> = [];

  public constructor(
    private router: RouterExtensions,
    private userService: SecureService,
    private database: DatabaseService
  ) {
    this.user_id = ApplicationSettings.getString("user_id");
  }

  public ngOnInit() {
    if (!ApplicationSettings.getBoolean("authenticated", false)) {
      this.router.navigate(["/login"], { clearHistory: true });
    } else {
      this.currentUser = this.user_id;
    }
    this.fetch();
  }

  public logout() {
    this.userService.logout();
    ApplicationSettings.remove("authenticated");
    this.router.navigate(["/login"], { clearHistory: true });
  }

  public AddNewContact() {
    this.router.navigate(["/add"]);
  }

  public editContact() {
    console.log("Item: " + this.currentContact)
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify(this.currentContact),
        "id": this.id
      }
    };
    this.router.navigate(["/edit"], navigationExtras);
  }

  public deleteContact(i) {
    this.currentContact = this.items[i];
    console.log("CONTACT EMAIL: " + this.currentContact)
    this.userService.delete(this.currentContact, this.currentUser)
      .then(status => {
        console.log("DELETED: " + status)
        this.fetch();
        alert("Deleted contact succesfully")
      }, err => {
        alert("Unfortunately we were unable to delete your contact.")
      });
  }

  onItemTap(args) {
    this.currentContact = this.items[args.index];
    console.log("Current Contact " + this.currentContact.email)
    this.selectUser()
  }

  public fetch() {
    this.userService.fetch(this.currentUser)
      .then(status => {
        this.items = [];
        for (var row in status) {
          this.items.push({
            "user_id": status[row][1],
            "email": status[row][2],
            "name": status[row][3],
            "telephone": status[row][4],
            "sex": status[row][5],
            "birthdate": status[row][6]
          });
        }
      }, err => {
        alert("Unfortunately we were unable to fetch your contact.")
      });
  }



  public selectUser() {
    this.userService.selectUser(this.currentUser, this.currentContact)
      .then(status => {
        this.id = status
        this.editContact()
      }, err => {
        alert("Unfortunately we were unable to select your contact.")
      });
  }



}