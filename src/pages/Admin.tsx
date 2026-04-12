import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioItem } from '../store';
import { Trash2, Plus, Image as ImageIcon, Save, LogOut, Edit2, X } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'hero' | 'portfolio'>('hero');
  const [heroImages, setHeroImagesState] = useState<{id: string, image: string, order: number}[]>([]);
  const [portfolioItems, setPortfolioItemsState] = useState<PortfolioItem[]>([]);

  // New/Edit Portfolio Item State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPortfolio, setNewPortfolio] = useState<Partial<PortfolioItem>>({
    title: '', category: '', description: '', image: '', gallery: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.email === 'eslehoon7@gmail.com' || user.email === 'admin@makedesign.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setError('관리자 권한이 없습니다.');
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const heroUnsubscribe = onSnapshot(query(collection(db, 'heroImages'), orderBy('order')), (snapshot) => {
      const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setHeroImagesState(images);
    }, (err) => {
      console.error('Firestore Error: ', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    });

    const portfolioUnsubscribe = onSnapshot(query(collection(db, 'portfolioItems'), orderBy('createdAt', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPortfolioItemsState(items);
    }, (err) => {
      console.error('Firestore Error: ', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    });

    return () => {
      heroUnsubscribe();
      portfolioUnsubscribe();
    };
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let loginEmail = username;
    let loginPassword = password;

    // Map the custom ID/PW to the Firebase account
    if (username === 'makedesign' && password === '3014') {
      loginEmail = 'admin@makedesign.com';
      loginPassword = 'admin3014';
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setError('');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Firebase 콘솔에서 [이메일/비밀번호] 로그인 제공업체를 사용 설정해주세요.');
      } else if (err.code === 'auth/invalid-api-key' || err.message.includes('missing-api-key') || err.message.includes('API key')) {
        setError('Netlify 환경 변수(API 키)가 설정되지 않았거나 잘못되었습니다.');
      } else {
        setError(`로그인 실패 (${err.code || '알 수 없는 오류'}): 다시 시도해주세요.`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 해상도를 1920으로 대폭 상향 (기존 800)
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // 화질을 0.85로 상향하고, 압축률이 좋은 webp 포맷 사용 (기존 jpeg 0.6)
          const dataUrl = canvas.toDataURL('image/webp', 0.85);
          
          // Firestore 1MB 제한 체크 (대략적인 base64 크기 계산)
          const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
          if (sizeInBytes > 900000) { // 900KB 이상일 경우
            setError('이미지 용량이 너무 큽니다. 조금 더 작은 이미지를 사용해주세요.');
            setTimeout(() => setError(''), 4000);
            return;
          }
          
          callback(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Hero Image Handlers
  const addHeroImage = async (base64: string) => {
    try {
      const newRef = doc(collection(db, 'heroImages'));
      await setDoc(newRef, {
        image: base64,
        order: heroImages.length,
        createdAt: serverTimestamp()
      });
    } catch (e: any) {
      setError(e.message || '저장 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeHeroImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'heroImages', id));
    } catch (e: any) {
      setError(e.message || '삭제 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const updateHeroImage = async (id: string, base64: string) => {
    try {
      await setDoc(doc(db, 'heroImages', id), { image: base64 }, { merge: true });
    } catch (e: any) {
      setError(e.message || '저장 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Portfolio Handlers
  const savePortfolioItem = async () => {
    if (!newPortfolio.title || !newPortfolio.image) {
      setError('제목과 메인 이미지는 필수입니다.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      const docRef = editingId ? doc(db, 'portfolioItems', editingId) : doc(collection(db, 'portfolioItems'));
      await setDoc(docRef, {
        title: newPortfolio.title || '',
        category: newPortfolio.category || '',
        description: newPortfolio.description || '',
        image: newPortfolio.image || '',
        gallery: newPortfolio.gallery || [],
        createdAt: editingId ? undefined : serverTimestamp() // Only set createdAt on new items, or use merge
      }, { merge: true });
      
      resetPortfolioForm();
    } catch (e: any) {
      setError(e.message || '저장 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const editPortfolioItem = (item: PortfolioItem) => {
    setEditingId(item.id);
    setNewPortfolio({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      gallery: item.gallery || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPortfolioForm = () => {
    setEditingId(null);
    setNewPortfolio({ title: '', category: '', description: '', image: '', gallery: [] });
  };

  const removePortfolioItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'portfolioItems', id));
      if (editingId === id) {
        resetPortfolioForm();
      }
    } catch (e: any) {
      setError(e.message || '삭제 중 오류가 발생했습니다.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">관리자 로그인</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">아이디</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MAKE DESIGN 관리자</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">홈페이지로</button>
              <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800">
                <LogOut size={18} className="mr-1" /> 로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('hero')}
              className={`${activeTab === 'hero' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            >
              메인 이미지 관리
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`${activeTab === 'portfolio' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            >
              포트폴리오 관리
            </button>
          </nav>
        </div>

        {activeTab === 'hero' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">메인 슬라이드 이미지 ({heroImages.length}장)</h3>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              {heroImages.map((img, index) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img src={img.image} alt={`Hero ${index}`} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
                      <Edit2 size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => updateHeroImage(img.id, base64))} />
                    </label>
                    <button
                      onClick={() => removeHeroImage(img.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">새 이미지 추가</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, addHeroImage)} />
              </label>
            </div>
            <p className="text-sm text-gray-500">* 이미지는 5초 간격으로 자동 전환됩니다. 고화질 가로 이미지를 권장합니다.</p>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? '포트폴리오 수정' : '새 포트폴리오 등록'}
              </h3>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">프로젝트명</label>
                    <input type="text" value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">카테고리 (예: CAFE, OFFICE)</label>
                    <input type="text" value={newPortfolio.category} onChange={e => setNewPortfolio({...newPortfolio, category: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상세 설명</label>
                    <textarea rows={4} value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지 (썸네일)</label>
                    {newPortfolio.image ? (
                      <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
                        <img src={newPortfolio.image} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setNewPortfolio({...newPortfolio, image: ''})} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"><X size={16}/></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <ImageIcon size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">이미지 업로드</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewPortfolio({...newPortfolio, image: base64}))} />
                      </label>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">추가 갤러리 이미지</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {newPortfolio.gallery?.map((img, idx) => (
                        <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => setNewPortfolio({...newPortfolio, gallery: newPortfolio.gallery?.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full scale-75"><X size={12}/></button>
                        </div>
                      ))}
                      <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <Plus size={20} className="text-gray-400" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setNewPortfolio({...newPortfolio, gallery: [...(newPortfolio.gallery || []), base64]}))} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                {editingId && (
                  <button onClick={resetPortfolioForm} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    취소
                  </button>
                )}
                <button onClick={savePortfolioItem} className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                  <Save size={18} className="mr-2" /> {editingId ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">등록된 포트폴리오 목록</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">프로젝트명</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {portfolioItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={item.image} alt={item.title} className="h-12 w-16 object-cover rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => editPortfolioItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">수정</button>
                          <button onClick={() => removePortfolioItem(item.id)} className="text-red-600 hover:text-red-900">삭제</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
