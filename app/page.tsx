'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMenuItems(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando el menú:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { name: 'Todo', slug: 'todo' },
    { name: 'Hamburguesas', slug: 'hamburguesas' },
    { name: 'Platos fuertes', slug: 'platos fuertes' },
    { name: 'Mexicano', slug: 'mexicano' },
    { name: 'Fresco', slug: 'fresco' },
    { name: 'Pizza', slug: 'pizza' },
    { name: 'Bebidas', slug: 'bebidas' },
    { name: 'Postres', slug: 'postres' }
  ];

  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'todo' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="logo-container">
          <span className="logo-text">SaborExpress</span>
        </div>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Busca un plato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <span className="hero-tag">PARA HOY</span>
          <h1 className="hero-title">Elige tu antojo</h1>
        </section>

        <div className="category-row" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={selectedCategory === cat.slug}
              className={`category-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <section className="menu-section">
          {loading ? (
            <div className="loading-state">Cargando platos desde la base de datos...</div>
          ) : filteredMenu.length > 0 ? (
            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <article key={item.id} className="menu-card">
                  <div className="card-image-wrapper">
                    <img src={item.image} alt={item.name} className="card-image" />
                    {item.popular && <span className="badge-popular">Popular</span>}
                  </div>
                  <div className="card-body">
                    <div className="card-header-info">
                      <h3 className="card-title">{item.name}</h3>
                      <span className="card-price">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="card-description">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No encontramos platos con ese nombre. Prueba otra búsqueda.</div>
          )}
        </section>

        <section className="live-banner" id="favoritos">
          <div className="banner-content">
            <div className="banner-icon">🚲</div>
            <div className="banner-text">
              <h3>¿Ya hiciste tu pedido?</h3>
              <p>Consulta el estado de tu entrega en tiempo real.</p>
            </div>
          </div>
          <button className="banner-btn" onClick={() => setTrackingOpen(true)}>
            Ver mi pedido &rarr;
          </button>
        </section>
      </main>

      <footer id="ayuda">
        <div className="footer-main">
          <p>&copy; {new Date().getFullYear()} SaborExpress. Todos los derechos reservados.</p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root { --ink: #182522; --muted: #73827b; --cream: #f7f6f1; --green: #173d35; --coral: #e06d53; }
        * { box-sizing: border-box; } html { scroll-behavior: smooth; } body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--cream); color: var(--ink); }
        .app-shell { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: white; border-bottom: 1px solid #eaeaea; }
        .logo-text { font-weight: 700; font-size: 1.5rem; color: var(--green); }
        .search-input { padding: 10px 16px; border-radius: 20px; border: 1px solid #ccc; width: 250px; font-size: 0.9rem; }
        .content { flex: 1; max-width: 1200px; margin: 0 auto; padding: 40px 20px; width: 100%; }
        .hero { margin-bottom: 30px; }
        .hero-tag { font-size: 0.8rem; font-weight: 700; color: var(--coral); letter-spacing: 1px; }
        .hero-title { font-size: 2.5rem; margin: 5px 0 0; color: var(--ink); }
        .category-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 30px; }
        .category-pill { padding: 8px 18px; border-radius: 20px; border: none; background: #e5e8e6; color: var(--ink); font-weight: 600; cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .category-pill.active { background: var(--green); color: white; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
        .menu-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform 0.2s; }
        .menu-card:hover { transform: translateY(-4px); }
        .card-image-wrapper { position: relative; height: 180px; }
        .card-image { width: 100%; height: 100%; object-fit: cover; }
        .badge-popular { position: absolute; top: 12px; left: 12px; background: var(--coral); color: white; padding: 4px 10px; font-size: 0.75rem; font-weight: 700; border-radius: 8px; }
        .card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
        .card-header-info { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .card-title { font-size: 1.1rem; font-weight: 700; margin: 0; color: var(--ink); }
        .card-price { font-weight: 700; color: var(--green); font-size: 1.1rem; }
        .card-description { font-size: 0.85rem; color: var(--muted); margin: 0; line-height: 1.4; }
        .live-banner { background: #e2f0d9; border-radius: 16px; padding: 30px; display: flex; justify-content: space-between; align-items: center; margin-top: 50px; }
        .banner-content { display: flex; align-items: center; gap: 20px; }
        .banner-icon { font-size: 2.5rem; background: var(--green); color: white; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .banner-text h3 { margin: 0 0 5px; color: var(--green); font-size: 1.3rem; }
        .banner-text p { margin: 0; color: #4a5c53; font-size: 0.95rem; }
        .banner-btn { background: var(--green); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; }
        .loading-state, .empty-state { text-align: center; padding: 50px; color: var(--muted); font-size: 1.1rem; grid-column: 1 / -1; }
        footer { background: #111b18; color: white; text-align: center; padding: 30px; margin-top: auto; font-size: 0.9rem; }
        @media(max-width: 800px) { .topbar { flex-direction: column; gap: 15px; } .search-input { width: 100%; } .live-banner { flex-direction: column; gap: 20px; text-align: center; } .banner-content { flex-direction: column; } }
      `}</style>
    </div>
  );
}