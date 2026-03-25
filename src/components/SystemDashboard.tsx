import { useState, useEffect } from 'react';

interface SystemItem {
  id: string;
  name: string;
  url: string;
  category: string;
  emoji: string;
}

const DEFAULT_CATEGORIES = [
  'Google 系統',
  '社群媒體',
  '廣告系統',
  '會計系統',
  '網站',
  '寫文系統',
  '開發工具',
  '其他',
];

const DEFAULT_SYSTEMS: SystemItem[] = [
  // Google
  { id: 'ga4', name: 'Google Analytics 4', url: 'https://analytics.google.com/', category: 'Google 系統', emoji: '📊' },
  { id: 'gsc', name: 'Google Search Console', url: 'https://search.google.com/search-console', category: 'Google 系統', emoji: '🔍' },
  { id: 'gtm', name: 'Google Tag Manager', url: 'https://tagmanager.google.com/', category: 'Google 系統', emoji: '🏷️' },
  { id: 'adsense', name: 'Google AdSense', url: 'https://www.google.com/adsense/', category: 'Google 系統', emoji: '💰' },
  // Social
  { id: 'ig', name: 'Instagram', url: 'https://www.instagram.com/', category: '社群媒體', emoji: '📸' },
  { id: 'fb', name: 'Facebook', url: 'https://www.facebook.com/', category: '社群媒體', emoji: '👥' },
  // Ad Report
  { id: 'ad-report', name: '廣告報表', url: 'https://ad-report-cloudflare.pages.dev/', category: '廣告系統', emoji: '📈' },
  // Accounting
  { id: 'accounting', name: '會計系統', url: 'https://mommy-wisdom-accounting.vercel.app/', category: '會計系統', emoji: '🧾' },
  // Websites
  { id: 'main-site', name: 'FreeToolkit 主站', url: 'https://freetoolkit.cc', category: '網站', emoji: '🧰' },
  { id: 'calc', name: 'Calculators', url: 'https://calc.freetoolkit.cc', category: '網站', emoji: '🔢' },
  { id: 'convert', name: 'Converters', url: 'https://convert.freetoolkit.cc', category: '網站', emoji: '🔄' },
  { id: 'text', name: 'Text Tools', url: 'https://text.freetoolkit.cc', category: '網站', emoji: '📝' },
  { id: 'password', name: 'Password', url: 'https://password.freetoolkit.cc', category: '網站', emoji: '🔐' },
  { id: 'image', name: 'Image Tools', url: 'https://image.freetoolkit.cc', category: '網站', emoji: '🖼️' },
  { id: 'pdf', name: 'PDF Tools', url: 'https://pdf.freetoolkit.cc', category: '網站', emoji: '📄' },
  { id: 'qr', name: 'QR Code', url: 'https://qr.freetoolkit.cc', category: '網站', emoji: '📱' },
  { id: 'color', name: 'Color Tools', url: 'https://color.freetoolkit.cc', category: '網站', emoji: '🎨' },
  { id: 'json', name: 'Dev Tools', url: 'https://json.freetoolkit.cc', category: '網站', emoji: '💻' },
  { id: 'seo', name: 'SEO Tools', url: 'https://seo.freetoolkit.cc', category: '網站', emoji: '🔍' },
  { id: 'social', name: 'Social Media', url: 'https://social.freetoolkit.cc', category: '網站', emoji: '📣' },
  { id: 'random', name: 'Random', url: 'https://random.freetoolkit.cc', category: '網站', emoji: '🎲' },
  { id: 'time', name: 'Time & Date', url: 'https://time.freetoolkit.cc', category: '網站', emoji: '⏰' },
  { id: 'finance', name: 'Finance', url: 'https://finance-tools.freetoolkit.cc', category: '網站', emoji: '💰' },
  { id: 'health', name: 'Health', url: 'https://health-tools.freetoolkit.cc', category: '網站', emoji: '❤️' },
];

const STORAGE_KEY = 'ftk-dashboard-systems';

function loadSystems(): SystemItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SYSTEMS;
}

function saveSystems(systems: SystemItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
}

export default function SystemDashboard() {
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', category: DEFAULT_CATEGORIES[0], emoji: '🔗' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSystems(loadSystems());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveSystems(systems);
  }, [systems, mounted]);

  const categories = [...new Set([...DEFAULT_CATEGORIES, ...systems.map((s) => s.category)])];

  const grouped = categories
    .map((cat) => ({ category: cat, items: systems.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;

    if (editingId) {
      setSystems((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
      setEditingId(null);
    } else {
      const newItem: SystemItem = { id: Date.now().toString(), ...form };
      setSystems((prev) => [...prev, newItem]);
    }
    setForm({ name: '', url: '', category: DEFAULT_CATEGORIES[0], emoji: '🔗' });
    setShowForm(false);
  };

  const handleEdit = (item: SystemItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, url: item.url, category: item.category, emoji: item.emoji });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSystems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReset = () => {
    setSystems(DEFAULT_SYSTEMS);
  };

  if (!mounted) return null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-gray-500">
          共 {systems.length} 個系統，{grouped.length} 個分類
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            重置預設
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', url: '', category: DEFAULT_CATEGORIES[0], emoji: '🔗' }); }}
            className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            + 新增系統
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">{editingId ? '編輯系統' : '新增系統'}</h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">名稱</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如：Google Analytics"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">網址</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">分類</label>
              <input
                type="text"
                list="category-list"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={4}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? '儲存' : '新增'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* System Groups */}
      {grouped.map((group) => (
        <div key={group.category} className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            {group.category}
            <span className="text-xs font-normal text-gray-400">({group.items.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {group.items.map((item) => (
              <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-200 transition-all">
                <a href={item.url} target="_blank" rel="noopener" className="block">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-primary-600 mb-0.5 truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-400 leading-tight truncate">{item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                </a>
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs flex items-center justify-center transition-colors"
                    title="編輯"
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-400 text-xs flex items-center justify-center transition-colors"
                    title="刪除"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
