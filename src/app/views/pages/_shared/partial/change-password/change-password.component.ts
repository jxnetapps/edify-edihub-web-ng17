// Angular
import { Component, OnInit, Input } from "@angular/core";
import {
	AbstractControl,
	Validators,
	FormBuilder,
	ValidationErrors,
	ValidatorFn,
} from "@angular/forms";
import { FormGroup } from "@angular/forms";
// RxJS
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";
import { LayoutUtilsService, ResponseModel, Utilities } from "../../../../../core";
import { IUpdateResponse, JxBaseComponent, JxHttpService } from 'jx-ng-core'
import { ResponseStatus } from "../../../../../core/_base/crud";

// Layout
export class PasswordValidation {
	/**
	 * MatchPassword
	 *
	 * @param AC: AbstractControl
	 */
	static passwordMatchValidator(AC: AbstractControl) {
		const password = AC && AC.get("password")?.value; // to get value in input tag
		const confirmPassword = AC?.get("confirmPassword")?.value; // to get value in input tag
		if (password !== confirmPassword) {
			AC.get("confirmPassword")?.setErrors({ NoPassswordMatch: true });
		} else {
			return null;
		}

		return null;
	}

	static patternValidator(
		regex: RegExp,
		error: ValidationErrors
	): ValidatorFn {
		return (control: AbstractControl) => {
			if (!control.value) {
				// if control is empty return no error
				return null;
			}

			// test the value of the control against the regexp supplied
			const valid = regex.test(control.value);

			// if true, return no error (no error), else return error passed in the second parameter
			return valid ? null : error;
		};
	}
}

@Component({
	selector: "kt-change-password",
	templateUrl: "./change-password.component.html",
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent extends JxBaseComponent implements OnInit {
	// Public properties
	userId!: number;
	@Input()
	profileId!: number;
	@Input() profileUrl: string = "";
	loadingSubject = new BehaviorSubject<boolean>(false);
	hasFormErrors: boolean = false;
	changePasswordForm!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private _http: JxHttpService
	) {
		super();
	}

	ngOnInit() {
		this.createForm();
		this.loadData();
	}

	loadData() {
		if (this.profileUrl) {
			this.layoutUtilsService.startLoadingMessage();
			this._http
				.getHttp$(this.profileUrl)
				.finally(
					() => {
						this.layoutUtilsService.stopLoadingMessage();
						this.loadingSubject.next(false);
						this.takeUntilDestroy();
					}
				)
				.then(
					(response: any) => {
						if (response) {
							this.userId = parseInt(response.UserId, 0);
							this.changePasswordForm.controls['username'].setValue(response.UserName)
						}
					},
					(error) =>
						this.layoutUtilsService.showActionNotification(
							Utilities.getHttpErrorMessage(error)
						)
				);
		}
	}

	/**
	 * Init form
	 */
	createForm() {
		this.changePasswordForm = this.fb.group(
			{
				password: [
					null,
					Validators.compose([
						// 1. Password Field is Required
						Validators.required,
						// 2. check whether the entered password has a number
						PasswordValidation.patternValidator(/\d/, {
							hasNumber: true,
						}),
						// 3. check whether the entered password has upper case letter
						PasswordValidation.patternValidator(/[A-Z]/, {
							hasCapitalCase: true,
						}),
						// 4. check whether the entered password has a lower-case letter
						PasswordValidation.patternValidator(/[a-z]/, {
							hasSmallCase: true,
						}),
						// 5. check whether the entered password has a special character
						PasswordValidation.patternValidator(/[@#$\^%&]/, {
							hasSpecialCharacters: true,
						}),
						// 6. Has a minimum length of 8 characters
						Validators.minLength(8),
					]),
				],
				confirmPassword: ["", Validators.required],
				username: [""]
			},
			{
				validator: PasswordValidation.passwordMatchValidator,
			}
		);
	}

	/**
	 * Reset
	 */
	reset() {
		this.changePasswordForm.patchValue({
			confirmPassword: "",
			password: "",
		});
		this.hasFormErrors = false;
		this.loadingSubject.next(false);
		this.changePasswordForm.markAsPristine();
		this.changePasswordForm.markAsUntouched();
		this.changePasswordForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 */
	onSubmit() {
		if (this.userId === 0)
			return;

		this.loadingSubject.next(true);
		this.hasFormErrors = false;
		const controls = this.changePasswordForm.controls;
		/** check form */
		if (this.changePasswordForm.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.loadingSubject.next(false);

			return;
		}

		const request = {
			UserId: this.userId,
			ProfileId: 0,
			Password: this.changePasswordForm.controls["password"].value,
		};

		this.loadingSubject.next(true);
		this.layoutUtilsService.startLoadingMessage();
		this._http
			.putHttp$<IUpdateResponse>(`api/iam/users/change-password`, request)
			.finally(
				() => {
					this.layoutUtilsService.stopLoadingMessage();
					this.loadingSubject.next(false);
					this.takeUntilDestroy();
				}
			)
			.then(
				(response: IUpdateResponse) => {
					if (response.isSuccess) {
						const message = `User password has been changed successfully.`;
						this.layoutUtilsService.showActionNotification(message);
						this.reset();
					}
				}
			);
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose() {
		this.hasFormErrors = false;
	}
}
