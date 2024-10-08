import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Trash2, DollarSign } from 'lucide-react'

interface GroceryItem {
  id: number
  name: string
  quantity: number
  price: number
  currency: 'USD' | 'VES'
}

function App() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemCurrency, setNewItemCurrency] = useState<'USD' | 'VES'>('USD')
  const [exchangeRate, setExchangeRate] = useState('')

  useEffect(() => {
    const savedItems = localStorage.getItem('groceryItems')
    const savedExchangeRate = localStorage.getItem('exchangeRate')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
    if (savedExchangeRate) {
      setExchangeRate(savedExchangeRate)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('exchangeRate', exchangeRate)
  }, [exchangeRate])

  const addItem = () => {
    if (newItemName.trim() !== '' && newItemPrice !== '') {
      setItems([...items, {
        id: Date.now(),
        name: newItemName,
        quantity: parseFloat(newItemQuantity.toString()),
        price: parseFloat(newItemPrice),
        currency: newItemCurrency
      }])
      setNewItemName('')
      setNewItemQuantity(1)
      setNewItemPrice('')
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
  }

  const calculateTotalPrice = (item: GroceryItem) => {
    const price = item.currency === 'USD' ? item.price : item.price / parseFloat(exchangeRate)
    return (price * item.quantity).toFixed(2)
  }

  const calculateGrandTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(calculateTotalPrice(item))
    }, 0).toFixed(2)
  }

  const calculateGrandTotalVES = () => {
    const totalUSD = parseFloat(calculateGrandTotal())
    return (totalUSD * parseFloat(exchangeRate)).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
          <ShoppingCart className="mr-2" /> Lista de Compras
        </h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tipo de cambio (VES/USD)</label>
          <input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            placeholder="Tasa de cambio VES/USD"
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>

        <div className="flex flex-wrap mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nombre del artículo"
            className="flex-grow p-2 border rounded mr-2 mb-2"
          />
          <input
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseFloat(e.target.value))}
            step="0.01"
            min="0"
            className="w-24 p-2 border rounded mr-2 mb-2"
          />
          <input
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            placeholder="Precio"
            step="0.01"
            min="0"
            className="w-24 p-2 border rounded mr-2 mb-2"
          />
          <select
            value={newItemCurrency}
            onChange={(e) => setNewItemCurrency(e.target.value as 'USD' | 'VES')}
            className="p-2 border rounded mr-2 mb-2"
          >
            <option value="USD">USD</option>
            <option value="VES">VES</option>
          </select>
          <button
            onClick={addItem}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <Plus size={24} />
          </button>
        </div>

        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
              <span className="flex-grow">{item.name}</span>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 0.1)}
                  className="px-2 py-1 bg-gray-200 rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity.toFixed(2)}
                  onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                  className="w-20 px-2 py-1 bg-gray-100 text-center"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 0.1)}
                  className="px-2 py-1 bg-gray-200 rounded-r"
                >
                  +
                </button>
                <span className="ml-2">
                  {item.price.toFixed(2)} {item.currency}
                </span>
                <span className="ml-2">
                  Total: ${calculateTotalPrice(item)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right">
          <p className="text-xl font-bold">
            Total: <DollarSign className="inline" size={20} />{calculateGrandTotal()} USD
          </p>
          <p className="text-xl font-bold">
            Total: {calculateGrandTotalVES()} VES
          </p>
        </div>
      </div>
    </div>
  )
}

export default App