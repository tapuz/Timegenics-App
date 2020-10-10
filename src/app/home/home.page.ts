import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;

  constructor(private storage: Storage) {
    this.storage.get('user').then((val) => {
      this.user = val;
      console.log('Your user is ', val);
      
    });
  }

}
