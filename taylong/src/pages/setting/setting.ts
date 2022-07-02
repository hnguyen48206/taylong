import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

declare var cordova: any;
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  playlist
  currentVolume = 100;
  constructor(private toast: ToastController, public alertCtrl: AlertController, private storage: Storage, private platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public hero: GlobalHeroProvider) {
  }

  toogleChanged(e) {
    console.log(this.hero.isLocalMode)
    if (this.hero.isLocalMode) {
      this.currentVolume=10
      this.triggerEvent('kill');
      this.triggerEvent('localModeSwitch');
    }
    else {
      this.currentVolume=100
      this.triggerEvent('refresh');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewDidEnter() {
    this.hero.settingSubject.next('Đã vào setting')
    this.playlist = this.hero.currentPlaylist;
    if (this.platform.is('cordova'))
      this.currentVolume = cordova.VolumeControl.getVolume();
  }

  closeSetting() {
    this.triggerEvent('closeSetting');
    this.viewCtrl.dismiss();
  }

  openSystemSetting() {
    if (this.platform.is('cordova'))
      cordova.plugins.settings.open("wifi", function () {
        console.log('opened settings');
      },
        function () {
          console.log('failed to open settings');
        })
  }

  saveSetting() {
    if (this.playlist != this.hero.currentPlaylist) {
      console.log('Playlist changed')
      this.hero.currentPlaylist = this.playlist;
      this.storage.set('playlist', this.hero.currentPlaylist)
    }
    this.presentToast('Đã lưu playlist mới.')
  }

  triggerEvent(event) {
    console.log(event)
    let data = {}
    if (event == 'volume')
      data = { volume: this.currentVolume }
    if (event == 'local_volume')
      data = { volume: this.currentVolume/10 }
    if (event.startsWith('local_startwith_')) {
      let parts = event.split('_')
      let index = parts[parts.length - 1]
      data = { index: index }
      event = 'local_startwith_index'
    }
    this.hero.settingSubject.next({
      action: event,
      data: data
    })
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Thông báo',
      message: "Bạn có chắc muốn thoát khỏi chế độ kiosk và quay về trạng thái tablet bình thường hay không?",
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Có',
          role: 'cancel',
          handler: data => {
            if (this.platform.is('cordova')) {
              this.exitKioskMode();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  exitKioskMode() {
    cordova.plugins.settings.open("home", function () {
      console.log('opened settings');
    },
      function () {
        console.log('failed to open settings');
      })
  }

  focusFunction() {
    console.log('focus input')
    let container = document.getElementById('setting-main-container') as HTMLElement;
    let videoID = document.getElementById('videoID') as HTMLElement;
    container.scrollTop = videoID.offsetTop
  }

  outFocusFunction() {
    console.log('focus output')
  }

  presentToast(msg) {
    let inform = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    inform.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    inform.present();
  }


  localVideoSelected(index) {
    console.log(index)
    this.triggerEvent('local_startwith_' + index);
  }
}
