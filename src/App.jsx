import React from 'react';
import { UploadForm } from './components/UploadForm';
import { ExpenseList } from './components/ExpenseList';

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🧾 Expense Report App</h1>
      <UploadForm />
      <hr style={{ margin: '2rem 0' }} />
      <ExpenseList />
    </div>
  );
}