import { Component, OnInit } from '@angular/core';
import { SqlService } from '../services/sql.service';
import { info} from '../model/model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit{

  
  company:info[] = []
  
  filtered:info[] = []

  constructor(private sql:SqlService){

  }
  ngOnInit(): void {

  }

  
}
