import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/Servicios/conexion.service';
import { PdfService } from 'src/app/Servicios/pdf.service';
import { NgxPrintDirective, PrintOptions } from 'ngx-print';
import { NgxPrintService } from 'ngx-print';
  @Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
  })
  export class InicioComponent implements OnInit {
    datos: any[] = []
    imprimer:any[] = []
    articulo:any
    articuloGrupo:any
    gruposUnicos:String[] = []
    seleccionados: Set<string> = new Set();
    valorSeleccionado:string = ''
    contSelect:number = 0;
    cantPDF:number = 0;
    contador:number = 0;

    codigoImpr = ''
    nombreImpr = ''
    presentacionImpr = ''

    printOptions: PrintOptions = {
      printSectionId: 'print',
      useExistingCss: true,
      bodyClass: '',
      closeWindow: false,
      openNewTab: false,
      previewOnly: true,
      printDelay: 1,
      printTitle: ''
    };

    //Validar que se tome un valor para al empresa
    constructor(private pdfService: PdfService, private conexionService: ConexionService, private printerService: NgxPrintService) { }
    //Esto captura los valores que se seleccionaron para imprimirlos
    capturarValores(event: any) {
        const checkbox = event.target;
        const row = checkbox.closest('tr');
        const codigo = row.cells[0].innerText;
        const nombre = row.cells[1].innerText;
        const presentacion = row.cells[2].innerText;
        if (checkbox.checked) {
          this.datos.push({ codigo, nombre, presentacion });
          this.seleccionados.add(codigo); // Agrega el código a la lista de seleccionados
          this.contSelect += 1;
        } else {
          // Elimina el elemento de datos y de la lista de seleccionados si el checkbox se desmarca
          this.datos = this.datos.filter(item => item.codigo !== codigo);
          this.seleccionados.delete(codigo);
          this.contSelect -= 1;
        }
    }

    //Este captura los valores del check box al hacer click
    capturarSelect(event:any){
      const select = event.target;
      this.valorSeleccionado =  select.value
      this.conexionService.filtrarInformacion(this.valorSeleccionado).subscribe(data => {
        this.articulo = data
        
      })
    }

    
    /*
    verificarPDF(){
      this.cantPDF = this.contSelect/2
      this.generarPDF(this.contSelect)
    }
    generarPDF(cantidad: number) {
      let contadorPDF = 1; // Contador para el nombre de los PDF
      let par: any[] = []; // Array para almacenar los pares de datos
      let y = 10;
    
      for (let i = 0; i < this.datos.length; i++) {
        par.push(this.datos[i]); // Agregar el elemento actual al array par
    
        // Si se han agregado dos elementos a par, generar el PDF y vaciar par
        if (par.length === 2) {
          const doc = new jsPDF();
          this.agregarPar(doc, par, 10, y);
          y += 30;
          doc.save(`Documento${contadorPDF}.pdf`);
          contadorPDF++;
          par = [];
        }
    
        // Si quedan elementos sin agrupar y son impares, generar un PDF con el último elemento
        if (i === this.datos.length - 1 && par.length === 1) {
          const doc = new jsPDF();
          this.agregarPar(doc, par, 10, y);
          doc.save(`Documento${contadorPDF}.pdf`);
        }
      }
    }
  
    agregarPar(doc: any, par: any[], x: number, y: number) {
      let primero:boolean = true
      const fontSize = 20; // Tamaño de fuente deseado
      doc.setFontSize(fontSize);
  
      for (let index = 0; index < par.length; index++) {
        this.contador += 1;
        const elemento = par[index];
        const texto = `${elemento.codigo} - ${elemento.nombre}-${elemento.presentacion}`;
        if (primero == false && index == 1) {
          primero = true;
          doc.text(x + (index * 100), y, texto);
          par.pop();
        }
        if (primero == true && index == 0) {
          doc.text(x + (index * 100), y, texto);
          primero = false;
          if(this.contador == this.contSelect){
            par.pop()
          }
        }
      }
      
    }
    */

    async printer() {
      const datosCopy = [...this.datos]; // Copia de this.datos
      for(let i = 0; i < datosCopy.length; i++) {
        this.codigoImpr = datosCopy[i].codigo;
        this.nombreImpr = datosCopy[i].nombre;
        this.presentacionImpr = datosCopy[i].presentacion;
        console.log(this.codigoImpr);
        console.log(this.nombreImpr);
        console.log(this.presentacionImpr);
    
      }
      await this.ejecutarImpresion();
    }
    
    async ejecutarImpresion() {
      return new Promise<void>((resolve, reject) => {
        const printContent = document.getElementById("print") as HTMLElement;
        let WindowPrt = window.open('', '', 'left=0,top=50,width=500,height=600,toolbar=0,scrollbars=0,status=0');
        setTimeout(() => {
          WindowPrt!.document.write(printContent.innerHTML);
          setTimeout(() => {
            WindowPrt!.print();
            WindowPrt!.close(); // Cierra la ventana después de imprimir
            resolve(); // Resuelve la promesa cuando la impresión se complete
          }, 2000);
        }, 1000);
      });
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
