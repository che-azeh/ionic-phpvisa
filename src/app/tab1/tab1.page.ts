import { Component } from '@angular/core';
import { Variables } from '../services/variables.service';
import { StorageService } from '../services/storage.service';
import { DataService } from '../services/data.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  pageTitle = this.variables.appId;
  constructor(
    public variables: Variables,
    private storage: StorageService,
    private _data: DataService,
    private _login: LoginService
  ) {
    variables.appId = 'App ID Changed';
  }
}
