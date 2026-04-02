import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPortfolioItems, PortfolioItem } from '../store';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const items = getPortfolioItems();
    const found = items.find(p => p.id === id);
    if (found) {
      setItem(found);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">포트폴리오를 찾을 수 없습니다.</h2>
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 underline">
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-900 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium tracking-widest text-sm">BACK TO HOME</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-widest text-gray-500 mb-4 block">{item.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{item.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">{item.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <img src={item.image} alt={item.title} className="w-full rounded-lg shadow-lg" referrerPolicy="no-referrer" />
            
            {item.gallery && item.gallery.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {item.gallery.map((img, index) => (
                  <img key={index} src={img} alt={`${item.title} detail ${index + 1}`} className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow" referrerPolicy="no-referrer" />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
