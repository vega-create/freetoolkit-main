import { useState, useMemo } from 'react';

interface Article {
  slug: string;
  title: string;
  desc: string;
  category: string;
  date: string;
  tags: string[];
}

export default function BlogFilter({ articles, language }: { articles: Article[]; language: string }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(articles.map(a => a.category))], [articles]);

  const filtered = activeCategory
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            !activeCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({articles.length})
        </button>
        {categories.map(cat => {
          const count = articles.filter(a => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Article List */}
      <div className="space-y-4">
        {filtered.map(art => (
          <a
            key={art.slug}
            href={`/${language}/blog/${art.slug}/`}
            className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{art.category}</span>
              <time className="text-gray-400" dateTime={art.date}>
                {new Date(art.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-1">{art.title}</h2>
            <p className="text-sm text-gray-500">{art.desc}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {art.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400">#{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No articles found in this category.</p>
      )}
    </div>
  );
}
