import { useState } from 'react'
import { deliveryOrders } from '../data.js'
import { Icon, MetricCard, PaymentSelector, ProductCard, QuantityStepper, SectionHeading, StatusBadge } from '../components/Primitives.jsx'

const money = (amount) => `Bs ${amount.toFixed(2)}`
const categories = [
  { id: 'all', label: 'Todo', icon: 'lunch_dining' },
  { id: 'hamburguesas', label: 'Hamburguesas', icon: 'lunch_dining' },
  { id: 'acompañamientos', label: 'Acompañamientos', icon: 'fastfood' },
  { id: 'bebidas', label: 'Bebidas', icon: 'local_cafe' },
  { id: 'postres', label: 'Postres', icon: 'cake' },
]

export function POSView({ products, items, setItems, navigate, notify }) {
  const [category, setCategory] = useState('hamburguesas')
  const [query, setQuery] = useState('')
  const [dining, setDining] = useState('here')
  const [payment, setPayment] = useState('Efectivo')
  const filteredProducts = products.filter((product) => {
    const categoryMatches = category === 'all' || product.category === category || (category === 'bebidas' && product.category === 'bebidas') || (category === 'postres' && product.category === 'postres')
    return categoryMatches && product.name.toLowerCase().includes(query.trim().toLowerCase())
  })
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1

  const addProduct = (product) => {
    if (product.unavailable) return
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { id: `pos-${product.id}`, productId: product.id, name: product.name, price: product.price, quantity: 1, details: '' }]
    })
  }

  return (
    <main className="page-content pos-page">
      <div className="pos-layout">
        <section className="pos-catalog">
          <div className="category-tabs" role="group" aria-label="Categorías de productos">
            {categories.map((item) => <button type="button" className={category === item.id ? 'selected' : ''} key={item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => <ProductCard compact key={product.id} product={product} onAction={() => addProduct(product)} />)}
            {!filteredProducts.length && <p className="empty-state">No hay productos en esta categoría.</p>}
          </div>
        </section>
        <aside className="current-order panel">
          <div className="order-header"><div className="section-heading"><h2>Orden Actual</h2><span className="order-number">#4092</span></div>
            <div className="segmented-control" role="group" aria-label="Tipo de orden">
              <button type="button" className={dining === 'here' ? 'selected' : ''} onClick={() => setDining('here')}><Icon name="restaurant" />Comer aquí</button>
              <button type="button" className={dining === 'takeaway' ? 'selected' : ''} onClick={() => setDining('takeaway')}><Icon name="shopping_bag" />Para llevar</button>
            </div>
          </div>
          <div className="order-items">
            {items.map((item) => <article className="order-item" key={item.id}>
              <div className="order-item-line"><div><strong>{item.name}</strong>{item.details && <small>{item.details}</small>}</div><span>{money(item.price * item.quantity)}</span></div>
              <div className="order-item-controls"><QuantityStepper value={item.quantity} onChange={(quantity) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity } : entry))} label={`Cantidad de ${item.name}`} /><button className="icon-button delete-item" type="button" aria-label={`Quitar ${item.name}`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}><Icon name="delete" /></button></div>
            </article>)}
            {!items.length && <p className="empty-state">Agrega productos para iniciar una orden.</p>}
          </div>
          <div className="order-summary">
            <div className="summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="summary-line"><span>Impuestos (10%)</span><span>{money(tax)}</span></div>
            <div className="summary-line total-line"><strong>Total</strong><strong>{money(subtotal + tax)}</strong></div>
            <PaymentSelector value={payment} onChange={setPayment} methods={['Efectivo', 'Tarjeta', 'App']} />
            <button className="primary-button send-kitchen" type="button" disabled={!items.length} onClick={() => { notify(`Orden enviada a cocina · ${payment}`); navigate('kitchen') }}><Icon name="send" />Enviar a Cocina</button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export function InventoryView({ inventory, setInventory, notify }) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const visible = inventory.filter((item) => `${item.name} ${item.category} ${item.unit}`.toLowerCase().includes(query.trim().toLowerCase()))
  const addItem = (event) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const stock = Number(values.get('stock'))
    const next = { id: `stock-${Date.now()}`, name: values.get('name').trim(), category: values.get('category').trim(), stock, unit: values.get('unit').trim(), status: stock === 0 ? 'Agotado' : 'Suficiente', image: '' }
    setInventory((current) => [...current, next])
    setShowForm(false)
    notify('Producto agregado al inventario')
  }

  return (
    <main className="page-content inventory-page">
      <div className="page-heading"><div><h1>Inventario</h1><p className="muted">Existencias y estado de los insumos.</p></div><button className="primary-button" type="button" onClick={() => setShowForm(true)}><Icon name="add" />Agregar Producto</button></div>
      <section className="panel inventory-panel">
        <label className="inventory-search"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos..." aria-label="Buscar productos" /></label>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Unidad</th><th>Estado</th><th className="align-right">Acciones</th></tr></thead>
          <tbody>{visible.map((item) => <tr key={item.id} className={item.status === 'Agotado' ? 'out-of-stock-row' : ''}>
            <td><div className="inventory-product">{item.image && <img src={item.image} alt="" loading="lazy" />}<strong>{item.name}</strong></div></td><td>{item.category}</td><td className="stock-value">{item.stock}</td><td>{item.unit}</td><td><StatusBadge tone={item.status === 'Agotado' ? 'new' : item.status === 'Bajo' ? 'prep' : 'ready'}>{item.status}</StatusBadge></td>
            <td className="align-right"><button className="table-action" type="button" aria-label={`Editar ${item.name}`} onClick={() => notify('Edición disponible para este producto')}><Icon name="edit" /></button><button className="table-action danger" type="button" aria-label={`Eliminar ${item.name}`} onClick={() => setInventory((current) => current.filter((entry) => entry.id !== item.id))}><Icon name="delete" /></button></td>
          </tr>)}{!visible.length && <tr><td colSpan="6" className="empty-state">No se encontraron productos.</td></tr>}</tbody></table></div>
        <footer className="table-footer"><span>Mostrando {visible.length} de {Math.max(48, inventory.length)} productos</span><div><button type="button" disabled={page === 1} onClick={() => { setPage((current) => Math.max(1, current - 1)); notify('Página anterior') }}>Anterior</button><button type="button" onClick={() => { setPage((current) => current + 1); notify('Página siguiente') }}>Siguiente</button></div></footer>
      </section>
      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false) }}><form className="inventory-form modal-panel" onSubmit={addItem} aria-labelledby="inventory-form-title"><div className="section-heading"><h2 id="inventory-form-title">Agregar producto</h2><button className="icon-button" type="button" aria-label="Cerrar" onClick={() => setShowForm(false)}><Icon name="close" /></button></div><label>Nombre del producto<input name="name" required /></label><label>Categoría<input name="category" required /></label><label>Stock actual<input name="stock" type="number" min="0" required /></label><label>Unidad<input name="unit" required /></label><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancelar</button><button className="primary-button" type="submit">Guardar</button></div></form></div>}
    </main>
  )
}

