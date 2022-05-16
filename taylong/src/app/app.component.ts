import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GlobalHeroProvider } from '../providers/global-hero/global-hero';
import { Storage } from '@ionic/storage';

declare var cordova: any

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(storage: Storage, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, hero: GlobalHeroProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('cordova')) {
        cordova.KioskPlugin.setKioskEnabled(true)
        cordova.KioskPlugin.setAllowedKeys([]);
        cordova.KioskPlugin.setCloseSystemDialogIntervalMillis(200);
        cordova.KioskPlugin.setCloseSystemDialogDurationMillis(20000);
      }

      hero.networkStatus = navigator.onLine ? "Online" : "OFFline";
      console.log(hero.networkStatus)

    });
  }
}

