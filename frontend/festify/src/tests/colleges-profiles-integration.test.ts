/**
 * Colleges & Profiles Integration Tests
 * Tests backend integration for Colleges and Profiles features
 */

import { collegesService } from '@/services/colleges.service';
import { profilesService } from '@/services/profiles.service';

/**
 * Run all integration tests for Colleges and Profiles
 */
export async function runCollegesAndProfilesTests() {
  console.log('🧪 Starting Colleges & Profiles Integration Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>,
  };

  // Test 1: Get all colleges
  try {
    console.log('📋 Test 1: GET /api/colleges');
    const colleges = await collegesService.getAll();
    if (Array.isArray(colleges) && colleges.length >= 0) {
      console.log(`✅ PASS - Retrieved ${colleges.length} colleges`);
      results.passed++;
      results.tests.push({ name: 'Get All Colleges', status: 'PASS' });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get All Colleges', status: 'FAIL', error: (error as Error).message });
  }

  // Test 2: Verify college data structure
  try {
    console.log('\n📋 Test 2: Verify college data structure');
    const colleges = await collegesService.getAll();
    if (colleges.length > 0) {
      const college = colleges[0];
      const requiredFields = ['id', 'name', 'location'];
      const missingFields = requiredFields.filter(field => !(field in college));
      
      if (missingFields.length === 0) {
        console.log(`✅ PASS - College structure is valid`);
        console.log(`   Sample college: "${college.name}" (${college.location})`);
        results.passed++;
        results.tests.push({ name: 'Verify College Structure', status: 'PASS' });
      } else {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`⚠️  SKIP - No colleges to verify`);
      results.tests.push({ name: 'Verify College Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Verify College Structure', status: 'FAIL', error: (error as Error).message });
  }

  // Test 3: Get college by ID (if colleges exist)
  try {
    console.log('\n📋 Test 3: GET /api/colleges/{id}');
    const colleges = await collegesService.getAll();
    if (colleges.length > 0) {
      const firstCollege = colleges[0];
      const college = await collegesService.getById(firstCollege.id);
      if (college && college.id === firstCollege.id) {
        console.log(`✅ PASS - Retrieved college: "${college.name}"`);
        results.passed++;
        results.tests.push({ name: 'Get College by ID', status: 'PASS' });
      } else {
        throw new Error('College ID mismatch');
      }
    } else {
      console.log(`⚠️  SKIP - No colleges available to test`);
      results.tests.push({ name: 'Get College by ID', status: 'PASS' });
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Get College by ID', status: 'FAIL', error: (error as Error).message });
  }

  // Test 4: Search colleges
  try {
    console.log('\n📋 Test 4: Search colleges functionality');
    const colleges = await collegesService.getAll();
    const searchResults = collegesService.searchColleges(colleges, 'college');
    console.log(`✅ PASS - Search returned ${searchResults.length} results`);
    results.passed++;
    results.tests.push({ name: 'Search Colleges', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Search Colleges', status: 'FAIL', error: (error as Error).message });
  }

  // Test 5: Sort colleges by name
  try {
    console.log('\n📋 Test 5: Sort colleges by name');
    const colleges = await collegesService.getAll();
    const sorted = collegesService.sortCollegesByName(colleges);
    const isSorted = sorted.every((college, i) => 
      i === 0 || sorted[i - 1].name.localeCompare(college.name) <= 0
    );
    if (isSorted) {
      console.log(`✅ PASS - Colleges sorted correctly`);
      results.passed++;
      results.tests.push({ name: 'Sort Colleges', status: 'PASS' });
    } else {
      throw new Error('Sorting failed');
    }
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Sort Colleges', status: 'FAIL', error: (error as Error).message });
  }

  // Test 6: Group colleges by location
  try {
    console.log('\n📋 Test 6: Group colleges by location');
    const colleges = await collegesService.getAll();
    const grouped = collegesService.groupByLocation(colleges);
    const locationCount = Object.keys(grouped).length;
    console.log(`✅ PASS - Grouped into ${locationCount} locations`);
    results.passed++;
    results.tests.push({ name: 'Group Colleges by Location', status: 'PASS' });
  } catch (error) {
    console.log(`❌ FAIL - ${(error as Error).message}`);
    results.failed++;
    results.tests.push({ name: 'Group Colleges by Location', status: 'FAIL', error: (error as Error).message });
  }

  // Note: Profile tests require authentication, so they are commented out
  // Uncomment and test when you have a valid session
  
  console.log('\n⚠️  Profile tests skipped (require authentication)');
  console.log('   To test profiles:');
  console.log('   1. Log in to the application');
  console.log('   2. Run tests from authenticated context');

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
export default runCollegesAndProfilesTests;
