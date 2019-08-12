import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Config } from 'src/app/services/config';
import { AlertService } from 'src/app/services/alert.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styles: [],
  providers: [ UserService ]
})
export class ProfileConfigComponent implements OnInit {
  public user;
  public url;
  public imgFile;
  public imgUrl;
  public passwords: any;
  public message: string;
  public type: string;
  public auth;
  constructor(private userService: UserService, private alerService: AlertService) {
    this.auth = userService.getUser();
    this.user = new User('', '', '', '', '', '', '');
    this.url = Config.avatar;
    this.passwords = {};
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
      const userId = this.userService.getUser().id;
      this.userService.findById(userId).subscribe(res => {
        console.log(res);
        if (res.ok) {
          this.user = res.user;
          console.log(this.user);
        }
     }, err => {
        console.log(err);
     });
  }

  preview(event) {
    if (event.target.files.length === 0) {
      return;
    }
    this.imgFile = event.target.files[0];
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ($event) => {
      this.imgUrl = reader.result;
    };
    this.updateAvatar();
  }

  updateAvatar() {

    const formData = new FormData();
    formData.append('file', this.imgFile);

    this.userService.updateAvatar(formData).subscribe(res => {
      if (res.ok) {
        if (res.uploads.fileName) {
          this.alerService.success('Avatar Actualizado con éxito');
          this.auth.avatar = res.uploads.fileName;
          localStorage.setItem('user', JSON.stringify(this.auth));
        }
      }
    }, err => {
      console.log(err);
    });
  }


  // envia el formulario emvia el formulario de actualizacion
  onSubmit() {
    this.userService.updateUser(this.user).subscribe(res => {
      if (res.ok) {
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          this.alerService.success('Datos actualizados con exito');
        }
      }
    }, err => {
      console.log(err);
    });
  }

  // envia el formulario de contraseña

  onSubmitPw() {
    this.userService.updatePassword(this.passwords).subscribe(res => {
     if (res.ok) {
        this.message = res.message;
        this.type = 'success';
        // $('#exampleModal').modal('hide')
     }
    }, err => {
      this.message = (err);
      this.type = 'danger';
    });
  }

}
