import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuLateral],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEdicao: boolean = false;
  idUsuarioEdicao: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      perfil: ['USER', Validators.required],
      dataCadastro: [new Date().toISOString().split('T')[0]]
    });

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr && idStr !== 'novo') {
        this.isEdicao = true;
        this.idUsuarioEdicao = Number(idStr);
        this.carregarDadosDoUsuario(this.idUsuarioEdicao);
      } else {
        this.isEdicao = false;
        this.idUsuarioEdicao = null;
        this.usuarioForm.reset({ perfil: 'USER', dataCadastro: new Date().toISOString().split('T')[0] });
      }
    });
  }

  carregarDadosDoUsuario(id: number) {
    const dados = localStorage.getItem('usuarios');
    if (dados) {
      const lista = JSON.parse(dados);
      const encontrado = lista.find((u: any) => u.id === id);
      if (encontrado) {
        this.usuarioForm.patchValue(encontrado);
      } else {
        this.toastService.exibir('Usuário não encontrado!', 'erro');
        this.router.navigate(['/admin/usuarios']);
      }
    }
  }

  salvar() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.toastService.exibir('Verifique os campos obrigatórios.', 'erro');
      return;
    }
    // abre o Modal Global de Confirmação
    this.modalService.abrir({
      titulo: this.isEdicao ? 'Confirmar Edição' : 'Confirmar Cadastro',
      mensagem: `Deseja salvar as informações de ${this.usuarioForm.value.nome}?`,
      confirmar: () => {
        // so roda quando clica em confirmar
        this.executarGravacao();
      }
    });
  }

  private executarGravacao() {
    const dadosLocal = localStorage.getItem('usuarios');
    let usuarios = dadosLocal ? JSON.parse(dadosLocal) : [];
    const dadosForm = this.usuarioForm.value;

    if (this.isEdicao) {
      const index = usuarios.findIndex((u: any) => u.id === this.idUsuarioEdicao);
      if (index !== -1) {
        usuarios[index] = { ...dadosForm, id: this.idUsuarioEdicao };
        this.toastService.exibir('Usuário atualizado com sucesso!', 'sucesso');
      }
    } else {
      const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u: any) => u.id)) + 1 : 1;
      usuarios.push({ ...dadosForm, id: novoId });
      this.toastService.exibir('Usuário cadastrado com sucesso!', 'sucesso');

      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.router.navigate(['/admin/usuarios']);
    }
  }
}
export function semEspacosVazios(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return !isWhitespace ? null : { 'apenasEspacos': true };
}