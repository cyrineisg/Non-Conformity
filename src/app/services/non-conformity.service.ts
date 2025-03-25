import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of  } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NonConformity } from '../models/non-conformity';
import { DetailsComponent } from '../non-conformity/details/details.component';
@Injectable({
  providedIn: 'root'
})
export class NonConformityService {
  private baseUrl = 'https://timserver.northeurope.cloudapp.azure.com/QalitasWebApi';
  public non_conformity: NonConformity = new NonConformity();
  
  DetailsComponent: DetailsComponent | undefined;
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode pour générer les headers avec token
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap((token: string | null) => {
        if (!token) {
          console.error("No token found!");
          throw new Error('No token found');
        }
        return of(new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }));
      })
    );
  }

  // Méthode générique pour effectuer une requête GET
  private fetchData(endpoint: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(`${this.baseUrl}/${endpoint}`, { headers }))
    );
  }

  // Appels d'API optimisés
  getAllNC(): Observable<any> { return this.fetchData('api/NonConformities'); }
  getProcessusList(): Observable<any> { return this.fetchData('api/Process'); }
  getNonConformityTypes(): Observable<any> { return this.fetchData('api/Configuration/nonConformityTypes'); }
  getNonConformityCategories(): Observable<any> { return this.fetchData('api/Configuration/nonConformityCategory'); }
  getCommonPriorities(): Observable<any> { return this.fetchData('api/Configuration/commonPriorities'); }
  getIntensities(): Observable<any> { return this.fetchData('api/Configuration/intensities'); }
  getFrequencies(): Observable<any> { return this.fetchData('api/Configuration/frequencies'); }
  getGravities(): Observable<any> { return this.fetchData('api/Configuration/gravities'); }
  getActionTypes(): Observable<any> { return this.fetchData('api/Configuration/actionTypes'); }
  getParticipants(): Observable<any> { return this.fetchData('api/Employees/reduced'); }
  getCauses(): Observable<any> { return this.fetchData('api/Configuration/causesNC'); }
  getAudits(): Observable<any> { return this.fetchData('api/Audits'); }
  getQualityControle(): Observable<any> { return this.fetchData('api/QualityControls'); }
  getCustomerComplaints(): Observable<any> { return this.fetchData('api/CustomerComplaints'); } 
  getNCById(NCId: string): Observable<NonConformity> { return this.fetchData(`api/NonConformities/${NCId}`);}
  // Initialisation de l'audit
  initNonConformity(): Observable<NonConformity> { return this.fetchData('api/NonConformities/init');}
  

  // non conformity creation
  createNonConformity(non_conformity: NonConformity): Observable<NonConformity> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post<NonConformity>(`${this.baseUrl}/api/NonConformities`, non_conformity, { headers })
      )
    );    
  }
}
