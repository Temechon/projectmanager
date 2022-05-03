import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { first } from 'rxjs/operators';
import { DateTime } from "luxon";

@Injectable({
    providedIn: 'root'
})
export class DocxService {

    constructor(
        private http: HttpClient
    ) {

    }

    generateSpiraTemplate(parameters: {
        author: string,
        authorteam: string,
        trigram: string,
        targetdate: string,
        internalid: string,
        name: string,
        targetvp: string,
    }) {
        this.http.get('assets/spira_template.docx', { responseType: 'blob' }).pipe(first()).toPromise()
            .then((data: Blob) => {
                return data.arrayBuffer();
            })
            .then((binarybuffer: ArrayBuffer) => {

                console.log(binarybuffer);
                var zip = new PizZip(binarybuffer);
                var doc = new Docxtemplater(zip, {
                    linebreaks: true,
                });
                doc.setData(parameters)
                doc.render();

                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });

                // Get current date with luxon on format YYMMDD
                const date = DateTime.local().toFormat('yyMMdd');


                // Output the document using Data-URI
                saveAs(out, `SPIRA-${parameters.trigram}-${date}-A.docx`);
            })
    }

}
