import { Telefone } from './../../../model/telefone';
import { UsuarioService } from 'src/app/service/usuario.service';
import { User } from 'src/app/model/user';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html'
})
export class UsuarioEditComponent implements OnInit {

  tab1: String = "active"
  tab2: String = ""
  tab3: String = ""
  cdUsuario = new User()
  telefone = new Telefone()

  constructor(public dialogRef: MatDialogRef<UsuarioEditComponent>, @Inject(MAT_DIALOG_DATA) private modalData: any, private spinner: NgxSpinnerService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.getUsuario(this.modalData.id)
  }

  getUsuario(id: Number) {
    if (id != 0) {
      this.usuarioService.getUsuarioId(id).subscribe((resposta) => {
        this.cdUsuario = resposta
      })
    }
  }

  salvarUsuario() {
    this.usuarioService.salvaUsuario(this.cdUsuario).subscribe((resposta) => {
      this.fecharCad()
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Salvo com sucesso!'
      })
    })
  }

  salvarTelefone() {
    if (this.cdUsuario.listTelefones === undefined) {
      this.cdUsuario.listTelefones = new Array<Telefone>()
    }

    this.cdUsuario.listTelefones.push(this.telefone)
    this.telefone = new Telefone()
  }

  deleteTelefone(id: Number, i: number) {
    if (id > 0) {
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
          this.usuarioService.deleteTelefone(id).subscribe((resposta) => {
            this.getUsuario(this.cdUsuario.id) // retorna o usuario com os dados atualizados
            this.spinner.hide()
          });
        }
      })
    } else {
      this.cdUsuario.listTelefones.splice(i, 1)
    }
  }

  fecharCad() {
    this.dialogRef.close();
  }

  ativaTab(id: Number) {
    if(id === 1) {
      this.tab1 = "active"
      this.tab2 = ""
      this.tab3 = ""
    }
    if(id === 2) {
      this.tab1 = ""
      this.tab2 = "active"
      this.tab3 = ""
    }
    if(id === 3) {
      this.tab1 = ""
      this.tab2 = ""
      this.tab3 = "active"
    }
  }
}
