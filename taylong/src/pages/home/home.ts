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
declare var window: any;
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


  ///////////////////////Local Files
  
  localVideoPlayer

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
        case 'localModeSwitch':
          setTimeout(() => {
            if (this.hero.isLocalMode) {
              this.killPlayer();
              this.localVideoPlayer = document.getElementById('localPlayer') as HTMLVideoElement;
            }
          }, 1000);
          break;
        case 'local_play':
          if (this.localVideoPlayer != null)
            this.localVideoPlayer.play()
          break;
        case 'local_pause':
          if (this.localVideoPlayer != null)
            this.localVideoPlayer.pause()
          break;
        case 'local_shuffle':
          this.shuffleLocalPlaylist()
          break;
        case 'local_startwith_index':
          this.shuffleLocalPlaylistByIndex(push.data.index)
          break;
        case 'local_volume':
          if (this.localVideoPlayer != null)
          this.localVideoPlayer.volume = push.data.volume
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
      if (!this.hero.isLocalMode)
        this.setupPlayer();
    });
    this.watchoutNetwork();
    // this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]
    if (this.platform.is('cordova'))
      this.fileList();
  }

  fileList() {
    try {
      let basePath
      if (this.file.externalRootDirectory.endsWith('/'))
        basePath = this.file.externalRootDirectory.slice(0, -1)
      let roothPath = basePath + "/Download/"
      let fullPath = basePath + "/Download/cocomelon/"
      this.file.listDir(roothPath, "cocomelon").then((result) => {
        for (let file of result) {
          if (file.isDirectory == true) {
            // console.log("Code if its a folder");
            let name = file.name;
            console.log("Folder name " + name);
          }
          else if (file.isFile == true) {
            // console.log("Code if its a file");
            let name = file.name;
            this.hero.listOfLocalFileNames.push(name);
            let path = fullPath + name;
            this.hero.listOfLocalFiles.push(window.Ionic.WebView.convertFileSrc(path))
          }
        }
        console.log(this.hero.listOfLocalFiles)
        this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]
      }).catch(err => {
        console.log('Get Dir Error: ', err)
      });
    } catch (error) {
      console.log(error)
    }


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
    if (!this.hero.isLocalMode) {
      this.myplayer.destroy();
      this.showPlayer = false;
      setTimeout(function () {

        this.setupPlayer();
      }.bind(this), 1000);
    }
  }
  openSetting() {
    this.settingModal = this.popCtrl.create(SettingPage, {}, {
      showBackdrop: true,
      enableBackdropDismiss: false
    });
    this.settingModal.present({
    });
  }

  //////////////////////////////////////////Local Player

  localVideoEnded() {
    // console.log('video has ended')
    this.getLocalSrc();
  }
  getLocalSrc() {
    if (this.hero.currentPlayingLocalFileIndex == this.hero.listOfLocalFiles.length - 1) {
      this.hero.currentPlayingLocalFileIndex = 0;
      this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]
    }
    else {
      this.hero.currentPlayingLocalFileIndex++;
      this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]
    }
    this.localVideoPlayer.play();
  }
  shuffleLocalPlaylistByIndex(index) {
    let savedName = this.hero.listOfLocalFileNames[index].split('').join('');
    this.shuffle(this.hero.listOfLocalFileNames, this.hero.listOfLocalFiles)
    let newIndex
    this.hero.listOfLocalFileNames.forEach((element, index) => { 
      if(element==savedName)
      newIndex = index;
    })

    this.hero.listOfLocalFileNames = this.moveItem(this.hero.listOfLocalFileNames, newIndex, 0);
    this.hero.listOfLocalFiles = this.moveItem(this.hero.listOfLocalFiles, newIndex, 0)

    this.hero.currentPlayingLocalFileIndex = 0;
    this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]

  }
  moveItem(arr, fromIndex, toIndex) {
    let itemRemoved = arr.splice(fromIndex, 1) // assign the removed item as an array
    arr.splice(toIndex, 0, itemRemoved[0]) // insert itemRemoved into the target index
    return arr
  }

  shuffleLocalPlaylist() {
    this.shuffle(this.hero.listOfLocalFileNames, this.hero.listOfLocalFiles)
    this.hero.currentPlayingLocalFileIndex = 0;
    this.hero.currentLocalPlayerLink = this.hero.listOfLocalFiles[this.hero.currentPlayingLocalFileIndex]
  }
  shuffle(obj1, obj2) {
    var index = obj1.length;
    var rnd, tmp1, tmp2;
    while (index) {
      rnd = Math.floor(Math.random() * index);
      index -= 1;
      tmp1 = obj1[index];
      tmp2 = obj2[index];
      obj1[index] = obj1[rnd];
      obj2[index] = obj2[rnd];
      obj1[rnd] = tmp1;
      obj2[rnd] = tmp2;
    }
  }

}
