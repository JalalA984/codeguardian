// src/pages/CodeReview.tsx
import CodeEditor from '../components/CodeEditor';
import { useState } from 'react';

interface ReviewResult {
  issues: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    line: number;
  }>;
  suggestions: string[];
}

export default function CodeReview() {
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const handleCodeSubmit = async (code: string, language: string) => {
    // TODO: Implement actual API call
    setReviewResult({
      issues: [
        {
          id: '1',
          severity: 'high',
          message: 'Potential SQL injection vulnerability detected',
          line: 15,
        },
        {
          id: '2',
          severity: 'medium',
          message: 'Unsafe password hashing method',
          line: 23,
        },
      ],
      suggestions: [
        'Consider using parameterized queries',
        'Use bcrypt for password hashing',
      ],
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Code Review</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CodeEditor onSubmit={handleCodeSubmit} />
        </div>
        
        <div className="space-y-6">
          {reviewResult && (
            <>
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Security Issues</h2>
                <div className="space-y-4">
                  {reviewResult.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-lg ${
                        issue.severity === 'high' ? 'bg-red-50 border-red-200' :
                        issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Line {issue.line}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{issue.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
                <ul className="space-y-2">
                  {reviewResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-4 h-4 mt-1 mr-2 text-primary-600">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}