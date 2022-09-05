import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SnackBar } from "nativescript-snackbar";
import * as ApplicationSettings from '@nativescript/core/application-settings';
import { ActivatedRoute } from "@angular/router";

import { UtilityService } from "../../services/utility.service";
import { Contact } from "~/app/services/contact.model";
import { SecureService } from "~/app/services/secure.service";

@Component({
  moduleId: module.id,
  selector: "ns-edit",
  templateUrl: "edit.component.html",
  styleUrls: ["edit.component.css"]
})

export class EditComponent {
  currentUser;

  user_id: string;

  public genders: Array<string> = ["M", "F"];

  public input: any;

  id: string

  contact: Contact;

  result = 1;

  items: Array<Object> = [];

  public constructor(
    private router: RouterExtensions,
    private utilityService: UtilityService,
    private contactService: SecureService,
    private route: ActivatedRoute
  ) {
    this.contact = new Contact();
    this.user_id = ApplicationSettings.getString("user_id");
    this.currentUser = this.user_id;

    this.route.queryParams.subscribe((params) => {
      this.contact = JSON.parse(params["data"]);
      this.id = params["id"];
    });
    console.log("Sex is in edit: " + this.contact.sex)
    console.log(this.contact.birthdate)
    console.log("ID in edit: " + this.id)
  }

  public EditContact() {
    const isValidEmail = this.utilityService.isValidEmail(this.contact.email);
    const isValidName = this.isValidName(this.contact)
    console.log("Phone :" + this.isValidTelephone(this.contact));
    if (this.contact.email && this.contact.name && this.contact.telephone && this.contact.birthdate) {
      if (isValidEmail == true) {
        if (isValidName) {
          if (this.validateTelephone(this.contact)) {
            this.contactService.edit(this.contact, this.user_id, this.id)
              .then(status => {
                alert("Your contact was successfully edited.");
              }, err => {
                alert("Unfortunately we were unable to edit your contact.")
              });
            this.goBack();
          } else {
            (new SnackBar()).simple("the telephone is written incorrectly!");
          }
        } else {
          (new SnackBar()).simple("the name is written incorrectly!");
        }
      } else {
        (new SnackBar()).simple("the email is written incorrectly!");
      }
    } else {
      (new SnackBar()).simple("All Fields Required!");
    }
  }

  public validateTelephone(contact: Contact) {
    if (this.contact.telephone.length == 10 && this.isValidTelephone(this.contact)) {
      return true
    } else {
      return false
    }
  }

  isValidName(contact: Contact) {
    var regex = /^[a-zA-^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s]+$/;
    return regex.test(this.contact.name);
  }

  isValidTelephone(contact: Contact) {
    var regex = /^[0-9]+$/;
    return regex.test(this.contact.telephone);
  }


  public deleteContact() {
    console.log("CONTACT EMAIL: " + this.contact)
    this.contactService.delete(this.contact, this.currentUser)
      .then(status => {
        console.log("DELETED: " + status)
        alert("Deleted contact succesfully")
      }, err => {
        alert("Unfortunately we were unable to delete your contact.")
      });
    this.goBack();
  }

  public goBack() {
    this.router.navigate(["/secure"], { clearHistory: true });
  }


  public selectedIndexChanged(picker) {
    if (this.contact.sex.toString() == "M") {
      picker.selectedIndex = 0
    } else {
      picker.selectedIndex = 1
    }
    console.log('picker selection: ' + picker.selectedIndex);
  }




}
