/**
 * Events & Categories Integration Tests
 * Tests backend integration for Events and Categories features
 */

import { eventsService } from '@/services/events.service';
import { categoriesService } from '@/services/categories.service';
import { EventStatus, ParticipationType } from '@/types/api';

/**
 * Run all integration tests for Events and Categories
 */
export async function runEventsAndCategoriesTests() {
  console.log('🧪 Starting Events & Categories Integration Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>,
  };

  // Test 1: Get all categories
  try {
    console.log('📋 Test 1: GET /api/categories');
    const categories = await categoriesService.getAll();
    if (Array.isArray(categories) && categories.length >= 0) {
      console.log(`✅ PASS - Retrieved ${categories.length} categories`);
      results.passed++;
      results.tests.push({ name: 'Get All Categories', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Categories', status: 'FAIL', error: (error as Error).message });
  }

  // Test 2: Get all events
  try {
    console.log('\n📋 Test 2: GET /api/events');
    const events = await eventsService.getAll();
    if (Array.isArray(events) && events.length >= 0) {
      console.log(`✅ PASS - Retrieved ${events.length} events`);
      results.passed++;
      results.tests.push({ name: 'Get All Events', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Events', status: 'FAIL', error: (error as Error).message });
  }

  // Test 3: Get upcoming events
  try {
    console.log('\n📋 Test 3: GET /api/events/upcoming');
    const upcomingEvents = await eventsService.getUpcoming();
    console.log(`✅ PASS - Retrieved ${upcomingEvents.length} upcoming events`);
    results.passed++;
    results.tests.push({ name: 'Get Upcoming Events', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get Upcoming Events', status: 'FAIL', error: (error as Error).message });
  }

  // Test 4: Get events by status (PUBLISHED)
  try {
    console.log('\n📋 Test 4: GET /api/events/status/PUBLISHED');
    const publishedEvents = await eventsService.getByStatus(EventStatus.PUBLISHED);
    console.log(`✅ PASS - Retrieved ${publishedEvents.length} published events`);
    results.passed++;
    results.tests.push({ name: 'Get Events by Status', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get Events by Status', status: 'FAIL', error: (error as Error).message });
  }

  // Test 5: Filter events by eligibility (no profile)
  try {
    console.log('\n📋 Test 5: Filter events by eligibility (public)');
    const events = await eventsService.getAll();
    const publicEvents = eventsService.filterByEligibility(events, null);
    console.log(`✅ PASS - Filtered to ${publicEvents.length} public events`);
    results.passed++;
    results.tests.push({ name: 'Filter Events (Public)', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Filter Events (Public)', status: 'FAIL', error: (error as Error).message });
  }

  // Test 6: Search and filter events
  try {
    console.log('\n📋 Test 6: Search and filter events');
    const events = await eventsService.getAll();
    const searchResults = eventsService.searchAndFilter(events, {
      searchTerm: 'tech',
    });
    console.log(`✅ PASS - Search returned ${searchResults.length} results`);
    results.passed++;
    results.tests.push({ name: 'Search Events', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Search Events', status: 'FAIL', error: (error as Error).message });
  }

  // Test 7: Verify event data structure
  try {
    console.log('\n📋 Test 7: Verify event data structure');
    const events = await eventsService.getAll();
    if (events.length > 0) {
      const event = events[0];
      const requiredFields = ['id', 'title', 'startDate', 'endDate', 'location', 'eventStatus'];
      const missingFields = requiredFields.filter(field => !(field in event));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Event structure is valid`);
        console.log(`   Sample event: "${event.title}" (${event.eventStatus})`);
        results.passed++;
        results.tests.push({ name: 'Verify Event Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No events to verify`);
      results.tests.push({ name: 'Verify Event Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Event Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 8: Verify category data structure
  try {
    console.log('\n📋 Test 8: Verify category data structure');
    const categories = await categoriesService.getAll();
    if (categories.length > 0) {
      const category = categories[0];
      const requiredFields = ['id', 'name'];
      const missingFields = requiredFields.filter(field => !(field in category));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - Category structure is valid`);
        console.log(`   Sample category: "${category.name}"`);
        results.passed++;
        results.tests.push({ name: 'Verify Category Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No categories to verify`);
      results.tests.push({ name: 'Verify Category Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify Category Structure', status: 'FAIL', error: (error as Error).message });
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
export default runEventsAndCategoriesTests;
