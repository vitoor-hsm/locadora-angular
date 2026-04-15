import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { Toast, ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';

@Component({
  selector: 'app-filme-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuLateral], 
  templateUrl: './filme-form.html',
  styleUrl: './filme-form.css',
})
export class FilmeFormComponent implements OnInit {
  filmeForm!: FormGroup;
  isEdicao: boolean = false;
  idFilmeEdicao: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.filmeForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      genero: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      ano: ['', [Validators.required, Validators.min(1895), Validators.max(2026)]],
      capa: ['', [
      Validators.required, 
      Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');

      if (idStr && idStr !== 'novo') {
        this.isEdicao = true;
        this.idFilmeEdicao = Number(idStr);
        this.carregarDadosDoFilme(this.idFilmeEdicao);
      } else {
        this.isEdicao = false;
        this.idFilmeEdicao = null;
        this.filmeForm.reset();
      }
    });
  }

  carregarDadosDoFilme(id: number) {
    const dados = localStorage.getItem('meusFilmes');
    if (dados) {
      const filmesDoBanco = JSON.parse(dados);
      const encontrado = filmesDoBanco.find((f: any) => f.id === id);

      if (encontrado) {
        this.filmeForm.patchValue(encontrado);
      } else {
        this.toastService.exibir('Filme não encontrado!', 'erro');
        this.router.navigate(['/admin']);
      }
    } else {
      this.router.navigate(['/admin']);
    }
  }

  salvar() {
    // validação básica antes de qualquer coisa
    if (this.filmeForm.invalid) {
      this.filmeForm.markAllAsTouched();
      this.toastService.exibir('Verifique os campos destacados em vermelho.', 'erro');
      return;
    }

    // abre o Modal perguntando se confirma
    this.modalService.abrir({
      titulo: this.isEdicao ? 'Confirmar Edição' : 'Confirmar Cadastro',
      mensagem: this.isEdicao 
        ? `Deseja salvar as alterações no filme "${this.filmeForm.value.titulo}"?`
        : `Deseja cadastrar o filme "${this.filmeForm.value.titulo}" no catálogo?`,
      confirmar: () => {
        // só executa se clicar em "Confirmar" no modal
        this.executarSalvamento();
      }
    });
  }
  private executarSalvamento() {
    const dadosLocal = localStorage.getItem('meusFilmes');
    let filmes = dadosLocal ? JSON.parse(dadosLocal) : [];
    const dadosForm = this.filmeForm.value;

    if (this.isEdicao) {
      const index = filmes.findIndex((f: any) => f.id === this.idFilmeEdicao);
      if (index !== -1) {
        filmes[index] = { ...dadosForm, id: this.idFilmeEdicao };
        this.toastService.exibir('Filme atualizado com sucesso!', 'sucesso');
      }
    } else {
      const novoId = filmes.length > 0 ? Math.max(...filmes.map((f: any) => f.id)) + 1 : 1;
      const novoFilme = { ...dadosForm, id: novoId };
      filmes.push(novoFilme);
      this.toastService.exibir('Filme salvo com sucesso!', 'sucesso');
    }
    localStorage.setItem('meusFilmes', JSON.stringify(filmes));
    this.router.navigate(['/admin']);
  }

}

export function semEspacosVazios(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'apenasEspacos': true };
}