import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


// Importation des standalone components
import { DetailsComponent } from '../details/details.component';
import { ActionsComponent } from '../actions/actions.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { MediaComponent } from '../media/media.component';
import { CausesComponent } from '../causes/causes.component';
@Component({
  selector: 'app-non-conformity',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, 
  DetailsComponent , ActionsComponent, ParticipantsComponent, MediaComponent, CausesComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MenuPage {
  constructor() { }
  currentTab = 'details'; // Onglet par défaut

  changeTab(event: any) {
    this.currentTab = event.target.value;
  } 

}

