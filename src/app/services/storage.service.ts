/**
 * To use the storage plugin in ionic, first install it via
 * npm install --save @ionic/storage-angular
 * Then include it in app.module.ts:
 * import { IonicStorageModule } from '@ionic/storage-angular';
 * imports: [... IonicStorageModule.forRoot()]
 * Now add it as a service here (that's what this file does)
 * and then inject it into any class you wish to use it in
 */

import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Variables } from './variables.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private variables: Variables) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(this.variables.appId + key, value);
  }

  async get(key: string) {
    return await this._storage?.get(this.variables.appId + key);
  }

  async remove(key: string) {
    return await this._storage?.remove(this.variables.appId + key);
  }

  async clear() {
    return await this._storage?.clear();
  }
}
