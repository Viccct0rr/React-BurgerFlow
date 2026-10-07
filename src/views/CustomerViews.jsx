import { useState } from 'react'
import { menuProducts } from '../data.js'
import { Icon, OrderItem, ProductCard, QuantityStepper, StatusBadge } from '../components/Primitives.jsx'

const categories = ['Hamburguesas', 'Combos', 'Papas', 'Bebidas', 'Extras']
const extras = [
  { name: 'Queso extra', price: 1 },
  { name: 'Tocino extra', price: 1.5 },
  { name: 'Huevo frito', price: 1 },
  { name: 'Aros de cebolla', price: 1.2 },
]
const removals = ['Sin Cebolla', 'Sin Pickles']
const customizationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwvnVd-XRrcHQr4Yye9PwnCtzpA4LTUKVqy3hAG5tf0AlmpV9bgGvQ_ub-4snqoN4USwWRHEBzXPucRT-ke3X7D0TVaE-qUAmZuxLsBeVNLK1JsBlhKWQpefqcwDr99Zjv5DR5J5kusCzWPK-zEROoYNqYtPCaBv6L-ntRkjXU4rAhI-ZzPdhlXuO-f8nfR8VznnPSXaddiGu83D0TP9N5OfI4o2-YO3fHIFAI6LQym0wPi80xU3kC'
const money = (amount) => `Bs ${amount.toFixed(2)}`

