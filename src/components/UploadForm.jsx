// File: src/components/UploadForm.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { supabase } from '../supabase';

export function UploadForm() {
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
    if (!file || !ocrText) { alert('Upload and run OCR first.'); return; }
    const { error } = await supabase.storage.from('receipts').upload(`public/${file.name}`, file, { upsert: true });
    if (error) { alert('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(`public/${file.name}`);
    await supabase.from('expenses').insert({ amount, ocr_raw_text: ocrText, receipt_url: publicUrl });
    alert('Saved'); setFile(null); setOcrText(''); setAmount('');
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
      <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} className="block w-full mb-4" />
      <button onClick={handleOCR} disabled={!file} className="w-full py-2 bg-blue-600 text-white rounded mb-4">{loading ? 'Processing...' : 'Run OCR'}</button>
      {ocrText && (
        <textarea value={ocrText} onChange={e => setOcrText(e.target.value)} rows={6} className="w-full mb-4 p-2 border rounded" />
      )}
      {ocrText && (
        <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full mb-4 p-2 border rounded" />
      )}
      <button onClick={handleUpload} disabled={!ocrText} className="w-full py-2 bg-green-600 text-white rounded">Save Expense</button>
    </div>
  );
}
