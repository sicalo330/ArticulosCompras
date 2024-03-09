import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/Servicios/conexion.service';
import { PdfService } from 'src/app/Servicios/pdf.service';
import {jsPDF} from 'jspdf';

  @Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
  })
  export class InicioComponent implements OnInit {
    datos: any[] = [];
    articulo:any
    articuloGrupo:any
    gruposUnicos:String[] = []
    seleccionados: Set<string> = new Set();

    constructor(private pdfService: PdfService, private conexionService: ConexionService) { }

    capturarValores(event: any) {
        const checkbox = event.target;
        const row = checkbox.closest('tr');
        const codigo = row.cells[0].innerText;
        const nombre = row.cells[1].innerText;
        const presentacion = row.cells[2].innerText;
        if (checkbox.checked) {
          this.datos.push({ codigo, nombre, presentacion });
          this.seleccionados.add(codigo); // Agrega el código a la lista de seleccionados
        } else {
          // Elimina el elemento de datos y de la lista de seleccionados si el checkbox se desmarca
          this.datos = this.datos.filter(item => item.codigo !== codigo);
          this.seleccionados.delete(codigo);
        }
    }

    generarPDF() {
      const doc = new jsPDF();
  
      let y = 10;
      for (let i = 0; i < this.datos.length; i += 2) {
        const par = this.datos.slice(i, i + 2);
        this.agregarPar(doc, par, 10, y);
        y += 30; // Ajusta la posición vertical para el próximo par
      }
  
      doc.save('documento.pdf');
    }
  
    agregarPar(doc: any, par: any[], x: number, y: number) {
      const fontSize = 10; // Tamaño de fuente deseado
      doc.setFontSize(fontSize);
  
      par.forEach((elemento, index) => {
        const texto = `${elemento.codigo} - ${elemento.nombre}-${elemento.presentacion}`;
        doc.text(x + (index * 100), y, texto);
      });
    }

    capturarSelect(event:any){
      const select = event.target;
      let valorSeleccionado =  select.value
      if(valorSeleccionado == ''){
        return this.ngOnInit()
      }
      console.log(valorSeleccionado)
      this.conexionService.filtrarInformacion(valorSeleccionado).subscribe(data => {
        this.articulo = data
        console.log(data)
      })
    }

    ngOnInit(): void {
      this.conexionService.getArticulos().subscribe(data => {
        this.articulo = data;
        this.articuloGrupo = [...data];
        //El uso de Set tiene una complejidad lineal, espero que no de problemas de eficiencia
        this.gruposUnicos = Array.from(new Set(this.articulo.map((item: any) => item.Grupo)));
      });
    }
  }
