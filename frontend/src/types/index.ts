// src/types/index.ts
export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface CodeSubmission {
    id: string;
    code: string;
    language: string;
    timestamp: string;
    status: 'pending' | 'analyzing' | 'completed' | 'error';
  }
  


  
