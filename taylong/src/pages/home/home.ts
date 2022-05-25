import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

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
    private platform: Platform,
    private filePath: FilePath, private file: File
  ) {

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
        case 'kill':
          if (this.myplayer != null)
            this.killPlayer()
          break;
        case 'volume':
          if (this.myplayer != null && platform.is('cordova')) {
            this.myplayer.setVolume(push.data.volume);
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

    if(this.platform.is('cordova'))
    this.fileList();
  }

  fileList() {
    this.file.listDir(this.file.externalDataDirectory, '').then((result) => {
      console.log("this.storageDirectory containnig " + this.file.externalDataDirectory);
      console.log("listing taking place here" + this.file.externalDataDirectory);
      console.log("showing result content" + result);

      // code to print the name of files and folder on console as well as on device screen		

      for (let file of result) {
        if (file.isDirectory == true) {
          console.log("Code if its a folder");
          let name = file.name;
          console.log("File name" + name);
        }
        else if (file.isFile == true) {
          console.log("Code if its a file");
          let name = file.name;
          console.log("File name " + name);
          let path = this.file.externalDataDirectory + name;
          console.log(path);
          file.getMetadata(function (metadata) {
            let size = metadata.size;
            console.log("File size" + size);
          })
        }
      }


      /*result will have an array of file objects with 
      file details or if its a directory:  */
    });
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
        this.myplayer.loadPlaylist({ list: this.hero.currentPlaylist })
        this.myplayer.setLoop(true);
        this.myplayer.setShuffle(true);
      }
      else
        this.myplayer.loadVideoById(this.hero.currentPlaylist)
      this.myplayer.playVideo();
      this.myplayer.setVolume(100);
    }.bind(this), 3000)

  }

  onPlayerStateChange(event) {
    let state = event.target.getPlayerState();
    if (state == 0)
      event.target.playVideo();
  }

  killPlayer() {
    this.myplayer.destroy();
    this.showPlayer = false;
  }

  changePlayerSrc() {
    this.myplayer.destroy();
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
