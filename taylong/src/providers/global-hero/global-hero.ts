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

  currentPlayingLocalFileIndex = 0
  currentLocalPlayerLink = ""
  listOfLocalFiles = []
  listOfLocalFileNames = []

  // listOfLocalFiles = ['https://download.samplelib.com/mp4/sample-5s.mp4','https://download.samplelib.com/mp4/sample-10s.mp4','https://download.samplelib.com/mp4/sample-15s.mp4']
  // listOfLocalFileNames = ['Test video of a road in a city', 'Test video of a couple of buses passing by the park', 'A stream of vehicles passing by the park']

  constructor() {
    console.log('Hello GlobalHeroProvider Provider');
  }

}
