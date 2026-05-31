import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  ArrowRight,
  X,
  Phone,
  Instagram,
  ChevronDown,
  Share2,
} from 'lucide-react';
import { categories, products, branches, Branch } from './data/mockData';
import { Product, CartItem } from './types';
import LoadingSpinner from './LoadingSpinner';

type ViewState = 'home' | 'branches' | 'menu';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTab, setOrderTab] = useState<'menu' | 'info'>('menu');
  const [visibleCategoryId, setVisibleCategoryId] = useState<string>(categories[0].id);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrollingFromClick = useRef(false);

  const productsByCategory = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      products: products.filter(
        (p) =>
          p.category === cat.id &&
          (searchQuery === '' ||
            p.name.includes(searchQuery) ||
            p.description.includes(searchQuery))
      ),
    }));
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleBranchSelect = (branch: Branch) => {
    if (!branch.isOpen) return;
    setSelectedBranch(branch);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setView('home');
    setSelectedBranch(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBranches = () => {
    setView('branches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="ff-loading-screen ff-font">
        <LoadingSpinner />
      </div>
    );
  }

  if (view === 'home') {
    return (
      <div className="ff-home ff-font">
        <nav className="ff-home-nav">
          <div className="ff-home-nav-inner">
            <div className="ff-home-logo">FASTFOOD</div>
            <div className="ff-home-links">
              <a href="#">منو</a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToBranches();
                }}
              >
                شعب ما
              </a>
              <a href="#">درباره ما</a>
              <a href="#">تماس</a>
            </div>
            <button type="button" onClick={goToBranches} className="ff-home-cta">
              سفارش آنلاین
            </button>
          </div>
        </nav>

        <header className="ff-home-hero">
          <div className="ff-home-hero-bg">
            <img src="/images/promo-1.jpg" alt="Hero Burger" />
            <div className="ff-home-hero-overlay" />
          </div>
          <div className="ff-home-hero-content">
            <h1 className="ff-home-hero-title">
              طعم واقعی <br />
              <span>برگر</span> دست‌ساز
            </h1>
            <p className="ff-home-hero-desc">
              ما در فست‌فودیـو فقط غذا درست نمی‌کنیم، ما برای شما خاطره‌ای خوشمزه می‌سازیم.
            </p>
            <div className="ff-home-hero-btns">
              <button type="button" onClick={goToBranches} className="ff-btn-white">
                سفارش آنلاین
              </button>
              <button type="button" className="ff-btn-outline">
                مشاهده منو
              </button>
            </div>
          </div>
        </header>

        <footer className="ff-home-footer">
          <div className="ff-home-footer-inner">
            <div className="ff-home-footer-logo">FASTFOOD</div>
            <div className="ff-home-footer-icons">
              <Instagram size={32} />
              <Phone size={32} />
            </div>
            <p className="ff-home-footer-copy">© ۲۰۲۴ تمامی حقوق برای فست‌فود محفوظ است.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'branches') {
    return (
      <div className="ff-branches ff-font">
        <div className="ff-branches-bg">
          <img src="/images/promo-1.jpg" alt="" />
          <div className="ff-branches-bg-overlay" />
        </div>

        <header className="ff-branches-header">
          <button type="button" onClick={goHome} className="ff-btn-back">
            بازگشت
          </button>
          <div className="ff-branches-logo">
            <span className="ff-branches-logo-emoji">🍔</span>
            <span className="ff-branches-logo-text">fast foodio</span>
          </div>
        </header>

        <main className="ff-branches-main">
          <div className="ff-branches-card">
            <h2 className="ff-branches-title">لطفا شعبه مورد نظر خود را انتخاب کنید</h2>
            <div className="ff-branches-grid">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleBranchSelect(branch)}
                  disabled={!branch.isOpen}
                  className={`ff-branch-btn ${branch.isOpen ? 'open' : 'closed'}`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        </main>

        <footer className="ff-branches-footer">
          <a href="#" aria-label="اینستاگرام">
            <Instagram size={24} strokeWidth={1.5} />
          </a>
          <p>© حقوق مادی و معنوی متعلق به FASTFOOD است.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="ff-menu ff-font">
      <header className="ff-menu-header">
        <div className="ff-menu-header-left">
          <button
            type="button"
            onClick={goToBranches}
            className="ff-menu-header-btn"
            title="بازگشت به انتخاب شعبه"
          >
            <ArrowRight size={20} />
            <span className="ff-hide-mobile">بازگشت</span>
          </button>
          <button type="button" className="ff-menu-header-btn ff-login">
            ورود
          </button>
        </div>
        <button
          type="button"
          onClick={goHome}
          className="ff-menu-logo-btn"
          title="بازگشت به صفحه اصلی"
        >
          <div className="ff-menu-logo-icon">🍔</div>
          <span className="ff-menu-logo-text">Fast Foodio</span>
        </button>
      </header>

      <div className="ff-menu-hero">
        <img src="/images/promo-1.jpg" alt="" className="ff-hero-main" />
        <img src="/images/fries-1.jpg" alt="" className="ff-hero-fries" />
        <div className="ff-menu-hero-overlay" />
        <div className="ff-branch-info">
          <h3>{selectedBranch?.name ?? 'شعبه'}</h3>
          <p className="ff-discount">تا ۱۵٪ تخفیف</p>
          <p className="ff-address">آدرس: {selectedBranch?.address ?? ''}</p>
          <button type="button" onClick={goToBranches} className="ff-branch-change">
            تغییر شعبه
            <ChevronDown size={16} />
          </button>
          <div className="ff-status-open">
            <span className="ff-status-dot" />
            <span>سفارش می‌پذیریم</span>
          </div>
        </div>
      </div>

      <div className="ff-menu-tabs">
        <button
          type="button"
          onClick={() => setOrderTab('menu')}
          className={`ff-tab-btn ${orderTab === 'menu' ? 'active' : ''}`}
        >
          منوی سفارش
        </button>
        <button
          type="button"
          onClick={() => setOrderTab('info')}
          className={`ff-tab-btn ${orderTab === 'info' ? 'active' : ''}`}
        >
          اطلاعات رستوران
        </button>
      </div>

      {orderTab === 'info' ? (
        <main className="ff-info-page">
          <div className="ff-info-card">
            <h2>{selectedBranch?.name ?? 'شعبه'}</h2>
            <p>{selectedBranch?.address ?? ''}</p>
            <div className="ff-status-open" style={{ marginTop: '1rem' }}>
              <span className="ff-status-dot" />
              <span style={{ fontSize: '0.875rem' }}>سفارش می‌پذیریم</span>
            </div>
          </div>
        </main>
      ) : (
        <div className="ff-menu-body">
          <main className="ff-menu-main">
            <div ref={categoryNavRef} className="ff-category-nav">
              <div className="ff-category-list">
                {categories.map((cat) => {
                  const isActive = visibleCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`ff-cat-btn ${isActive ? 'active' : ''}`}
                    >
                      <span className="ff-cat-icon">{cat.icon}</span>
                      <span className={isActive ? 'ff-black' : ''}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="ff-search-wrap">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="جستجوی سریع"
                  className="ff-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="ff-products-area">
              {productsByCategory.map(({ category, products: catProducts }) => {
                if (catProducts.length === 0) return null;
                return (
                  <section
                    key={category.id}
                    id={`cat-${category.id}`}
                    className="ff-scroll-section"
                  >
                    <div className="ff-section-header">
                      <h2>
                        <span>{category.icon}</span>
                        {category.name}
                      </h2>
                      <button type="button" className="ff-share-btn" aria-label="اشتراک">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <div className="ff-product-grid">
                      {catProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAdd={() => addToCart(product)}
                          quantity={cart.find((i) => i.id === product.id)?.quantity || 0}
                          onRemove={() => removeFromCart(product.id)}
                          showNewBadge={index < 2}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
              {productsByCategory.every(({ products: p }) => p.length === 0) && (
                <div className="ff-no-products">محصولی یافت نشد.</div>
              )}
            </div>
          </main>

          <aside className="ff-cart-sidebar">
            <div className="ff-cart-sidebar-header">
              <h2>سبد خرید</h2>
            </div>
            <div className="ff-cart-sidebar-body">
              {cart.length === 0 ? (
                <div className="ff-cart-empty">
                  <div className="ff-cart-empty-icon">
                    <ShoppingCart size={48} />
                  </div>
                  <p>سبد خرید خالی است</p>
                </div>
              ) : (
                <>
                  <ul className="ff-cart-list">
                    {cart.map((item) => (
                      <li key={item.id}>
                        <div className="ff-cart-item">
                          <img src={item.image} alt={item.name} />
                          <div className="ff-cart-item-info">
                            <p className="ff-cart-item-name">{item.name}</p>
                            <p className="ff-cart-item-price">
                              {(item.price * item.quantity).toLocaleString()} تومان
                            </p>
                            <div className="ff-cart-qty">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="ff-cart-qty-btn"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="ff-cart-qty-num">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => addToCart(item)}
                                className="ff-cart-qty-btn"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="ff-cart-total">
                    <div className="ff-cart-total-row">
                      <span>جمع کل</span>
                      <span className="ff-bold">{cartTotal.toLocaleString()} تومان</span>
                    </div>
                    <button type="button" className="ff-cart-checkout">
                      تکمیل سفارش
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {orderTab === 'menu' && (
        <div className="ff-mobile-cart">
          <button type="button" onClick={() => setIsCartOpen(true)} className="ff-mobile-cart-btn">
            <div className="ff-mobile-cart-left">
              <ShoppingCart size={24} />
              <span className="label">سبد خرید</span>
              {totalItems > 0 && <span className="ff-cart-badge">{totalItems}</span>}
            </div>
            {totalItems > 0 ? (
              <span className="ff-mobile-cart-total">{cartTotal.toLocaleString()} تومان</span>
            ) : (
              <span className="ff-mobile-cart-empty">خالی</span>
            )}
          </button>
        </div>
      )}

      {isCartOpen && (
        <div className="ff-drawer-overlay">
          <div className="ff-drawer-backdrop" onClick={() => setIsCartOpen(false)} />
          <div className="ff-drawer-panel">
            <div className="ff-drawer-header">
              <h2>سبد خرید</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="ff-drawer-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="ff-drawer-body">
              {cart.length === 0 ? (
                <div className="ff-cart-empty">
                  <div className="ff-cart-empty-icon" style={{ width: '4rem', height: '4rem', marginBottom: '1rem' }}>
                    <ShoppingCart size={64} />
                  </div>
                  <p>سبد خرید خالی است</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="ff-drawer-item">
                      <img src={item.image} alt={item.name} />
                      <div className="ff-drawer-item-info">
                        <p className="ff-drawer-item-name">{item.name}</p>
                        <p className="ff-drawer-item-price">
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </p>
                        <div className="ff-drawer-qty">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="ff-drawer-qty-btn"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="ff-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="ff-drawer-qty-btn"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="ff-drawer-total">
                    <div className="ff-drawer-total-row">
                      <span>جمع کل</span>
                      <span>{cartTotal.toLocaleString()} تومان</span>
                    </div>
                    <button type="button" className="ff-cart-checkout">
                      تکمیل سفارش
                    </button>
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

const ProductCard: React.FC<{
  product: Product;
  onAdd: () => void;
  quantity: number;
  onRemove: () => void;
  showNewBadge?: boolean;
}> = ({ product, onAdd, quantity, onRemove, showNewBadge = false }) => {
  return (
    <div className="ff-product-card">
      <div className="ff-product-img-wrap">
        <img src={product.image} alt={product.name} />
        <div className="ff-product-img-gradient" />
        <div className="ff-product-hover">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        {showNewBadge && <span className="ff-badge-new">NEW</span>}
        {quantity > 0 && <span className="ff-badge-qty">{quantity} در سبد</span>}
      </div>

      <div className="ff-product-name">
        <h3>{product.name}</h3>
      </div>

      <div className="ff-product-footer">
        <div className="ff-product-price">
          {product.price.toLocaleString()} <span>تومان</span>
        </div>

        {quantity > 0 ? (
          <div className="ff-product-qty">
            <button
              type="button"
              onClick={onAdd}
              className="ff-product-qty-btn add"
              aria-label="افزایش تعداد"
            >
              <Plus size={14} />
            </button>
            <span className="ff-product-qty-num">{quantity}</span>
            <button
              type="button"
              onClick={onRemove}
              className="ff-product-qty-btn remove"
              aria-label="کاهش تعداد"
            >
              <Minus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="ff-product-add"
            aria-label="افزودن به سبد"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
