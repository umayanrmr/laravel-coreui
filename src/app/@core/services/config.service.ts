import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mapTo, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _configuration_loading = new BehaviorSubject<boolean>(false);
  public configuration_loading$ = this._configuration_loading.asObservable();

  public get configurationLoading() {
    return this._configuration_loading.getValue();
  }
  
  constructor() {
  }

  public load_application_configuration(force_refresh = false): Observable<boolean> {
    this._configuration_loading.next(true);
    return of([]).pipe(
              take(1),
              mapTo(true),
              tap(x => {
                this._configuration_loading.next(false);
              })
            );
    // return forkJoin([
    //         this._vaccinee_service.data_needed_by_map_to_ui(force_refresh),
    //         this._role_service.get_all(force_refresh),
    //         this._vaccination_site_service.get_all(force_refresh),
    //         this._region_service.get_all(force_refresh),
    //         this._municipality_service.get_all(force_refresh),
    //         this._province_service.get_all(force_refresh),
    //         this._ethnicity_service.get_all(force_refresh),
    //         this._adverse_event.get_all(force_refresh),
    //         this._dose_service.get_all(force_refresh),
    //         this._screening_service.get_all(force_refresh),
    //         this._screening_service.get_all(force_refresh),
    //         this._consent_service.get_all(force_refresh)
    //       ])
    //       .pipe(
    //         take(1),
    //         mapTo(true),
    //         tap(x => {
    //           this._configuration_loading.next(false);
    //         })
    //       )
  }
}
