import React,{useEffect,useState} from 'react';
import { supabase } from '../supabase';
export function AdminPanel(){
  const [expenses,setExpenses]=useState([]);
  useEffect(()=>{ supabase.from('expenses').select('*').order('created_at',{ascending:false}).then(({data})=>setExpenses(data)); },[]);
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Admin Dashboard</h2>
      {expenses.map((e,i)=><div key={i} className="flex justify-between p-1 bg-gray-100 dark:bg-gray-600 rounded mb-1">
        <span>{e.vendor||'Unknown'}</span><span>${e.amount}</span>
      </div>)}
    </div>
