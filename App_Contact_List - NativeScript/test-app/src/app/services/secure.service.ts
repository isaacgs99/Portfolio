import { Injectable } from "@angular/core";

import { Contact } from "./contact.model";
import { User } from "./user.model";
import { BackendService } from "./backend.service";
import { DatabaseService } from "../database/sqlite.service";

@Injectable()
export class SecureService {
  constructor(private database: DatabaseService) {
  }
  insert(contact: Contact, user) {
    return new Promise<Object>((resolve, reject) => {
      let gender;
      if (contact.sex.toString() == "0") {
        gender = "M"
      } else {
        gender = "F"
      }
      console.log("Added by user: " + user)
      this.database.getdbConnection()
        .then(db => {
          db.execSQL("INSERT INTO contacts (user_id, email, name, telephone, sex, birthdate) VALUES (?, ?, ?, ?, ?, ?)", [user, contact.email, contact.name, contact.telephone, gender, contact.birthdate]).then(id => {
            console.log("INSERT RESULT", id)
            resolve({ status: true });
          }, err => {
            reject({ status: false });
          });
        });
    });
  }

  public fetch(contact: Contact) {
    console.log(contact)
    return new Promise<Object>((resolve, reject) => {
      this.database.getdbConnection()
        .then(db => {
          db.all("SELECT * FROM contacts where user_id like'" + contact + "'").then(rows => {
            resolve(rows);
          }, err => {
            console.log("NO RESULT")
            reject({ status: false });

          });
        });
    });
  }

  public selectUser(user: Contact, contact: Contact) {
    console.log(user)
    console.log(contact.email)
    return new Promise<Object>((resolve, reject) => {
      this.database.getdbConnection()
        .then(db => {
          db.all("SELECT id FROM contacts where user_id like '" + user + "'AND email like '" + contact.email + "'").then(rows => {
            console.log("ROWS: " + rows)
            resolve(rows);
          }, err => {
            console.log("NO RESULT")
            reject({ status: false });

          });
        });
    });
  }

  edit(contact: Contact, user, id) {
    return new Promise<Object>((resolve, reject) => {
      let gender;
      if (contact.sex.toString() == "0") {
        gender = "M"
      } else {
        gender = "F"
      }
      console.log("Edited by user: " + user)
      console.log("Name of Contact: " + contact.name)
      console.log("ID of Contact: " + id)
      this.database.getdbConnection()
        .then(db => {
          db.execSQL("UPDATE contacts SET email = ?, name = ?, telephone = ?, sex = ?, birthdate = ?  WHERE id = ? AND user_id = ?", [contact.email, contact.name, contact.telephone, gender, contact.birthdate, id, user]).then(id => {
            console.log("Name of Contact: " + contact.name)
            console.log("EDIT RESULT", id)
            resolve({ status: true });
          }, err => {
            reject({ status: false });
          });
        });
    });
  }

  delete(contact: Contact, user: Contact) {
    return new Promise<Object>((resolve, reject) => {
      this.database.getdbConnection()
        .then(db => {
          db.execSQL("DELETE FROM contacts WHERE user_id = ? AND email = ? ", [user, contact.email]).then(id => {
            console.log("DELETE RESULT", id)
            resolve({ status: true });
          }, err => {
            reject({ status: false });
          });
        });
    });
  }

  logout() {
    BackendService.token = "";
    this.database.closedbConnection();
  }
}