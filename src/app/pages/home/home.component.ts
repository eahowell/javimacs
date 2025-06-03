import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LocationsComponent } from '../../locations/locations.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, LocationsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{}
