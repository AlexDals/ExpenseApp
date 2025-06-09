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
      const amt = text.match(/\$?\d+\.\d{2}/);
      if (amt) setAmount(amt[0]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file || !ocrText) return alert('Upload and OCR first.');
    const { data, error } = await supabase.storage.from('receipts').upload(`public/${file.name}`, file, { upsert: true });
    if (error) return alert('Upload failed');
    const url = `${supabase.storage.from('receipts').getPublicUrl(`public/${file.name}`).data.publicUrl}`;
    await supabase.from('expenses').insert({ amount, ocr_raw_text: ocrText, receipt_url: url });
    alert('Saved!');
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" />
      <button onClick={handleOCR}>Run OCR</button>
      {loading && <p>Processing...</p>}
      <textarea value={ocrText} onChange={e => setOcrText(e.target.value)} rows={10} cols={50} />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button onClick={handleUpload}>Save to DB</button>
    </div>
  );
}