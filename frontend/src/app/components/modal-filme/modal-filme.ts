import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { IconeComponent } from '../icone/icone';

@Component({
  selector: 'app-modal-filme',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './modal-filme.html',
  styleUrl: './modal-filme.css',
})
export class ModalFilmeComponent {
  @Input() movie: any = null;
  @Input() exibir: boolean = false;
  @Output() fechar = new EventEmitter<void>();

  fecharModal() {
    this.fechar.emit();
  }
}
