import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, Search, Filter, Trash2, Edit3, ArrowUpDown, Sparkles,
  Percent, AlertCircle, CheckCircle, Undo2, X, AlertTriangle,
  Tag, Download, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import StatusPill from '../../components/admin/StatusPill';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { formatINR, calcMargin } from '../../utils/adminUtils';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    darkMode,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    settings,
    addToast,
  } = useAdminStore();

  // Filters & State
  const [selectedIds, setSelectedIds] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all | low_stock | out_of_stock | no_sales | below_margin | live | draft

  // Handle URL search params on mount or change
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setStatusFilter(filterParam);
    }
  }, [searchParams]);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [bulkPricePercent, setBulkPricePercent] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    collection: 'Jewellery',
    cost: '',
    price: '',
    stock: '',
    status: 'Live',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const targetMargins = settings.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 };

  // Calculate live margin readout in form
  const liveCost = parseFloat(formData.cost) || 0;
  const livePrice = parseFloat(formData.price) || 0;
  const currentMargin = livePrice > 0 ? ((livePrice - liveCost) / livePrice) * 100 : 0;
  const targetForCollection = targetMargins[formData.collection] || 25;

  // Price suggestion from cost formula: price = cost / (1 - targetMargin / 100)
  const handleSuggestPrice = () => {
    if (!liveCost || liveCost <= 0) {
      setFormErrors(prev => ({ ...prev, cost: 'Enter a valid cost first' }));
      return;
    }
    const target = targetMargins[formData.collection] || 25;
    const suggested = Math.round(liveCost / (1 - target / 100));
    setFormData(prev => ({ ...prev, price: String(suggested) }));
    setFormErrors(prev => ({ ...prev, price: undefined }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      collection: 'Jewellery',
      cost: '',
      price: '',
      stock: '10',
      status: 'Live',
      image: '',
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      collection: p.collection,
      cost: String(p.cost),
      price: String(p.price),
      stock: String(p.stock),
      status: p.status,
      image: p.image || '',
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.cost || parseFloat(formData.cost) <= 0) errors.cost = 'Enter a valid cost (> 0)';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Enter a valid price (> 0)';
    if (formData.stock === '' || parseInt(formData.stock, 10) < 0) errors.stock = 'Enter valid stock (≥ 0)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      collection: formData.collection,
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      status: formData.status,
      image: formData.image.trim() || undefined,
    };

    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, payload);
      if (!updated) return;
      addToast({ type: 'success', message: `Updated "${payload.name}" successfully` });
    } else {
      const added = await addProduct(payload);
      if (!added) return;
      addToast({ type: 'success', message: `Added "${payload.name}" to catalog` });
    }

    setEditModalOpen(false);
  };

  // Single delete with 8-second undo toast
  const handleDeleteWithUndo = async (product) => {
    const deleted = await deleteProduct(product.id);
    if (!deleted) return;
    addToast({
      type: 'info',
      message: `Deleted "${product.name}"`,
      duration: 8000,
      undoAction: async () => {
        const restored = await addProduct(product);
        if (restored) addToast({ type: 'success', message: `Restored "${product.name}"` });
      },
    });
  };

  // Bulk actions
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    const updated = await bulkUpdateProducts(selectedIds, { status: newStatus });
    if (!updated) return;
    addToast({ type: 'success', message: `Updated ${selectedIds.length} products to ${newStatus}` });
    setSelectedIds([]);
  };

  const handleApplyBulkPrice = async () => {
    const pct = parseFloat(bulkPricePercent);
    if (isNaN(pct) || pct === 0) {
      addToast({ type: 'error', message: 'Please enter a valid non-zero percentage' });
      return;
    }
    const factor = 1 + (pct / 100);
    const updates = products.filter(p => selectedIds.includes(p.id)).map(p => {
      const newPrice = Math.max(1, Math.round(p.price * factor));
      return updateProduct(p.id, { price: newPrice });
    });
    const results = await Promise.all(updates);
    if (results.some(result => !result)) return;
    addToast({
      type: 'success',
      message: `Updated prices for ${selectedIds.length} products (${pct > 0 ? `+${pct}%` : `${pct}%`})`,
    });
    setSelectedIds([]);
    setBulkPriceModalOpen(false);
    setBulkPricePercent('');
  };

  const handleExecuteBulkDelete = async () => {
    const deleted = await bulkDeleteProducts(selectedIds);
    if (!deleted) return;
    addToast({ type: 'success', message: `Deleted ${selectedIds.length} products` });
    setSelectedIds([]);
  };

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    const lowStockThreshold = settings.lowStockThreshold || 5;
    return products.filter(p => {
      // Collection filter
      if (collectionFilter !== 'All' && p.collection !== collectionFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'live') return p.status === 'Live';
      if (statusFilter === 'draft') return p.status === 'Draft';
      if (statusFilter === 'low_stock') {
        return p.status === 'Live' && p.stock > 0 && p.stock <= lowStockThreshold;
      }
      if (statusFilter === 'out_of_stock') {
        return p.status === 'Live' && (p.stock === 0 || p.stock == null);
      }
      if (statusFilter === 'no_sales') {
        return p.status === 'Live' && (p.soldLast30 === 0 || !p.soldLast30);
      }
      if (statusFilter === 'below_margin') {
        const m = calcMargin(p.cost, p.price);
        const target = targetMargins[p.collection] || 25;
        return m < target;
      }
      return true;
    });
  }, [products, collectionFilter, statusFilter, settings, targetMargins]);

  // Unsold count for cleanup banner
  const unsoldProducts = useMemo(() => {
    return products.filter(p => p.status === 'Live' && (!p.soldLast30 || p.soldLast30 === 0));
  }, [products]);

  // Table columns definition
  const columns = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0 border border-inherit">
            {row.image ? (
              <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stone-400">
                {row.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="font-semibold block truncate text-stone-900 dark:text-white">
              {row.name}
            </span>
            <span className="text-[11px] text-stone-400 block font-mono">
              {row.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'collection',
      header: 'Collection',
      sortable: true,
      render: (val) => (
        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
          {val}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (val, row) => {
        const low = settings.lowStockThreshold || 5;
        let pillColor = 'text-stone-700 dark:text-stone-300';
        if (val === 0) pillColor = 'text-rose-600 font-bold';
        else if (val <= low) pillColor = 'text-amber-600 font-bold';
        return (
          <span className={`text-xs ${pillColor}`}>
            {val === 0 ? 'Out of stock' : `${val} units`}
          </span>
        );
      },
    },
    {
      key: 'cost',
      header: 'Cost',
      sortable: true,
      render: (val) => <span className="text-xs font-mono text-stone-500">{formatINR(val)}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-bold font-serif text-[#1e1519] dark:text-stone-100">
          {formatINR(val, { compact: false })}
        </span>
      ),
    },
    {
      key: 'margin',
      header: 'Margin %',
      sortable: true,
      render: (_, row) => {
        const m = calcMargin(row.cost, row.price);
        const target = targetMargins[row.collection] || 25;
        const isHealthy = m >= target;
        const isClose = m >= target - 5;
        const color = isHealthy ? '#1d8f6a' : isClose ? '#d9801a' : '#c4425e';

        return (
          <div className="inline-flex items-center gap-1.5 font-semibold text-xs" style={{ color }}>
            <span>{m}%</span>
            <span className="text-[10px] text-stone-400 font-normal">
              (tgt {target}%)
            </span>
          </div>
        );
      },
    },
    {
      key: 'soldLast30',
      header: '30d sales',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
          {val || 0} sold
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (val) => <StatusPill status={val} size="xs" />,
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label={`Edit ${row.name}`}
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${row.name}`}
            onClick={() => handleDeleteWithUndo(row)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-[#1e1519]'
            }`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Product inventory
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Manage collection stock, pricing margins, and catalog statuses
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
        >
          <Plus className="w-4 h-4" />
          Add product
        </button>
      </div>

      {/* ── Cleanup Banner for Unsold Products ── */}
      {unsoldProducts.length > 0 && (
        <div
          className="rounded-[18px] p-4 sm:p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(122, 79, 209, 0.12), rgba(30, 21, 25, 0.7))'
              : 'linear-gradient(135deg, #f7f3fd, #f2ebfc)',
            borderColor: 'rgba(122, 79, 209, 0.3)',
          }}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#7a4fd1]/20 text-[#7a4fd1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4
                className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-[#1e1519]'}`}
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Catalog cleanup recommendation: {unsoldProducts.length} unsold items in 30 days
              </h4>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                Recommended strategy: Cut price by 20% → Re-check sales in 2 weeks → Move to Draft if dormant → Delete.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setStatusFilter('no_sales');
                setSearchParams({ filter: 'no_sales' });
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#7a4fd1] text-white hover:opacity-90 transition-opacity"
            >
              Filter unsold ({unsoldProducts.length})
            </button>
            <button
              onClick={() => {
                const ids = unsoldProducts.map(p => p.id);
                bulkUpdateProducts(ids, { status: 'Draft' });
                addToast({ type: 'info', message: `Moved ${ids.length} unsold products to Draft` });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                darkMode ? 'border-white/10 text-stone-300 hover:bg-white/5' : 'border-stone-300 text-stone-700 hover:bg-white'
              }`}
            >
              Draft all unsold
            </button>
          </div>
        </div>
      )}

      {/* ── Filters Bar ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Collection Filter */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#181416] p-1 rounded-xl border border-[#e9e3dd] dark:border-white/10 shadow-sm">
          {['All', 'Jewellery', 'Makeup', 'Nails', 'Candles'].map(col => (
            <button
              key={col}
              onClick={() => setCollectionFilter(col)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                collectionFilter === col
                  ? 'bg-[#b58a2a] text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            if (e.target.value === 'all') setSearchParams({});
            else setSearchParams({ filter: e.target.value });
          }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
            darkMode
              ? 'bg-[#181416] border-white/10 text-stone-200'
              : 'bg-white border-[#e9e3dd] text-stone-700 shadow-sm'
          }`}
        >
          <option value="all">All statuses</option>
          <option value="live">Live only</option>
          <option value="draft">Draft only</option>
          <option value="low_stock">Low stock (≤ {settings.lowStockThreshold || 5})</option>
          <option value="out_of_stock">Out of stock (0 units)</option>
          <option value="no_sales">No sales in 30 days</option>
          <option value="below_margin">Below target margin</option>
        </select>

        {statusFilter !== 'all' && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchParams({});
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset filter
          </button>
        )}
      </div>

      {/* ── Bulk Actions Toolbar (when rows selected) ── */}
      {selectedIds.length > 0 && (
        <div
          className="rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs border"
          style={{
            backgroundColor: darkMode ? '#1e1519' : '#fcf9f2',
            borderColor: '#b58a2a',
          }}
        >
          <span className="font-semibold text-[#b58a2a]">
            {selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setBulkPriceModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-[#b58a2a] text-[#b58a2a] hover:bg-[#b58a2a]/10 font-semibold"
            >
              Adjust price %
            </button>
            <button
              onClick={() => handleBulkStatus('Live')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Make live
            </button>
            <button
              onClick={() => handleBulkStatus('Draft')}
              className="px-2.5 py-1.5 rounded-lg bg-stone-500 text-white font-semibold hover:bg-stone-600"
            >
              Move to draft
            </button>
            <button
              onClick={() => setConfirmBulkDelete(true)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* ── Main Data Table ── */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyField="id"
        selectable
        selectedIds={selectedIds}
        onSelect={(id, checked) => {
          setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
        }}
        onSelectAll={(checked, pageIds) => {
          if (checked) {
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
          } else {
            setSelectedIds(prev => prev.filter(x => !pageIds.includes(x)));
          }
        }}
        searchPlaceholder="Search product by name or ID..."
        searchKeys={['name', 'id', 'collection']}
        pageSize={10}
        emptyMessage="No products match the selected filters."
      />

      {/* ── Add / Edit Product Modal ── */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingProduct ? 'Edit product' : 'Add new product'}
        subtitle="Manage SKU information, cost, retail pricing, and live margin"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Product name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. 22K peacock jhumka earrings"
              className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
              }`}
            />
            {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Collection
              </label>
              <select
                value={formData.collection}
                onChange={(e) => setFormData(p => ({ ...p, collection: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              >
                <option value="Jewellery">Jewellery (Tgt 18%)</option>
                <option value="Makeup">Makeup (Tgt 45%)</option>
                <option value="Nails">Nails (Tgt 55%)</option>
                <option value="Candles">Candles (Tgt 60%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Stock quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))}
                placeholder="10"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {formErrors.stock && <p className="text-[11px] text-rose-500 mt-1">{formErrors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Artisan / Supplier cost (₹) *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={formData.cost}
                onChange={(e) => setFormData(p => ({ ...p, cost: e.target.value }))}
                placeholder="e.g. 18500"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {formErrors.cost && <p className="text-[11px] text-rose-500 mt-1">{formErrors.cost}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Retail price (₹) *
                </label>
                <button
                  type="button"
                  onClick={handleSuggestPrice}
                  className="text-[11px] font-semibold text-[#b58a2a] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggest from cost
                </button>
              </div>
              <input
                type="number"
                min="1"
                step="any"
                value={formData.price}
                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                placeholder="e.g. 22600"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {formErrors.price && <p className="text-[11px] text-rose-500 mt-1">{formErrors.price}</p>}
            </div>
          </div>

          {/* Live margin readout card */}
          <div
            className="p-3.5 rounded-xl border text-xs flex items-center justify-between"
            style={{
              backgroundColor: darkMode ? '#1e1519' : '#fcf9f2',
              borderColor: 'rgba(181, 138, 42, 0.3)',
            }}
          >
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Live calculated margin:
              </span>
              <span
                className="ml-2 font-bold font-serif text-sm"
                style={{
                  color: currentMargin >= targetForCollection ? '#1d8f6a' : '#c4425e',
                }}
              >
                {livePrice > 0 ? `${currentMargin.toFixed(1)}%` : '—'}
              </span>
            </div>
            <div className="text-[11px] text-stone-500">
              Target for {formData.collection}: {targetForCollection}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Catalog status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              >
                <option value="Live">Live (visible in store)</option>
                <option value="Draft">Draft (hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Image URL (optional)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-inherit">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                darkMode ? 'border-white/10 text-stone-300 hover:bg-white/5' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
            >
              {editingProduct ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Bulk Adjust Price % Modal ── */}
      <Modal
        open={bulkPriceModalOpen}
        onClose={() => setBulkPriceModalOpen(false)}
        title="Bulk adjust prices"
        subtitle={`Apply a percentage adjustment across ${selectedIds.length} selected products`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Enter positive percentage to increase price (e.g. <code>10</code> for +10%), or negative percentage to apply a discount (e.g. <code>-20</code> for 20% off).
          </p>
          <div>
            <label className="block text-xs font-semibold mb-1">Percentage change (%)</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={bulkPricePercent}
                onChange={(e) => setBulkPricePercent(e.target.value)}
                placeholder="-20 or 15"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBulkPriceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyBulkPrice}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#b58a2a] hover:opacity-90"
            >
              Apply adjustment
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Confirm Bulk Delete Dialog ── */}
      <ConfirmDialog
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        onConfirm={handleExecuteBulkDelete}
        title={`Delete ${selectedIds.length} selected products?`}
        message="These products will be removed from the catalog. You can restore default demo products anytime from Settings."
        confirmText="Delete products"
      />
    </div>
  );
}
