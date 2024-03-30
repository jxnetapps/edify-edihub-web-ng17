import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarketingMaterialModel } from '../../_models';
import { JxHttpService } from 'jx-ng-core';

@Component({
  selector: 'edify-material-view',
  templateUrl: './material-view.component.html',
  styleUrls: ['./material-view.component.scss']
})
export class MaterialViewComponent  implements OnInit, OnDestroy {
	// Public properties
	materialModel: MarketingMaterialModel = new MarketingMaterialModel;

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _appHttp: JxHttpService) { }

	ngOnInit() {
		const componentSubscriptions = this.activatedRoute.params
		.subscribe((params: any) => {
			const id = params['id'];
			if (id) {
				this._appHttp.getHttp$<MarketingMaterialModel>(`/v1/marketing/materials/${id}`, true)
					.then(
						(response: MarketingMaterialModel) => {
							if (response) {
								this.materialModel = response;
								this.cdr.detectChanges();
							}
						}).finally(() => {
						});
			}
		});
		this.subscriptions.push(componentSubscriptions);
	}

	backToList() {
    this.router.navigate(['/edi-mart/manage-materials'])
	}

	getTitle(): string {
		return `View details`;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
}
