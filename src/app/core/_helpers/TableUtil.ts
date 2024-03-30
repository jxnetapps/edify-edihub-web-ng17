import * as XLSX from 'xlsx';

export class TableColumn {
	constructor(
		public key: string,
		public title: string = '',
		public display = true
	) { }
}

/** export mat table to excel
 * Usage: TableUtil.exportToExcel("ExampleTable");
 */
export class TableUtil {

	static exportTableToExcel(tableId: string, name?: string) {
		const timeSpan = new Date().toISOString();
		const prefix = name || 'ExportResult';
		const fileName = `${prefix}-${timeSpan}`;
		const targetTableElm = document.getElementById(tableId);
		const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: prefix } as XLSX.Table2SheetOpts);
		XLSX.writeFile(wb, `${fileName}.xlsx`);
	}

	static exportDataToExcel(fileName: string, data: object[], columns: string[]): void {
		const newColumns = new Array<TableColumn>();
		if (columns && columns.length > 0) {
			columns.forEach(column => {
				newColumns.push(new TableColumn(column, column));
			});
		}
		this.export(fileName, data, newColumns);
	}

	static exportDataToExcelWithCustomHeader(fileName: string, data: object[], columns: TableColumn[]): void {
		this.export(fileName, data, columns);
	}

	private static export(fileName: string, data: object[], columns?: TableColumn[]): void {

		const sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
			this.mergeDataWithColumns(data, columns)
		);
		const workBook: XLSX.WorkBook = {
			Sheets: {
				data: sheet
			},
			SheetNames: ['data']
		};

		XLSX.writeFile(workBook, `${fileName}.xlsx`, {
			type: 'base64'
		});
	}

	private static mergeDataWithColumns(data: object[], columns?: TableColumn[]): any[] {
		//debugger
		const table: any[] = [];
		let tempRow: any;
		if (columns) {
		  data.forEach((row: any) => {
			tempRow = {};
			columns.forEach(({ display, key, title }) => {
			  if (display) {
				tempRow[title] = row[key];
			  }
			});
	
			table.push(tempRow);
		  });
		  return table;
		}
		return data;
	  }
}
