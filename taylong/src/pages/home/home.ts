import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { Storage } from '@ionic/storage';

declare var YT: any

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
  videoList = "videoseries?list="

  constructor(
    private popCtrl: PopoverController,
    public navCtrl: NavController,
    private santinizer: DomSanitizer, public hero: GlobalHeroProvider,
    private storage: Storage,
    private platform: Platform) {

    this.hero.settingSubject.subscribe(data => {
      console.log(data)
      let push = <any>data;
      switch (push.action) {
        case 'play':
          console.log(this.myplayer)
          if (this.myplayer != null)
            this.myplayer.playVideo();
          break;
        case 'pause':
          if (this.myplayer != null)
            this.myplayer.pauseVideo();
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
        case 'volume':
          if (this.myplayer != null && platform.is('cordova')) {
            cordova.VolumeControl.setVolume(push.data.volume);
          }
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

    this.storage.get('playlist').then((val) => {
      if (val != null)
        this.hero.currentPlaylist = val
      else {
        this.hero.currentPlaylist = 'RciE68Q7PCA';
        this.storage.set('playlist', 'RciE68Q7PCA');
      }

      this.setupPlayer();

    });

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
    this.showPlayer = true;
    setTimeout(function () {
      this.myplayer = new YT.Player('player', {
        videoId: this.hero.currentPlaylist,
        playerVars: {
          'playsinline': 1,
        },
        events: {
          'onStateChange': this.onPlayerStateChange
        }

      });
    }.bind(this), 1000)

    setTimeout(function () {
      if (this.hero.currentPlaylist.length > 15) {
        this.myplayer.loadPlaylist({ list: this.hero.currentPlaylist, index: 1 })
        this.myplayer.setLoop(true)
      }
      else
        this.myplayer.loadVideoById(this.hero.currentPlaylist)
      this.myplayer.playVideo();
    }.bind(this), 2000)

  }

  onPlayerStateChange(event) {
    let state = event.target.getPlayerState();
    if(state == 0)
    event.target.playVideo();
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
