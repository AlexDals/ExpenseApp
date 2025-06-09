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
    if (!file || !ocrText) return alert('Please upload and run OCR first.');
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(`public/${file.name}`, file, { upsert: true });
    if (error) return alert('Upload failed');
    const url = supabase.storage.from('receipts').getPublicUrl(`public/${file.name}`).data.publicUrl;
    await supabase.from('expenses').insert({ amount, ocr_raw_text: ocrText, receipt_url: url });
    alert('Expense saved!');
    setFile(null);
    setOcrText('');
    setAmount('');
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Receipt</h2>
      <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} className="mb-2"/>
      <button onClick={handleOCR} disabled={!file} className="w-full py-2 bg-blue-600 text-white rounded mb-2">{loading?'Processing...':'Run OCR'}</button>
      {ocrText && <textarea value={ocrText} onChange={e=>setOcrText(e.target.value)} rows={4} className="w-full mb-2 p-2"/>}
      {ocrText && <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="w-full mb-2 p-2"/>}
      <button onClick={handleUpload} disabled={!ocrText} className="w-full py-2 bg-green-600 text-white rounded">Save Expense</button>
    </div>
