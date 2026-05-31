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
import Offcanvas from 'react-bootstrap/Offcanvas';
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

  const renderCartItems = () => (
    <>
      <ul className="list-unstyled mb-0">
        {cart.map((item) => (
          <li key={item.id} className="d-flex gap-3 mb-3">
            <img
              src={item.image}
              alt={item.name}
              className="rounded object-fit-cover flex-shrink-0"
              style={{ width: 56, height: 56 }}
            />
            <div className="flex-grow-1 min-w-0">
              <p className="fw-bold text-dark mb-0 small text-truncate">{item.name}</p>
              <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                {(item.price * item.quantity).toLocaleString()} تومان
              </p>
              <div className="qty-control d-inline-flex">
                <button
                  type="button"
                  className="qty-btn remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="کاهش"
                >
                  <Minus size={14} />
                </button>
                <span className="fw-bold text-center" style={{ width: 24 }}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => addToCart(item)}
                  aria-label="افزایش"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-top pt-3 mt-3">
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted small">جمع کل</span>
          <span className="fw-bold">{cartTotal.toLocaleString()} تومان</span>
        </div>
        <button type="button" className="btn btn-brand-red w-100 rounded-3 py-2">
          تکمیل سفارش
        </button>
      </div>
    </>
  );

  const renderEmptyCart = () => (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div
        className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
        style={{ width: 96, height: 96 }}
      >
        <ShoppingCart size={48} className="text-secondary opacity-50" />
      </div>
      <p className="text-muted fw-medium mb-0">سبد خرید خالی است</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <LoadingSpinner />
      </div>
    );
  }

  /* ─── HOME VIEW ─── */
  if (view === 'home') {
    return (
      <div className="min-vh-100 bg-brand-black text-white">
        <nav className="navbar navbar-expand-md navbar-dark navbar-glass fixed-top">
          <div className="container-fluid px-4 py-2">
            <span className="navbar-brand fs-3 fw-black text-brand-yellow mb-0">
              FASTFOOD
            </span>
            <div className="d-none d-md-flex gap-4 mx-auto">
              <a href="#" className="nav-link text-white fw-bold text-uppercase small">
                منو
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); goToBranches(); }}
                className="nav-link text-white fw-bold text-uppercase small"
              >
                شعب ما
              </a>
              <a href="#" className="nav-link text-white fw-bold text-uppercase small">
                درباره ما
              </a>
              <a href="#" className="nav-link text-white fw-bold text-uppercase small">
                تماس
              </a>
            </div>
            <button
              type="button"
              onClick={goToBranches}
              className="btn btn-brand-yellow rounded-pill px-4 py-2"
            >
              سفارش آنلاین
            </button>
          </div>
        </nav>

        <header className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 h-100">
            <img
              src="/images/promo-1.jpg"
              className="w-100 h-100 object-fit-cover opacity-75"
              alt="Hero Burger"
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 hero-overlay" />
          </div>
          <div className="position-relative text-center px-3 hero-content" style={{ maxWidth: 900 }}>
            <h1 className="display-1 fw-black mb-4 lh-1">
              طعم واقعی <br />
              <span className="text-brand-yellow">برگر</span> دست‌ساز
            </h1>
            <p className="fs-4 text-light mb-5 mx-auto" style={{ maxWidth: 600 }}>
              ما در فست‌فودیـو فقط غذا درست نمی‌کنیم، ما برای شما خاطره‌ای خوشمزه می‌سازیم.
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button
                type="button"
                onClick={goToBranches}
                className="btn btn-light btn-lg rounded-pill fw-black px-5 py-3"
              >
                سفارش آنلاین
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg rounded-pill fw-black px-5 py-3"
              >
                مشاهده منو
              </button>
            </div>
          </div>
        </header>

        <footer className="bg-black py-5 border-top border-secondary border-opacity-25">
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <span className="fs-2 fw-black text-brand-yellow">FASTFOOD</span>
            <div className="d-flex gap-4">
              <Instagram size={32} className="text-white" style={{ cursor: 'pointer' }} />
              <Phone size={32} className="text-white" style={{ cursor: 'pointer' }} />
            </div>
            <p className="text-secondary fw-bold mb-0 small">
              © ۲۰۲۴ تمامی حقوق برای فست‌فود محفوظ است.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  /* ─── BRANCHES VIEW ─── */
  if (view === 'branches') {
    return (
      <div className="min-vh-100 position-relative overflow-hidden">
        <div className="branch-bg">
          <img src="/images/promo-1.jpg" alt="" />
          <div className="branch-bg-overlay" />
        </div>

        <header className="position-relative d-flex align-items-center justify-content-between px-4 py-3" style={{ zIndex: 10 }}>
          <button
            type="button"
            onClick={goHome}
            className="btn btn-dark fw-bold rounded-3 px-4 py-2"
          >
            بازگشت
          </button>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4">🍔</span>
            <span className="text-warning fw-black fs-5">fast foodio</span>
          </div>
        </header>

        <main
          className="position-relative d-flex flex-column align-items-center justify-content-center px-3 py-4"
          style={{ zIndex: 10, minHeight: 'calc(100vh - 180px)' }}
        >
          <div
            className="w-100 bg-white bg-opacity-95 rounded-4 shadow-lg p-4 p-md-5"
            style={{ maxWidth: 640, backdropFilter: 'blur(12px)' }}
          >
            <h2 className="text-center text-dark fw-black fs-4 mb-4">
              لطفا شعبه مورد نظر خود را انتخاب کنید
            </h2>
            <div className="row g-2">
              {branches.map((branch) => (
                <div key={branch.id} className="col-6 col-md-3">
                  <button
                    type="button"
                    onClick={() => handleBranchSelect(branch)}
                    disabled={!branch.isOpen}
                    className={`btn w-100 py-3 fw-bold rounded-3 border-2 ${
                      branch.isOpen
                        ? 'btn-outline-secondary text-dark'
                        : 'btn-light text-muted opacity-75'
                    }`}
                    style={branch.isOpen ? { borderColor: '#e4e4e7' } : undefined}
                  >
                    {branch.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer
          className="position-relative d-flex align-items-center justify-content-between px-4 py-3 text-white"
          style={{ zIndex: 10 }}
        >
          <a href="#" className="btn btn-link text-white p-2" aria-label="اینستاگرام">
            <Instagram size={24} strokeWidth={1.5} />
          </a>
          <p className="mb-0 small fw-medium opacity-75">
            © حقوق مادی و معنوی متعلق به FASTFOOD است.
          </p>
        </footer>
      </div>
    );
  }

  /* ─── MENU VIEW ─── */
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="bg-brand-black d-flex align-items-center justify-content-between px-3 px-md-4 flex-shrink-0" style={{ height: 56 }}>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={goToBranches}
            className="btn btn-dark border border-secondary border-opacity-50 d-flex align-items-center gap-2 rounded-3 fw-bold small py-2 px-3"
            title="بازگشت به انتخاب شعبه"
          >
            <ArrowRight size={20} />
            <span className="d-none d-sm-inline">بازگشت</span>
          </button>
          <button
            type="button"
            className="btn btn-dark border border-secondary border-opacity-50 rounded-3 fw-bold small py-2 px-3 d-none d-sm-inline-block"
          >
            ورود
          </button>
        </div>
        <button
          type="button"
          onClick={goHome}
          className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0"
          title="بازگشت به صفحه اصلی"
        >
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40, fontSize: '1.25rem' }}
          >
            🍔
          </div>
          <span className="text-warning fw-black fs-5">Fast Foodio</span>
        </button>
      </header>

      <div className="menu-hero bg-brand-red flex-shrink-0">
        <img
          src="/images/promo-1.jpg"
          alt=""
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-75"
        />
        <img
          src="/images/fries-1.jpg"
          alt=""
          className="position-absolute rounded opacity-90 object-fit-cover d-none d-md-block"
          style={{ left: '25%', top: 0, width: '25%', height: '50%' }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-danger opacity-75" />

        <div className="branch-info-card bg-white shadow-lg p-3">
          <h3 className="fw-black text-dark fs-5 mb-1">{selectedBranch?.name ?? 'شعبه'}</h3>
          <p className="text-warning fw-bold small mb-1">تا ۱۵٪ تخفیف</p>
          <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
            آدرس: {selectedBranch?.address ?? ''}
          </p>
          <button
            type="button"
            onClick={goToBranches}
            className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-1 rounded-3 fw-bold small py-2"
          >
            تغییر شعبه
            <ChevronDown size={16} />
          </button>
          <div className="d-flex align-items-center gap-2 text-success mt-2">
            <span
              className="rounded-circle bg-success d-inline-block"
              style={{ width: 8, height: 8 }}
            />
            <span className="fw-bold" style={{ fontSize: '0.75rem' }}>
              سفارش می‌پذیریم
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border-bottom d-flex gap-1 px-3 px-md-4 flex-shrink-0">
        <button
          type="button"
          onClick={() => setOrderTab('menu')}
          className={`nav-tab-btn ${orderTab === 'menu' ? 'active' : ''}`}
        >
          منوی سفارش
        </button>
        <button
          type="button"
          onClick={() => setOrderTab('info')}
          className={`nav-tab-btn ${orderTab === 'info' ? 'active' : ''}`}
        >
          اطلاعات رستوران
        </button>
      </div>

      {orderTab === 'info' ? (
        <main className="flex-grow-1 p-4 bg-light">
          <div className="mx-auto bg-white rounded-4 shadow-sm p-4 p-md-5" style={{ maxWidth: 640 }}>
            <h2 className="fw-black fs-4 text-dark mb-3">{selectedBranch?.name ?? 'شعبه'}</h2>
            <p className="text-muted small lh-lg">{selectedBranch?.address ?? ''}</p>
            <div className="d-flex align-items-center gap-2 text-success mt-3">
              <span className="rounded-circle bg-success d-inline-block" style={{ width: 8, height: 8 }} />
              <span className="fw-bold small">سفارش می‌پذیریم</span>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-grow-1 d-flex">
          <main className="flex-grow-1 min-w-0 p-3 p-md-4">
            <div ref={categoryNavRef} className="category-nav-sticky pb-3 pt-1 px-0">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`btn-category d-flex align-items-center gap-2 ${
                      visibleCategoryId === cat.id ? 'active' : ''
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className={visibleCategoryId === cat.id ? 'fw-black' : ''}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="search-wrap">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="جستجوی سریع"
                  className="form-control rounded-3 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-3">
              {productsByCategory.map(({ category, products: catProducts }) => {
                if (catProducts.length === 0) return null;
                return (
                  <section
                    key={category.id}
                    id={`cat-${category.id}`}
                    className="scroll-mt-nav mb-5"
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h2 className="fw-black text-dark fs-5 d-flex align-items-center gap-2 mb-0">
                        <span>{category.icon}</span>
                        {category.name}
                      </h2>
                      <button
                        type="button"
                        className="btn btn-light rounded-3 p-2 text-muted"
                        aria-label="اشتراک"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                    <div className="row g-3">
                      {catProducts.map((product, index) => (
                        <div key={product.id} className="col-6 col-md-4 col-lg-3">
                          <ProductCard
                            product={product}
                            onAdd={() => addToCart(product)}
                            quantity={cart.find((i) => i.id === product.id)?.quantity || 0}
                            onRemove={() => removeFromCart(product.id)}
                            showNewBadge={index < 2}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
              {productsByCategory.every(({ products: p }) => p.length === 0) && (
                <div className="text-center py-5 text-muted fw-medium">محصولی یافت نشد.</div>
              )}
            </div>
          </main>

          <aside
            className="cart-sidebar d-none d-md-flex flex-column bg-white flex-shrink-0"
            style={{ width: 320 }}
          >
            <div className="p-3 border-bottom flex-shrink-0">
              <h2 className="fw-black text-dark fs-5 mb-0">سبد خرید</h2>
            </div>
            <div className="flex-grow-1 overflow-auto p-3">
              {cart.length === 0 ? renderEmptyCart() : renderCartItems()}
            </div>
          </aside>
        </div>
      )}

      {orderTab === 'menu' && (
        <div className="mobile-cart-bar d-md-none">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="btn btn-light w-100 border-2 rounded-4 py-3 px-3 d-flex align-items-center justify-content-between shadow"
          >
            <div className="d-flex align-items-center gap-2">
              <ShoppingCart size={24} className="text-secondary" />
              <span className="fw-bold text-dark">سبد خرید</span>
              {totalItems > 0 && (
                <span
                  className="badge bg-danger rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 24, height: 24, fontSize: '0.7rem' }}
                >
                  {totalItems}
                </span>
              )}
            </div>
            {totalItems > 0 ? (
              <span className="fw-black text-dark">{cartTotal.toLocaleString()} تومان</span>
            ) : (
              <span className="text-muted small">خالی</span>
            )}
          </button>
        </div>
      )}

      <Offcanvas show={isCartOpen} onHide={() => setIsCartOpen(false)} placement="start">
        <Offcanvas.Header className="border-bottom">
          <Offcanvas.Title className="fw-black">سبد خرید</Offcanvas.Title>
          <button
            type="button"
            className="btn btn-link p-0 text-dark"
            onClick={() => setIsCartOpen(false)}
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? renderEmptyCart() : renderCartItems()}
        </Offcanvas.Body>
      </Offcanvas>
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
    <div className="product-card bg-white p-3 d-flex flex-column h-100 shadow-sm">
      <div className="product-img-wrap mb-2">
        <img src={product.image} alt={product.name} />
        <div className="product-hover-overlay">
          <h3 className="text-white fw-bold small mb-1">{product.name}</h3>
          <p className="text-white opacity-75 mb-0" style={{ fontSize: '0.7rem' }}>
            {product.description}
          </p>
        </div>
        {showNewBadge && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-danger fw-black"
            style={{ fontSize: '0.6rem' }}
          >
            NEW
          </span>
        )}
        {quantity > 0 && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark fw-black"
            style={{ fontSize: '0.65rem' }}
          >
            {quantity} در سبد
          </span>
        )}
      </div>

      <h3 className="fw-bold text-dark small mb-0 flex-grow-1">{product.name}</h3>

      <div className="d-flex align-items-center justify-content-between gap-2 pt-3 mt-auto border-top border-light">
        <div className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>
          {product.price.toLocaleString()}{' '}
          <span className="text-muted fw-normal">تومان</span>
        </div>

        {quantity > 0 ? (
          <div className="qty-control">
            <button type="button" className="qty-btn" onClick={onAdd} aria-label="افزایش">
              <Plus size={16} />
            </button>
            <span className="fw-black text-center" style={{ width: 20, fontSize: '0.875rem' }}>
              {quantity}
            </span>
            <button type="button" className="qty-btn remove" onClick={onRemove} aria-label="کاهش">
              <Minus size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="btn btn-dark rounded-3 p-2"
            aria-label="افزودن به سبد"
          >
            <Plus size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
