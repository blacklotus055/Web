import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, BookOpen, Scale, Search, ArrowLeft } from 'lucide-react';
import { BOOKS } from './constants';
import { Category, View, Book } from './types';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [npm, setNpm] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInNpm, setLoggedInNpm] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedNpm = sessionStorage.getItem('npmLogin');
    if (savedNpm) {
      setLoggedInNpm(savedNpm);
      setView('kategori');
    }
  }, []);

  const handleLogin = () => {
    const npmNum = Number(npm.trim());
    if (/^\d{13}$/.test(npm.trim()) && npmNum >= 2300000000000 && npmNum <= 2500000000000) {
      sessionStorage.setItem('npmLogin', npm.trim());
      setLoggedInNpm(npm.trim());
      setView('kategori');
      setError('');
    } else {
      setError('NPM harus 13 digit (23... hingga 25...)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('npmLogin');
    setLoggedInNpm(null);
    setView('login');
    setSelectedCategory(null);
    setNpm('');
  };

  const selectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setView('buku');
    setSearchQuery('');
  };

  const filteredBooks = selectedCategory 
    ? BOOKS[selectedCategory].filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleNextBook = () => {
    if (!selectedBook || !selectedCategory) return;
    const currentList = BOOKS[selectedCategory];
    const currentIndex = currentList.findIndex(b => b.title === selectedBook.title);
    if (currentIndex < currentList.length - 1) {
      setSelectedBook(currentList[currentIndex + 1]);
    } else {
      setSelectedBook(currentList[0]);
    }
  };

  const handlePrevBook = () => {
    if (!selectedBook || !selectedCategory) return;
    const currentList = BOOKS[selectedCategory];
    const currentIndex = currentList.findIndex(b => b.title === selectedBook.title);
    if (currentIndex > 0) {
      setSelectedBook(currentList[currentIndex - 1]);
    } else {
      setSelectedBook(currentList[currentList.length - 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="glass-box w-full max-w-[400px]">
              <h2 className="text-3xl font-bold text-[#E6C35C] mb-2 flex items-center justify-center gap-2">
                <Scale className="w-8 h-8" /> 
                Login
              </h2>
              <p className="text-[#f5f2e7]/80 mb-6 font-medium">Masukkan NPM (13 digit)</p>
              
              <input
                type="text"
                placeholder="2300000000000"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-4 mb-4 rounded-xl bg-white/10 border-2 border-[#D4AF37]/30 text-white placeholder:text-white/30 focus:border-[#D4AF37] outline-none transition-all"
              />
              
              <button 
                onClick={handleLogin}
                className="btn-gold w-full text-lg mb-4"
              >
                MASUK
              </button>
              
              {error && <p className="text-red-400 font-medium animate-pulse">{error}</p>}
            </div>
          </motion.div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar / Slide Bar */}
            <motion.aside 
              initial={false}
              animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
              className="bg-black/80 backdrop-blur-xl border-r border-[#D4AF37]/30 overflow-hidden flex-shrink-0 lg:relative absolute inset-y-0 left-0 z-50"
            >
              <div className="w-[280px] p-6 h-full flex flex-col">
                <div className="font-display text-4xl text-[#E6C35C] mb-12 flex items-center gap-2">
                  <Scale className="w-8 h-8" /> Digital
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <h4 className="text-[#D4AF37]/50 text-[10px] font-black uppercase tracking-widest mb-4">Navigasi Kategori</h4>
                    <div className="space-y-2">
                      {(['perdata', 'pidana', 'tata negara'] as Category[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => selectCategory(cat)}
                          className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all group ${
                            selectedCategory === cat 
                              ? 'bg-[#E6C35C] text-[#142b45] font-bold shadow-[0_10px_20px_rgba(212,175,55,0.2)]' 
                              : 'text-white/50 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <BookOpen className={`w-5 h-5 ${selectedCategory === cat ? 'text-[#142b45]' : 'text-[#D4AF37]/50'}`} />
                          <span className="capitalize text-sm font-medium tracking-wide">{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setView('kategori');
                    }}
                    className="w-full text-left p-4 rounded-2xl flex items-center gap-3 text-white/30 hover:text-[#E6C35C] hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> 
                    <span className="text-sm font-medium">Reset Filter</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/5">
                    <p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-tighter mb-1 opacity-50">Sesi Aktif</p>
                    <p className="text-white font-mono text-sm truncate font-bold">{loggedInNpm}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full p-4 rounded-2xl flex items-center gap-3 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all font-bold text-sm"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <nav className="p-4 flex items-center justify-between border-b border-white/5 bg-black/20 md:hidden">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-3 text-[#E6C35C] bg-white/5 rounded-xl"
                >
                  <Scale className="w-6 h-6" />
                </button>
                <div className="font-display text-3xl text-[#E6C35C]">Library</div>
              </nav>

              <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 md:p-12">
                  <AnimatePresence mode="wait">
                    {view === 'kategori' && (
                      <motion.div
                        key="kategori-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <header className="mb-16">
                          <h2 className="text-5xl font-bold text-[#E6C35C] mb-4 tracking-tighter">Pilih Jurusan.</h2>
                          <p className="text-white/40 text-lg font-medium">Akses materi hukum digital secara instan dan efisien.</p>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <CategoryCard 
                            title="Hukum Perdata" 
                            image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
                            onClick={() => selectCategory('perdata')}
                          />
                          <CategoryCard 
                            title="Hukum Pidana" 
                            image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
                            onClick={() => selectCategory('pidana')}
                          />
                          <CategoryCard 
                            title="Hukum Tata Negara" 
                            image="https://media.istockphoto.com/id/1090431444/photo/judge-gavel-and-scale-in-court-legal-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=-t1Mx0QyMVUWUR8YhATKfE59dVMRWc9-Z3_tDdSRcDw="
                            onClick={() => selectCategory('tata negara')}
                          />
                        </div>
                      </motion.div>
                    )}

                    {view === 'buku' && selectedCategory && (
                      <motion.div
                        key="buku-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pb-32"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                          <div>
                            <p className="text-[#D4AF37] uppercase text-xs font-black tracking-[0.2em] mb-3 opacity-60">Koleksi Digital</p>
                            <h2 className="text-5xl font-bold text-[#E6C35C] capitalize tracking-tighter">{selectedCategory}</h2>
                          </div>
                          
                          <div className="relative w-full md:w-96">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]/50" />
                            <input
                              type="text"
                              placeholder="Cari referensi buku..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-14 text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/20 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredBooks.map((book, idx) => (
                            <BookCard 
                              key={`${selectedCategory}-${idx}`} 
                              book={book} 
                              index={idx} 
                              onClick={() => setSelectedBook(book)}
                            />
                          ))}
                        </div>
                        
                        {filteredBooks.length === 0 && (
                          <div className="text-center py-32 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                            <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-6" />
                            <p className="text-xl text-white/30 font-bold">Hasil pencarian nihil.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>

      <BookViewer 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
        onNext={handleNextBook}
        onPrev={handlePrevBook}
      />
    </div>
  );
}

function CategoryCard({ title, image, onClick }: { title: string; image: string; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="card-legal h-[320px] group border-none"
      style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
        <h3 className="text-3xl font-black text-[#FFD700] mb-3 drop-shadow-2xl">
          {title}
        </h3>
        <div className="w-12 h-1 bg-[#D4AF37] rounded-full group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}

interface BookCardProps {
  book: Book;
  index: number;
  onClick: () => void;
  key?: string;
}

function BookCard({ book, index, onClick }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-6 flex items-center justify-between group cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 shadow-lg"
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6C35C]/20 to-[#C9A227]/10 flex items-center justify-center border border-[#D4AF37]/10 group-hover:scale-110 transition-transform">
          <BookOpen className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white group-hover:text-[#E6C35C] transition-colors truncate max-w-[200px] md:max-w-xs leading-tight">
            {book.title}
          </h3>
          <p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mt-1 opacity-40">Materi Hukum</p>
        </div>
      </div>
      <div className="flex-shrink-0 opacity-20 group-hover:opacity-100 transition-all">
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all">
          <ArrowLeft className="w-5 h-5 text-[#D4AF37] rotate-180 group-hover:text-[#142b45]" />
        </div>
      </div>
    </motion.div>
  );
}

interface BookViewerProps {
  book: Book | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function BookViewer({ book, onClose, onNext, onPrev }: BookViewerProps) {
  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col"
        >
          {/* Controls Bar */}
          <div className="flex justify-between items-center p-4 bg-black/80 border-b border-[#D4AF37]/20 z-[110]">
            <div className="flex items-center gap-4 min-w-0 pr-6">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-[#E6C35C] transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h3 className="text-[#E6C35C] font-bold text-lg truncate">{book.title}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                <button 
                  onClick={onPrev}
                  className="p-2.5 hover:bg-[#E6C35C] hover:text-[#142b45] rounded-full transition-all text-white/40"
                  title="Sebelumnya"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button 
                  onClick={onNext}
                  className="p-2.5 hover:bg-[#E6C35C] hover:text-[#142b45] rounded-full transition-all text-white/40"
                  title="Selanjutnya"
                >
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
              
              <button 
                onClick={onClose}
                className="bg-[#D4AF37] text-[#142b45] px-8 py-2.5 rounded-full font-black hover:bg-[#FFD700] transition-all active:scale-95 shadow-lg text-sm"
              >
                TUTUP
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative overflow-hidden bg-white/5">
            <iframe
              src={book.file}
              className="absolute inset-0 w-full"
              style={{ 
                height: 'calc(100% + 64px)', 
                marginTop: '-64px',
                border: 'none'
              }}
              allow="autoplay"
              title={book.title}
            />
            {/* Pop-out button safety shield */}
            <div className="absolute top-0 right-0 w-48 h-16 bg-transparent z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
