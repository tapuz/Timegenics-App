import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer,FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import * as Config from '../config';

@Component({
  selector: 'app-docscan',
  templateUrl: './docscan.page.html',
  styleUrls: ['./docscan.page.scss'],
})
export class DocscanPage implements OnInit {
  base64Image:any;
  myphoto:any;
  pictures=[];
  patientID:any;
  footermsg = "system ready..";
  activePatient: any;
  patientName: string;
  //data:Observable<any>;

  constructor(private camera: Camera,private transfer: FileTransfer) { }

  ngOnInit() {
  }

  takePhoto(){
    //check if patientID was entered
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:false,
      targetWidth:1000,
      allowEdit:false,
      correctOrientation:true
    }

    this.camera.getPicture(options).then((imageData) => { 
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      //push picture to array
      this.pictures.push(this.base64Image);
      this.pictures.reverse();
      //upload the photo
      
      this.uploadPicture();
      
    }, (err) => {
      // Handle error
    });
  }

  uploadPicture(){
    //Show loading
    //let loader = this.loadingCtrl.create({
     // content: "Uploading..."
    //});
    // this.footermsg = "Uploading.."
    //loader.present();
    //var patientID = 3;

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    //random int
    let random = Math.random().toString(36).substring(7);

    this.patientID = 12722;
    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: this.patientID + "_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {},
      params:{'patientID':this.patientID,'tag':'doc'}
    }

    //const base64Data = await this.readAsBase64(foto);
    //file transfer action
    
    fileTransfer.onProgress((progressEvent) => {
		      	//console.log(progressEvent);
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        //this.footermsg = "Uploading " + perc + "%";
        console.log(perc);
        //if (perc == 100) {loader.dismiss();}
				//this.progress = perc;
		    });
    
    //console.log('here is the file' + theString);
    
    fileTransfer.upload(this.base64Image, Config.TIMEGENICS_API + '?task=upload_image', options)
      .then((data) => {
        //alert("Success");
        console.log('done');
        //this.footermsg = "Upload done..."
        //loader.dismiss();
        //this.presentAlert('Upload done');
      }, (err) => {
        console.log(err.code);
        //alert("Error");

        //loader.dismiss();
      });
    
  }

}
