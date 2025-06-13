'use client';

export default function ItemTable({ items, onRefresh }) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function handleDelete(id) {
    await fetch(`${API}/items/${id}`, { method: 'DELETE' });
    onRefresh();
  }

  async function handleUpdate(id, quantity) {
    await fetch(`${API}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    onRefresh();
  }

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Quantity</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="text-center">
            <td className="p-2 border">{item.name}</td>
            <td className="p-2 border">
              <input
                className="w-16 border rounded p-1"
                type="number"
                defaultValue={item.quantity}
                onBlur={(e) => handleUpdate(item._id, parseInt(e.target.value))}
              />
            </td>
            <td className="p-2 border">${item.price.toFixed(2)}</td>
            <td className="p-2 border">
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
