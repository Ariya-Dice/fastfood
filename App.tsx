
/**
 * کامپوننت اصلی برنامه (App)
 * مدیریت نماهای صفحه، سبد خرید، جستجو، دسته‌بندی و منطق سفارش آنلاین
 * توضیحات کامل‌تر ذیل هر تابع و متغیر درج شده است.
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Minus, 
  Plus, 
  MapPin, 
  Clock, 
  ArrowRight,
  X,
  Phone,
  Instagram,
  ArrowLeft,
  ChevronDown,
  Share2
} from 'lucide-react';
import { categories, products, branches, Branch } from './data/mockData';
import { Product, Category, CartItem } from './types';
import LoadingSpinner from './LoadingSpinner';
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
  // وضعیت لودینگ برنامه (Burgerland style)
const [isLoading, setIsLoading] = useState(true);
  // تب صفحه منو: منوی سفارش | اطلاعات رستوران
const [orderTab, setOrderTab] = useState<'menu' | 'info'>('menu');
  // دسته‌ای که الان در view است (برای هایلایت دکمه با اسکرول)
const [visibleCategoryId, setVisibleCategoryId] = useState<string>(categories[0].id);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrollingFromClick = useRef(false);

  // گروه‌بندی محصولات بر اساس دسته برای اسکرول یکپارچه (همه دسته‌ها پشت‌سرهم)
  const productsByCategory = useMemo(() => {
    return categories.map(cat => ({
      category: cat,
      products: products.filter(p =>
        p.category === cat.id &&
        (searchQuery === '' || p.name.includes(searchQuery) || p.description.includes(searchQuery))
      ),
    }));
  }, [searchQuery]);

  // Burgerland loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // با کلیک روی دسته، اسکرول به همان بخش و هایلایت همان دسته
  useEffect(() => {
    if (orderTab !== 'menu') return;
    isScrollingFromClick.current = true;
    setVisibleCategoryId(selectedCategory);
    const el = document.getElementById(`cat-${selectedCategory}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const timer = window.setTimeout(() => {
      isScrollingFromClick.current = false;
    }, 700);
    return () => window.clearTimeout(timer);
  }, [selectedCategory, orderTab]);

  // با اسکرول، دستهٔ در حال نمایش را برای هایلایت دکمه به‌روز کن
  useEffect(() => {
    if (orderTab !== 'menu') return;
    const sectionIds = productsByCategory
      .filter(({ products: p }) => p.length > 0)
      .map(({ category }) => category.id);
    if (sectionIds.length === 0) return;

    const updateVisibleCategory = () => {
      if (isScrollingFromClick.current) return;

      const offset = categoryNavRef.current
        ? categoryNavRef.current.getBoundingClientRect().bottom + 8
        : 140;

      let activeId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(`cat-${id}`);
        if (el && el.getBoundingClientRect().top <= offset) {
          activeId = id;
        }
      }
      setVisibleCategoryId((prev) => (prev === activeId ? prev : activeId));
    };

    updateVisibleCategory();
    window.addEventListener('scroll', updateVisibleCategory, { passive: true });
    window.addEventListener('resize', updateVisibleCategory, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateVisibleCategory);
      window.removeEventListener('resize', updateVisibleCategory);
    };
  }, [orderTab, searchQuery, productsByCategory]);

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
   * بررسی وضعیت لودینگ و نمایش LoadingSpinner اگر لازم باشد
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-burgerland-gray flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * رندر صفحه اصلی (landing page)
   */
