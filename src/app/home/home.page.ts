import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Expense } from './home.model';
import { Capacitor, } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  disabled = true;
  sum: number = 0;
  idcounter: number = -1;
  arr: Expense[] = [];
  uploadedPhoto!: string;
  dateTime = new Date();

  constructor(private alertController: AlertController) {}

  onSubmitExp(form: NgForm) {
    this.idcounter = this.idcounter + 1;

    const e: Expense = {
      id: this.idcounter,
      amount: form.value.amount,
      photo: this.uploadedPhoto,
      datetime: this.dateTime
    };

    this.arr.push(e);

    this.sum = this.arr.reduce((amount, expense) => {
      return amount + expense.amount;
    }, 0);

    this.disabled = true;
    form.reset()
  }

  onDelete(Id: number) {
    this.arr = this.arr.filter(b => b.id !== Id);
    
    this.sum = this.arr.reduce((amount, expense) => {
      return amount + expense.amount;
    }, 0);
  }

  onUploadPhoto() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.uploadedPhoto = image.dataUrl!;
      this.dateTime = new Date();
      this.disabled = false;
    }).catch(error => {
      console.log(error);
    });  
  }

  async onSubmitAll() {
    console.log("Expenses array is...")
    console.log(this.arr);
    console.log("Total amount is...")
    console.log(this.sum);
    const alert = await this.alertController.create({
      header: 'Message',
      subHeader: 'Expenses submitted.',
      message: 'Your expenses have been submitted to the console log for review.',
      buttons: ['OK'],
    });

    await alert.present();
    this.arr = [];
    this.sum = 0;
  }
}