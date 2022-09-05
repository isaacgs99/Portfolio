import { Component } from "@angular/core";
import { ApiService } from "./services/api.service";
import { Username } from "./services/username.model";

@Component({
  moduleId: module.id,
  templateUrl: "./api.component.html",
  providers: [ApiService] // using the providers array
})
export class ApiComponent {
  public user: string;
  public pass: string;
  public remember: boolean;
  username: Username;
  public message: string = "";
  token: string;

  constructor
    (
      private myPostService: ApiService,
      private myGetService: ApiService
    ) {
    this.username = new Username();
    this.username.username = "user";
    this.username.password = "user";
  }

  public submit() {
    this.makePostRequest();
  }

  public recieve() {
    this.makeGetRequest();
  }

  private makePostRequest() {
    this.myPostService.postData(this.username)
      .then(status => {
        this.token = status.id_token;
        console.log(this.token)
      }, err => {
        alert("Unfortunately we were unable to fetch your contact.")
      });
  }

  private makeGetRequest() {
    console.log(this.token)
    this.myGetService.getData(this.token)
      .then(status => {
        console.log(status)
      }, err => {
        alert("Unfortunately we were unable to fetch your contact.")
      });
  }
}
