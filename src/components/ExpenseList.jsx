import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    supabase.from('expenses').select('*').order('created_at',{ascending:false}).then(({data}) => setExpenses(data));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow overflow-y-auto max-h-96">
      <h2 className="text-lg font-semibold mb-2">History</h2>
      {expenses.length === 0 ? <p>No expenses.</p> :
        expenses.map((e, i) => (
          <div key={i} className="flex items-center mb-2">
            <img src={e.receipt_url} alt="receipt" className="w-10 h-10 rounded mr-2"/>
            <div><p>${e.amount}</p><p className="text-sm line-clamp-2">{e.ocr_raw_text}</p></div>
          </div>
        ))
      }
    </div>
