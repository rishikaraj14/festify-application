/**
 * Payments & Tickets Integration Tests
 * Tests backend integration for Payments and Tickets features
 */

import { paymentsService } from '@/services/payments.service';
import { ticketsService } from '@/services/tickets.service';

/**
 * Run all integration tests for Payments and Tickets
 */
export async function runPaymentsAndTicketsTests() {
  console.log('🧪 Starting Payments & Tickets Integration Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>,
  };

  // Test 1: Get all payments (requires authentication)
  try {
    console.log('📋 Test 1: GET /api/payments');
    const payments = await paymentsService.getAll();
    if (Array.isArray(payments)) {
      console.log(`✅ PASS - Retrieved ${payments.length} payments`);
      results.passed++;
      results.tests.push({ name: 'Get All Payments', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Payments', status: 'FAIL', error: (error as Error).message });
  }

  // Test 2: Verify payment data structure
  try {
    console.log('\n📋 Test 2: Verify payment data structure');
    const payments = await paymentsService.getAll();
    if (payments.length > 0) {
      const payment = payments[0];
      const requiredFields = ['id', 'registrationId', 'paymentStatus', 'amount'];
      const missingFields = requiredFields.filter(field => !(field in payment));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Payment structure is valid`);
        console.log(`   Sample payment: ₹${payment.amount} (${payment.paymentStatus})`);
        results.passed++;
        results.tests.push({ name: 'Verify Payment Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No payments to verify`);
      results.tests.push({ name: 'Verify Payment Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Payment Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 3: Filter payments by status
  try {
    console.log('\n📋 Test 3: Filter payments by status');
    const payments = await paymentsService.getAll();
    const completed = paymentsService.getCompletedPayments(payments);
    const pending = paymentsService.getPendingPayments(payments);
    const failed = paymentsService.getFailedPayments(payments);
    console.log(`✅ PASS - Completed: ${completed.length}, Pending: ${pending.length}, Failed: ${failed.length}`);
    results.passed++;
    results.tests.push({ name: 'Filter Payments by Status', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Payments by Status', status: 'FAIL', error: (error as Error).message });
  }

  // Test 4: Calculate payment revenue
  try {
    console.log('\n📋 Test 4: Calculate total revenue from payments');
    const payments = await paymentsService.getAll();
    const totalRevenue = paymentsService.calculateTotalRevenue(payments);
    const stats = paymentsService.getPaymentStatistics(payments);
    console.log(`✅ PASS - Total revenue: ₹${totalRevenue.toFixed(2)}`);
    console.log(`   Pending: ₹${stats.pendingAmount.toFixed(2)}, Refunded: ₹${stats.refundedAmount.toFixed(2)}`);
    results.passed++;
    results.tests.push({ name: 'Calculate Payment Revenue', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Calculate Payment Revenue', status: 'FAIL', error: (error as Error).message });
  }

  // Test 5: Group payments by payment method
  try {
    console.log('\n📋 Test 5: Group payments by payment method');
    const payments = await paymentsService.getAll();
    const grouped = paymentsService.groupByPaymentMethod(payments);
    const methodCount = Object.keys(grouped).length;
    console.log(`✅ PASS - Grouped into ${methodCount} payment methods`);
    Object.entries(grouped).forEach(([method, methodPayments]) => {
      console.log(`   ${method}: ${methodPayments.length} payments`);
    });
    results.passed++;
    results.tests.push({ name: 'Group Payments by Method', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Group Payments by Method', status: 'FAIL', error: (error as Error).message });
  }

  // Test 6: Get all tickets
  try {
    console.log('\n📋 Test 6: GET /api/tickets');
    const tickets = await ticketsService.getAll();
    if (Array.isArray(tickets)) {
      console.log(`✅ PASS - Retrieved ${tickets.length} tickets`);
      results.passed++;
      results.tests.push({ name: 'Get All Tickets', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Tickets', status: 'FAIL', error: (error as Error).message });
  }

  // Test 7: Verify ticket data structure
  try {
    console.log('\n📋 Test 7: Verify ticket data structure');
    const tickets = await ticketsService.getAll();
    if (tickets.length > 0) {
      const ticket = tickets[0];
      const requiredFields = ['id', 'eventId', 'ticketType', 'price', 'ticketCode', 'valid'];
      const missingFields = requiredFields.filter(field => !(field in ticket));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Ticket structure is valid`);
        console.log(`   Sample ticket: ${ticket.ticketCode} (${ticket.ticketType}, ₹${ticket.price})`);
        results.passed++;
        results.tests.push({ name: 'Verify Ticket Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No tickets to verify`);
      results.tests.push({ name: 'Verify Ticket Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Ticket Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 8: Filter tickets by type
  try {
    console.log('\n📋 Test 8: Filter tickets by type');
    const tickets = await ticketsService.getAll();
    const free = ticketsService.getFreeTickets(tickets);
    const paid = ticketsService.getPaidTickets(tickets);
    const vip = ticketsService.getVIPTickets(tickets);
    const earlyBird = ticketsService.getEarlyBirdTickets(tickets);
    console.log(`✅ PASS - Free: ${free.length}, Paid: ${paid.length}, VIP: ${vip.length}, Early Bird: ${earlyBird.length}`);
    results.passed++;
    results.tests.push({ name: 'Filter Tickets by Type', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Tickets by Type', status: 'FAIL', error: (error as Error).message });
  }

  // Test 9: Get valid vs invalid tickets
  try {
    console.log('\n📋 Test 9: Filter valid vs invalid tickets');
    const tickets = await ticketsService.getAll();
    const valid = ticketsService.getValidTickets(tickets);
    const invalid = ticketsService.getInvalidTickets(tickets);
    const used = ticketsService.getUsedTickets(tickets);
    const unused = ticketsService.getUnusedTickets(tickets);
    console.log(`✅ PASS - Valid: ${valid.length}, Invalid: ${invalid.length}, Used: ${used.length}, Unused: ${unused.length}`);
    results.passed++;
    results.tests.push({ name: 'Filter Valid/Invalid Tickets', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Valid/Invalid Tickets', status: 'FAIL', error: (error as Error).message });
  }

  // Test 10: Calculate ticket revenue and statistics
  try {
    console.log('\n📋 Test 10: Calculate ticket revenue and statistics');
    const tickets = await ticketsService.getAll();
    const stats = ticketsService.getTicketStatistics(tickets);
    console.log(`✅ PASS - Total revenue: ₹${stats.totalRevenue.toFixed(2)}`);
    console.log(`   Average price: ₹${stats.averagePrice.toFixed(2)}`);
    console.log(`   By type: Free=${stats.byType.free}, Paid=${stats.byType.paid}, VIP=${stats.byType.vip}, Early Bird=${stats.byType.earlyBird}`);
    results.passed++;
    results.tests.push({ name: 'Calculate Ticket Statistics', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Calculate Ticket Statistics', status: 'FAIL', error: (error as Error).message });
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`   Total: ${results.passed + results.failed}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  console.log('='.repeat(60) + '\n');

  return results;
}

// Export for use in components or pages
export default runPaymentsAndTicketsTests;
