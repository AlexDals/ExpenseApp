// src/components/UploadForm.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { supabase } from '../supabase';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleOCR = async () => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const { data: { text } } = await Tesseract.recognize(reader.result, 'eng');
      setOcrText(text);
      const match = text.match(/\$?\d+\.\d{2}/);
      if (match) setAmount(match[0]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file || !ocrText) { alert('Please upload and run OCR first.'); return; }
    const { data, error } = await supabase.storage.from('receipts').upload(`public/${file.name}`, file, { upsert: true });
    if (error) { alert('Upload failed'); return; }
    const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(`public/${file.name}`);
    await supabase.from('expenses').insert({ amount, ocr_raw_text: ocrText, receipt_url: urlData.publicUrl });
    alert('Expense saved!');
    setFile(null); setOcrText(''); setAmount('');
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Upload Receipt</h2>
      <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} className="block w-full text-gray-700 dark:text-gray-300 mb-4" />
      <button onClick={handleOCR} disabled={!file} className="w-full mb-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition">{loading ? 'Processing...' : 'Run OCR'}</button>
      {ocrText && <textarea value={ocrText} onChange={e => setOcrText(e.target.value)} rows={6} className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />}
      {ocrText && <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />}
      <button onClick={handleUpload} disabled={!ocrText} className="w-full py-2 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition">Save Expense</button>
    </div>
}
