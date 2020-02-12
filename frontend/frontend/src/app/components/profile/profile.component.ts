import { Component, OnInit } from '@angular/core';
import { Singup } from 'src/app/auth/singup';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  id:number;
  user: Singup;

  constructor() { }

  ngOnInit() {
  

}
}
