import { Component } from "@angular/core";
import { DatabaseService } from "./database/sqlite.service";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent {

    constructor(private database: DatabaseService) {
        this.database.getdbConnection()
            .then(db => {
                db.execSQL("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT ,email TEXT, name TEXT, telephone TEXT, sex TEXT, birthdate TEXT, FOREIGN KEY(user_id) REFERENCES users(user_id))").then(() => {
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
                db.execSQL("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT UNIQUE, password TEXT)").then(() => {
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            });
    }
}
