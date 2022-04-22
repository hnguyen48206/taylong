import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalHeroProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalHeroProvider {
  currentPlaylist = ''
  constructor() {
    console.log('Hello GlobalHeroProvider Provider');
  }

}
