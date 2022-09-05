import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SnackBar } from "nativescript-snackbar";
import * as ApplicationSettings from '@nativescript/core/application-settings';
import { registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";
registerLocaleData(localeES, "es");


import { UtilityService } from "../../services/utility.service";
import { Contact } from "~/app/services/contact.model";
import { SecureService } from "~/app/services/secure.service";


@Component({
  moduleId: module.id,
  selector: "ns-add",
  templateUrl: "add.component.html",
  styleUrls: ["add.component.css"]
})

export class AddComponent {

  user_id: string;

  public genders: Array<string> = ["M", "F"];

  public input: any;

  contact: Contact;

  result = 1;

  public constructor(
    private router: RouterExtensions,
    private utilityService: UtilityService,
    private contactService: SecureService
  ) {
    this.contact = new Contact();
    this.user_id = ApplicationSettings.getString("user_id");
  }

  public AddContact() {
    const isValidEmail = this.utilityService.isValidEmail(this.contact.email);
    const isValidName = this.isValidName(this.contact)
    console.log(this.contact.sex);
    if (this.contact.email && this.contact.name && this.contact.telephone && this.contact.birthdate) {
      if (isValidEmail == true) {
        if (isValidName) {
          if (this.validateTelephone(this.contact)) {
            this.contactService.insert(this.contact, this.user_id)
              .then(status => {
                alert("Your contact was successfully created.");
              }, err => {
                alert("Unfortunately we were unable to create your contact.")
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

  public goBack() {
    this.router.navigate(["/secure"], { clearHistory: true });
  }

  public selectedIndexChanged(picker) {
    console.log('picker selection: ' + picker.selectedIndex);
  }


}
