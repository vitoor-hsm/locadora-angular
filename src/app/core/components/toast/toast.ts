import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../services/toast';
import { IconeComponent } from '../../../components/icone/icone';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit {
  public toast: Toast | null = null;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.toastService.toastState.subscribe((novoToast: Toast) => {
      this.toast = novoToast;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.toast = null;
        this.cdr.detectChanges();
      }, 3000);
    });
  }
}