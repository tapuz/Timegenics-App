import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { FileTransfer,FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import * as Config from '../config';
import { LoadingController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const {Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";
  private platform: Platform;
  public patientID:any;
  private base64Image:any;
  public pictures=[];
  public loading:any;


  constructor(public loadingController: LoadingController,private camera: Camera,platform: Platform, private transfer: FileTransfer ) {
    this.platform = platform;
    

   }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
        });
      
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  /* Use the device camera to take a photo:
  // https://capacitor.ionicframework.com/docs/apis/camera
  
  // Store the photo data into permanent file storage:
  // https://capacitor.ionicframework.com/docs/apis/filesystem
  
  // Store a reference to all photo filepaths using Storage API:
  // https://capacitor.ionicframework.com/docs/apis/storage
  */

  public async takePicture(){
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
      
      //this.uploadPicture();
      
    }, (err) => {
      // Handle error
    });
  }

  public async addNewToGallery() {
    // Take a photo
    
    
    //const savedImageFile = await this.savePicture(capturedPhoto);
    
    // Add new photo to Photos array
    //this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    //Storage.set({
    //  key: this.PHOTO_STORAGE,
    //  value: JSON.stringify(this.photos)
    //});
  }

  // Save picture to file on device
  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's 
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  async uploadPictures(){
    
    //Show loading
    //let loader = this.loadingCtrl.create({
     // content: "Uploading..."
    //});
    // this.footermsg = "Uploading.."
    //loader.present();
    //var patientID = 3;

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Uploading...',
      
    });
    

    
    //option transfer
    
    this.pictures.forEach((picture, index) => {
      console.log("THIS IS THE INDEX!!" + index); // 0, 1, 2
      this.loading.present();
      //random int
      let random = Math.random().toString(36).substring(7);
    
      let options: FileUploadOptions = {
        fileKey: 'photo',
        fileName: this.patientID + "_" + random + ".jpg",
        chunkedMode: false,
        httpMethod: 'post',
        mimeType: "image/jpeg",
        headers: {},
        params:{'patientID':this.patientID,'tag':'camera'}
      }

      //const base64Data = await this.readAsBase64(foto);
      //file transfer action
      
      fileTransfer.onProgress((progressEvent) => {
              //console.log(progressEvent);
              
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          
          //this.footermsg = "Uploading " + perc + "%";
          //console.log(perc);
          //if (perc == 100) {this.loading.dismiss();}
          //this.progress = perc;
          
          });

      
      fileTransfer.upload(picture, Config.TIMEGENICS_API + '?task=upload_image', options)
        .then((data) => {
          //alert("Success");
          console.log('done');
          this.loading.dismiss();
          if (index==0) { this.pictures = [];}//the was the last picture... delete all local files
          
          //this.footermsg = "Upload done..."
          //loader.dismiss();
          //this.presentAlert('Upload done');
        }, (err) => {
          console.log(err.code);
          //alert("Error");

          //loader.dismiss();
        });
      });
    //console.log('all files uploaded');
    //this.loading.dismiss();
    
  }


  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;  
    }
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: Photo, position: number) {
    // Remove this photo from the pictures reference data array
    this.pictures.splice(position, 1);
    console.log("DELETING POS " + position );
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  
 
}


export interface Photo {
  filepath: string;
  webviewPath: string;
}

