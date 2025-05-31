import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { LocationService, Location } from '../../services/location.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  locations: Location[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.getLocations()
      .subscribe(data => this.locations = data);
  }
}
