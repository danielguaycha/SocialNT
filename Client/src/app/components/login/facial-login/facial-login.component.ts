import {Component, NgZone, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {FacialService} from '../../../services/facial.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-facial-login',
  templateUrl: './facial-login.component.html',
  styleUrls: ['./facial-login.component.css']
})
export class FacialLoginComponent implements OnInit, OnDestroy {

  private loginUser;
  private token;
  private imagen;
  private counter;
  private loader;
  // video vars
  private video;
  private track;
  private canvas;

  constructor(private userService: UserService,
              private facialService: FacialService,
              private router: Router,
              private alert: AlertService, private ngZone: NgZone) {
    this.counter = 0;
    this.loader = false;
    if (this.userService.getUser() && this.userService.getToken()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.startUp();
  }

  tieneSoporteUserMedia() {
    return !!(navigator.getUserMedia || ( navigator.mediaDevices.getUserMedia));
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

  startLogin() {
    this.loader = true;
    this.counter = 0;
    this.capturePhoto();
  }

  capturePhoto() {
    this.video.pause();

    const contexto = this.canvas.getContext('2d');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    contexto.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    this.imagen = this.canvas.toDataURL();

    const formData = new FormData();
    formData.append('imagen', this.imagen);
    formData.append('csrfmiddlewaretoken', 'dasdajkshd1273182d87asghduiashdas98d7a98sdhai');

    this.facialService.identify(formData).subscribe(res => {
      if (res !== -1) {
        const hash = res.face_id;
        this.video.remove();
        this.track.getTracks()[0].stop();
        this.login(hash);
      } else {
        if (this.counter < 10) {
          this.capturePhoto();
          this.counter ++;
        } else {
          this.loader = false;
          this.alert.error('Su FaceID no ha sido reconocido');
        }
      }
    }, err => {
        console.log('Error', err);
    });

    this.video.play();
  }

  login(faceId) {
    this.userService.loginFaceId(faceId).subscribe(res => {
      if (res.ok) {
        this.loginUser = res.data.user;
        this.token = res.data.token;

        // guardando datos de sesion
        localStorage.setItem('user', JSON.stringify(this.loginUser));
        localStorage.setItem('token', this.token);
        this.loader = false;
        // this.router.navigate(['/home']);
        this.ngZone.run(() => this.router.navigate(['/home'])).then();
      }

    }, err => {
      console.log(err);
      this.alert.error(err);
      this.loader = false;
    });
  }

  ngOnDestroy(): void {
    if (this.video) {
      this.video.remove();
    }
    if (this.track) {
      this.track.getTracks()[0].stop();
    }
  }
}
