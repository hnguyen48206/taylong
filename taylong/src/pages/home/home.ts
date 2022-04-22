import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { Platform } from 'ionic-angular';

declare var Plyr: any
declare var AndroidApp:any;
declare var cordova:any; 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  clicks = 0;
  triggerSetting = false;
  myplayer
  showPlayer = false;
  constructor(public navCtrl: NavController, public hero: GlobalHeroProvider, private platform: Platform) {
  }

  settingClick() {
    console.log('click')
    this.clicks++;
    let self = this;
    setTimeout(function () {
      if (self.clicks >= 5 && !self.triggerSetting) {
        console.log('Trigger Setting Menu')
        self.triggerSetting = true;
      }
      else {
        self.clicks = 0;
        self.triggerSetting = false;
      }
    }, 3000);

  }

  ionViewDidEnter() {
    // if(this.platform.is('cordova'))
    // cordova.plugins.Focus.focus(document.getElementById('playerContainer') as HTMLElement);

    this.setupPlayer();
  }

  setupPlayer() {
    let config = {
      hideControls: true,
      resetOnEnd: true,
      loop: { active: true },
      youtube: {
        noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, mute: 1, autoplay: 1
      }
    }
    this.showPlayer = true;
    setTimeout(function () {
      this.myplayer = new Plyr('#player', config);
    }.bind(this), 1000)
    setTimeout(function () {
      this.myplayer.play()
    }.bind(this), 3000)
  }

}
