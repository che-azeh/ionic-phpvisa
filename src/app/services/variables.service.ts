import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Variables {
  public appRoot: string;
  public apiRoot: string;
  public appId: string = 'com.ionic-phpvisa';
  public apiKey: string = '012345abcdefghijklmnopqrstuvwxyz';
  public live: boolean = true;

  constructor(
    private alertCtrl: AlertController,
    public location: Location,
    public router: Router
  ) {
    this.appRoot = this.live
      ? 'https://phpvisa.maxwelltraining.net/'
      : 'http://localhost/phpvisa/';
    this.apiRoot = this.appRoot + 'router.php';
  }

  async gen_alert(
    header: string,
    message: string,
    buttons: any = [{ text: 'Return' }],
    inputs: any = []
  ) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons,
      inputs: inputs,
    });

    await alert.present();
  }

  object_to_query(obj: any) {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join('&');
  }

  // Truncate long strings and replace with elipses
  truncate_string(input: string, length: number) {
    return input.length > length ? `${input.substring(0, length)}...` : input;
  }
}
