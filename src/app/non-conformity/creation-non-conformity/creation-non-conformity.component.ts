import { Component, OnInit } from '@angular/core';
import {DxPopupModule, DxDataGridModule} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NonConformityService } from 'src/app/services/non-conformity.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-creation-non-conformity',
  templateUrl: './creation-non-conformity.component.html',
  styleUrls: ['./creation-non-conformity.component.scss'],
    standalone: true,
    imports: [DxPopupModule,CommonModule, IonicModule, FormsModule, DxDataGridModule],
})
export class CreationNonConformityComponent  implements OnInit {
  // Variables liées à la popup
  popupVisible = false;

  // Données à afficher dans la popup
  typeLien: string = 'Déclenché(e)';
  private _source: string = '';
  sourceOptions: string[] = [
    'Interne', 'Audit Interne', 'Audit Externe', 'Audit Certification',
    'Objectives', 'Réclamations Clients', 'Contrôles Qualités',
    'Conformité aux exigences', 'Indicateurs', 'Satisfactions Clients',
    'Evaluation Qualité Service', 'Plainte des parties intéressées',
    'Satisfaction des employés', 'Contrôles environnementaux', 'Contrôle Opérationnel',
    'Simulation des situations d\'urgence', 'Contrôles SST', 'Accidents'
  ];
  intitule: string = '';
  commentaires: string = '';
  // Tableau pour stocker les audits
  audits: any[] = [];
  qualityControls: any[] = [];
  displayedData: any[] = [];
  // Variable pour stocker l'enregistrement sélectionné
  selectedRecord: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private nonConformityService: NonConformityService, private toastController: ToastController) { }

  ngOnInit() {
  // Afficher la popup à l'initialisation
    this.popupVisible = true;
    this.source = this.sourceOptions[0];
  }

  // Fermer la popup
  closePopup() {
    this.popupVisible = false;
    this.router.navigate(['/ncList']);
  }

  // Enregistrer les données (à adapter selon ton modèle de données)
  async saveLink() {
    if (this.source !== 'Interne' && (!this.selectedRecord || Object.keys(this.selectedRecord).length === 0)) {
      await this.presentToast('Veuillez choisir un enregistrement avant d’enregistrer.');
      return;
    }
    // Logique d'enregistrement ici (API, stockage local, etc.)
    console.log('Données enregistrées:', {
      typeLien: this.typeLien,
      source: this.source,
      intitule: this.intitule,
      commentaires: this.commentaires
    });

    // Définition des paramètres à passer
    const queryParams: any = { source: this.source, date: new Date().toISOString() };

    if (this.source !== 'Interne' && this.selectedRecord?.reference) {
      queryParams.reference = this.selectedRecord.reference;
      console.log("référence enregistrée");
    }
    this.closePopup();
    // Attendre un court instant pour éviter les conflits d'affichage
    setTimeout(() => {
      this.router.navigate(['/menu'], { queryParams });
    }, 300); // Attente de 300ms (ajustable si nécessaire)
    
  }

  //Charger les audits
  loadAudits() {
    this.displayedData = [];
    if (['Audit Interne', 'Audit Externe', 'Audit Certification'].includes(this.source)) {
      this.nonConformityService.getAudits().subscribe((data: any[]) => {
        // Filtrer les audits en fonction du type sélectionné
        this.displayedData = data.filter(audit => audit.auditNatureStr === this.source);
      });
    } else {
      this.audits = [];
      this.displayedData = [];
    }
  }

  //Charger les controles qualités
  loadQualityControls() {
    this.displayedData = [];
    if (this.source === 'Contrôles Qualités') {
      this.nonConformityService.getQualityControle().subscribe((data: any[]) => {
        this.displayedData = data;
      });
    } else {
      this.qualityControls = [];
      this.displayedData = [];
    }
  }

  // Charger les réclamations clients
  loadCustomerComplaints() {
    this.displayedData = [];
    if (this.source === 'Réclamations Clients') {
      this.nonConformityService.getCustomerComplaints().subscribe((data: any[]) => {
        this.displayedData = data.map(item => ({
          year: item.year,
          reference: item.reference,
          customerDesignation: item.customerDesignation,
          customerTypeFullDesignation: item.customerTypeFullDesignation,
          complaintTypesDesignation: item.complaintProducts?.[0]?.complaintTypesDesignation,
          productReference: item.complaintProducts?.[0]?.productReference,
          designation: item.designation,
          stateStr: item.stateStr,
          date: item.date
        }));
      });
    } else {
      this.displayedData = [];
    }
  }

  //getter et setter pour la source
  get source(): string {
    return this._source;
  }
  set source(value: string) {
    this._source = value;
    this.displayedData = [];
    switch (value) {
      case 'Contrôles Qualités':
        this.loadQualityControls();
        break;
      case 'Réclamations Clients':
        this.loadCustomerComplaints();
        break;
      case 'Audit Interne':
      case 'Audit Externe':
      case 'Audit Certification':
        this.loadAudits();
        break;
      default:
        this.displayedData = [];
    }
  }

  //selecting row method
  selectRecord(event: any) {
    this.selectedRecord = event.data;
  }

  //Toast alert method
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      position: 'bottom', 
      color: 'danger' 
    });
    await toast.present();
  }
  
}
