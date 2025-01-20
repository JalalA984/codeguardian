  // src/App.tsx
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  
  import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import CodeReview from './pages/CodeReview';
import Login from './pages/Login';

  
  const queryClient = new QueryClient();
  
  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/review" element={<CodeReview/>} />
                <Route path="/login" element={<Login/>} />
              </Routes>
            </div>
          </div>
        </Router>
      </QueryClientProvider>
    );
  }
  
  export default App;