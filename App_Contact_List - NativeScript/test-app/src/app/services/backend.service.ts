import { Injectable } from "@angular/core";
import * as ApplicationSettings from '@nativescript/core/application-settings';
export class BackendService {
  static isLoggedIn(): boolean {
    return !!ApplicationSettings.getString("token");
  }
  static get token(): string {
    return ApplicationSettings.getString("token");
  }
  static set token(theToken: string) {
    ApplicationSettings.setString("token", theToken);
  }

}