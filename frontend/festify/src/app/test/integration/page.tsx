'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { runEventsAndCategoriesTests } from '@/tests/events-categories-integration.test';
import { CheckCircle2, XCircle, Loader2, Play } from 'lucide-react';

export default function IntegrationTestPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setRunning(true);
    setResults(null);
    
    try {
      const testResults = await runEventsAndCategoriesTests();
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
      setResults({
        passed: 0,
        failed: 1,
        tests: [{ name: 'Test Execution', status: 'FAIL', error: (error as Error).message }],
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Events & Categories Integration Tests</CardTitle>
          <CardDescription>
            Test the backend integration for Events and Categories features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={runTests}
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
        </CardContent>
      </Card>
    </div>
  );
}
