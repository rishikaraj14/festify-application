'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runEventsAndCategoriesTests } from '@/tests/events-categories-integration.test';
import { runCollegesAndProfilesTests } from '@/tests/colleges-profiles-integration.test';
import { runRegistrationsAndTeamsTests } from '@/tests/registrations-teams-integration.test';
import { CheckCircle2, XCircle, Loader2, Play } from 'lucide-react';

type TestSuite = 'events-categories' | 'colleges-profiles' | 'registrations-teams';

export default function IntegrationTestPage() {
  const [runningEventsCategories, setRunningEventsCategories] = useState(false);
  const [runningCollegesProfiles, setRunningCollegesProfiles] = useState(false);
  const [runningRegistrationsTeams, setRunningRegistrationsTeams] = useState(false);
  const [eventsCategoriesResults, setEventsCategoriesResults] = useState<any>(null);
  const [collegesProfilesResults, setCollegesProfilesResults] = useState<any>(null);
  const [registrationsTeamsResults, setRegistrationsTeamsResults] = useState<any>(null);

  const runTests = async (suite: TestSuite) => {
    if (suite === 'events-categories') {
      setRunningEventsCategories(true);
      setEventsCategoriesResults(null);
      
      try {
        const testResults = await runEventsAndCategoriesTests();
        setEventsCategoriesResults(testResults);
      } catch (error) {
        console.error('Error running tests:', error);
        setEventsCategoriesResults({
          passed: 0,
          failed: 1,
          tests: [{ name: 'Test Execution', status: 'FAIL', error: (error as Error).message }],
        });
      } finally {
        setRunningEventsCategories(false);
      }
    } else if (suite === 'colleges-profiles') {
      setRunningCollegesProfiles(true);
      setCollegesProfilesResults(null);
      
      try {
        const testResults = await runCollegesAndProfilesTests();
        setCollegesProfilesResults(testResults);
      } catch (error) {
        console.error('Error running tests:', error);
        setCollegesProfilesResults({
          passed: 0,
          failed: 1,
          tests: [{ name: 'Test Execution', status: 'FAIL', error: (error as Error).message }],
        });
      } finally {
        setRunningCollegesProfiles(false);
      }
    } else if (suite === 'registrations-teams') {
      setRunningRegistrationsTeams(true);
      setRegistrationsTeamsResults(null);
      
      try {
        const testResults = await runRegistrationsAndTeamsTests();
        setRegistrationsTeamsResults(testResults);
      } catch (error) {
        console.error('Error running tests:', error);
        setRegistrationsTeamsResults({
          passed: 0,
          failed: 1,
          tests: [{ name: 'Test Execution', status: 'FAIL', error: (error as Error).message }],
        });
      } finally {
        setRunningRegistrationsTeams(false);
      }
    }
  };

  const renderTestResults = (results: any, running: boolean, suite: TestSuite) => (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => runTests(suite)}
          disabled={running}
          size="lg"
          className="gap-2"
        >
          {running ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Run Integration Tests
            </>
          )}
        </Button>
      </div>

      {results && (
        <div className="space-y-4">
          <Alert className={results.failed === 0 ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}>
            <AlertDescription className="text-lg font-semibold">
              {results.passed} / {results.passed + results.failed} tests passed 
              ({Math.round((results.passed / (results.passed + results.failed)) * 100)}% success rate)
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Test Results:</h3>
            {results.tests.map((test: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                {test.status === 'PASS' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{test.name}</div>
                  {test.error && (
                    <div className="text-sm text-red-600 mt-1">
                      Error: {test.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Check the browser console for detailed test output
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Backend Integration Tests</CardTitle>
          <CardDescription>
            Test the backend integration for all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="events-categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events-categories">Events & Categories</TabsTrigger>
              <TabsTrigger value="colleges-profiles">Colleges & Profiles</TabsTrigger>
              <TabsTrigger value="registrations-teams">Registrations & Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="events-categories" className="space-y-6">
              {renderTestResults(eventsCategoriesResults, runningEventsCategories, 'events-categories')}
            </TabsContent>
            <TabsContent value="colleges-profiles" className="space-y-6">
              {renderTestResults(collegesProfilesResults, runningCollegesProfiles, 'colleges-profiles')}
            </TabsContent>
            <TabsContent value="registrations-teams" className="space-y-6">
              {renderTestResults(registrationsTeamsResults, runningRegistrationsTeams, 'registrations-teams')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

