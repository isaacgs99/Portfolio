import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { request } from "tns-core-modules/http";
import { Username } from "./username.model";

@Injectable()
export class ApiService {
  private serverUrl = "http://192.168.3.143:8080/api/authenticate";
  private serverUrlGet = "http://192.168.3.143:8080/api/contactos"

  constructor(private http: HttpClient) { }

  postData(user: Username) {
    return new Promise<any>((resolve, reject) => {
      request({
        url: this.serverUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(user)
      }).then(response => {
        var result = response.content.toJSON();
        resolve(result);
      }, error => {
        console.error(error);
        reject({ status: true });
      });
    });
  }

  getData(token: string) {
    return new Promise<any>((resolve, reject) => {
      request({
        url: this.serverUrlGet,
        method: "GET",
        headers:
        {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "page": 1,
          "size": 10,
          "sort": "asc"

        }
      }).then(response => {
        var result = response.content.toJSON();
        resolve(result);
      }, error => {
        console.error(error);
        reject({ status: true });
      });
    });
  }
}