/**
 * Payments Service
 * Handles all payment-related API calls
 */

import { api } from '@/utils/apiClient';
import type { 
  Payment, 
  CreatePaymentDTO, 
  UpdatePaymentDTO,
  PaymentStatus
} from '@/types/api';

/**
 * Get all payments (admin only)
 */
export async function getAll(): Promise<Payment[]> {
  return await api.get<Payment[]>('/api/payments');
}

/**
 * Get payment by ID
 */
export async function getById(id: string): Promise<Payment> {
  return await api.get<Payment>(`/api/payments/${id}`);
}

/**
 * Get payments by registration ID
 */
export async function getByRegistrationId(registrationId: string): Promise<Payment[]> {
  return await api.get<Payment[]>(`/api/payments/registration/${registrationId}`);
}

/**
 * Get payment by transaction ID
 */
export async function getByTransactionId(transactionId: string): Promise<Payment> {
  return await api.get<Payment>(`/api/payments/transaction/${transactionId}`);
}

/**
 * Create a new payment
 */
export async function create(payment: CreatePaymentDTO): Promise<Payment> {
  return await api.post<Payment>('/api/payments', payment);
}

/**
 * Update an existing payment
 */
export async function update(id: string, payment: UpdatePaymentDTO): Promise<Payment> {
  return await api.put<Payment>(`/api/payments/${id}`, payment);
}

/**
 * Delete a payment
 */
export async function deletePayment(id: string): Promise<void> {
  await api.delete<void>(`/api/payments/${id}`);
}

/**
 * Filter payments by status
 */
export function filterByStatus(
  payments: Payment[],
  status: PaymentStatus
): Payment[] {
  return payments.filter(payment => payment.paymentStatus === status);
}

/**
 * Get pending payments
 */
export function getPendingPayments(payments: Payment[]): Payment[] {
  return filterByStatus(payments, 'PENDING' as PaymentStatus);
}

/**
 * Get completed payments
 */
export function getCompletedPayments(payments: Payment[]): Payment[] {
  return filterByStatus(payments, 'COMPLETED' as PaymentStatus);
}

/**
 * Get failed payments
 */
export function getFailedPayments(payments: Payment[]): Payment[] {
  return filterByStatus(payments, 'FAILED' as PaymentStatus);
}

/**
 * Get refunded payments
 */
export function getRefundedPayments(payments: Payment[]): Payment[] {
  return filterByStatus(payments, 'REFUNDED' as PaymentStatus);
}

/**
 * Filter payments by payment method
 */
export function filterByPaymentMethod(
  payments: Payment[],
  method: string
): Payment[] {
  return payments.filter(payment => 
    payment.paymentMethod?.toLowerCase() === method.toLowerCase()
  );
}

/**
 * Search payments by transaction ID
 */
export function searchByTransactionId(
  payments: Payment[],
  searchTerm: string
): Payment[] {
  const term = searchTerm.toLowerCase();
  return payments.filter(payment => 
    payment.transactionId?.toLowerCase().includes(term)
  );
}

/**
 * Sort payments by date (newest first)
 */
export function sortByDateDesc(payments: Payment[]): Payment[] {
  return [...payments].sort((a, b) => {
    const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
    const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Sort payments by date (oldest first)
 */
export function sortByDateAsc(payments: Payment[]): Payment[] {
  return [...payments].sort((a, b) => {
    const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
    const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
    return dateA - dateB;
  });
}

/**
 * Sort payments by amount (highest first)
 */
export function sortByAmountDesc(payments: Payment[]): Payment[] {
  return [...payments].sort((a, b) => b.amount - a.amount);
}

/**
 * Sort payments by amount (lowest first)
 */
export function sortByAmountAsc(payments: Payment[]): Payment[] {
  return [...payments].sort((a, b) => a.amount - b.amount);
}

/**
 * Calculate total revenue
 */
export function calculateTotalRevenue(payments: Payment[]): number {
  return payments.reduce((total, payment) => {
    if (payment.paymentStatus === 'COMPLETED') {
      return total + payment.amount;
    }
    return total;
  }, 0);
}

/**
 * Calculate total pending amount
 */
export function calculatePendingAmount(payments: Payment[]): number {
  return payments.reduce((total, payment) => {
    if (payment.paymentStatus === 'PENDING') {
      return total + payment.amount;
    }
    return total;
  }, 0);
}

/**
 * Calculate total refunded amount
 */
export function calculateRefundedAmount(payments: Payment[]): number {
  return payments.reduce((total, payment) => {
    if (payment.paymentStatus === 'REFUNDED') {
      return total + payment.amount;
    }
    return total;
  }, 0);
}

/**
 * Group payments by payment method
 */
export function groupByPaymentMethod(payments: Payment[]): Record<string, Payment[]> {
  return payments.reduce((acc, payment) => {
    const method = payment.paymentMethod || 'Unknown';
    if (!acc[method]) {
      acc[method] = [];
    }
    acc[method].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);
}

/**
 * Group payments by status
 */
export function groupByStatus(payments: Payment[]): Record<PaymentStatus, Payment[]> {
  return payments.reduce((acc, payment) => {
    const status = payment.paymentStatus;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(payment);
    return acc;
  }, {} as Record<PaymentStatus, Payment[]>);
}

/**
 * Get payments within date range
 */
export function getPaymentsInDateRange(
  payments: Payment[],
  startDate: Date,
  endDate: Date
): Payment[] {
  return payments.filter(payment => {
    if (!payment.paymentDate) return false;
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate >= startDate && paymentDate <= endDate;
  });
}

/**
 * Get payment statistics
 */
export function getPaymentStatistics(payments: Payment[]) {
  const completed = getCompletedPayments(payments);
  const pending = getPendingPayments(payments);
  const failed = getFailedPayments(payments);
  const refunded = getRefundedPayments(payments);

  return {
    total: payments.length,
    completed: completed.length,
    pending: pending.length,
    failed: failed.length,
    refunded: refunded.length,
    totalRevenue: calculateTotalRevenue(payments),
    pendingAmount: calculatePendingAmount(payments),
    refundedAmount: calculateRefundedAmount(payments),
    averagePayment: payments.length > 0 
      ? calculateTotalRevenue(payments) / completed.length 
      : 0,
  };
}

// Export as a single service object
export const paymentsService = {
  getAll,
  getById,
  getByRegistrationId,
  getByTransactionId,
  create,
  update,
  delete: deletePayment,
  filterByStatus,
  getPendingPayments,
  getCompletedPayments,
  getFailedPayments,
  getRefundedPayments,
  filterByPaymentMethod,
  searchByTransactionId,
  sortByDateDesc,
  sortByDateAsc,
  sortByAmountDesc,
  sortByAmountAsc,
  calculateTotalRevenue,
  calculatePendingAmount,
  calculateRefundedAmount,
  groupByPaymentMethod,
  groupByStatus,
  getPaymentsInDateRange,
  getPaymentStatistics,
};
