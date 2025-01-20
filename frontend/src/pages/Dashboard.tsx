// src/pages/Dashboard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ReviewItem {
  id: string;
  language: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  score: number;
}

export default function Dashboard() {
  const [recentReviews] = useState<ReviewItem[]>([
    {
      id: '1',
      language: 'Python',
      status: 'completed',
      timestamp: '2024-01-20',
      score: 85,
    },
    {
      id: '2',
      language: 'JavaScript',
      status: 'pending',
      timestamp: '2024-01-19',
      score: 0,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/review" className="btn-primary">
          New Review
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary-50">
          <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-primary-600">24</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">78%</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-lg font-semibold mb-2">Security Issues Found</h3>
          <p className="text-3xl font-bold text-purple-600">12</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="px-6 py-4">{review.id}</td>
                  <td className="px-6 py-4">{review.language}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      review.status === 'completed' ? 'bg-green-100 text-green-800' :
                      review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{review.timestamp}</td>
                  <td className="px-6 py-4">{review.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}