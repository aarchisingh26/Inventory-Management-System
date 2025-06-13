'use client';

import { useState, useEffect } from 'react';
import ItemTable from './components/ItemTable';

export default function Home() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '' });

  const API = process.env.NEXT_PUBLIC_API_URL;

  async function fetchItems() {
    const res = await fetch(`${API}/items`);
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    await fetch(`${API}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
      }),
    });
    setForm({ name: '', quantity: '', price: '' });
    fetchItems();
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📦 Inventory Tracker</h1>

      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-fit">Add Item</button>
      </form>

      <ItemTable items={items} onRefresh={fetchItems} />
    </main>
  );
}
