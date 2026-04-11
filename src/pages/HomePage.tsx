import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, ChevronDown, ChevronUp, Phone, Mail, MapPin, Instagram, Facebook, PhoneCall, Ruler, PenTool, FileText, Hammer, Wrench, Palette, Calculator, Award, Clock, Sparkles, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { PortfolioItem } from '../store';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'PORTFOLIO', href: '#portfolio' },
    { name: 'PROCESS', href: '#process' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white text-gray-900 shadow-md py-4' : 'bg-transparent text-white py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold tracking-tighter">
              MAKE DESIGN
            </a>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-widest hover:text-gray-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white text-gray-900"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'heroImages'), orderBy('order')), (snapshot) => {
      const images = snapshot.docs.map(doc => doc.data().image as string);
      setHeroImages(images);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <motion.img
            key={img + index}
            src={img}
            alt={`Luxury Interior ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
            initial={{ opacity: index === 0 ? 1 : 0 }}
            animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
        >
          외식, 상업공간 전문<br />인테리어 디자인
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 mb-10 font-light"
        >
          합리적인 가격, 100% 자체공사, 검증된 퀄리티의 수준 높은 인테리어
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium text-sm tracking-widest hover:bg-gray-100 transition-colors rounded-full"
          >
            견적 문의하기 <ChevronRight size={16} className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              공간의 가치를 높이는<br />메이크디자인
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              메이크디자인은 다년간의 노하우와 트렌디한 감각으로 고객님의 비즈니스 성공을 돕는 상업공간 인테리어 전문 기업입니다. 카페, 식당, 프랜차이즈 등 다양한 상업공간의 특성을 정확히 파악하여 최적의 디자인과 동선을 제안합니다.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              외주 없는 100% 자체 시공팀 운영으로 거품 없는 합리적인 가격과 책임감 있는 A/S를 약속드립니다. 고객님의 꿈이 현실이 되는 공간, 메이크디자인이 함께 만들어가겠습니다.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-4xl font-bold text-gray-900 mb-2">10+</h4>
                <p className="text-sm text-gray-500 tracking-widest uppercase">Years Experience</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-gray-900 mb-2">300+</h4>
                <p className="text-sm text-gray-500 tracking-widest uppercase">Projects Done</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px]"
          >
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
              alt="About Make Design"
              className="w-full h-full object-cover rounded-lg shadow-xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Palette size={32} />,
      title: '맞춤 디자인',
      description: '고객의 니즈와 브랜드 아이덴티티를 완벽하게 반영한 1:1 맞춤형 디자인을 제안합니다.'
    },
    {
      icon: <Calculator size={32} />,
      title: '거품없는 견적',
      description: '자체 시공팀 운영과 직거래 네트워크를 통해 중간 마진을 없앤 합리적인 견적을 제공합니다.'
    },
    {
      icon: <Award size={32} />,
      title: '고품질 공사',
      description: '다년간의 노하우를 갖춘 전문 시공팀이 최고급 자재로 하이엔드 퀄리티를 구현합니다.'
    },
    {
      icon: <Clock size={32} />,
      title: '신속한 A/S',
      description: '공사 후 발생하는 문제에 대해 신속하고 정확한 사후관리 서비스를 보장합니다.'
    },
    {
      icon: <Sparkles size={32} />,
      title: '깔끔한 마무리',
      description: '보이지 않는 곳까지 세심하게 마감하며, 완벽한 클리닝 후 공간을 인도합니다.'
    }
  ];

  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">OUR STRENGTHS</h2>
          <p className="text-gray-400">메이크디자인만의 차별화된 기술력과 약속</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 text-white mb-6 group-hover:bg-white group-hover:text-gray-900 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'portfolioItems'), orderBy('createdAt', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setProjects(items);
    });
    return () => unsubscribe();
  }, []);

  const visibleProjects = projects.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleClose = () => {
    setVisibleCount(6);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">PORTFOLIO</h2>
          <p className="text-gray-600">메이크디자인이 완성한 다양한 상업공간 프로젝트를 확인해보세요.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
              className="group relative overflow-hidden cursor-pointer rounded-lg shadow-sm hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/portfolio/${project.id}`)}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-center items-center text-white">
                <span className="text-sm font-medium tracking-widest mb-2">{project.category}</span>
                <h3 className="text-xl font-bold">{project.title}</h3>
                <span className="mt-4 px-4 py-2 border border-white text-xs tracking-widest transition-colors">VIEW DETAILS</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center gap-8">
          {visibleCount < projects.length && (
            <button
              onClick={handleLoadMore}
              className="inline-flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <span className="text-sm font-medium tracking-widest mb-2 uppercase">add</span>
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-gray-900 transition-colors">
                <ChevronDown size={20} />
              </div>
            </button>
          )}
          
          {visibleCount > 6 && (
            <button
              onClick={handleClose}
              className="inline-flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <span className="text-sm font-medium tracking-widest mb-2 uppercase">close</span>
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-gray-900 transition-colors">
                <ChevronUp size={20} />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      icon: <PhoneCall size={32} />,
      title: '01. 상담 문의',
      description: '전화 및 온라인을 통해 원하시는 컨셉과 예산, 일정 등을 간략히 상담합니다.'
    },
    {
      icon: <Ruler size={32} />,
      title: '02. 현장 실측',
      description: '전문가가 직접 현장을 방문하여 정확한 실측과 현장 컨디션을 체크합니다.'
    },
    {
      icon: <PenTool size={32} />,
      title: '03. 디자인 설계',
      description: '실측 자료를 바탕으로 평면도 및 3D 모델링을 작업하여 최적의 공간을 제안합니다.'
    },
    {
      icon: <FileText size={32} />,
      title: '04. 견적 및 계약',
      description: '확정된 디자인을 바탕으로 투명하고 상세한 세부 견적서를 제출하고 계약을 체결합니다.'
    },
    {
      icon: <Hammer size={32} />,
      title: '05. 본 공사 진행',
      description: '메이크디자인의 자체 전문 시공팀이 투입되어 안전하고 책임감 있게 시공합니다.'
    },
    {
      icon: <Wrench size={32} />,
      title: '06. 완공 및 A/S',
      description: '공사 완료 후 고객님과 함께 꼼꼼한 현장 점검을 진행하며, 철저한 사후관리를 보장합니다.'
    }
  ];

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">WORK PROCESS</h2>
          <p className="text-gray-600">메이크디자인만의 체계적이고 투명한 공사 진행 절차입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gray-200 rounded-full z-0 group-hover:bg-gray-900 transition-colors duration-500 opacity-50"></div>
              <div className="relative z-10">
                <div className="text-gray-900 mb-6 group-hover:text-white transition-colors duration-500">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">무료 견적 상담</h2>
            <p className="text-gray-400 mb-10 leading-relaxed">
              인테리어가 필요하신가요? 아래 양식을 작성해주시면 빠른 시일 내에 연락드리겠습니다.
              전화 상담을 원하시면 언제든 고객센터로 연락주세요.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                <div>
                  <h4 className="font-medium text-lg">고객센터</h4>
                  <p className="text-gray-400">070-8285-8834</p>
                  <p className="text-sm text-gray-500 mt-1">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Printer className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                <div>
                  <h4 className="font-medium text-lg">팩스</h4>
                  <p className="text-gray-400">02-2254-4491</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-gray-400 mr-4 mt-1" />
                <div>
                  <h4 className="font-medium text-lg">이메일</h4>
                  <p className="text-gray-400">kkh7643@naver.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg text-gray-900">
            <h3 className="text-2xl font-bold mb-6">온라인 문의</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름/상호명 *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업종 (예: 카페, 식당, 사무실) *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">평수 *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">예산</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors rounded-md">
                상담 신청하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">MAKE DESIGN</h2>
            <p className="mb-4 max-w-md leading-relaxed">
              공간에 가치를 더하는 인테리어 전문 기업 메이크디자인입니다.<br />
              고객님의 비즈니스 성공을 위한 최적의 공간을 제안합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">회사소개</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">포트폴리오</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">진행과정</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">견적문의</a></li>
              <li className="pt-2 mt-2 border-t border-gray-800">
                <Link to="/admin" className="hover:text-white transition-colors text-gray-500">관리자페이지</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">LEGAL</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
          <p className="mb-2">메이크디자인 l 대표 김경헌 l 사업자등록번호 : 624-21-00572</p>
          <p className="mb-2">전화 : 070-8285-8834 l 팩스 : 02-2254-4491 l 이메일 : kkh7643@naver.com</p>
          <p>Copyright &copy; MAKE DESIGN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Portfolio />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
