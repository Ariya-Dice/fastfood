
/**
 * کامپوننت اصلی برنامه (App)
 * مدیریت نماهای صفحه، سبد خرید، جستجو، دسته‌بندی و منطق سفارش آنلاین
 * توضیحات کامل‌تر ذیل هر تابع و متغیر درج شده است.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Minus, 
  Plus, 
  MapPin, 
  Clock, 
  Star,
  Sparkles,
  ArrowRight,
  X,
  Phone,
  Instagram,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { categories, products, branches, Branch } from './data/mockData';
import { Product, Category, CartItem } from './types';
// حذف import پیشنهاد هوشمند Gemini به درخواست کارفرما

/**
 * نوع ViewState برای تعیین وضعیت نمایش صفحه فعلی:
 * home: صفحه اصلی، branches: انتخاب شعبه، menu: نمایش منو محصولات
 */
type ViewState = 'home' | 'branches' | 'menu';

const App: React.FC = () => {
  // وضعیت صفحه نمایش فعلی را نگه می‌دارد
const [view, setView] = useState<ViewState>('home');
  // شعبه انتخاب‌شده توسط کاربر (در صورت وجود)
const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  // دسته‌بندی انتخاب‌شده، پیش‌فرض بر روی اولین دسته موجود
const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
  // متن جستجوی واردشده توسط کاربر
const [searchQuery, setSearchQuery] = useState('');
  // لیست اقلام سبد خرید کاربر
const [cart, setCart] = useState<CartItem[]>([]);
  // وضعیت باز یا بسته بودن پنل سبد خرید
const [isCartOpen, setIsCartOpen] = useState(false);
// حذف پیشنهاد هوشمند Gemini به درخواست کارفرما
// حذف پیشنهاد هوشمند Gemini به درخواست کارفرما

  // محاسبه محصولات فیلترشده با توجه به دسته‌بندی و جستجو
const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (p.category === selectedCategory) && 
      (p.name.includes(searchQuery) || p.description.includes(searchQuery))
    );
  }, [selectedCategory, searchQuery]);

  /**
 * افزودن محصول به سبد خرید
 * اگر محصول تکراری باشد یک عدد به تعدادش افزوده می‌شود.
 */
const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /**
 * حذف یک محصول از سبد خرید با توجه به id
 * اگر تعداد بیشتر از یک باشد، یک عدد کم می‌شود؛ در غیراین‌صورت حذف آیتم
 */
const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

// مجموع قیمت کل سبد خرید
const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
// مجموع تعداد اقلام در سبد خرید
const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  /**
 * تابع انتخاب شعبه توسط کاربر
 * فقط در صورت باز بودن امکان انتخاب دارد
 */