// View: Landing Page (burgerland.com)
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-burgerland-black text-white font-burgerland selection:bg-burgerland-yellow selection:text-burgerland-black">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-3xl font-black text-yellow-400 tracking-tighter">FASTFOOD</div>
            <div className="hidden md:flex gap-10 text-sm font-black uppercase tracking-widest">
              <a href="#" className="hover:text-yellow-400 transition-colors">منو</a>
              <a href="#" onClick={goToBranches} className="hover:text-yellow-400 transition-colors">شعب ما</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">درباره ما</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">تماس</a>
            </div>
            <button onClick={goToBranches} className="bg-burgerland-yellow text-burgerland-black px-8 py-2.5 rounded-full font-black hover:bg-yellow-300 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20">
              سفارش آنلاین
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/promo-1.jpg" 
              className="w-full h-full object-cover opacity-70 scale-100 transition-transform duration-[10s] hover:scale-110"
              alt="Hero Burger"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          <div className="z-10 text-center px-4 max-w-4xl opacity-0 animate-fade-in">
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

        {/* Footer */}
        <footer className="bg-black py-20 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-4xl font-black text-yellow-400 tracking-tighter">FASTFOOD</div>
              <div className="flex gap-10">
                <Instagram size={32} className="cursor-pointer hover:text-yellow-400 transition-colors" />
                <Phone size={32} className="cursor-pointer hover:text-yellow-400 transition-colors" />
              </div>
              <p className="text-zinc-500 font-bold">© ۲۰۲۴ تمامی حقوق برای فست‌فود محفوظ است.</p>
           </div>
        </footer>
      </div>
    );
  }

  /**
 * رندر صفحه انتخاب شعبه (branches view) - طراحی مینیمال مطابق برگرلند
 */
