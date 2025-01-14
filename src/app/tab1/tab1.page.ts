import { Component, OnInit } from '@angular/core';
import { Variables } from '../services/variables.service';
import { StorageService } from '../services/storage.service';
import { DataService } from '../services/data.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  pageTitle = this.variables.appId;
  heroes: any = [];

  constructor(
    public variables: Variables,
    private storage: StorageService,
    private _data: DataService,
    private _login: LoginService
  ) {
    variables.appId = 'App ID Changed';
  }
  ngOnInit(): void {
    const data = {
      route: 'get-heroes',
    };

    this._data.get_data(this.variables.object_to_query(data)).subscribe(
      (resp) => {
        if (resp && 'heroes' in resp) {
          this.heroes = resp.heroes;
          this.storage.set('heroes', this.heroes);
        } else {
          this._data.handle_server_err();
        }
      },
      (err) => {
        this.storage.get('heroes').then((val) => {
          if (val) {
            this.heroes = val;
          } else {
            this._data.handle_failed_conn();
          }
        });
      }
    );
  }
}
