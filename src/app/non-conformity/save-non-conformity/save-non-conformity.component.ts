import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonConformityService } from 'src/app/services/non-conformity.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-save-non-conformity',
  templateUrl: './save-non-conformity.component.html',
  styleUrls: ['./save-non-conformity.component.scss'],
  standalone:true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class SaveNonConformityComponent  implements OnInit {
  NCId: string | null = null;
  constructor(private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private NCservice: NonConformityService) { }

  ngOnInit() {
    this.NCId = this.route.snapshot.paramMap.get('NCId');
  }

  //Method to save the non conformity 
  saveNonConformity (){
    const formattedDate = this.datePipe.transform(this.NCservice.non_conformity.detectionDate, "yyyy-MM-dd'T'HH:mm:ss");
    this.NCservice.non_conformity.detectionDate = formattedDate ? new Date(formattedDate) : null;

    const formattedAnalysisDateP = this.datePipe.transform(this.NCservice.non_conformity.analysisDateP, "yyyy-MM-dd'T'HH:mm:ss");
    this.NCservice.non_conformity.analysisDateP = formattedAnalysisDateP ? new Date(formattedAnalysisDateP) : null;
    
    const formattedAnalysisDateR = this.datePipe.transform(this.NCservice.non_conformity.analysisDateR, "yyyy-MM-dd'T'HH:mm:ss");
    this.NCservice.non_conformity.analysisDateR = formattedAnalysisDateR ? new Date(formattedAnalysisDateR) : null;

    if(this.NCservice.DetailsComponent ) {
      return;
    }
    
    if (!this.NCId) {
      // Non conformity creation case
      this.NCservice.createNonConformity(this.NCservice.non_conformity).subscribe(
        data => {
          if (data) {
            console.log("Non conformity added successfully.");
            this.NCservice.initNonConformity();
            this.router.navigate(["ncList"]);
          }
        },
        error => {
          console.error("Error saving non conformity:", error);
        }
      );
    }
  }

}
