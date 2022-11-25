import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/user';
import { UsuarioService } from 'src/app/service/usuario.service';
import Swal from 'sweetalert2';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  usuarios!: Array<User>
  busca!: String
  currentPage!: number
  totalItems!: number

  constructor(private usuarioService: UsuarioService, private spinner: NgxSpinnerService, private matDialog: MatDialog) {

  }

  ngOnInit(): void {
    this.listar()
  }

  abreCad(id: Number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-component";
    dialogConfig.autoFocus = false;
    dialogConfig.width = "99%";
    dialogConfig.maxHeight = "99%";
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      id
     }
    const modalDialog = this.matDialog.open(UsuarioEditComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(result => {
      this.listar()
    });
  }

  listar() {
    this.usuarioService.getUsuario().subscribe((resposta: any) =>  {
      this.usuarios = resposta.content
      this.totalItems = resposta.totalElements
    })
  }

  listarPagina(pagina: number) {
    this.usuarioService.getUsuarioPagina(pagina - 1).subscribe((resposta: any) =>  {
      this.usuarios = resposta.content
      this.totalItems = resposta.totalElements
    })
  }


  deleteUsuario(id: Number) {
    Swal.fire({
      title: "Deletar item",
      text: "Deseja mesmo remover este item?",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      width: "740px",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode continuar!',
      cancelButtonText: 'Não, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.usuarioService.deleteUsuario(id).subscribe((resposta) => {
          this.listar()
          this.spinner.hide()
        });
      }
    })
  }

  buscaUsuario() {
    let busca = this.busca
    if(busca === "") {busca = "undefined"}
    this.usuarioService.buscaUsuario(busca).subscribe((resposta: any) => {
      this.usuarios = resposta
    })
  }

}
