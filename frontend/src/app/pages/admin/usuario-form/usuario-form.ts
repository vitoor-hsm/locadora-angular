import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';
import { UsuarioService } from '../../../services/usuario';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuLateral],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit: boolean = false;
  editUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private modalService: ModalService,
    private userService: UsuarioService
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required]],
      password: [''],
      role: ['USER', Validators.required],
      highContrast: [false]
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam && idParam !== 'new') {
        this.isEdit = true;
        this.editUserId = Number(idParam);
        this.loadUserData(this.editUserId);

        // password optional in edit mode, only required in new user creation
        this.userForm.get('password')?.clearValidators();
      } else {
        this.isEdit = false;
        this.editUserId = null;
        this.userForm.reset({ role: 'USER', highContrast: false });

        // password required in create mode
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(3)]);
      }
      this.userForm.get('password')?.updateValueAndValidity();
    });
  }

  loadUserData(id: number) {
    this.userService.findById(id).subscribe({
      next: (user) => {
        console.log('User data loaded from Java:', user);
        // populate the form with the user data
        this.userForm.patchValue(user);
      },
      error: (err) => {
        this.toastService.exibir('Erro ao carregar dados do usuário.', 'erro');
        console.error('Erro ao buscar usuário:', err);
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  save() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastService.exibir('Verifique os campos obrigatórios.', 'erro');
      return;
    }
    // open confirmation modal before saving
    this.modalService.abrir({
      titulo: this.isEdit ? 'Confirmar Edição' : 'Confirmar Cadastro',
      mensagem: `Deseja salvar as informações de ${this.userForm.value.name}?`,
      confirmar: () => {
        this.executeSave();
      }
    });
  }

  private executeSave() {
    console.log('Tentando salvar dados:', this.userForm.value);
    const userData = this.userForm.value;

    if (this.isEdit && !userData.password) {
      delete userData.password; // If it's an edit and the password is empty, remove the field to avoid sending an empty string to Java
    }

    if (this.isEdit && this.editUserId) {

      this.userService.update(this.editUserId, userData).subscribe({
        next: () => {
          this.toastService.exibir('Usuário atualizado com sucesso!', 'sucesso');
          this.router.navigate(['/admin/usuarios']);
        },
        error: () => this.toastService.exibir('Verifique as informações do usuário.', 'erro')
      });
    } else {
      this.userService.create(userData).subscribe({
        next: () => {
          this.toastService.exibir('Usuário cadastrado com sucesso!', 'sucesso');
          this.router.navigate(['/admin/usuarios']);
        },
        error: () => this.toastService.exibir('Verifique as informações do usuário.', 'erro')
      });
    }
  }
}
export function semEspacosVazios(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return !isWhitespace ? null : { 'apenasEspacos': true };
}