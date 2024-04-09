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
    par:any[] = []
    listPar:any[] = []
    nombreDividido:string [] = [];
    nombreActual: string | string[] = '';
    bajar:number = 0
    articulo:any
    articuloGrupo:any
    gruposUnicos:String[] = []
    seleccionados: Set<string> = new Set();
    valorSeleccionado:string = ''
    empresaSeleccionada:string = ''
    contSelect:number = 0;
    cantPDF:number = 0;
    contador:number = 0;
    selectActual:string = ''
    db:String = ''
    database:any

    codigoImpr = ''
    nombreImpr:String[] = []
    presentacionImpr = ''
    nombre:string = ''
    codigo:string = ''

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

    constructor(private pdfService: PdfService, private conexionService: ConexionService, private printerService: NgxPrintService) { }

    //Captura los checkbox
    capturarValores(event: any) {
      const checkbox = event.target;
      const row = checkbox.closest('tr');
      const codigo = row.cells[0].innerText;
      const nombre = row.cells[1].innerText;
      const presentacion = row.cells[2].innerText;
      let nombreDividido: string[] = [];
    
      if (checkbox.checked) {
        if (nombre.length > 30) {
          nombreDividido = this.dividirPalabra(nombre);
        } else {
          nombreDividido.push(nombre);
        }
        this.datos.push({ codigo, nombre: nombreDividido, presentacion });
        this.seleccionados.add(codigo); // Agrega el código a la lista de seleccionados
      } else {
        // Elimina el elemento de datos y de la lista de seleccionados si el checkbox se desmarca
        this.datos = this.datos.filter(item => item.codigo !== codigo || item.nombre.join(' ') !== nombre);
        this.seleccionados.delete(codigo);
      }
      this.listPar = this.datos
    }
    
    dividirPalabra(nombre: string): string[] {
      let palabras = nombre.split(" ");
      let nombreDividido: string[] = [];
      let linea = palabras[0];
      for (let i = 1; i < palabras.length; i++) {
        if ((linea + " " + palabras[i]).length <= 30) {
          linea += " " + palabras[i];
        } else {
          nombreDividido.push(linea);
          linea = palabras[i];
        }
      }
      if (linea.length > 0) {
        nombreDividido.push(linea);
      }
      return nombreDividido;
    }
  
    //Este captura los valores del select grupos
    capturarSelect(event:any){
      const select = event.target;
      this.valorSeleccionado =  select.value
      if(this.db == 'Articulos'){
        this.conexionService.filtrarInformacionArticulos(this.valorSeleccionado).subscribe(data => {
          this.articulo = data
          console.log(data)
          this.verificarSelect(data)  
        })
      }
      if(this.db == 'Productos'){
        console.log(this.valorSeleccionado)
        this.conexionService.filtrarInformacionProductos(this.valorSeleccionado).subscribe(data => {
          this.articulo = data
          console.log(data)
          this.verificarSelect(data)  
        })
      }
    }

    capturarEmpresa(event:any){
      const select = event.target;
      this.empresaSeleccionada =  select.value
      this.conexionService.filtrarEmpresa(this.empresaSeleccionada).subscribe(data => {
        this.db = data.parent.config.database
        this.filtrarPorEmpresa()
      })
    }

    //Esto detecta si se ha cambiado de grupo
    verificarSelect(datos:any){
      if(this.selectActual != datos){
        this.datos = []
      }
    }

    filtrarPorEmpresa(){
      if(this.db == 'Productos'){
        console.log("Entró a ", this.db)
        this.conexionService.getProductos().subscribe(data => {
          console.log(data)
          this.articulo = data;
          this.articuloGrupo = [...data];
          this.gruposUnicos = Array.from(new Set(this.articulo.map((item: any) => item.Grupo)));
          console.log(this.gruposUnicos)
        })
      }
      if(this.db == 'Articulos'){
        console.log("Entró a ", this.db)
        this.conexionService.getArticulos().subscribe(data => {
        this.articulo = data;
        this.articuloGrupo = [...data];
        //El uso de Set tiene una complejidad lineal, espero que no de problemas de eficiencia
        this.gruposUnicos = Array.from(new Set(this.articulo.map((item: any) => item.Grupo)));
        })
      }
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
        this.contador += 1
        this.codigoImpr = datosCopy[i].codigo;
        this.nombreImpr = datosCopy[i].nombre;
        this.presentacionImpr = datosCopy[i].presentacion;

        this.par.push(datosCopy[i])

        //Si la cantidad de datos es par
        if(this.par.length == 2){
          await this.agregarPar(this.par)
          this.par = []
          await this.ejecutarImpresion()
        }

        //Arreglo auxiliar para controlar los pares de información
      }
      //Esto significa que tomaron datos impares, por ejemplo 3, 2 se imprimen y el tercero tiene que ser impreso de igual forma
      if(this.par.length == 1){
        await this.agregarImpar(this.par)
        this.par = []
        await this.ejecutarImpresion()
      }
    }

    async agregarPar(par:any[]){
      this.listPar = par
    }

    async agregarImpar(par:any[]){
      this.listPar = par
    }

    async ejecutarImpresion() {
      console.log("Imprimiendo")
      return new Promise<void>((resolve, reject) => {
        const printContent = document.getElementById("print") as HTMLElement;
        let WindowPrt = window.open('', '', 'left=0,top=50,width=500,height=600,toolbar=0,scrollbars=0,status=0');
        setTimeout(() => {
          WindowPrt!.document.write(printContent.innerHTML);
          setTimeout(() => {
            WindowPrt!.print();
            WindowPrt!.close(); // Cierra la ventana después de imprimir
            resolve(); // Resuelve la promesa cuando la impresión se complete
            this.listPar = []
          }, 2000);
        }, 1000);
      });
    }

    ngOnInit(): void {
    }
  }
