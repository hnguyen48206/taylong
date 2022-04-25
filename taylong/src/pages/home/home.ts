import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
declare var Plyr: any
declare var cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settingModal
  clicks = 0;
  triggerSetting = false;
  myplayer
  showPlayer = false;
  videoSrc
  videoPrefix = 'https://www.youtube.com/embed/'
  videoSubfix = '?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'
  constructor(
    private popCtrl: PopoverController,
    public navCtrl: NavController,
    private santinizer: DomSanitizer, public hero: GlobalHeroProvider, private platform: Platform) {

    this.hero.settingSubject.subscribe(data => {
      console.log(data)
      let push = <any>data;
      switch (push.action) {
        case 'play':
          if (this.myplayer != null)
            this.myplayer.play();
          break;
        case 'pause':
          if (this.myplayer != null)
            this.myplayer.pause();
          break;
        case 'refresh':
          this.changePlayerSrc();
          break;
        case 'closeSetting':
          this.triggerSetting = false;
          break;
        case 'volumeUp':
          if (this.myplayer != null)
          this.myplayer.increaseVolume()
          break;
        case 'volumeDown':
          if (this.myplayer != null)
          this.myplayer.decreaseVolume()	
          break;
        default:
          break;
      }
    })
  }

  settingClick() {
    console.log('click')
    this.clicks++;
    let self = this;
    setTimeout(function () {
      if (self.clicks >= 5 && !self.triggerSetting) {
        console.log('Trigger Setting Menu')
        self.triggerSetting = true;
        self.openSetting();
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
    this.watchoutNetwork();
  }

  watchoutNetwork() {
    document.addEventListener("offline", () => {
      this.hero.networkStatus = "OFFline";
    }, false);
    document.addEventListener("online", () => {
      this.hero.networkStatus = "Online";
    }, false);
  }
  getSrc() {
    return this.santinizer.bypassSecurityTrustResourceUrl(this.videoSrc)
  }
  setupPlayer() {
    this.videoSrc = this.videoPrefix + this.hero.currentPlaylist + this.videoSubfix
    console.log(this.hero.currentPlaylist)
    console.log(this.videoSrc)
    let config = {
      hideControls: true,
      resetOnEnd: true,
      loop: { active: true },
      youtube: {
        noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1
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
  changePlayerSrc() {
    this.showPlayer = false;
    setTimeout(function () {
      this.setupPlayer();
    }.bind(this), 1000);
  }
  openSetting() {
    this.settingModal = this.popCtrl.create(SettingPage, {}, {
      showBackdrop: true,
      enableBackdropDismiss: false
    });
    this.settingModal.present({

    });
  }
}
