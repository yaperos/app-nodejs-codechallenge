import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountEntity } from '../../models/account.model';
import { CreateTransactionRequest, TransactionResponse } from '../../models/transaction.model';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  transactions: TransactionResponse[] = [];
  accounts: AccountEntity[] = [];
  transactionForm!: FormGroup;
  loading = false;
  toastDuration = 4000;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private notificationService: NotificationService,
    public toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadTransactions();
    this.buildForm();

    this.notificationService.connect();
    this.notificationService.messages$.subscribe(msg => {
      const updatedTx: TransactionResponse = JSON.parse(msg);

      console.log('%c[WS] Transacción actualizada:', 'color: #10B981; font-weight: bold;', {
        transactionExternalId: updatedTx.transactionExternalId,
        transactionStatus: updatedTx.transactionStatus,
        value: updatedTx.value,
        createdAt: updatedTx.createdAt
      });

      switch (updatedTx.transactionStatus) {
        case 'APPROVED':
          this.toastService.show('✅ Yape Aprobado', 'success', this.toastDuration);
          break;
        case 'REJECTED':
          this.toastService.show('❌ Yape Rechazado', 'error', this.toastDuration);
          break;
        case 'PENDING':
          this.toastService.show('⏳ Yape Pendiente', 'info', this.toastDuration);
          break;
        default:
          this.toastService.show(`Estado desconocido: ${updatedTx.transactionStatus}`, 'info', this.toastDuration);
          break;
      }


      const index = this.transactions.findIndex(tx =>
        tx.transactionExternalId === updatedTx.transactionExternalId
      );

      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], transactionStatus: updatedTx.transactionStatus };
      } else {
        this.transactions.unshift(updatedTx);
      }
      this.loadAccounts();
    });
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

  private buildForm(): void {
    this.transactionForm = this.fb.group({
      accountExternalIdDebit: ['', Validators.required],
      accountExternalIdCredit: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  private loadTransactions(): void {
    this.transactionService.getAll().subscribe({
      next: data => this.transactions = data
    });
  }

  private loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: data => this.accounts = data,
      error: err => console.error('Error loading accounts', err)
    });
  }

  submit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const request: CreateTransactionRequest = {
      ...this.transactionForm.value,
      transferTypeId: 1
    };

    this.loading = true;

    this.transactionService.create(request).subscribe({
      next: (res) => {
        console.log('%c[WS] Transacción registrada:', 'color: #10B981; font-weight: bold;', res);
        this.transactions.unshift(res);
        this.transactionForm.reset();
        this.loadAccounts();
        this.toastService.show('⏳ Yape Pendiente', 'info', this.toastDuration);
      },
      error: (err) => {
        this.transactionForm.reset();
        console.error('Transaction error', err);
        this.toastService.show('Ha ocurrido un error. Intenta nuevamente.', 'error', this.toastDuration);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }


  getEstado(tx: TransactionResponse) {
    switch (tx.transactionStatus) {
      case 'APPROVED':
        return { text: 'Aprobado', color: 'bg-green-100 text-green-800' };
      case 'PENDING':
        return { text: 'Pendiente', color: 'bg-cyan-100 text-cyan-800' };
      case 'REJECTED':
        return { text: 'Rechazado', color: 'bg-red-100 text-red-800' };
      default:
        return { text: tx.transactionStatus, color: 'bg-gray-100 text-gray-800' };
    }
  }

  getAccountName(accountId: string | undefined): string {
    const acc = this.accounts.find(a => a.accountExternalId === accountId);
    return acc ? `${acc.firstName} ${acc.lastName}` : 'Desconocido';
  }

}