export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  gallery: string[];
}

const DEFAULT_HERO = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1600607687959-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80"
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern Cafe',
    category: 'CAFE',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    description: '모던하고 세련된 분위기의 카페 인테리어입니다. 따뜻한 조명과 우드 톤을 매치하여 편안한 공간을 연출했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '2',
    title: 'Premium Dining',
    category: 'RESTAURANT',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    description: '고급스러운 다이닝 레스토랑 인테리어입니다. 대리석과 골드 포인트를 활용하여 럭셔리함을 강조했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '3',
    title: 'Minimalist Bakery',
    category: 'BAKERY',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: '미니멀리즘을 추구하는 베이커리입니다. 빵이 돋보일 수 있도록 화이트 톤의 깔끔한 배경을 구성했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '4',
    title: 'Boutique Shop',
    category: 'RETAIL',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    description: '트렌디한 부티크 의류 매장입니다. 감각적인 디스플레이와 조명으로 제품의 가치를 높였습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '5',
    title: 'Co-working Space',
    category: 'OFFICE',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: '창의력을 자극하는 공유 오피스 공간입니다. 개방감 있는 구조와 플랜테리어를 적용했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '6',
    title: 'Lounge Bar',
    category: 'BAR',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    description: '프라이빗하고 무드 있는 라운지 바입니다. 어두운 톤과 간접 조명을 활용하여 분위기를 조성했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const getHeroImages = (): string[] => {
  const stored = localStorage.getItem('heroImages_v4');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse heroImages_v4 from localStorage', e);
    }
  }
  return DEFAULT_HERO;
};

export const setHeroImages = (images: string[]) => {
  try {
    localStorage.setItem('heroImages_v4', JSON.stringify(images));
  } catch (e) {
    console.error('Failed to save heroImages_v4 to localStorage. The image might be too large.', e);
    throw new Error('저장 공간이 부족합니다. 이미지 용량을 줄이거나 불필요한 이미지를 삭제해주세요.');
  }
};

export const getPortfolioItems = (): PortfolioItem[] => {
  const stored = localStorage.getItem('portfolioItems_v4');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse portfolioItems_v4 from localStorage', e);
    }
  }
  return DEFAULT_PORTFOLIO;
};

export const setPortfolioItems = (items: PortfolioItem[]) => {
  try {
    localStorage.setItem('portfolioItems_v4', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save portfolioItems_v4 to localStorage. The image might be too large.', e);
    throw new Error('저장 공간이 부족합니다. 이미지 용량을 줄이거나 불필요한 포트폴리오를 삭제해주세요.');
  }
};