export function MenuView({ navigate, setSelectedProduct, cartCount }) {
  const [category, setCategory] = useState('Hamburguesas')
  const [query, setQuery] = useState('')
  const categoryProducts = menuProducts.filter((product) => product.category === category.toLowerCase())
  const activeCategory = categoryProducts.length ? category.toLowerCase() : 'all'
  const filtered = menuProducts.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()) && (activeCategory === 'all' || product.category === activeCategory))

  return (
    <main className="customer-menu">
      <header className="menu-topbar"><button className="menu-brand" type="button" onClick={() => navigate('dashboard')}>BurgerFlow</button><label className="menu-search"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el menú..." aria-label="Buscar en el menú" /></label><div className="menu-top-actions"><button className="icon-button" type="button" aria-label="Notificaciones"><Icon name="notifications" /></button><button className="icon-button desktop-only" type="button" onClick={() => navigate('dashboard')} aria-label="Centro de operaciones"><Icon name="storefront" /></button><span className="avatar">VV</span></div></header>
      <section className="menu-hero"><div className="menu-hero-photo" /><div className="menu-hero-copy"><h1>Sabor que fluye</h1></div></section>
      <nav className="menu-categories" aria-label="Categorías del menú">{categories.map((item) => <button type="button" className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</nav>
      <section className="menu-products" aria-label="Productos del menú">{filtered.map((product) => <ProductCard key={product.id} product={product} onAction={() => { setSelectedProduct(product); navigate('customizer') }} />)}{!filtered.length && <p className="empty-state">No encontramos productos con esos filtros.</p>}</section>
      <button className="floating-cart" type="button" aria-label={`Abrir carrito, ${cartCount} productos`} onClick={() => navigate('cart')}><Icon name="shopping_cart" /><span>{cartCount}</span></button>
    </main>
  )
}

export function CustomizerView({ product, navigate, notify, onAddToCart }) {
  const [size, setSize] = useState('regular')
  const [selectedExtras, setSelectedExtras] = useState([])
  const [selectedRemovals, setSelectedRemovals] = useState([])
  const [quantity, setQuantity] = useState(1)
  const unitPrice = product.price + (size === 'grande' ? 2 : 0) + selectedExtras.reduce((sum, name) => sum + extras.find((item) => item.name === name).price, 0)
  const total = unitPrice * quantity
  const toggleValue = (value, values, setValues) => setValues((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])

  const addToCart = () => {
    onAddToCart({ id: `custom-${Date.now()}`, name: product.name, price: unitPrice, quantity, details: [size === 'grande' ? 'Grande' : 'Regular', ...selectedExtras, ...selectedRemovals].join(', '), image: product.image })
    notify('Producto agregado al carrito')
    navigate('cart')
  }

  return (
    <main className="customizer-page">
      <header className="customizer-topbar"><button className="back-to-menu" type="button" onClick={() => navigate('menu')}><Icon name="close" />Volver al Menú</button><strong>BurgerFlow</strong></header>
      <div className="customizer-layout"><div className="customizer-image"><img src={product.id === 'bacon-blast' ? customizationImage : product.image} alt={product.name} /><StatusBadge tone="prep">Más Vendido</StatusBadge></div>
        <section className="customizer-panel"><div className="customizer-scroll"><div className="customizer-product-heading"><div><h1>{product.name}</h1><p>{product.description}</p></div><strong>{money(product.price)}</strong></div>
          <section className="customizer-section"><div className="customizer-section-title"><Icon name="straighten" /><h2>Elegir Tamaño</h2><span>Requerido</span></div><div className="option-grid">{[['regular', 'Regular', '200g de carne'], ['grande', 'Grande', '+ Bs 2.00']].map(([value, label, detail]) => <label className={`choice-card ${size === value ? 'checked' : ''}`} key={value}><input type="radio" name="size" value={value} checked={size === value} onChange={() => setSize(value)} /><span><strong>{label}</strong><small>{detail}</small></span><Icon name={size === value ? 'radio_button_checked' : 'radio_button_unchecked'} /></label>)}</div></section>
          <section className="customizer-section"><div className="customizer-section-title"><Icon name="add_circle" /><h2>Agregar Extras</h2></div><div className="check-list">{extras.map((extra) => <label className="check-row" key={extra.name}><span><input type="checkbox" checked={selectedExtras.includes(extra.name)} onChange={() => toggleValue(extra.name, selectedExtras, setSelectedExtras)} />{extra.name}</span><small>+ {money(extra.price)}</small></label>)}</div></section>
          <section className="customizer-section"><div className="customizer-section-title neutral"><Icon name="remove_circle" /><h2>Quitar Ingredientes</h2></div><div className="option-grid">{removals.map((item) => <label className="check-row" key={item}><span><input type="checkbox" checked={selectedRemovals.includes(item)} onChange={() => toggleValue(item, selectedRemovals, setSelectedRemovals)} />{item}</span></label>)}</div></section>
        </div><div className="customizer-actionbar"><QuantityStepper value={quantity} onChange={setQuantity} label={`Cantidad de ${product.name}`} /><button className="primary-button" type="button" onClick={addToCart}><span><Icon name="shopping_cart" />Agregar al Carrito</span><strong>Total: {money(total)}</strong></button></div></section>
      </div>
    </main>
  )
}

export function CartView({ items, setItems, navigate, notify }) {
  const [dining, setDining] = useState('here')
  const [payment, setPayment] = useState('')
  const [confirmation, setConfirmation] = useState(false)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const service = items.length ? 0.5 : 0
  const total = subtotal + tax + service
  const changeQuantity = (item, quantity) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity } : entry))

  const confirmOrder = () => {
    if (!items.length) return
    if (!payment) {
      notify('Selecciona un método de pago para continuar')
      return
    }
    setConfirmation(true)
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header"><button className="menu-brand" type="button" onClick={() => navigate('menu')}>BurgerFlow</button><button className="back-to-menu" type="button" onClick={() => navigate('menu')}><Icon name="arrow_back" />Seguir comprando</button></header>
      <div className="checkout-progress"><span /><div><strong>Carrito</strong><span>Pago</span><span>Confirmación</span></div></div>
      <div className="checkout-layout"><section className="checkout-items"><h1>Tu Pedido</h1>{items.map((item) => <OrderItem item={item} key={item.id} onQuantityChange={(quantity) => changeQuantity(item, quantity)} onRemove={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} />)}{!items.length && <p className="empty-state cart-empty">Tu carrito está vacío.</p>}</section>
        <aside className="checkout-summary">
          <section className="panel delivery-options"><h2>Opciones de Entrega</h2><div className="option-grid">{[['here', 'restaurant', 'Comer aquí'], ['takeaway', 'takeout_dining', 'Para llevar']].map(([value, icon, label]) => <button type="button" className={`delivery-option ${dining === value ? 'selected' : ''}`} key={value} onClick={() => setDining(value)}><Icon name={icon} />{label}</button>)}</div></section>
          <section className="panel payment-summary"><h2>Resumen</h2><SummaryLine label="Subtotal" value={money(subtotal)} /><SummaryLine label="Impuestos (8%)" value={money(tax)} /><SummaryLine label="Cargo por Servicio" value={money(service)} /><div className="summary-divider" /><SummaryLine label="Total" value={money(total)} total />
            <label className="payment-select">Método de pago<select value={payment} onChange={(event) => setPayment(event.target.value)} required><option value="">Selecciona un método</option><option>Efectivo</option><option>Tarjeta</option><option>QR</option></select></label>
            <button className="primary-button confirm-payment" type="button" disabled={!items.length} onClick={confirmOrder}>Ir a Pagar<Icon name="arrow_forward" /></button>
          </section>
        </aside>
      </div>
      {confirmation && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmation(false) }}><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><span className="confirmation-icon"><Icon name="check_circle" /></span><h2 id="confirmation-title">¡Pedido Recibido!</h2><strong className="confirmation-order">#BF-1024</strong><div className="confirmation-details"><SummaryLine label="Estado:" value="Enviado a Cocina" /><SummaryLine label="Tipo:" value={dining === 'here' ? 'Comer en el local' : 'Para llevar'} /><SummaryLine label="Total Pagado:" value={money(total)} /></div><button className="secondary-button full-width" type="button" onClick={() => { setConfirmation(false); navigate('dashboard') }}>Volver al Inicio</button><button className="primary-button full-width" type="button" onClick={() => { setConfirmation(false); navigate('menu') }}>Seguir comprando</button></section></div>}
    </main>
  )
}

function SummaryLine({ label, value, total = false }) {
  return <div className={`summary-line ${total ? 'total-line' : ''}`}><span>{label}</span><strong>{value}</strong></div>
}