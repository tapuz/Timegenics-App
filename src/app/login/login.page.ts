import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any;
  
  constructor(private storage: Storage,private router: Router) { 
  
  this.storage.get('user').then((val) => {
    this.user = val;
    console.log('Your user is ', val);
    
  });
  }

  ngOnInit() {
    
  }

  login() {
    this.storage.set('user', this.user);
    console.log( "USER IS NEW  " + this.user);
    this.router.navigate(['/home'])
    //

  }

}
