import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GlobalHeroProvider } from '../providers/global-hero/global-hero';
import { IonicStorageModule } from '@ionic/storage';
import { SettingPage } from '../pages/setting/setting';
import { Keyboard } from '@ionic-native/keyboard';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { AccordionModule } from 'ngx-accordion';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
    mode: 'ios'
   }),
    IonicStorageModule.forRoot(),
    AccordionModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingPage
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalHeroProvider,
    FilePath,
    File
  ]
})
export class AppModule {}
