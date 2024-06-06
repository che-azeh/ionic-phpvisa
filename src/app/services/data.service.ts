import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { Variables } from './variables.service';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loader: any;
  private options;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private http: HttpClient,
    private variables: Variables,
    private storage: StorageService
  ) {
    // Http Options
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  }

  post_data(
    data: string,
    headers: any = this.options,
    load: boolean = true
  ): Observable<any> {
    if (load) {
      this.handle_loading();
    }
    let postData = this.format_data(data);

    return this.http.post(this.variables.apiRoot, postData, headers).pipe(
      tap((complete) => this.dismissAllLoaders()),
      retry(0),
      catchError(this.handle_failed_conn)
    );
  }

  async get_session() {
    let header;
    await this.storage.get('access_token').then((val) => {
      console.log(val);
      if (val && val.length) {
        header = {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${val}`,
          }),
        };
      }
    });
    return await header;
  }

  get_data(
    data: string = '',
    headers: any = this.options,
    load: boolean = true
  ): Observable<any> {
    if (load) {
      this.handle_loading();
    }
    let postData = this.format_data(data);

    return this.http.get(this.variables.apiRoot + '?' + postData, headers).pipe(
      tap((complete) => this.dismissAllLoaders()),
      retry(0),
      catchError(this.handle_failed_conn)
    );
  }

  format_data(data: string) {
    let session = localStorage.getItem(this.variables.appId + 'session'),
      user =
        JSON.parse(
          localStorage.getItem(this.variables.appId + 'user') ?? '[]'
        ) ?? {},
      userId = user ? user.id : 0;
    // this.handle_loading();

    return `key=${this.variables.apiKey}&${data}`;
  }

  async handle_loading() {
    this.loader = await this.loadingController.create({
      message: 'Contacting Server...',
      // duration: 3000,
    });
    await this.loader.present();
  }

  async handle_failed_conn(data: any = {}) {
    setTimeout(() => this.dismissAllLoaders(), 500);

    if (data && 'error' in data) {
      this.variables.gen_alert('Logged out!', data.error.message);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Connection error!',
      message:
        'No contact was made with the server. This can happen when you have no active internet connection. Please try again',
      buttons: [
        {
          text: 'Close',
        },
      ],
    });

    await alert.present();
  }

  async handle_server_err() {
    setTimeout(() => this.dismissAllLoaders(), 500);

    const alert = await this.alertController.create({
      header: 'Sincere Apologies!',
      message:
        'Your request encountered an error! This is our fault, we have been notified and are looking at it right away. Please try again in a moment.',
      buttons: [
        {
          text: 'Close',
        },
      ],
    });

    await alert.present();
  }

  async dismissAllLoaders() {
    let topLoader = await this.loadingController.getTop();
    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        throw new Error('Could not dismiss the topmost loader. Aborting...');
      }
      topLoader = await this.loadingController.getTop();
    }
  }
}
