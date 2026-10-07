import { useEffect, useState } from 'react'
import { Icon, Toast } from './Primitives.jsx'

function AppShell({ page, navItems, navigate, notify, toast, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const current = navItems.find((item) => item.id === page)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const selectPage = (destination) => {
    navigate(destination)
    setMenuOpen(false)
  }

  return (
    <div className={`app-shell ${page === 'kitchen' ? 'kitchen-shell' : ''}`}>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand-lockup"><span className="brand-mark"><Icon name="restaurant" /></span><span><strong>BurgerFlow</strong><small>Downtown Branch</small></span></div>
        <button className="new-order-button" type="button" onClick={() => selectPage('pos')}><Icon name="add" /> Nuevo pedido</button>
        <nav className="side-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button className={page === item.id ? 'active' : ''} key={item.id} type="button" aria-current={page === item.id ? 'page' : undefined} onClick={() => selectPage(item.id)}>
              <Icon name={item.icon} />{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user"><span className="avatar">VV</span><span><strong>Victor Vargas</strong><small>Administrador</small></span></div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" aria-label="Cerrar navegación" type="button" onClick={() => setMenuOpen(false)} />}
      <div className="shell-main">
        <header className="topbar">
          <button className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          <label className="global-search"><Icon name="search" /><input type="search" placeholder="Buscar pedidos o productos" aria-label="Buscar pedidos o productos" onChange={(event) => { if (event.target.value.length > 2) notify(`Buscando “${event.target.value}”`) }} /></label>
          <div className="topbar-actions"><button className="icon-button notification-button" type="button" aria-label="Notificaciones" onClick={() => notify('No tienes notificaciones nuevas')}><Icon name="notifications" /><i /></button><span className="profile-name">Victor Vargas</span><span className="avatar">VV</span></div>
        </header>
        <div className="view-title"><span className="eyebrow">BurgerFlow / {current?.label ?? 'Panel principal'}</span></div>
        {children}
      </div>
      <Toast>{toast}</Toast>
    </div>
  )
}

export default AppShell