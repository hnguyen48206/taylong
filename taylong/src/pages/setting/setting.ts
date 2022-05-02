import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
import { AlertController } from 'ionic-angular';

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
  currentVolume = 1.0;
  constructor(public alertCtrl: AlertController, private storage: Storage, private platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public hero: GlobalHeroProvider) {
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
  }
  triggerEvent(event) {
    console.log(event)
    let data = {}
    if (event == 'volume')
      data = { volume: this.currentVolume }
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

}
