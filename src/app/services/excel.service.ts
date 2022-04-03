import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { DateTime } from "luxon";


@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() {

    }

    export(projectid: string, sheetName: string, rows: any) {

        /* generate worksheet and workbook */
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Get today date at format YYYY-MM-DD
        const today = DateTime.local().toFormat('yyyy-MM-dd');
        XLSX.writeFile(workbook, `${today} - ${projectid} - Tests ${sheetName}.xlsx`);
    }

}

