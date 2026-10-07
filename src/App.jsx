import { useState } from 'react'
import AppShell from './components/AppShell.jsx'
import { Toast } from './components/Primitives.jsx'
import { CartView, CustomizerView, MenuView } from './views/CustomerViews.jsx'
import DashboardView from './views/DashboardView.jsx'
import { DeliveryView, InventoryView, KitchenView, POSView, ReportsView } from './views/OperationsViews.jsx'
import { inventorySeed, menuProducts, navItems, products } from './data.js'
import './App.css'
import './views.css'

function App() {
  const [page, setPage] = useState('dashboard')
  const [toast, setToast] = useState('')
  const [inventory, setInventory] = useState(inventorySeed)
  const [selectedProduct, setSelectedProduct] = useState(menuProducts[0])
  const [cartItems, setCartItems] = useState([
    { id: 'cart-bacon', name: 'Double Bacon Smash', price: 14.5, quantity: 1, details: '+ Extra Bacon, Sin Cebolla', image: menuProducts[0].image },
    { id: 'cart-fries', name: 'Crinkle Fries (L)', price: 4.5, quantity: 1, details: 'Salsa de Queso Aparte', image: products[3].image },
  ])
  const [posItems, setPosItems] = useState([
    { id: 'pos-flow', productId: 'flow-burger', name: 'Doble Flow Burger', price: 12.5, quantity: 1, details: 'Sin cebolla, Extra queso' },
    { id: 'pos-fries', productId: 'fries', name: 'Papas Clásicas (L)', price: 4.5, quantity: 2, details: '' },
  ])
  const [kitchenOrders, setKitchenOrders] = useState([
    { id: '4092', type: 'Dine-in · Table 12', time: '12:15 PM', age: '1 min ago', minutes: 1, status: 'new', items: [{ qty: 1, name: 'Classic Smash Burger', notes: ['SIN CEBOLLA', 'EXTRA QUESO'] }, { qty: 2, name: 'Fries (Large)' }] },
    { id: '4093', type: 'Takeaway', time: '12:16 PM', age: 'Just now', minutes: 0, status: 'new', items: [{ qty: 1, name: 'Spicy Chicken Sandwich' }, { qty: 1, name: 'Aros de cebolla' }] },
    { id: '4085', type: 'Delivery · UberEats', time: '11:50 AM', age: '26 min ago', minutes: 26, status: 'preparing', items: [{ qty: 3, name: 'Double Bacon Burger', notes: ['1x SIN TOCINO', '2x SALSA APARTE'] }, { qty: 3, name: 'Fries (Medium)' }, { qty: 3, name: 'Vanilla Shake' }] },
    { id: '4089', type: 'Dine-in · Table 4', time: '12:05 PM', age: '11 min ago', minutes: 11, status: 'preparing', items: [{ qty: 1, name: 'Veggie Burger' }, { qty: 1, name: 'Sweet Potato Fries' }] },
    { id: '4080', type: 'Takeaway · Pick-up', time: '11:45 AM', age: '', minutes: 0, status: 'ready', items: [{ qty: 2, name: 'Kids Meal - Cheeseburger' }], note: 'Esperando recolección...' },
    { id: '4081', type: 'Delivery · DoorDash', time: '11:48 AM', age: '', minutes: 0, status: 'ready', items: [{ qty: 1, name: 'Mushroom Swiss Burger' }, { qty: 1, name: 'Fries (Small)' }], note: 'Driver arrived' },
  ])

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(notify.timer)
    notify.timer = window.setTimeout(() => setToast(''), 2200)
  }

  const navigate = (destination) => {
    setPage(destination)
    setToast('')
  }

  if (page === 'menu') return <><MenuView navigate={navigate} setSelectedProduct={setSelectedProduct} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Toast>{toast}</Toast></>
  if (page === 'customizer') return <><CustomizerView product={selectedProduct} navigate={navigate} notify={notify} onAddToCart={(item) => setCartItems((current) => [...current, item])} /><Toast>{toast}</Toast></>
  if (page === 'cart') return <><CartView items={cartItems} setItems={setCartItems} navigate={navigate} notify={notify} /><Toast>{toast}</Toast></>

  const views = {
    dashboard: <DashboardView navigate={navigate} notify={notify} />,
    pos: <POSView products={products} items={posItems} setItems={setPosItems} navigate={navigate} notify={notify} />,
    inventory: <InventoryView inventory={inventory} setInventory={setInventory} notify={notify} />,
    kitchen: <KitchenView orders={kitchenOrders} setOrders={setKitchenOrders} navigate={navigate} notify={notify} />,
    delivery: <DeliveryView notify={notify} />,
    reports: <ReportsView navigate={navigate} />,
    settings: <ReportsView navigate={navigate} />,
  }

  return <AppShell page={page} navItems={navItems} navigate={navigate} notify={notify} toast={toast}>{views[page] ?? views.dashboard}</AppShell>
}

export default App
