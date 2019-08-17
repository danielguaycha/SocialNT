import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FacialService} from '../../../services/facial.service';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-face-register',
  templateUrl: './face-register.component.html',
  styleUrls: ['./face-register.component.css']
})
export class FaceRegisterComponent implements OnInit, OnDestroy {
  private video;
  private canvas;
  private auth;
  private loader;
  private message;
  private track;
  private showVideo;
  private oldHash;
  private newHash;
  constructor(private userService: UserService, private facialService: FacialService,
              private alert: AlertService,
              private router: Router ) {
    this.auth = userService.getUser();
    this.loader = false;
    this.message = 'Espere';
    this.showVideo = false;
  }

  tieneSoporteUserMedia() {
    return !!(navigator.getUserMedia || ( navigator.mediaDevices.getUserMedia));
  }

  ngOnInit() {
      this.loadHash();
      this.startUp();
  }

  loadHash() {
      this.userService.getHash().subscribe(res => {
          if (res.ok) {
              this.oldHash = res.oldHash;
              this.newHash = res.newHash;
          }
      }, err => console.log(err));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startUp() {
    if (this.tieneSoporteUserMedia()) {
      navigator.getUserMedia({video: true}, stream => {
          this.canvas = document.getElementById('canvas');
          this.video = document.querySelector('video');
          this.video.srcObject = stream;
          if (!this.track) { this.track = stream; }
          this.video.play();
      }, error => {
        console.log(error);
      } );
    }
  }

  async capturePhotos() {
    const formData = new FormData();
    this.loader = true;
    for (let i = 0; i < 100; i++) {
      await this.sleep(100);
      this.video.pause();
      const contexto = this.canvas.getContext('2d');
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      contexto.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      const img = contexto.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data2 = img.data;

      for (let j = 0; j < data2.length; j += 4) {
        const grayscale = 0.33 * data2[j] + 0.5 * data2[j + 1] + 0.15 * data2[j + 2];
        data2[j] = grayscale;
        data2[j + 1] = grayscale;
        data2[j + 2] = grayscale;
      }
      contexto.putImageData(img, 0, 0);
      formData.append('foto' + i, this.canvas.toDataURL());

      await this.video.play();
      this.message = `Capturando patrón del rostro ${i}%`;
    }

    this.video.remove();
    this.track.getTracks()[0].stop();
    this.showVideo = false;

    formData.append('id', this.newHash);
    formData.append('face_data', this.oldHash);
    formData.append('csrfmiddlewaretoken', 'eqweuqoiweuqowe219832198hhwqey8audahsida9823198231gadasd');

    this.message = 'Validando y guardando información, Espere...';
    this.facialService.registerPhotos(formData).subscribe(res => {
      if (res.ok === true) {
          this.userService.updateHash(this.newHash).subscribe();
          this.router.navigate(['/profile/config']);
          this.alert.success('Su registro facial ha sido agregado con éxito, ' +
              'ya puede iniciar sesión con su rostro');
      }
      console.log(res);
      this.loader = false;
    }, err => console.log(err));
  }

  ngOnDestroy(): void {
    this.video.remove();
    this.track.getTracks()[0].stop();
  }
}
