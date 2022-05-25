import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/*
  Generated class for the GlobalHeroProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalHeroProvider {
  isLocalMode = false
  currentPlaylist = ''
  settingSubject = new Subject();
  networkStatus
  constructor() {
    console.log('Hello GlobalHeroProvider Provider');
  }

}
