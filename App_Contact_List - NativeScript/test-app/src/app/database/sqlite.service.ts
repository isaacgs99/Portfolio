import { Injectable } from "@angular/core";
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class DatabaseService {

  public getdbConnection() {
    return new Sqlite('Test');

  }
  public closedbConnection() {
    new Sqlite('Test')
      .then((db) => {
        db.close();
      });
  }


}