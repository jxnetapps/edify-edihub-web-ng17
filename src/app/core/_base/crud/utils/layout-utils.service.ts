// Angular
import { Injectable } from "@angular/core";
// Partials for CRUD
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from "../../../../views/partials/content/crud";
import { KtDialogService } from "../../layout/services/kt-dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ApiResponseModel } from "../models/response-models";

export enum MessageType {
	Create,
	Read,
	Update,
	Delete,
}

@Injectable()
export class LayoutUtilsService {
	/**
	 * Service constructor
	 *
	 * @param snackBar: MatSnackBar
	 * @param dialog: MatDialog
	 */
	constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private ktDialogService: KtDialogService) {}

	/**
	 * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: string
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 */
	showActionNotification(_message: string, _type: MessageType = MessageType.Read, _duration: number = 3000, _showCloseButton: boolean = true, _showUndoButton: boolean = true, _undoButtonDuration: number = 3000, _verticalPosition: "top" | "bottom" = "bottom") {
		const _data = {
			message: _message,
			snackBar: this.snackBar,
			showCloseButton: _showCloseButton,
			showUndoButton: _showUndoButton,
			undoButtonDuration: _undoButtonDuration,
			verticalPosition: _verticalPosition,
			type: _type,
			action: "Undo",
		};
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: _duration,
			data: _data,
			verticalPosition: _verticalPosition,
		});
	}

	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
	deleteElement(title: string = "", description: string = "", waitDesciption: string = "", deleteMessage = "", url = "", httpType = "", payload = null) {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption, deleteMessage, url, httpType, payload },
			width: "440px",
		});
	}

	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
	deleteElementInServer(entityName: string, baseDeleteUrl: string, dataSource: any[], primaryColumn: string) {
		const idsForDeletion: number[] = [];
		for (let i = 0; i < dataSource.length; i++) {
			idsForDeletion.push(dataSource[i][primaryColumn]);
		}

		if (idsForDeletion.length === 0) {
			this.showActionNotification("Please select atleast one record.");
			return;
		}

		const deleteUrl = `${baseDeleteUrl}/${idsForDeletion}`;

		const deleteLables = {
			title: `${entityName} Delete`,
			description: `Are you sure to permanently delete this ${entityName}?`,
			waitDesciption: `Deleting...`,
			deleteMessage: `${entityName} has been deleted`,
		};

		return this.deleteElement(deleteLables.title, deleteLables.description, deleteLables.waitDesciption, deleteLables.deleteMessage, deleteUrl).afterClosed();
	}

	deleteElementInServerByUrl(entityName: string, baseDeleteUrl: string) {
		const deleteLables = {
			title: `${entityName} Delete`,
			description: `Are you sure to permanently delete this ${entityName}?`,
			waitDesciption: `Deleting...`,
			deleteMessage: `${entityName} has been deleted`,
		};

		return this.deleteElement(deleteLables.title, deleteLables.description, deleteLables.waitDesciption, deleteLables.deleteMessage, baseDeleteUrl).afterClosed();
	}

	deleteElementInServerCustomHttp(entityName: string, baseDeleteUrl: string, httpType: "POST" | "DELETE", payload: any) {
		const deleteLables = {
			title: `${entityName} Delete`,
			description: `Are you sure to permanently delete this ${entityName}?`,
			waitDesciption: `Deleting...`,
			deleteMessage: `${entityName} has been deleted`,
		};

		return this.deleteElement(deleteLables.title, deleteLables.description, deleteLables.waitDesciption, deleteLables.deleteMessage, baseDeleteUrl, httpType, payload).afterClosed();
	}

	httpPostWithConfirm(dialogData: ConfirmDialogLabels, url: string, payload: any) {
		const deleteLables = {
			title: dialogData.title,
			description: dialogData.description,
			waitDesciption: dialogData.waitDesciption,
			deleteMessage: dialogData.deleteMessage,
		};

		return this.deleteElement(deleteLables.title, deleteLables.description, deleteLables.waitDesciption, deleteLables.deleteMessage, url, "POST", payload).afterClosed();
	}

	/**
	 * Showing Fetching Window(Mat-Dialog)
	 *
	 * @param _data: any
	 */
	fetchElements(_data: any) {
		return this.dialog.open(FetchEntityDialogComponent, {
			data: _data,
			width: "400px",
		});
	}

	/**
	 * Showing Update Status for Entites Window
	 *
	 * @param title: string
	 * @param statuses: string[]
	 * @param messages: string[]
	 */
	updateStatusForEntities(title: any, statuses: any, messages: any[]) {
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: "480px",
		});
	}

	startLoadingMessage(message = "Loading...", caption = "") {
		this.ktDialogService.show(message);
	}

	stopLoadingMessage() {
		this.ktDialogService.hide();
		if (document.querySelectorAll(".kt-dialog.kt-dialog--shown.kt-dialog--default.kt-dialog--loader.kt-dialog--top-center").length > 0) {
			document.querySelectorAll(".kt-dialog.kt-dialog--shown.kt-dialog--default.kt-dialog--loader.kt-dialog--top-center")[0].remove();
		}
	}

	showServerNotification(res: ApiResponseModel) {
		if (res.Response && res.Response.isSuccess) {
			this.showActionNotification(res.Message);
			if (res.hasOwnProperty("successFunc")) {
				res.successFunc();
			}
		} else {
			this.showActionNotification(res.Message);
		}
	}
}

export class ConfirmDialogLabels {
	title!: string;
	description!: string;
	waitDesciption!: string;
	deleteMessage!: string;
}
