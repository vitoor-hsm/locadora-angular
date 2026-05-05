import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { Toast, ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';
import { AuthService } from '../../../services/auth';

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
  cdr: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.filmeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      genre: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      releaseYear: ['', [Validators.required, Validators.min(1895), Validators.max(2026)]],
      posterUrl: ['', [
        Validators.required,
        Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      synopsis: ['', [Validators.required, Validators.maxLength(500)]]
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
    this.authService.getMoviesById(id).subscribe({
      next: (movie: any) => {
        if (movie) {
          this.filmeForm.patchValue(movie);
          this.filmeForm.markAsDirty();
          this.filmeForm.updateValueAndValidity();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.toastService.exibir('Erro ao carregar dados do filme!', 'erro');
        this.router.navigate(['/admin']);
      }
    });
  }
  salvar() {
    if (this.filmeForm.invalid) {
      this.filmeForm.markAllAsTouched();
      this.toastService.exibir('Verifique os campos destacados em vermelho.', 'erro');
      return;
    }

    this.modalService.abrir({
      titulo: this.isEdicao ? 'Confirmar Edição' : 'Confirmar Cadastro',
      mensagem: this.isEdicao
        ? `Deseja salvar as alterações no filme "${this.filmeForm.value.title}"?`
        : `Deseja cadastrar o filme "${this.filmeForm.value.title}" no catálogo?`,
      confirmar: () => {
        this.executarSalvamento();
      }
    });
  }
  private executarSalvamento() {
    const dadosForm = this.filmeForm.value;

    const filmeParaSalvar = this.isEdicao
      ? { ...dadosForm, id: this.idFilmeEdicao }
      : dadosForm;
    
    this.authService.saveMovie(filmeParaSalvar).subscribe({
      next: (res: any) => {
        this.toastService.exibir(
          this.isEdicao ? 'Filme atualizado com sucesso!' : 'Filme salvo com sucesso!',
          'sucesso'
        );
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        this.toastService.exibir('Erro ao salvar no banco de dados', 'erro');
      }
    });
  }

}

export function semEspacosVazios(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'apenasEspacos': true };
}