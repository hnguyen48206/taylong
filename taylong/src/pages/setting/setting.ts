import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { GlobalHeroProvider } from '../../providers/global-hero/global-hero';
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
  constructor(private storage:Storage,private platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public hero: GlobalHeroProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewDidEnter() {
    this.hero.settingSubject.next('Đã vào setting')
    this.playlist = this.hero.currentPlaylist
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

  saveSetting()
  {
    if(this.playlist!=this.hero.currentPlaylist)
    {
      console.log('Playlist changed')
      this.hero.currentPlaylist = this.playlist;
      this.storage.set('playlist', this.hero.currentPlaylist)
    }
  }
  triggerEvent(event)
  { 
    console.log(event)
    this.hero.settingSubject.next({
      action:event,
      data:{}
    })
  }

}
