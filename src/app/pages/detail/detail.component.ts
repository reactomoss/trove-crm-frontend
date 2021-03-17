import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToList() {
    this.router.navigate(['/pages/leads']);
  }

  addAppoint() {
    console.log('add appoint')
  }

  addTask() {
    console.log('add task')
  }
}
