import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GlobalHeroProvider } from '../providers/global-hero/global-hero';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, hero: GlobalHeroProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      hero.currentPlaylist = localStorage.getItem('playlist');
      if(hero.currentPlaylist == null)
      {
        localStorage.setItem('playlist', 'RciE68Q7PCA');
        hero.currentPlaylist = 'RciE68Q7PCA';
      }
    });
  }
}

