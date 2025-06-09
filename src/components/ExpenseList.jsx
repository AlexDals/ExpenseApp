import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      setExpenses(data);
    };
    load();
  }, []);

  return (
    <div>
      <h2>📑 Expenses</h2>
      {expenses.map((e, i) => (
        <div key={i} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <img src={e.receipt_url} alt="receipt" style={{ maxWidth: 200 }} />
          <p><b>Amount:</b> {e.amount}</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{e.ocr_raw_text}</pre>
        </div>
      ))}
    </div>
  );
}