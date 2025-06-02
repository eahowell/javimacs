import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LocationService, Location } from '../../services/location.service';
import { LocationsComponent } from '../../locations/locations.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, LocationsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{}
// export class HomeComponent implements OnInit {
//   locations: Location[] = [];

//   constructor(private locationService: LocationService) {}

//   ngOnInit(): void {
//     this.locationService.getLocations()
//       .subscribe(data => this.locations = data);
//   }
// }
