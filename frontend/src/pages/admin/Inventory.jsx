import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, LoaderCircle } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import { formatDate } from '../../utils/adminUtils';
import { useSocket } from '../../context/SocketContext';

export default function Inventory() {
  const {
    darkMode,
    products,
    inventoryAdjustments,
    loadInventoryAdjustments,
    adjustInventory,
    addToast,
    settings
  } = useAdminStore();
  const { socket } = useSocket();
  const [productId, setProductId] = useState('');
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInventoryAdjustments().finally(() => setLoading(false));
  }, [loadInventoryAdjustments]);

  useEffect(() => {
    if (!socket) return undefined;
    socket.on('admin:data:changed', loadInventoryAdjustments);
    return () => socket.off('admin:data:changed', loadInventoryAdjustments);
  }, [socket, loadInventoryAdjustments]);

  const selectedProductId = productId || products[0]?.id || '';
  const selectedProduct = products.find((product) => product.id === selectedProductId);
  const lowStockThreshold = settings.lowStockThreshold || 5;
  const lowStock = useMemo(
    () => products.filter((product) => product.stock <= lowStockThreshold).length,
    [products, lowStockThreshold]
  );

  const submitAdjustment = async (event) => {
    event.preventDefault();
    const change = Number(delta);
    if (!selectedProductId || !Number.isInteger(change) || change === 0 || !reason.trim()) return;
    setSaving(true);
    const result = await adjustInventory(selectedProductId, { delta: change, reason: reason.trim() });
    setSaving(false);
    if (!result) return;
    addToast({ type: 'success', message: `${result.product.name} stock updated to ${result.product.stock}` });
    setDelta('');
    setReason('');
  };

  const surface = darkMode ? 'bg-[#1a1717] border-white/10' : 'bg-white border-[#e7dfd1]';
  const heading = darkMode ? 'text-white' : 'text-[#241b18]';
  const muted = darkMode ? 'text-stone-400' : 'text-stone-500';
  const input = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 ${
    darkMode ? 'border-white/10 bg-black/20 text-white' : 'border-stone-200 bg-white text-stone-800'
  }`;

  return (
    <section className="space-y-6">
      <header>
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c37]">
          <Boxes className="h-3.5 w-3.5" /> Stock control
        </p>
        <h1 className={`font-serif text-3xl font-semibold sm:text-4xl ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Inventory
        </h1>
        <p className={`mt-1 text-sm ${muted}`}>Adjust stock with a reason and keep a traceable history of the latest 50 changes per product.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`rounded-2xl border p-4 ${surface}`}>
          <p className={`text-xs ${muted}`}>Catalog items</p>
          <p className={`mt-1 text-2xl font-semibold ${heading}`}>{products.length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${surface}`}>
          <p className={`text-xs ${muted}`}>Low stock ({lowStockThreshold} or fewer)</p>
          <p className={`mt-1 flex items-center gap-2 text-2xl font-semibold ${lowStock ? 'text-amber-500' : heading}`}>
            {lowStock ? <AlertTriangle className="h-5 w-5" /> : null}{lowStock}
          </p>
        </div>
        <div className={`rounded-2xl border p-4 ${surface}`}>
          <p className={`text-xs ${muted}`}>Recorded adjustments</p>
          <p className={`mt-1 text-2xl font-semibold ${heading}`}>{inventoryAdjustments.length}</p>
        </div>
      </div>

      <form onSubmit={submitAdjustment} className={`grid gap-4 rounded-2xl border p-5 md:grid-cols-4 md:items-end ${surface}`}>
        <label className="block text-xs font-semibold">
          <span className={heading}>Product</span>
          <select required value={selectedProductId} onChange={(event) => setProductId(event.target.value)} className={`${input} mt-1`}>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name} · stock {product.stock}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold">
          <span className={heading}>Stock change (+/- units)</span>
          <input required type="number" step="1" value={delta} onChange={(event) => setDelta(event.target.value)} placeholder="e.g. 12 or -2" className={`${input} mt-1`} />
          {selectedProduct && <span className={`mt-1 block font-normal ${muted}`}>Current: {selectedProduct.stock} · New: {Number(selectedProduct.stock) + (Number(delta) || 0)}</span>}
        </label>
        <label className="block text-xs font-semibold">
          <span className={heading}>Reason</span>
          <input required maxLength={160} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Stock received, damaged, correction…" className={`${input} mt-1`} />
        </label>
        <button type="submit" disabled={saving || !products.length} className="rounded-xl bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? 'Saving…' : 'Adjust stock'}
        </button>
      </form>

      <div className={`overflow-hidden rounded-2xl border ${surface}`}>
        <div className={`border-b px-5 py-4 ${darkMode ? 'border-white/10' : 'border-stone-100'}`}>
          <h2 className={`font-serif text-xl font-semibold ${heading}`}>Recent stock history</h2>
          <p className={`mt-0.5 text-xs ${muted}`}>Latest 200 recorded changes across products.</p>
        </div>
        {loading ? (
          <div className={`flex justify-center gap-2 p-10 text-sm ${muted}`}><LoaderCircle className="h-4 w-4 animate-spin" /> Loading history…</div>
        ) : inventoryAdjustments.length === 0 ? (
          <p className={`p-8 text-center text-sm ${muted}`}>No inventory changes recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className={darkMode ? 'bg-white/5 text-stone-400' : 'bg-[#faf8f3] text-stone-500'}>
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold">Product</th>
                  <th className="px-5 py-3 text-xs font-semibold">Change</th>
                  <th className="px-5 py-3 text-xs font-semibold">Stock</th>
                  <th className="px-5 py-3 text-xs font-semibold">Reason</th>
                  <th className="px-5 py-3 text-xs font-semibold">When / who</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-stone-100'}`}>
                {inventoryAdjustments.map((entry, index) => (
                  <tr key={`${entry.productId}-${entry.adjustedAt}-${index}`}>
                    <td className={`px-5 py-3 font-medium ${heading}`}>{entry.productName}</td>
                    <td className={`px-5 py-3 font-semibold ${entry.delta > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <span className="inline-flex items-center gap-1">
                        {entry.delta > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {entry.delta > 0 ? '+' : ''}{entry.delta}
                      </span>
                    </td>
                    <td className={`px-5 py-3 ${muted}`}>{entry.previousStock} → {entry.newStock}</td>
                    <td className={`px-5 py-3 ${muted}`}>{entry.reason}</td>
                    <td className={`px-5 py-3 text-xs ${muted}`}>{formatDate(entry.adjustedAt)}<br />{entry.adjustedBy || 'Admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
