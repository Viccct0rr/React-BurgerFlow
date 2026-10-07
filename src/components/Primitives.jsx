export function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`} aria-hidden="true">{name}</span>
}

export function SectionHeading({ title, action, onAction }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action && <button className="text-action" type="button" onClick={onAction}>{action}</button>}
    </div>
  )
}

export function MetricCard({ label, value, icon, trend, tone = 'red' }) {
  return (
    <article className="metric-card">
      <div className="metric-card-head"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon name={icon} /></span></div>
      <strong>{value}</strong>
      <small className={tone === 'neutral' ? 'neutral' : ''}>{trend}</small>
    </article>
  )
}

export function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge ${tone}`}>{children}</span>
}

export function QuantityStepper({ value, onChange, label = 'Cantidad' }) {
  return (
    <div className="quantity-stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Disminuir ${label.toLowerCase()}`} disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}><Icon name="remove" /></button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label={`Aumentar ${label.toLowerCase()}`} onClick={() => onChange(value + 1)}><Icon name="add" /></button>
    </div>
  )
}

export function Toast({ children }) {
  return <div className={`toast ${children ? 'visible' : ''}`} role="status" aria-live="polite">{children}</div>
}

export function PaymentSelector({ value, onChange, methods = ['Efectivo', 'Tarjeta', 'QR'], label = 'Método de pago' }) {
  return (
    <div className="payment-selector">
      <p className="field-label">{label}</p>
      <div className="payment-options">
        {methods.map((method) => <button type="button" key={method} className={value === method ? 'selected' : ''} aria-pressed={value === method} onClick={() => onChange(method)}><Icon name={method === 'Efectivo' ? 'payments' : method === 'Tarjeta' ? 'credit_card' : method === 'App' ? 'qr_code_scanner' : 'qr_code_2'} />{method}</button>)}
      </div>
    </div>
  )
}

export function ProductCard({ product, onAction, actionLabel = 'Personalizar', compact = false }) {
  if (compact) {
    return <button className={`pos-product ${product.unavailable ? 'unavailable' : ''}`} type="button" onClick={onAction} disabled={product.unavailable}>
      <span className="pos-product-image"><img src={product.image} alt={product.name} loading="lazy" />{product.unavailable && <span className="sold-out">Agotado</span>}</span>
      <strong>{product.name}</strong><span>Bs {product.price.toFixed(2)}</span>
    </button>
  }
  return <article className="menu-product-card"><div className="menu-product-image"><img src={product.image} alt={product.name} loading="lazy" /></div><div className="menu-product-copy"><h2>{product.name}</h2><p>{product.description}</p><div className="menu-product-footer"><strong>Bs {product.price.toFixed(2)}</strong><button className="primary-button" type="button" onClick={onAction}><Icon name="add_circle" />{actionLabel}</button></div></div></article>
}

export function OrderItem({ item, onQuantityChange, onRemove }) {
  return <article className="checkout-item"><img src={item.image} alt={item.name} /><div className="checkout-item-main"><div className="checkout-item-title"><h2>{item.name}</h2><strong>Bs {item.price.toFixed(2)}</strong></div>{item.details && <p>{item.details}</p>}<QuantityStepper value={item.quantity} onChange={onQuantityChange} label={`Cantidad de ${item.name}`} /></div><button className="remove-cart-item" type="button" aria-label={`Eliminar ${item.name}`} onClick={onRemove}><Icon name="delete" /></button></article>
}