const laneLabels = { new: 'Nuevos', preparing: 'En Preparación', ready: 'Listos' }

export function KitchenView({ orders, setOrders, navigate, notify }) {
  const moveOrder = (order, status) => {
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item))
    notify(`Pedido #${order.id} ${status === 'preparing' ? 'aceptado' : 'listo para despacho'}`)
  }
  return (
    <main className="kitchen-view">
      <header className="kitchen-topbar"><button className="wordmark" type="button" onClick={() => navigate('dashboard')}>BurgerFlow</button><span className="kitchen-label"><Icon name="restaurant" />Monitor de cocina</span><div className="kitchen-branch">Downtown Branch <span className="avatar">VV</span></div></header>
      <div className="kitchen-board">{Object.entries(laneLabels).map(([status, title]) => {
        const laneOrders = orders.filter((order) => order.status === status)
        return <section className={`kitchen-lane ${status}`} key={status}><div className="lane-heading"><h2>{title}</h2><span>{laneOrders.length}</span></div><div className="lane-orders">{laneOrders.map((order) => <article className={`kitchen-order ${order.minutes > 15 && status === 'preparing' ? 'overdue' : ''} ${status}`} key={order.id}>
          <div className="kitchen-order-head"><div><strong>#{order.id}</strong><small>{order.type}</small></div><div className="order-time"><span>{order.time}</span>{order.age && <small>{order.age}</small>}</div></div>
          <ul>{order.items.map((item, index) => <li key={`${item.name}-${index}`}><strong>{item.qty}x</strong><div>{item.name}{item.notes?.length > 0 && <ul className="order-notes">{item.notes.map((note) => <li key={note}>{note}</li>)}</ul>}</div></li>)}</ul>
          {status === 'ready' ? <p className="ready-note">{order.note}</p> : <button className={`kitchen-action ${status}`} type="button" onClick={() => moveOrder(order, status === 'new' ? 'preparing' : 'ready')}><Icon name={status === 'new' ? 'play_arrow' : 'check_circle'} />{status === 'new' ? 'Aceptar' : 'Listo para Despacho'}</button>}
        </article>)}{!laneOrders.length && <p className="lane-empty">Sin pedidos</p>}</div></section>
      })}</div>
    </main>
  )
}

