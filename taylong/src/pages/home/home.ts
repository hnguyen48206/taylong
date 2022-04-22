import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
declare var Plyr: any
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  clicks = 0;
  triggerSetting = false;
  myplayer
  showPlayer = false;
  constructor(public navCtrl: NavController, public hero: GlobalHeroProvider) {
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
