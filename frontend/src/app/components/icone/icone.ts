import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-icone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icone.html',
  styleUrl: './icone.css',
})
export class IconeComponent {
  @Input() nome: string = '';

  @Input() tamanho: string ='24px'
}
