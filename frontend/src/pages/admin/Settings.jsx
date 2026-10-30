import React, { useEffect, useState, useRef } from 'react';
import {
  Save, Download, Upload, Moon, Sun
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import ChartCard from '../../components/admin/ChartCard';

export default function Settings() {
  const {
    darkMode,
    toggleDark,
    settings,
    updateSettings,
    exportData,
    importData,
    addToast,
  } = useAdminStore();

  const fileInputRef = useRef(null);

  // Form State
  const [storeName, setStoreName] = useState(settings.storeName || "Nihara D'Aura");
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold || 5);
  const [targetMargins, setTargetMargins] = useState(
    settings.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 }
  );

  useEffect(() => {
    setStoreName(settings.storeName || "Nihara D'Aura");
    setLowStockThreshold(settings.lowStockThreshold || 5);
    setTargetMargins(settings.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 });
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updated = await updateSettings({
      storeName: storeName.trim() || "Nihara D'Aura",
      lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
      targetMargins: {
        Jewellery: parseFloat(targetMargins.Jewellery) || 18,
        Makeup: parseFloat(targetMargins.Makeup) || 45,
        Nails: parseFloat(targetMargins.Nails) || 55,
        Candles: parseFloat(targetMargins.Candles) || 60,
      },
    });
    if (updated) addToast({ type: 'success', message: 'Settings saved successfully' });
  };

  const handleExportBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nihara_daura_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'Exported JSON backup file' });
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importData(content).then((success) => {
        if (success) {
          addToast({ type: 'success', message: 'Store settings restored successfully' });
        } else {
          addToast({ type: 'error', message: 'Backup must contain valid store settings' });
        }
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
            Store & system settings
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Configure brand metadata, target margin guardrails, and cloud backups
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: General & Margin Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ChartCard
            title="General store configuration"
            subtitle="Store name, thresholds, and target margin baselines"
          >
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Store display name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                    darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Global low-stock alert threshold (units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                    darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                  }`}
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Products with stock equal to or below this quantity will trigger to-do alerts.
                </p>
              </div>

              {/* Target Margins per Collection */}
              <div className="pt-3 border-t border-inherit">
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-stone-400">
                  Target gross margin per collection (%)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Jewellery', 'Makeup', 'Nails', 'Candles'].map(col => (
                    <div key={col}>
                      <span className="block text-xs font-medium mb-1 text-stone-700 dark:text-stone-300">
                        {col}
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={targetMargins[col] || ''}
                          onChange={(e) => setTargetMargins(p => ({ ...p, [col]: e.target.value }))}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                            darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                          }`}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-stone-400">
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
                >
                  <Save className="w-4 h-4" />
                  Save settings
                </button>
              </div>
            </form>
          </ChartCard>

          {/* Theme Toggle Card */}
          <ChartCard
            title="Appearance & theme"
            subtitle="Switch between light luxury sand and dark plum executive interface"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-semibold block ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                  {darkMode ? 'Dark plum mode active' : 'Light sand mode active'}
                </span>
                <span className="text-xs text-stone-400">
                  Theme preference is stored locally in your browser
                </span>
              </div>
              <button
                type="button"
                onClick={toggleDark}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    Switch to light mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-purple-600" />
                    Switch to dark mode
                  </>
                )}
              </button>
            </div>
          </ChartCard>
        </div>

        {/* Right Column: Backup, Restore & Reset (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Backup & Restore */}
          <ChartCard
            title="Backup & restore"
            subtitle="Download a read-only snapshot of current database records"
          >
            <div className="space-y-4">
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  darkMode ? 'bg-[#121010] border-white/5' : 'bg-[#faf9f7] border-stone-200'
                }`}
              >
                <p className="text-stone-600 dark:text-stone-400 mb-3">
                  Download a snapshot of all products, inventory counts, orders, salon bookings, and active coupons.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#b58a2a] text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Export JSON backup
                </button>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  darkMode ? 'bg-[#121010] border-white/5' : 'bg-[#faf9f7] border-stone-200'
                }`}
              >
                <p className="text-stone-600 dark:text-stone-400 mb-3">
                  Restore settings only from a prior dashboard export. Product, order, and appointment records are never overwritten here.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
                    darkMode ? 'border-white/10 text-stone-300 hover:bg-white/5' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Restore settings from JSON
                </button>
              </div>
            </div>
          </ChartCard>

        </div>
      </div>

    </div>
  );
}
