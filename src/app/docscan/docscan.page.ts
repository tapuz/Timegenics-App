import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo, PhotoService } from '../services/photo.service';
import { Observable } from 'rxjs';
//import { map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as Config from '../config';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-docscan',
  templateUrl: './docscan.page.html',
  styleUrls: ['./docscan.page.scss'],
})
export class DocscanPage implements OnInit {
  activePatient: any;
  patientName: string;
  patientID :any;
  data:Observable<any>;

  constructor(private http:HttpClient, 
              public photoService: PhotoService, 
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private storage: Storage
              ) {}

  async ngOnInit() {
    await this.photoService.reset();
    this.storage.get('user').then((val) => {
      this.getActivePatient(val);
      
      
    });
    
  }



  getActivePatient(email){
    console.log('this is the email: ' + email);
    console.log('getting the patient');
    console.log(Config.TIMEGENICS_API + '?task=getActivePatient&userEmail='+email);
    this.data = this.http.get(Config.TIMEGENICS_API + '?task=getActivePatient&userEmail='+email);
    this.data.subscribe(data => {
    this.activePatient = data;
    console.log(this.activePatient);
    this.patientName = data.patient_surname + ' ' + data.patient_firstname;
    this.photoService.patientID = data.patient_id;
    console.log(data.patient_id + ' is the ids');
    console.log(this.patientName);
    
},(error: any) => {
  this.presentAlert('Could not connect to Timegenics. Check your internet connection');
});

}

refreshActivePatient(refresher) {
  this.data.subscribe(data => {
    this.activePatient = data;
      this.patientName = data.patient_surname + ' ' + data.patient_firstname;
      this.photoService.patientID = data.patient_id;
      //clear the pictures
      this.photoService.pictures = [];
      //this.footermsg= 'system ready..';
      refresher.target.complete();
      
  },(error: any) => {
    this.presentAlert('Could not connect to Timegenics. Check your internet connection');
    refresher.target.complete();
  });
  
}

async presentAlert(msg) {
  const alert = await this.alertController.create({
    message: msg,
    buttons: ['OK'],
  })
  alert.present();
}

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Delete photo?',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

  
}
