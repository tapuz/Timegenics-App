import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as Config from '../config';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  data:Observable<any>;
  activePatient: any;
  
  constructor(private http:HttpClient,public alertController: AlertController) { }

  async getActivePatient(email){
    console.log('this is the email: ' + email);
    console.log('getting the patient');
    console.log(Config.TIMEGENICS_API + '?task=getActivePatient&userEmail='+email);
    this.data = this.http.get(Config.TIMEGENICS_API + '?task=getActivePatient&userEmail='+email);
    this.data.subscribe(data => {
    return data;   
    
},(error: any) => {
  this.presentAlert('Could not connect to Timegenics. Check your internet connection');
});

}



async presentAlert(msg) {
  const alert = await this.alertController.create({
    message: msg,
    buttons: ['OK'],
  })
  alert.present();
}


}
