import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/Servicios/conexion.service';
import { PdfService } from 'src/app/Servicios/pdf.service';

  @Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
  })
  export class InicioComponent implements OnInit {
    datos: any[] = [];
    articulo:any

    constructor(private pdfService: PdfService, private conexionService: ConexionService) { }

    capturarValores(event: any) {
        const checkbox = event.target;
        const row = checkbox.closest('tr');
        const codigo = row.cells[0].innerText;
        const nombre = row.cells[1].innerText;
        const presentacion = row.cells[2].innerText;

        this.datos.push({ codigo, nombre, presentacion });
    }

    mandarValores(){
      this.pdfService.generarPdf(this.datos)
    }

    capturarSelect(event:any){
      const select = event.target;
      const valorSeleccionado =  select.value
      console.log(valorSeleccionado)
    }

    ngOnInit(): void {
      console.log('cargando')
        this.conexionService.getArticulos().subscribe(data => {
          this.articulo = data
          console.log(data)
        })
    }
  }
