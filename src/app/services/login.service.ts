import { Injectable } from '@angular/core';
import { Variables } from './variables.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  jwtHelper = new JwtHelperService();
  userInfo = new BehaviorSubject<any>(null);
  checkUserObs: Observable<any>;

  constructor(
    private variables: Variables,
    private readonly platform: Platform,
    private readonly storage: StorageService
  ) {
    let readyPlatformObs = from(this.platform.ready());

    this.checkUserObs = readyPlatformObs.pipe(
      switchMap(() => {
        return from(this.getAccessToken());
      }),
      map((token) => {
        if (!token) {
          return null;
        }
        var decodedUser = this.jwtHelper.decodeToken(token);
        if (decodedUser.exp > Math.floor(Date.now() / 1000)) {
          // Token has expired, log user in
          this.userInfo.next(decodedUser);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  login_with_jwt(sampleJwt: string): Observable<boolean> {
    //sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QiLCJzdWIiOjIsImlhdCI6MTYwNDMwOTc0OSwiZXhwIjoxNjA0MzA5ODA5fQ.jHez9kegJ7GT1AO5A2fQp6Dg9A6PBmeiDW1YPaCQoYs";

    return of(sampleJwt).pipe(
      map((token: string) => {
        if (!token) {
          return false;
        }
        this.storage.set('access_token', token);
        var decodedUser = this.jwtHelper.decodeToken(token);
        this.userInfo.next(decodedUser);
        return decodedUser;
      })
    );
  }

  async getAccessToken() {
    return await this.storage.get('access_token');
  }

  /**
   * Update user's details
   * This is an rxjs BehaviourSubject implementation to update the value of the user
   * Call this whenever you've updated the user's values
   * See https://dev.to/dipteekhd/angular-behaviorsubject-p1#:~:text=BehaviorSubject%20is%20both%20observer%20and,method%20or%20initial%2Fdefault%20value. for details
   * @param user new user's details
   */
  update_user(user: any) {
    return this.userInfo.next(user);
  }
}
