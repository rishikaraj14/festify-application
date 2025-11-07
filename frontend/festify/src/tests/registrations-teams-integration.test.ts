/**
 * Registrations & Teams Integration Tests
 * Tests backend integration for Registrations and Teams features
 */

import { registrationsService } from '@/services/registrations.service';
import { teamsService } from '@/services/teams.service';

/**
 * Run all integration tests for Registrations and Teams
 */
export async function runRegistrationsAndTeamsTests() {
  console.log('🧪 Starting Registrations & Teams Integration Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>,
  };

  // Test 1: Get all registrations (requires authentication)
  try {
    console.log('📋 Test 1: GET /api/registrations');
    const registrations = await registrationsService.getAll();
    if (Array.isArray(registrations)) {
      console.log(`✅ PASS - Retrieved ${registrations.length} registrations`);
      results.passed++;
      results.tests.push({ name: 'Get All Registrations', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Registrations', status: 'FAIL', error: (error as Error).message });
  }

  // Test 2: Verify registration data structure
  try {
    console.log('\n📋 Test 2: Verify registration data structure');
    const registrations = await registrationsService.getAll();
    if (registrations.length > 0) {
      const registration = registrations[0];
      const requiredFields = ['id', 'eventId', 'userId', 'registrationStatus', 'paymentStatus'];
      const missingFields = requiredFields.filter(field => !(field in registration));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Registration structure is valid`);
        console.log(`   Sample registration: Event ${registration.eventId} (${registration.registrationStatus})`);
        results.passed++;
        results.tests.push({ name: 'Verify Registration Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No registrations to verify`);
      results.tests.push({ name: 'Verify Registration Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Registration Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 3: Filter registrations by status
  try {
    console.log('\n📋 Test 3: Filter registrations by status');
    const registrations = await registrationsService.getAll();
    const pending = registrationsService.getPendingRegistrations(registrations);
    const confirmed = registrationsService.getConfirmedRegistrations(registrations);
    console.log(`✅ PASS - Pending: ${pending.length}, Confirmed: ${confirmed.length}`);
    results.passed++;
    results.tests.push({ name: 'Filter Registrations by Status', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Registrations by Status', status: 'FAIL', error: (error as Error).message });
  }

  // Test 4: Filter team vs individual registrations
  try {
    console.log('\n📋 Test 4: Filter team vs individual registrations');
    const registrations = await registrationsService.getAll();
    const teamRegs = registrationsService.getTeamRegistrations(registrations);
    const individualRegs = registrationsService.getIndividualRegistrations(registrations);
    console.log(`✅ PASS - Team: ${teamRegs.length}, Individual: ${individualRegs.length}`);
    results.passed++;
    results.tests.push({ name: 'Filter Team/Individual Registrations', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Team/Individual Registrations', status: 'FAIL', error: (error as Error).message });
  }

  // Test 5: Calculate total revenue
  try {
    console.log('\n📋 Test 5: Calculate total revenue');
    const registrations = await registrationsService.getAll();
    const totalRevenue = registrationsService.calculateTotalRevenue(registrations);
    console.log(`✅ PASS - Total revenue: ₹${totalRevenue.toFixed(2)}`);
    results.passed++;
    results.tests.push({ name: 'Calculate Total Revenue', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Calculate Total Revenue', status: 'FAIL', error: (error as Error).message });
  }

  // Test 6: Get all teams
  try {
    console.log('\n📋 Test 6: GET /api/teams');
    const teams = await teamsService.getAll();
    if (Array.isArray(teams)) {
      console.log(`✅ PASS - Retrieved ${teams.length} teams`);
      results.passed++;
      results.tests.push({ name: 'Get All Teams', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Teams', status: 'FAIL', error: (error as Error).message });
  }

  // Test 7: Verify team data structure
  try {
    console.log('\n📋 Test 7: Verify team data structure');
    const teams = await teamsService.getAll();
    if (teams.length > 0) {
      const team = teams[0];
      const requiredFields = ['id', 'eventId', 'teamName', 'teamLeaderName'];
      const missingFields = requiredFields.filter(field => !(field in team));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Team structure is valid`);
        console.log(`   Sample team: "${team.teamName}" led by ${team.teamLeaderName}`);
        results.passed++;
        results.tests.push({ name: 'Verify Team Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No teams to verify`);
      results.tests.push({ name: 'Verify Team Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Team Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 8: Search teams
  try {
    console.log('\n📋 Test 8: Search teams functionality');
    const teams = await teamsService.getAll();
    const searchResults = teamsService.searchTeams(teams, 'team');
    console.log(`✅ PASS - Search returned ${searchResults.length} results`);
    results.passed++;
    results.tests.push({ name: 'Search Teams', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Search Teams', status: 'FAIL', error: (error as Error).message });
  }

  // Test 9: Sort teams by name
  try {
    console.log('\n📋 Test 9: Sort teams by name');
    const teams = await teamsService.getAll();
    const sorted = teamsService.sortByName(teams);
    const isSorted = sorted.every((team, i) => 
      i === 0 || sorted[i - 1].teamName.localeCompare(team.teamName) <= 0
    );
    if (isSorted) {
      console.log(`✅ PASS - Teams sorted correctly`);
      results.passed++;
      results.tests.push({ name: 'Sort Teams by Name', status: 'PASS' });
    } else {
      throw new Error('Sorting failed');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Sort Teams by Name', status: 'FAIL', error: (error as Error).message });
  }

  // Test 10: Group teams by event
  try {
    console.log('\n📋 Test 10: Group teams by event');
    const teams = await teamsService.getAll();
    const grouped = teamsService.groupByEvent(teams);
    const eventCount = Object.keys(grouped).length;
    console.log(`✅ PASS - Grouped into ${eventCount} events`);
    results.passed++;
    results.tests.push({ name: 'Group Teams by Event', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Group Teams by Event', status: 'FAIL', error: (error as Error).message });
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
export default runRegistrationsAndTeamsTests;
