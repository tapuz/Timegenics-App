import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, StatusBarStyle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform
    
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const { SplashScreen, StatusBar } = Plugins;
    if (this.platform.is('hybrid')) {
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
    }
  }
  // initializeApp() {
  //  this.platform.ready().then(() => {
  //    this.statusBar.styleDefault();
  //    this.splashScreen.hide();
  //  });
  //}
}
