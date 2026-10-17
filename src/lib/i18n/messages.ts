export interface LocaleMessages {
  common: {
    all: string;
    copyToClipboard: string;
  };
  navigation: {
    openMainMenu: string;
  };
  theme: {
    system: string;
    light: string;
    dark: string;
    currentTheme: string;
    cycleTheme: string;
  };
  profile: {
    email: string;
    location: string;
    workAddress: string;
    click: string;
    googleMap: string;
    send: string;
    sendEmail: string;
    researchInterests: string;
    copied: string;
    like: string;
    liked: string;
    thanks: string;
  };
  home: {
    about: string;
    news: string;
    selectedPublications: string;
    viewAll: string;
  };
  publications: {
    searchPlaceholder: string;
    filters: string;
    year: string;
    type: string;
    noResults: string;
    abstract: string;
    bibtex: string;
    code: string;
    reset: string;
    allYears: string;
    allTypes: string;
    impactFactor: string;
    impactFactor5y: string;
    authorRoles: {
      first: string;
      coFirst: string;
      corresponding: string;
      advisorFirst: string;
      coauthor: string;
    };
  };
  publicationDetail: {
    backToPublications: string;
    researchMotivation: string;
    methodOverview: string;
    keyContributions: string;
    results: string;
    abstract: string;
    linksAndCitation: string;
    details: string;
    pdf: string;
    code: string;
    copyBibtex: string;
    copied: string;
    fullTextBasis: string;
    abstractBasis: string;
    metadataBasis: string;
    metadataOnlyTitle: string;
    metadataOnlyBody: string;
    citations: string;
    enlargeFigure: string;
    closeFigure: string;
    figurePreview: string;
    source: string;
    contentBasis: string;
    journal: string;
    conference: string;
  };
  footer: {
    lastUpdated: string;
    totalViews: string;
  };
}

const en: LocaleMessages = {
  common: {
    all: 'All',
    copyToClipboard: 'Copy to clipboard',
  },
  navigation: {
    openMainMenu: 'Open main menu',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    currentTheme: 'Current theme',
    cycleTheme: 'Click to cycle theme',
  },
  profile: {
    email: 'Email',
    location: 'Location',
    workAddress: 'Work Address',
    click: 'Click',
    googleMap: 'Google Map',
    send: 'Send',
    sendEmail: 'Send Email',
    researchInterests: 'Research Interests',
    copied: 'Copied',
    like: 'Like',
    liked: 'Liked',
    thanks: 'Thanks!',
  },
  home: {
    about: 'About',
    news: 'News',
    selectedPublications: 'Selected Publications',
    viewAll: 'View All',
  },
  publications: {
    searchPlaceholder: 'Search publications...',
    filters: 'Filters',
    year: 'Year',
    type: 'Type',
    noResults: 'No publications found matching your criteria.',
    abstract: 'Abstract',
    bibtex: 'BibTeX',
    code: 'Code',
    reset: 'Reset',
    allYears: 'All years',
    allTypes: 'All types',
    impactFactor: 'Impact Factor',
    impactFactor5y: '5-Year Impact Factor',
    authorRoles: {
      first: 'First author',
      coFirst: 'Co-first author',
      corresponding: 'Corresponding author',
      advisorFirst: 'Advisor first, student second',
      coauthor: 'Co-author',
    },
  },
  publicationDetail: {
    backToPublications: 'Back to publications',
    researchMotivation: 'Research Motivation',
    methodOverview: 'Method Overview',
    keyContributions: 'Key Contributions',
    results: 'Results / Findings',
    abstract: 'Abstract',
    linksAndCitation: 'Links & Citation',
    details: 'Details',
    pdf: 'PDF',
    code: 'Code',
    copyBibtex: 'Copy BibTeX',
    copied: 'Copied',
    fullTextBasis: 'Summary reviewed against the open-access full text.',
    abstractBasis: 'Summary based on the published abstract.',
    metadataBasis: 'Verified bibliographic metadata only.',
    metadataOnlyTitle: 'Metadata-only record',
    metadataOnlyBody: 'A reliable abstract or full text was not available for editorial review. This page therefore limits itself to validated bibliographic metadata and the publisher record.',
    citations: 'citations',
    enlargeFigure: 'Enlarge figure',
    closeFigure: 'Close figure',
    figurePreview: 'Figure preview',
    source: 'Source',
    contentBasis: 'Content basis',
    journal: 'Journal',
    conference: 'Conference',
  },
  footer: {
    lastUpdated: 'Last updated',
    totalViews: 'Total Views',
  },
};

const zh: LocaleMessages = {
  common: {
    all: '全部',
    copyToClipboard: '复制到剪贴板',
  },
  navigation: {
    openMainMenu: '打开主菜单',
  },
  theme: {
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
    currentTheme: '当前主题',
    cycleTheme: '点击切换主题',
  },
  profile: {
    email: '邮箱',
    location: '地址',
    workAddress: '办公地址',
    click: '点击',
    googleMap: '谷歌地图',
    send: '发送',
    sendEmail: '发送邮件',
    researchInterests: '研究兴趣',
    copied: '已复制',
    like: '点赞',
    liked: '已点赞',
    thanks: '感谢支持！',
  },
  home: {
    about: '关于我',
    news: '动态',
    selectedPublications: '精选论文',
    viewAll: '查看全部',
  },
  publications: {
    searchPlaceholder: '搜索论文...',
    filters: '筛选',
    year: '年份',
    type: '类型',
    noResults: '没有找到符合条件的论文。',
    abstract: '摘要',
    bibtex: 'BibTeX',
    code: '代码',
    reset: '清除筛选',
    allYears: '全部年份',
    allTypes: '全部类型',
    impactFactor: '影响因子',
    impactFactor5y: '五年影响因子',
    authorRoles: {
      first: '第一作者',
      coFirst: '共同一作',
      corresponding: '通讯作者',
      advisorFirst: '导师一作 · 学生二作',
      coauthor: '合作作者',
    },
  },
  publicationDetail: {
    backToPublications: '返回论文列表',
    researchMotivation: '研究动机',
    methodOverview: '方法概览',
    keyContributions: '主要贡献',
    results: '结果与发现',
    abstract: '摘要',
    linksAndCitation: '链接与引用',
    details: '详情',
    pdf: 'PDF',
    code: '代码',
    copyBibtex: '复制 BibTeX',
    copied: '已复制',
    fullTextBasis: '内容依据开放获取全文核对。',
    abstractBasis: '内容基于已发表摘要整理。',
    metadataBasis: '仅包含已核验的文献元数据。',
    metadataOnlyTitle: '仅元数据记录',
    metadataOnlyBody: '目前没有可用于编辑核对的可靠摘要或全文，因此本页仅展示已核验的文献元数据和出版商记录。',
    citations: '次引用',
    enlargeFigure: '放大图片',
    closeFigure: '关闭图片',
    figurePreview: '图片预览',
    source: '来源',
    contentBasis: '内容依据',
    journal: '期刊论文',
    conference: '会议论文',
  },
  footer: {
    lastUpdated: '最近更新',
    totalViews: '总访问量',
  },
};

export const messages: Record<string, LocaleMessages> = {
  en,
  zh,
};

export function getMessages(locale: string): LocaleMessages {
  return messages[locale] || en;
}
