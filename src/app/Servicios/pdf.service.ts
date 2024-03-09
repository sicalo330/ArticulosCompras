import { Injectable } from '@angular/core';
import {jsPDF} from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }


  generarPdf(datos: any[]) {
    const doc = new jsPDF()

    doc.text('Datos del PDF:', 10, 10);
    datos.forEach((dato, index) => {
        const y = 20 + (index * 10); // Ajustar el espaciado vertical según tus necesidades
        doc.text(`${dato.codigo}, ${dato.nombre}, ${dato.presentacion}`, 10, y);
    });

    doc.save('documento.pdf');
}
}
