import { Component, OnInit, Input} from '@angular/core';
import { NConformityMenuService } from 'src/app/services/nconformity-menu.service';
import { NonConformityService } from 'src/app/services/non-conformity.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {  DxHtmlEditorModule } from 'devextreme-angular';
import { NonConformity } from 'src/app/models/non-conformity';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SaveNonConformityComponent } from '../save-non-conformity/save-non-conformity.component';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,  DxHtmlEditorModule, ReactiveFormsModule, DatePipe],
  providers: [DatePipe]
})
export class DetailsComponent  implements OnInit {
  @Input() nature: string = 'Réelle'; // Valeur par défaut
  detailsForm!: FormGroup;
  showSecondPart = false
  processusList: any[] = []; 
  nonConformityTypes: any[] = [];  
  nonConformityCategories: any[] = [];
  commonPriorities: any[] = []; 
  intensities: any[] = [];
  frequencies: any[] = []; 
  gravities: any[] = []; 
  servicesList: any[] = [];
  isModified: boolean = false;
  NCId: string | null = null;

  //Constructor 
  constructor(private NcService: NConformityMenuService,
              private fb: FormBuilder,
              private nonConformityService : NonConformityService,
              private datePipe: DatePipe,
              private navigationService : NavigationService,
              private router: Router,
              private route: ActivatedRoute,
              )  { }

  ngOnInit() {
    this.NCId = this.route.snapshot.paramMap.get('NCId');
    this.detailsForm = this.fb.group({
      title: [''],
      description: [''],
      nature: ['Réelle'],
      source: [''],
      processus: [''],
      service: [''],
      intitule: [''],
      exigences: [''],
      q: [false],
      s: [false],
      e: [false],
      sda: [false],
      detectionDate: [''],
      type: [''],
      categorie: [''],
      priorite: [''],
      intensite: [''],
      frequence: [''],
      gravite: [''],
      risques: [''],
      opportunites: ['']
   });

   // Récupérer les données et remplir le formulaire
   if (this.NCId) {
    this.getNCData(this.NCId);
    } else {
    this.initializeNonConformity();
    }
   
    // Restore saved data if exists
    const savedData = this.NcService.getNCData();
    if (savedData) {
    this.detailsForm.patchValue(savedData);
    }

    // Appeler le service pour récupérer la liste des processus
    this.nonConformityService.getProcessusList().subscribe(
      (data: any[]) => {
        this.processusList = data;  // Stocke les données récupérées dans la variable
        console.log('Processus List:', this.processusList);  // Vous pouvez également ajouter un log pour vérifier les données
      },
      (error) => {
        console.error('Error fetching processus list:', error);
      }
    );

      // Appeler le service pour récupérer les types de non-conformité
      this.nonConformityService.getNonConformityTypes().subscribe(
        (data) => {
          console.log('Non Conformity Types:', data);
          this.nonConformityTypes = data;  // Assigner les types au tableau
        },
        (error) => {
          console.error('Error fetching non-conformity types:', error);
        }
      );
    
        // Appeler le service pour récupérer les catégories de non-conformité
        this.nonConformityService.getNonConformityCategories().subscribe(
          (data) => {
            console.log('Non Conformity Categories:', data);
            this.nonConformityCategories = data;  // Assigner les catégories au tableau
          },
          (error) => {
            console.error('Error fetching non-conformity categories:', error);
          }
        );
      
        // Appeler le service pour récupérer les priorités 
        this.nonConformityService.getCommonPriorities().subscribe(
          (data) => {
            console.log('Common Priorities:', data);
            this.commonPriorities = data;  // Assigner les priorités au tableau
          },
          (error) => {
            console.error('Error fetching common priorities:', error);
          }
        );

        //Appeler le service pour récupérer les intensités
        this.nonConformityService.getIntensities().subscribe(
          (data) => {
            console.log('intensities:', data);
            this.intensities = data;  // Assigner les priorités au tableau
          },
          (error) => {
            console.error('Error fetching intensities:', error);
          }
        );

        //Appeler le service pour récupérer les fréquences
        this.nonConformityService.getFrequencies().subscribe(
          (data) => {
            console.log('frequencies:', data);
            this.frequencies = data;  // Assigner les priorités au tableau
          },
          (error) => {
            console.error('Error fetching frequencies:', error);
          }
        );
  
        //Appeler le service pour récupérer les gravités
        this.nonConformityService.getGravities().subscribe(
          (data) => {
            console.log('gravities:', data);
            this.gravities = data;  // Assigner les priorités au tableau
          },
          (error) => {
            console.error('Error fetching gravities:', error);
          }
        );

  }
  //initializing non conformity
  initializeNonConformity() {
    this.nonConformityService.initNonConformity().subscribe((data) => {
      if (data) {
        this.formatNonConformityDates(data);
        this.nonConformityService.non_conformity = data;
        this.isModified = false;

        // Remplir le formulaire avec les données reçues
        this.detailsForm.patchValue({
          description: data.description || '',
          nature: data.nature || 'Réelle',
          source: data.source || '',
          processus: data.processDesignation || '',
          service: data.serviceDesignation || '',
          intitule: data.designation || '',
          exigences: data.requirement || '',
          q: data.q ?? false,
          s: data.s ?? false,
          e: data.e ?? false,
          h: data.h ?? false,
          detectionDate: data.detectionDate || '',
          type: data.typesDesignation || '',
          categorie: data.categoryDesignation || '',
          priorite: data.priorityDesignation || '',
          intensite: data.intensityDesignation || '',
          frequence: data.frequencyDesignation || '',
          gravite: data.gravityDesignation || '',
          risques: data.nonConformityRiskOpps || '',
          opportunites: data.nonConformityRiskOpps || ''
        });
      }
    });
  }

  formatNonConformityDates(non_conformity: NonConformity) {
   non_conformity.nonConformityAnalysis = non_conformity.nonConformityAnalysis || [];
    non_conformity.nonConformityCorrections = non_conformity.nonConformityCorrections || [];
    non_conformity.nonConformityFiles = non_conformity.nonConformityFiles || [];
    non_conformity.nonConformityParticipants = non_conformity.nonConformityParticipants || [];
    non_conformity.nonConformityLinks = non_conformity.nonConformityLinks || [];
    non_conformity.actionsList = non_conformity.actionsList || [];
    non_conformity.triggerLink = non_conformity.triggerLink || [];
    non_conformity.nonConformityDocuments = non_conformity.nonConformityDocuments || [];

    non_conformity.nonConformityExternalDocuments = non_conformity.nonConformityExternalDocuments || [];
    non_conformity.nonConformityChapters = non_conformity.nonConformityChapters || [];
    non_conformity.nonConformityProducts = non_conformity.nonConformityProducts || [];
    non_conformity.nonConformityRiskOpps = non_conformity.nonConformityRiskOpps || [];  
  }

  //saving infos
  saveTempData() {
    this.NcService.setNCData(this.detailsForm.value);
  }

  //Méthode pour afficher la deuxième partie de non conformity details
  next() {
    this.showSecondPart = true;
  }

  //Go back
  goBack() {
    this.navigationService.goBack();
  }

  //Getting non conformity data
  getNCData(NCId: string) {
    this.nonConformityService.getNCById(NCId).subscribe((data) => {
      if (data) {
        this.formatNonConformityDates(data);
        this.nonConformityService.non_conformity = data;
        this.isModified = false;
      }
    });
  }



  
}
