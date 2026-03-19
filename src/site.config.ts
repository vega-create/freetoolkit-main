export const siteConfig = {
  name: 'FreeToolkit',
  url: 'https://freetoolkit.cc',
  description: 'Free online tools for learning Chinese and Japanese. Interactive tools, daily practice, quizzes, and downloadable resources.',
  author: 'FreeToolkit',
  ogImage: '/images/og-default.png',

  // Author (EEAT)
  authorPerson: {
    name: 'Yang Lin',
    slug: 'yang-lin',
    title: 'Language Education Specialist',
    bio: 'Yang Lin is a Taiwan-based bilingual educator specializing in Mandarin Chinese and Japanese instruction. With over 10 years of experience helping learners worldwide master East Asian languages, Yang creates practical tools and structured study guides that make language learning accessible, effective, and enjoyable. She holds a degree in Applied Linguistics and has taught students from more than 20 countries.',
    url: '/about/yang-lin/',
    expertise: ['Mandarin Chinese', 'Japanese', 'HSK Preparation', 'JLPT Preparation', 'Language Pedagogy', 'Applied Linguistics'],
    sameAs: [],
  },

  // Tracking
  tracking: {
    gtm: 'GTM-NWNPMSZM',
    ga4: 'G-9FQB214ZEC',
    adsense: {
      enabled: true,
      client: 'ca-pub-3493526929407874',
    },
  },

  // GSC verification
  gscVerification: '', // 填入 GSC 驗證碼

  // Languages
  languages: {
    chinese: {
      name: 'Chinese',
      slug: 'chinese',
      emoji: '🈶',
      description: 'Learn Mandarin Chinese with free interactive tools, daily practice, and downloadable resources.',
      speechLang: {
        traditional: 'zh-TW',
        simplified: 'zh-CN',
      },
      categories: [
        { slug: 'chinese-basics', name: 'Chinese Basics', emoji: '📖' },
        { slug: 'characters', name: 'Characters', emoji: '字' },
        { slug: 'grammar', name: 'Grammar', emoji: '📐' },
        { slug: 'culture', name: 'Culture', emoji: '🏮' },
        { slug: 'hsk-prep', name: 'HSK Prep', emoji: '📝' },
        { slug: 'study-tips', name: 'Study Tips', emoji: '💡' },
      ],
    },
    japanese: {
      name: 'Japanese',
      slug: 'japanese',
      emoji: '🗾',
      description: 'Learn Japanese with free interactive tools, daily practice, and downloadable resources.',
      speechLang: 'ja-JP',
      categories: [
        { slug: 'kana', name: 'Kana', emoji: '🔤' },
        { slug: 'grammar', name: 'Grammar', emoji: '📖' },
        { slug: 'jlpt', name: 'JLPT', emoji: '📝' },
        { slug: 'culture', name: 'Culture', emoji: '⛩️' },
        { slug: 'study-tips', name: 'Study Tips', emoji: '💡' },
      ],
    },
  },

  // Subdomain tools (existing)
  tools: [
    { name: 'Calculators', slug: 'calc', domain: 'calc.freetoolkit.cc', emoji: '🔢', cpc: '$2-8' },
    { name: 'Converters', slug: 'convert', domain: 'convert.freetoolkit.cc', emoji: '🔄', cpc: '$1-4' },
    { name: 'Text Tools', slug: 'text', domain: 'text.freetoolkit.cc', emoji: '📝', cpc: '$2-6' },
    { name: 'Password', slug: 'password', domain: 'password.freetoolkit.cc', emoji: '🔐', cpc: '$4-12' },
    { name: 'Image Tools', slug: 'image', domain: 'image.freetoolkit.cc', emoji: '🖼️', cpc: '$2-6' },
    { name: 'PDF Tools', slug: 'pdf', domain: 'pdf.freetoolkit.cc', emoji: '📄', cpc: '$3-8' },
    { name: 'QR Code', slug: 'qr', domain: 'qr.freetoolkit.cc', emoji: '📱', cpc: '$2-6' },
    { name: 'Color Tools', slug: 'color', domain: 'color.freetoolkit.cc', emoji: '🎨', cpc: '$2-5' },
    { name: 'Dev Tools', slug: 'json', domain: 'json.freetoolkit.cc', emoji: '💻', cpc: '$3-10' },
    { name: 'SEO Tools', slug: 'seo', domain: 'seo.freetoolkit.cc', emoji: '🔍', cpc: '$5-15' },
    { name: 'Social Media', slug: 'social', domain: 'social.freetoolkit.cc', emoji: '📣', cpc: '$3-8' },
    { name: 'Random', slug: 'random', domain: 'random.freetoolkit.cc', emoji: '🎲', cpc: '$1-3' },
    { name: 'Time & Date', slug: 'time', domain: 'time.freetoolkit.cc', emoji: '⏰', cpc: '$1-4' },
    { name: 'Finance', slug: 'finance-tools', domain: 'finance-tools.freetoolkit.cc', emoji: '💰', cpc: '$8-20' },
    { name: 'Health', slug: 'health-tools', domain: 'health-tools.freetoolkit.cc', emoji: '❤️', cpc: '$3-8' },
  ],
};
