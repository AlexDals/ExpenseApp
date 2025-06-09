import React, { useEffect, useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { ExpenseList } from './components/ExpenseList';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './supabase';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('users').select('role').eq('id', user.id).single()
          .then(({ data }) => setUserRole(data?.role));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <header className="bg-white dark:bg-gray-700 shadow p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Expense Report App</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-200 dark:bg-gray-600 rounded">
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400"/> : <MoonIcon className="w-6 h-6 text-gray-900"/>}
        </button>
      </header>
      <main className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4"><UploadForm/><ExpenseList/></div>
        {userRole==='admin' && <AdminPanel/>}
      </main>
    </div>