// View: Branch Selection (order.burgerland.com)
  if (view === 'branches') {
    return (
      <div className="min-h-screen font-burgerland text-right selection:bg-amber-500 selection:text-black relative overflow-hidden">
        {/* پس‌زمینه تار شده */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/promo-1.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        {/* هدر: ورود چپ، لوگو راست */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={goHome}
            className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            بازگشت
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-amber-500 font-black text-xl tracking-tight">fast foodio</span>
          </div>
        </header>

        {/* بخش مرکزی: عنوان + گرید شعب */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-8">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10">
            <h2 className="text-center text-zinc-800 font-black text-xl md:text-2xl mb-8">
              لطفا شعبه مورد نظر خود را انتخاب کنید
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleBranchSelect(branch)}
                  className={`py-4 px-3 rounded-xl text-center font-bold text-sm transition-all border-2 ${
                    branch.isOpen
                      ? 'bg-white text-zinc-800 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/80'
                      : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed opacity-80'
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* فوتر: اینستاگرام + کپی‌رایت */}
        <footer className="relative z-10 flex items-center justify-between px-6 py-5 text-white/90">
          <a
            href="#"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="اینستاگرام"
          >
            <Instagram size={24} strokeWidth={1.5} />
          </a>
          <p className="text-xs md:text-sm font-medium">
            © حقوق مادی و معنوی متعلق به FASTFOOD است.
          </p>
        </footer>
      </div>
    );
  }

  /**
 * رندر صفحه منو و سبد خرید - طراحی مطابق برگرلند (هیرو قرمز، سبد چپ، منو راست)
 */
// View: Menu/Order (order.burgerland.com/order/...)
  return (
    <div className="min-h-screen bg-zinc-100 font-burgerland text-right selection:bg-amber-500 selection:text-black flex flex-col">
      {/* نوار بالایی مشکی: بازگشت | ورود | لوگو (کلیک = خانه) */}
      <header className="h-14 bg-black flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToBranches}
            className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg font-bold text-sm border border-white/20 hover:bg-zinc-800 transition-colors"
            title="بازگشت به انتخاب شعبه"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="hidden sm:inline">بازگشت</span>
          </button>
          <button type="button" className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm border border-white/20 hover:bg-zinc-800 transition-colors hidden sm:inline-block">
            ورود
          </button>
        </div>
        <button type="button" onClick={goHome} className="flex items-center gap-2 hover:opacity-90 transition-opacity" title="بازگشت به صفحه اصلی">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">🍔</div>
          <span className="text-amber-500 font-black text-lg tracking-tight">Fast Foodio</span>
        </button>
      </header>

      {/* هیرو قرمز با تصاویر غذا + باکس شعبه */}
      <div className="relative w-full h-44 md:h-52 shrink-0 overflow-hidden bg-red-600">
        <img src="/images/promo-1.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <img src="/images/fries-1.jpg" alt="" className="absolute left-1/4 top-0 w-1/4 h-1/2 object-cover opacity-90 rounded-lg" />
        <div className="absolute inset-0 bg-red-600/70" />
        {/* باکس اطلاعات شعبه - گوشه راست با فاصله مناسب از هدر */}
        <div className="absolute top-24 md:top-4 right-4 left-4 md:left-auto md:w-72 bg-white rounded-2xl shadow-xl p-4">
          <h3 className="font-black text-zinc-800 text-lg">{selectedBranch?.name ?? 'شعبه'}</h3>
          <p className="text-amber-600 font-bold text-sm mt-1">تا ۱۵٪ تخفیف</p>
          <p className="text-zinc-500 text-xs mt-2">آدرس: {selectedBranch?.address ?? ''}</p>
          <button
            type="button"
            onClick={goToBranches}
            className="mt-3 w-full flex items-center justify-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            تغییر شعبه
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="mt-2 flex items-center gap-2 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold">سفارش می‌پذیریم</span>
          </div>
        </div>
      </div>

      {/* تب‌ها: منوی سفارش | اطلاعات رستوران */}
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 flex gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setOrderTab('menu')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-colors ${orderTab === 'menu' ? 'border-red-500 text-red-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          منوی سفارش
        </button>
        <button
          type="button"
          onClick={() => setOrderTab('info')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-colors ${orderTab === 'info' ? 'border-red-500 text-red-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          اطلاعات رستوران
        </button>
      </div>

      {orderTab === 'info' ? (
        <main className="flex-1 p-6 bg-zinc-50">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
            <h2 className="font-black text-xl text-zinc-800 mb-4">{selectedBranch?.name ?? 'شعبه'}</h2>
            <p className="text-zinc-600 text-sm leading-relaxed">{selectedBranch?.address ?? ''}</p>
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-bold">سفارش می‌پذیریم</span>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex">
          {/* ستون راست: هدر و هیرو و تب با اسکرول از صفحه خارج می‌شوند؛ فقط نوار دسته‌ها به بالای صفحه می‌چسبد */}
          <main className="flex-1 min-w-0 p-4 md:p-6">
            {/* نوار دسته‌ها + جستجو: با رسیدن به بالا به viewport می‌چسبد، همیشه در دسترس */}
            <div ref={categoryNavRef} className="sticky top-0 z-20 bg-zinc-100 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 pt-px shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => {
                  const isActive = visibleCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        isActive
                          ? 'bg-white border-red-500 text-red-600 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      } ${isActive ? 'ring-2 ring-red-500/30' : ''}`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className={isActive ? 'font-black' : ''}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="جستجوی سریع"
                  className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pr-10 pl-4 text-sm outline-none focus:border-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* دسته‌ها پشت‌سرهم — اسکرول صفحه؛ کارت‌ها از زیر نوار دسته‌ها رد می‌شوند */}
            <div className="space-y-8 pt-4">
              {productsByCategory.map(({ category, products: catProducts }) => {
                if (catProducts.length === 0) return null;
                return (
                  <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-28">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-black text-zinc-800 text-lg flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </h2>
                      <button type="button" className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100" aria-label="اشتراک">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {catProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAdd={() => addToCart(product)}
                          quantity={cart.find(i => i.id === product.id)?.quantity || 0}
                          onRemove={() => removeFromCart(product.id)}
                          showNewBadge={index < 2}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
              {productsByCategory.every(({ products: p }) => p.length === 0) && (
                <div className="text-center py-16 text-zinc-500 font-medium">محصولی یافت نشد.</div>
              )}
            </div>
          </main>

          {/* ستون چپ: سبد خرید — با اسکرول به بالا می‌چسبد و از دید خارج نمی‌شود */}
          <aside className="hidden md:flex md:w-72 lg:w-80 md:shrink-0 md:sticky md:top-0 md:self-start md:max-h-screen md:flex-col bg-white border-r border-zinc-200 shadow-[-4px_0_12px_rgba(0,0,0,0.06)] z-10">
            <div className="p-4 border-b border-zinc-100 shrink-0">
              <h2 className="font-black text-zinc-800 text-lg">سبد خرید</h2>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-12 h-12 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500 font-medium">سبد خرید خالی است</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-800 text-sm truncate">{item.name}</p>
                          <p className="text-zinc-500 text-xs">{(item.price * item.quantity).toLocaleString()} تومان</p>
                          <div className="flex items-center gap-1 mt-1">
                            <button type="button" onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button type="button" onClick={() => addToCart(item)} className="w-7 h-7 rounded bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-zinc-100 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">جمع کل</span>
                      <span className="font-bold">{cartTotal.toLocaleString()} تومان</span>
                    </div>
                    <button
                      type="button"
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition-colors"
                    >
                      تکمیل سفارش
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* سبد خرید موبایل: دکمه شناور */}
      {orderTab === 'menu' && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-white border-2 border-zinc-200 rounded-2xl py-4 px-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-zinc-600" />
              <span className="font-bold text-zinc-800">سبد خرید</span>
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </div>
            {totalItems > 0 ? (
              <span className="font-black text-zinc-800">{cartTotal.toLocaleString()} تومان</span>
            ) : (
              <span className="text-zinc-400 text-sm">خالی</span>
            )}
          </button>
        </div>
      )}

      {/* دراور سبد خرید موبایل */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-black text-lg">سبد خرید</h2>
              <button type="button" onClick={() => setIsCartOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="w-16 h-16 text-zinc-300 mb-4" />
                  <p className="text-zinc-500 font-medium">سبد خرید خالی است</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 py-3 border-b border-zinc-100">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-zinc-500 text-xs">{(item.price * item.quantity).toLocaleString()} تومان</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button type="button" onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => addToCart(item)} className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold mb-3">جمع کل <span>{cartTotal.toLocaleString()} تومان</span></div>
                    <button type="button" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">تکمیل سفارش</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * کارت محصول ساده: تصویر با هاور (نام + توضیح)، نام و قیمت با فونت کوچک، دکمه افزودن
 */
const ProductCard: React.FC<{
  product: Product;
  onAdd: () => void;
  quantity: number;
  onRemove: () => void;
  showNewBadge?: boolean;
}> = ({ product, onAdd, quantity, onRemove, showNewBadge = false }) => {
  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-2xl transition-all duration-700 border border-zinc-100 flex flex-col h-full relative overflow-hidden">
      <div className="relative mb-2 sm:mb-4 rounded-xl sm:rounded-2xl lg:rounded-[2rem] overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* هاور روی تصویر: نام و توضیحات محصول */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-white/90 text-xs leading-relaxed line-clamp-3">{product.description}</p>
        </div>
        {showNewBadge && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-md z-10">
            NEW
          </span>
        )}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-amber-500 text-black px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-xl z-10">
            {quantity} در سبد
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <h3 className="font-bold text-zinc-800 text-sm line-clamp-2 leading-snug">{product.name}</h3>
      </div>

      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-zinc-50 mt-auto min-w-0">
        <div className="font-bold text-[10px] sm:text-xs text-zinc-700 min-w-0 shrink leading-tight">
          {product.price.toLocaleString()}{' '}
          <span className="text-zinc-400 font-normal">تومان</span>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 bg-zinc-100 rounded-lg sm:rounded-xl md:rounded-[1.5rem] px-1 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 shadow-inner shrink-0">
            <button
              type="button"
              onClick={onAdd}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-md sm:rounded-lg md:rounded-xl text-yellow-600 shadow-md hover:bg-yellow-50 active:scale-90 transition-all"
              aria-label="افزایش تعداد"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
            <span className="font-black text-sm sm:text-base md:text-lg w-5 sm:w-6 md:min-w-[1.5rem] text-center tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-md sm:rounded-lg md:rounded-xl text-zinc-400 shadow-md hover:text-red-500 active:scale-90 transition-all"
              aria-label="کاهش تعداد"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="bg-black text-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-[1.5rem] hover:bg-yellow-400 hover:text-black transition-all duration-500 transform active:scale-90 shadow-xl shadow-black/5 shrink-0 group-hover:rotate-12"
            aria-label="افزودن به سبد"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