const handleBranchSelect = (branch: Branch) => {
    if (!branch.isOpen) return;
    setSelectedBranch(branch);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
 * بازگشت به صفحه اصلی و پاک‌کردن انتخاب شعبه
 */
const goHome = () => {
    setView('home');
    setSelectedBranch(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
 * تغییر صفحه به انتخاب شعبه‌ها
 */
const goToBranches = () => {
    setView('branches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
 * رندر صفحه اصلی (landing page)
 */
// View: Landing Page (burgerland.com)
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-black text-white font-['Vazirmatn'] selection:bg-yellow-400 selection:text-black">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-3xl font-black text-yellow-400 tracking-tighter">FASTFOODIO</div>
            <div className="hidden md:flex gap-10 text-sm font-black uppercase tracking-widest">
              <a href="#" className="hover:text-yellow-400 transition-colors">منو</a>
              <a href="#" onClick={goToBranches} className="hover:text-yellow-400 transition-colors">شعب ما</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">درباره ما</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">تماس</a>
            </div>
            <button onClick={goToBranches} className="bg-yellow-400 text-black px-8 py-2.5 rounded-full font-black hover:bg-yellow-300 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20">
              سفارش آنلاین
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/burger-3.jpg" 
              className="w-full h-full object-cover opacity-70 scale-100 transition-transform duration-[10s] hover:scale-110"
              alt="Hero Burger"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          <div className="z-10 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
              طعم واقعی <br/> <span className="text-yellow-400">برگر</span> دست‌ساز
            </h1>
            <p className="text-xl md:text-3xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              ما در فست‌فودیـو فقط غذا درست نمی‌کنیم، ما برای شما خاطره‌ای خوشمزه می‌سازیم.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button onClick={goToBranches} className="bg-white text-black px-12 py-5 rounded-full font-black text-2xl hover:bg-yellow-400 transition-all transform hover:scale-110 shadow-2xl shadow-white/10">
                سفارش آنلاین
              </button>
              <button className="bg-black/40 backdrop-blur-md border-2 border-white/50 text-white px-12 py-5 rounded-full font-black text-2xl hover:bg-white hover:text-black transition-all">
                مشاهده منو
              </button>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-32 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-20">چرا فست‌فودیـو؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="group p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-4">
                <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">🥩</div>
                <h3 className="text-3xl font-black mb-5 text-yellow-400">گوشت ۱۰۰٪ تازه</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">استفاده از بهترین قطعات گوشت گوساله تازه که به صورت روزانه آماده می‌شوند.</p>
              </div>
              <div className="group p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-4">
                <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">🥖</div>
                <h3 className="text-3xl font-black mb-5 text-yellow-400">نان پخت روز</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">نان‌های مخصوص فست‌فودیـو که هر صبح در نانوایی اختصاصی ما پخته می‌شوند.</p>
              </div>
              <div className="group p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-4">
                <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">👨‍🍳</div>
                <h3 className="text-3xl font-black mb-5 text-yellow-400">دستور پخت ویژه</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">ترکیباتی که فقط در فست‌فودیـو پیدا می‌کنید، همراه با سس‌های جادویی ما.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-20 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-4xl font-black text-yellow-400 tracking-tighter">FASTFOODIO</div>
              <div className="flex gap-10">
                <Instagram size={32} className="cursor-pointer hover:text-yellow-400 transition-colors" />
                <Phone size={32} className="cursor-pointer hover:text-yellow-400 transition-colors" />
              </div>
              <p className="text-zinc-500 font-bold">© ۲۰۲۴ تمامی حقوق برای فست‌فودیـو محفوظ است.</p>
           </div>
        </footer>
      </div>
    );
  }

  /**
 * رندر صفحه انتخاب شعبه (branches view)
 */
// View: Branch Selection (order.burgerland.com)
  if (view === 'branches') {
    return (
      <div className="min-h-screen bg-zinc-50 font-['Vazirmatn'] text-right selection:bg-yellow-400">
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 p-5 border-b border-zinc-100">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={goHome} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all group active:scale-90">
              <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">کجا هستید؟</h1>
            <div className="w-12"></div>
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto p-8 space-y-12">
          <div className="text-center py-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-5xl font-black mb-4 text-zinc-900">انتخاب شعبه</h2>
            <p className="text-zinc-500 text-xl font-medium">نزدیک‌ترین شعبه را برای سفارش آنلاین انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map(branch => (
              <div 
                key={branch.id}
                onClick={() => handleBranchSelect(branch)}
                className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 ${branch.isOpen ? 'border-transparent hover:border-yellow-400' : 'opacity-60 grayscale cursor-not-allowed'}`}
              >
                <div className="h-60 overflow-hidden relative">
                  <img src={branch.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={branch.name} />
                  {!branch.isOpen && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-white text-black px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-xl">بسته است</span>
                    </div>
                  )}
                  {branch.isOpen && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      باز است
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black mb-2 group-hover:text-yellow-600 transition-colors">{branch.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6 font-medium leading-relaxed">{branch.address}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <Clock size={18} />
                      <span className="text-sm font-bold">۳۰-۴۵ دقیقه</span>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all ${branch.isOpen ? 'bg-zinc-50 group-hover:bg-yellow-400 text-zinc-400 group-hover:text-black group-hover:rotate-12' : 'bg-zinc-100 text-zinc-300'}`}>
                      <ArrowRight className="rotate-180" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /**
 * رندر صفحه منو و سبد خرید
 */
// View: Menu/Order (order.burgerland.com/order/...)
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-['Vazirmatn'] text-right selection:bg-yellow-400">
      <header className="bg-white shadow-sm sticky top-0 z-40 transition-all duration-300 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={goToBranches} className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-3 border-2 border-black hover:rotate-0 transition-all active:scale-90">
              BL
            </button>
            <div className="hidden sm:block">
              <h1 className="font-black text-xl">فست‌فودیـو</h1>
              <div className="flex items-center text-xs text-zinc-400 font-bold gap-2">
                <MapPin size={12} className="text-yellow-500" />
                <span>{selectedBranch?.name}</span>
                <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                <Clock size={12} />
                <span>۳۰-۴۵ دقیقه</span>
              </div>
            </div>
          </div>
          
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="چی میل داری؟"
              className="w-full bg-zinc-100 border-2 border-transparent rounded-2xl py-3 pr-12 pl-4 focus:bg-white focus:border-yellow-400 text-sm font-bold outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3.5 rounded-2xl bg-zinc-900 text-white hover:bg-black transition-all transform active:scale-90 shadow-xl shadow-black/10"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[10px] w-6 h-6 flex items-center justify-center rounded-xl border-2 border-white font-black animate-bounce shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="bg-white border-t border-zinc-50 overflow-x-auto no-scrollbar py-3">
          <div className="max-w-6xl mx-auto px-6 flex gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 border-2 ${
                  selectedCategory === cat.id 
                    ? 'bg-black text-white border-black shadow-xl shadow-black/10 transform scale-105 translate-y-[-2px]' 
                    : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:text-zinc-600'
                }`}
              >
                <span className="ml-2 text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 mb-28">
        {/* Special Promo */}
        <div className="mb-12 rounded-[2.5rem] overflow-hidden relative h-60 bg-black group cursor-pointer shadow-2xl shadow-black/10">
           <img 
             src="/images/promo-1.jpg" 
             className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2s]" 
             alt="Promo"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent"></div>
           <div className="z-10 relative h-full flex flex-col justify-center p-12">
              <div className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full w-fit mb-4 uppercase tracking-tighter">پیشنهاد ویژه</div>
              <h2 className="text-5xl font-black mb-3 leading-tight text-white tracking-tighter">پارتی باکس!<br/>ویژه آخر هفته</h2>
              <div className="flex items-center gap-3 text-yellow-400 group-hover:translate-x-[-10px] transition-transform duration-500">
                <span className="font-black text-xl underline decoration-4 underline-offset-8">همین حالا سفارش دهید</span>
                <ArrowRight className="rotate-180" />
              </div>
           </div>
        </div>

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                 {categories.find(c => c.id === selectedCategory)?.icon}
               </div>
               <h2 className="text-3xl font-black tracking-tight">{categories.find(c => c.id === selectedCategory)?.name}</h2>
            </div>
            <div className="text-sm text-zinc-400 font-black bg-white px-4 py-2 rounded-xl shadow-sm border border-zinc-100">{filteredProducts.length} محصول</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={() => addToCart(product)} 
                quantity={cart.find(i => i.id === product.id)?.quantity || 0}
                onRemove={() => removeFromCart(product.id)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-200">
               <div className="text-8xl mb-6 grayscale opacity-30">🍔</div>
               <h3 className="text-2xl font-black text-zinc-800">اینجا چیزی نیست!</h3>
               <p className="text-zinc-400 text-lg font-medium mt-2">لطفاً کلمه دیگری را جستجو کنید</p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Checkout (Mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-40 md:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-black text-white rounded-[2rem] p-5 flex items-center justify-between shadow-2xl transform active:scale-95 transition-all border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 text-black font-black rounded-xl px-3 py-1.5 text-sm">
                {totalItems}
              </div>
              <span className="font-black text-lg">سبد خرید</span>
            </div>
            <div className="font-black text-xl">
              {cartTotal.toLocaleString()} <span className="text-xs font-normal opacity-50 mr-1">تومان</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex justify-end transition-opacity duration-500">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out">
            <div className="p-8 border-b flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-zinc-200 rounded-2xl transition-all active:scale-90">
                  <X size={28} />
                </button>
                <h2 className="text-3xl font-black tracking-tight">سبد خرید شما</h2>
              </div>
              <span className="bg-black text-white font-black px-4 py-1.5 rounded-2xl text-xs uppercase tracking-widest">{totalItems} مورد</span>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-12">
                  <div className="w-48 h-48 bg-zinc-100 rounded-full flex items-center justify-center text-8xl shadow-inner animate-pulse">
                    🛍️
                  </div>
                  <div>
                    <h3 className="font-black text-3xl mb-4">سبد خریدت خالیه!</h3>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed">بهترین برگرهای شهر منتظر تواَن. همین حالا اولین آیتم رو اضافه کن.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full rounded-[2rem] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-2xl group-hover:text-yellow-600 transition-colors">{item.name}</h4>
                            <div className="font-black text-lg text-zinc-900">
                              {(item.price * item.quantity).toLocaleString()} <span className="text-xs opacity-40 font-normal mr-1">تومان</span>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-1 font-medium">{item.description}</p>
                          <div className="flex items-center justify-start mt-4">
                            <div className="flex items-center gap-5 bg-zinc-100 rounded-2xl px-3 py-1.5 shadow-inner">
                              <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-yellow-600 shadow-sm hover:bg-yellow-50 active:scale-90 transition-all">
                                <Plus size={20} />
                              </button>
                              <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
                              <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-zinc-400 shadow-sm hover:text-red-500 active:scale-90 transition-all">
                                <Minus size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )
                </>
              )}
            </div>

            {/* Cart Summary */}
            <div className="p-8 bg-zinc-50 border-t border-zinc-100">
              <div className="space-y-4 mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-zinc-400">جمع کل</span>
                  <span className="text-zinc-900">{cartTotal.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-zinc-400">هزینه ارسال</span>
                  <span className="text-green-600 font-black tracking-widest uppercase">رایگان</span>
                </div>
                <div className="h-[2px] bg-zinc-50 my-2"></div>
                <div className="flex justify-between text-3xl font-black tracking-tighter">
                  <span>قابل پرداخت</span>
                  <span className="text-black">{cartTotal.toLocaleString()} <span className="text-sm font-normal opacity-40">تومان</span></span>
                </div>
              </div>

              <button 
                disabled={cart.length === 0}
                className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-5 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all shadow-2xl shadow-black/20"
              >
                تکمیل و پرداخت نهایی
                <ArrowRight size={28} className="transform rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * کامپوننت کارت محصول جهت نمایش اطلاعات هر کالا
 * شامل تصویر، نام، قیمت و عملیات افزودن/حذف به سبد خرید
 */
// Reusable Product Card Component
const ProductCard: React.FC<{ 
  product: Product, 
  onAdd: () => void, 
  quantity: number,
  onRemove: () => void
}> = ({ product, onAdd, quantity, onRemove }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-700 border border-zinc-100 flex flex-col h-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6 rounded-[2rem] overflow-hidden aspect-[4/3]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        {quantity > 0 && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-1.5 rounded-2xl text-xs font-black shadow-2xl animate-in zoom-in duration-300">
            {quantity} در سبد
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-2xl group-hover:text-yellow-600 transition-colors tracking-tight">{product.name}</h3>
          <div className="flex items-center text-xs bg-zinc-50 text-zinc-600 px-3 py-1.5 rounded-xl font-black border border-zinc-100 shadow-inner">
            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1.5" />
            ۴.۸
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-8 min-h-[3rem] font-medium italic">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
        <div className="font-black text-2xl tracking-tighter">
          {product.price.toLocaleString()} <span className="text-xs font-normal text-zinc-400 mr-1">تومان</span>
        </div>
        
        {quantity > 0 ? (
          <div className="flex items-center gap-4 bg-zinc-100 rounded-[1.5rem] px-2.5 py-1.5 shadow-inner transition-all transform scale-110">
             <button 
              onClick={onAdd}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-yellow-600 shadow-md hover:bg-yellow-50 active:scale-90 transition-all"
            >
              <Plus size={20} />
            </button>
            <span className="font-black text-lg min-w-[1.5rem] text-center">{quantity}</span>
            <button 
              onClick={onRemove}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-zinc-400 shadow-md hover:text-red-500 active:scale-90 transition-all"
            >
              <Minus size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAdd}
            className="bg-black text-white p-4 rounded-[1.5rem] hover:bg-yellow-400 hover:text-black transition-all duration-500 transform active:scale-90 shadow-xl shadow-black/5 group-hover:rotate-12"
          >
            <Plus size={30} />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