export function DeliveryView({ notify }) {
  const [filter, setFilter] = useState('Todas')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(deliveryOrders[0].id)
  const filteredOrders = deliveryOrders.filter((order) => {
    const matchesFilter = filter === 'Todas' || order.status === filter
    const matchesSearch = `${order.id} ${order.customer} ${order.address}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesSearch
  })
  const selected = deliveryOrders.find((order) => order.id === selectedId) ?? filteredOrders[0] ?? deliveryOrders[0]
  return (
    <main className="delivery-page">
      <section className="delivery-list">
        <div className="delivery-list-head"><h1>Entregas activas</h1><div className="delivery-filters" role="group" aria-label="Filtrar entregas">{[['Todas', '12', 'Todas'], ['Asignada', '5', 'Asignadas'], ['En camino', '7', 'En camino']].map(([value, count, label]) => <button type="button" className={filter === value ? 'selected' : ''} key={value} onClick={() => setFilter(value)}>{label} ({count})</button>)}</div><label className="inventory-search"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pedido o dirección..." /></label></div>
        <div className="delivery-orders">{filteredOrders.map((order) => <button type="button" className={`delivery-order-card ${selected.id === order.id ? 'selected' : ''}`} key={order.id} onClick={() => setSelectedId(order.id)}><div className="delivery-card-top"><div><strong>#{order.id}</strong><h2>{order.customer}</h2></div><StatusBadge tone={order.status === 'En camino' ? 'prep' : 'neutral'}>{order.status}</StatusBadge></div><p><Icon name="location_on" />{order.address}</p><footer><span>{order.payment}</span><span>Estimado: {order.eta}</span></footer></button>)}{!filteredOrders.length && <p className="empty-state">No hay entregas que coincidan con la búsqueda.</p>}</div>
      </section>
      <section className="delivery-detail">
        <div className="map-panel" aria-label="Mapa de entregas, ubicación Buenos Aires"><div className="map-streets" /><div className="map-route"><svg viewBox="0 0 400 300" role="img" aria-label="Ruta de entrega"><path d="M50 250 Q 150 50 350 150" /><circle cx="50" cy="250" r="8" /><circle cx="350" cy="150" r="12" /></svg></div><div className="map-tools"><button className="icon-button" type="button" aria-label="Centrar en mi ubicación" onClick={() => notify('Centrando mapa en tu ubicación')}><Icon name="my_location" /></button><button className="icon-button" type="button" aria-label="Cambiar capas del mapa" onClick={() => notify('Capas del mapa actualizadas')}><Icon name="layers" /></button></div><span className="map-label">Buenos Aires · ruta #{selected.id}</span></div>
        <div className="delivery-order-detail"><div className="detail-items"><div className="delivery-detail-heading"><div><h2>#{selected.id} Details</h2><p>Repartidor: {selected.driver}</p></div><button className="secondary-button" type="button" onClick={() => notify('Abriendo contacto del cliente')}><Icon name="call" />Contactar cliente</button></div><ul>{selected.items.map((item) => <li key={item}>{item}</li>)}</ul></div><aside className="delivery-total"><div><span>Importe total</span><strong>{money(selected.total)}</strong></div><StatusBadge tone="ready">{selected.payment}</StatusBadge></aside></div>
      </section>
    </main>
  )
}

export function ReportsView({ navigate }) {
  const barValues = [40, 60, 55, 85, 70, 90, 30]
  return (
    <main className="page-content reports-page">
      <div className="page-heading"><div><p className="eyebrow">Rendimiento del restaurante</p><h1>Panel principal</h1></div><button className="icon-button" type="button" aria-label="Exportar reporte"><Icon name="download" /></button></div>
      <section className="metric-grid"><MetricCard label="Ventas de hoy" value="Bs 12,450" icon="attach_money" trend="+8% vs ayer" /><MetricCard label="Pedidos totales" value="84" icon="receipt_long" trend="En curso: 12" tone="orange" /><MetricCard label="Crecimiento semanal" value="+12%" icon="trending_up" trend="Objetivo: 15%" tone="green" /><MetricCard label="Stock bajo" value="3 alertas" icon="warning" trend="Requiere acción" tone="neutral" /></section>
      <section className="reports-grid"><article className="panel reports-chart"><SectionHeading title="Ventas de la semana" /><div className="report-bars">{barValues.map((value, index) => <div className="report-bar-wrap" key={index}><span className={index === 3 ? 'highlight' : ''} style={{ height: `${value}%` }} /><small>{['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}</small></div>)}</div></article><article className="panel report-alerts"><SectionHeading title="Alertas de inventario" /><StockProgress label="Pan de Hamburguesa" amount="12 und" value={15} tone="red" /><StockProgress label="Cheddar (Lajas)" amount="45 und" value={25} tone="orange" /><StockProgress label="Salsa BurgerFlow" amount="2 L" value={30} tone="orange" /><button className="secondary-button full-width" type="button" onClick={() => navigate('inventory')}>Ver Inventario Completo</button></article><article className="panel top-products"><SectionHeading title="Productos más vendidos" /><div className="table-scroll"><table className="data-table"><thead><tr><th>Producto</th><th>Cantidad</th><th className="align-right">Ingresos</th></tr></thead><tbody>{[['Doble Bacon Cheese', '145', 'Bs 1.885,00'], ['Classic Burger', '112', 'Bs 1.008,00'], ['Papas Fritas Grandes', '98', 'Bs 441,00']].map(([name, quantity, income]) => <tr key={name}><td><strong>{name}</strong></td><td>{quantity}</td><td className="align-right">{income}</td></tr>)}</tbody></table></div></article></section>
    </main>
  )
}

function StockProgress({ label, amount, value, tone }) {
  return <div className={`report-stock ${tone}`}><div><strong>{label}</strong><span>{amount}</span></div><div className="stock-track"><i style={{ width: `${value}%` }} /></div></div>
}