import { Icon, MetricCard, SectionHeading, StatusBadge } from '../components/Primitives.jsx'

const roles = [
  { label: 'Jefe / Admin', detail: 'Panel y reportes', icon: 'admin_panel_settings', page: 'reports' },
  { label: 'Cajero', detail: 'Ventas y pedidos', icon: 'point_of_sale', page: 'pos' },
  { label: 'Cocinero', detail: 'Cola de cocina', icon: 'soup_kitchen', page: 'kitchen' },
  { label: 'Delivery', detail: 'Repartos activos', icon: 'delivery_dining', page: 'delivery' },
  { label: 'Cliente', detail: 'Menú y carrito', icon: 'restaurant_menu', page: 'menu' },
]

const sales = [50, 65, 44, 78, 61, 90, 72]
const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy']
const recentOrders = [
  { id: '4098', label: 'Mesa 04', age: 'Hace 2 min · Bs 86.50', status: 'Nuevo', tone: 'new', icon: 'takeout_dining' },
  { id: '4097', label: 'Delivery', age: 'Hace 8 min · Bs 124.00', status: 'En cocina', tone: 'prep', icon: 'two_wheeler' },
  { id: '4096', label: 'Mesa 12', age: 'Hace 14 min · Bs 58.00', status: 'Listo', tone: 'ready', icon: 'restaurant' },
  { id: '4095', label: 'Para llevar', age: 'Hace 18 min · Bs 42.50', status: 'Listo', tone: 'ready', icon: 'shopping_bag' },
]

function DashboardView({ navigate, notify }) {
  const date = new Date()
  const longDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
  const shortDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(date).replace('.', '')

  return (
    <main className="page-content dashboard-view">
      <section className="welcome-row">
        <div><p className="eyebrow">{longDate.charAt(0).toUpperCase() + longDate.slice(1)}</p><h1>Buenas tardes, Victor</h1><p className="muted">Esto es lo que está pasando en tu restaurante hoy.</p></div>
        <div className="date-chip"><Icon name="calendar_today" />Hoy, {shortDate}</div>
      </section>

      <section aria-label="Interfaces del equipo" className="dashboard-roles">
        <SectionHeading title="Interfaces del equipo" action="Accesos según el rol" />
        <div className="role-grid">
          {roles.map((role) => <button className="role-card" key={role.page} type="button" onClick={() => navigate(role.page)}><Icon name={role.icon} /><strong>{role.label}</strong><small>{role.detail}</small></button>)}
        </div>
      </section>

      <section className="metric-grid" aria-label="Resumen del día">
        <MetricCard label="Ventas de hoy" value="Bs 12,450" icon="payments" trend="↑ 8.2% vs. ayer" />
        <MetricCard label="Pedidos totales" value="84" icon="receipt_long" trend="↑ 12 pedidos nuevos" tone="orange" />
        <MetricCard label="Ticket promedio" value="Bs 148.21" icon="sell" trend="↑ 3.4% vs. ayer" tone="green" />
        <MetricCard label="Tiempo de entrega" value="18 min" icon="schedule" trend="Meta: 20 min" tone="neutral" />
      </section>

      <section className="dashboard-grid">
        <article className="panel dashboard-chart-panel">
          <SectionHeading title="Ventas de la semana" action="Ver reporte" onAction={() => navigate('reports')} />
          <div className="sales-chart" aria-label="Gráfico de ventas semanal">
            {sales.map((height, index) => <div className="sales-bar-wrap" key={days[index]}><div className={`sales-bar ${index === sales.length - 1 ? 'current' : ''}`} style={{ height: `${height}%` }} title={`${days[index]}: ${height}%`} /><span>{days[index]}</span></div>)}
          </div>
          <p className="chart-note"><strong>Bs 68,920</strong> acumulados esta semana <span>+14.8%</span></p>
        </article>
        <article className="panel recent-panel">
          <SectionHeading title="Pedidos recientes" action="Ver todos" onAction={() => navigate('cart')} />
          <div className="recent-orders">
            {recentOrders.map((order) => <div className="recent-order" key={order.id}><span className="recent-order-icon"><Icon name={order.icon} /></span><div><strong>#{order.id} · {order.label}</strong><small>{order.age}</small></div><StatusBadge tone={order.tone}>{order.status}</StatusBadge></div>)}
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-lower">
        <article className="panel inventory-alerts">
          <SectionHeading title="Inventario crítico" action="Gestionar inventario" onAction={() => navigate('inventory')} />
          {[['Pan brioche', 24, 24], ['Carne de res', 48, 86], ['Queso cheddar', 31, 31]].map(([label, progress, amount]) => <div className="stock-row" key={label}><span>{label}</span><div className="stock-track"><i style={{ width: `${progress}%` }} /></div><small>{amount} u.</small></div>)}
        </article>
        <article className="panel quick-actions-panel">
          <SectionHeading title="Acciones rápidas" />
          <div className="quick-actions">
            <button type="button" onClick={() => navigate('inventory')}><Icon name="add_box" />Nuevo producto</button>
            <button type="button" onClick={() => navigate('kitchen')}><Icon name="kitchen" />Abrir cocina</button>
            <button type="button" onClick={() => navigate('delivery')}><Icon name="local_shipping" />Ver delivery</button>
            <button type="button" onClick={() => notify('Reporte semanal exportado')}><Icon name="download" />Exportar reporte</button>
          </div>
        </article>
      </section>
    </main>
  )
}

export default DashboardView