import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboardPage.css'
import adminLogo from '../assets/images/logo.png'

const initialOrders = [
  {
    id: 'ORD-1045',
    customer: 'Jacob Martin',
    email: 'jacob.martin@example.com',
    category: 'Professional Athletes',
    items: 3,
    total: '$285.00',
    status: 'Processing',
    date: 'Nov 10, 2025'
  },
  {
    id: 'ORD-1044',
    customer: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    category: 'Influencers',
    items: 1,
    total: '$120.00',
    status: 'Pending',
    date: 'Nov 9, 2025'
  },
  {
    id: 'ORD-1043',
    customer: 'Trevor Miles',
    email: 'trevor.miles@example.com',
    category: 'High School Athletes',
    items: 2,
    total: '$180.00',
    status: 'Completed',
    date: 'Nov 8, 2025'
  },
  {
    id: 'ORD-1042',
    customer: 'Dana Rivers',
    email: 'dana.rivers@example.com',
    category: 'Teamwear',
    items: 1,
    total: '$540.00',
    status: 'Processing',
    date: 'Nov 7, 2025'
  }
]

const initialCatalog = {
  professionalAthletes: [
    { id: 'pro-1', name: 'LeBron International Jersey', price: '$140.00', inventory: 25, status: 'Active' },
    { id: 'pro-2', name: 'Kawhi Tokyo Edition', price: '$135.00', inventory: 18, status: 'Active' }
  ],
  influencers: [
    { id: 'inf-1', name: 'HoopDreams Collab', price: '$95.00', inventory: 0, status: 'Coming Soon' }
  ],
  highSchoolAthletes: [
    { id: 'hs-1', name: 'Northshore Champions Jersey', price: '$85.00', inventory: 0, status: 'Coming Soon' }
  ]
}

const categoryLabels = {
  professionalAthletes: 'Professional Athletes',
  influencers: 'Influencers',
  highSchoolAthletes: 'High School Athletes'
}

const statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled']
const catalogStatusOptions = ['Active', 'Draft', 'Coming Soon', 'Archived']

const formatStatusLabel = (status = '') => {
  if (!status) return 'Draft'
  return status
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const statusToSlug = (status = '') => status.toLowerCase().replace(/\s+/g, '-') || 'draft'

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('orders') // 'orders', 'users', 'catalog', 'inquiries', 'promocodes'
  const [orders, setOrders] = useState(initialOrders)
  const [catalog, setCatalog] = useState(initialCatalog)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all') // 'all', 'Pending', 'Processing', 'Completed', 'Cancelled'
  const [selectedCategory, setSelectedCategory] = useState('professionalAthletes')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [savingCategory, setSavingCategory] = useState('')
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' })
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const [serverCategories, setServerCategories] = useState([])
  const [teamwearInquiries, setTeamwearInquiries] = useState([])
  const [loadingInquiries, setLoadingInquiries] = useState(true)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [promoCodes, setPromoCodes] = useState([])
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(true)
  const [editingPromoCode, setEditingPromoCode] = useState(null)
  const [promoCodeForm, setPromoCodeForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  })

  useEffect(() => {
    // Small delay to ensure localStorage is set after login redirect
    const checkAuth = setTimeout(() => {
      const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
      if (!isAdminAuthenticated) {
        navigate('/admin-login', { replace: true })
      }
    }, 100)
    
    return () => clearTimeout(checkAuth)
  }, [navigate])

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch(`${API_URL}/api/categories`)
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`)
      }

      const categories = await response.json()
      
      if (!Array.isArray(categories)) {
        console.warn('Categories response is not an array:', categories)
        setServerCategories([])
        return
      }

      setServerCategories(categories)

      const mapped = {
        professionalAthletes: [],
        influencers: [],
        highSchoolAthletes: []
      }

      categories.forEach(category => {
        if (!category || !category.key) return
        const key = category.key
        // Skip teamwear collection - only show inquiries
        if (key === 'teamwear') return
        if (mapped.hasOwnProperty(key)) {
          mapped[key] = (category.products || []).map(product => ({
            ...product,
            id: product._id || product.id,
            name: product.title || product.name || '',
            price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : (product.price || ''),
            status: formatStatusLabel(product.status),
            imageUrl: product.imageUrl || '',
            description: product.description || '',
            isNew: false
          }))
        }
      })

      setCatalog(mapped)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setServerCategories([])
      // Don't crash the page, just show empty catalog
    } finally {
      setLoadingCategories(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const fetchTeamwearInquiries = useCallback(async () => {
    try {
      setLoadingInquiries(true)
      const response = await fetch(`${API_URL}/api/teamwear-inquiries`)
      if (!response.ok) {
        throw new Error(`Failed to load inquiries: ${response.status}`)
      }
      const data = await response.json()
      setTeamwearInquiries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch teamwear inquiries:', error)
      setTeamwearInquiries([])
      // Don't crash the page, just show empty inquiries
    } finally {
      setLoadingInquiries(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchTeamwearInquiries()
  }, [fetchTeamwearInquiries])

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch(`${API_URL}/api/admin/users`)
      if (!response.ok) {
        throw new Error(`Failed to load users: ${response.status}`)
      }
      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }, [API_URL])

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers()
    }
  }, [activeSection, fetchUsers])

  const fetchPromoCodes = useCallback(async () => {
    try {
      setLoadingPromoCodes(true)
      const response = await fetch(`${API_URL}/api/admin/promo-codes`)
      if (!response.ok) {
        throw new Error(`Failed to load promo codes: ${response.status}`)
      }
      const data = await response.json()
      setPromoCodes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch promo codes:', error)
      setPromoCodes([])
    } finally {
      setLoadingPromoCodes(false)
    }
  }, [API_URL])

  useEffect(() => {
    if (activeSection === 'promocodes') {
      fetchPromoCodes()
    }
  }, [activeSection, fetchPromoCodes])

  const handlePromoCodeSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...promoCodeForm,
        code: promoCodeForm.code.toUpperCase().trim(),
        discountValue: parseFloat(promoCodeForm.discountValue) || 0,
        minPurchaseAmount: parseFloat(promoCodeForm.minPurchaseAmount) || 0,
        maxDiscountAmount: null,
        usageLimit: null,
        startDate: new Date(promoCodeForm.startDate),
        endDate: new Date(promoCodeForm.endDate)
      }

      let response
      if (editingPromoCode) {
        response = await fetch(`${API_URL}/api/admin/promo-codes/${editingPromoCode._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch(`${API_URL}/api/admin/promo-codes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save promo code')
      }

      setStatusMessage({ text: `Promo code ${editingPromoCode ? 'updated' : 'created'} successfully!`, type: 'success' })
      setEditingPromoCode(null)
      setPromoCodeForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchaseAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true
      })
      await fetchPromoCodes()
    } catch (error) {
      console.error('Failed to save promo code:', error)
      setStatusMessage({ text: error.message || 'Failed to save promo code', type: 'error' })
    } finally {
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000)
    }
  }

  const handleDeletePromoCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/promo-codes/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete promo code')
      }

      setStatusMessage({ text: 'Promo code deleted successfully', type: 'success' })
      await fetchPromoCodes()
    } catch (error) {
      console.error('Failed to delete promo code:', error)
      setStatusMessage({ text: 'Failed to delete promo code', type: 'error' })
    } finally {
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000)
    }
  }

  const handleEditPromoCode = (promoCode) => {
    setEditingPromoCode(promoCode)
    setPromoCodeForm({
      code: promoCode.code,
      description: promoCode.description || '',
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue.toString(),
      minPurchaseAmount: promoCode.minPurchaseAmount?.toString() || '',
      startDate: promoCode.startDate ? new Date(promoCode.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: promoCode.endDate ? new Date(promoCode.endDate).toISOString().split('T')[0] : '',
      isActive: promoCode.isActive
    })
  }

  const metrics = useMemo(() => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => order.status === 'Pending').length
    const revenue = orders.reduce((total, order) => {
      const amount = parseFloat(order.total.replace('$', ''))
      return total + (isNaN(amount) ? 0 : amount)
    }, 0)
    const totalCollections = Object.values(catalog).reduce(
      (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
      0
    )

    return {
      totalOrders,
      pendingOrders,
      revenue: `$${revenue.toFixed(2)}`,
      totalCollections
    }
  }, [orders, catalog])

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleCatalogChange = (categoryKey, itemId, field, value) => {
    setCatalog(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleAddItem = (categoryKey) => {
    const newItem = {
      id: `${categoryKey}-${Date.now()}`,
      name: '',
      price: '',
      inventory: '',
      status: 'Draft',
      description: '',
      imageUrl: '',
      isNew: true
    }

    setCatalog(prev => ({
      ...prev,
      [categoryKey]: [newItem, ...((prev[categoryKey] || []))]
    }))
  }

  const handleDeleteItem = (categoryKey, itemId) => {
    setCatalog(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(item => item.id !== itemId)
    }))
  }

  const handleImageUpload = (categoryKey, itemId, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result
      if (typeof dataUrl === 'string') {
        handleCatalogChange(categoryKey, itemId, 'imageUrl', dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleNavClick = (categoryKey) => {
    setSelectedCategory(categoryKey)
    const section = document.getElementById(`category-${categoryKey}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSaveCategory = async (categoryKey) => {
    setSavingCategory(categoryKey)
    try {
      const currentCategory = serverCategories.find(cat => cat.key === categoryKey)
      if (!currentCategory) throw new Error('Category not found')

      const payload = {
        key: currentCategory.key,
        title: currentCategory.title || categoryLabels[categoryKey],
        description: currentCategory.description || '',
        status: currentCategory.status || 'active',
        products: (catalog[categoryKey] || []).map(item => {
          const productData = {
            title: item.name || '',
            description: item.description || '',
            price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '').replace(',', '')) || 0 : (typeof item.price === 'number' ? item.price : 0),
            status: statusToSlug(item.status),
            inventory: parseInt(String(item.inventory).replace('-', '0'), 10) || 0,
            imageUrl: item.imageUrl || ''
          }
          // Preserve _id for existing products
          if (item.id && !item.id.startsWith('new-') && !item.id.startsWith(categoryKey + '-')) {
            productData._id = item.id
          }
          return productData
        })
      }

      const response = await fetch(`${API_URL}/api/categories/${currentCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const updated = await response.json()
      console.log('Category updated successfully:', updated)
      
      await fetchCategories()
      setStatusMessage({ text: `${categoryLabels[categoryKey]} updated successfully.`, type: 'success' })
    } catch (error) {
      console.error('Save failed:', error)
      setStatusMessage({ text: `Failed to publish changes: ${error.message}`, type: 'error' })
    } finally {
      setSavingCategory('')
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return (
          <>
            <section className='metrics-grid'>
              <div className='metric-card'>
                <p className='metric-label'>Total Orders</p>
                <p className='metric-value'>{metrics.totalOrders}</p>
              </div>
              <div className='metric-card'>
                <p className='metric-label'>Pending</p>
                <p className='metric-value'>{metrics.pendingOrders}</p>
              </div>
              <div className='metric-card'>
                <p className='metric-label'>Revenue (est.)</p>
                <p className='metric-value'>{metrics.revenue}</p>
              </div>
              <div className='metric-card'>
                <p className='metric-label'>Active Collections</p>
                <p className='metric-value'>{metrics.totalCollections}</p>
              </div>
            </section>

            <section className='orders-panel'>
              <div className='panel-header'>
                <div>
                  <p className='eyebrow'>LIVE ORDERS</p>
                  <h2>Orders & Fulfillment</h2>
                </div>
                <div className='orders-filter-group'>
                  <select
                    className='orders-status-filter'
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value='all'>View All</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='orders-table'>
                <div className='orders-row orders-header'>
                  <span>Order ID</span>
                  <span>Customer</span>
                  <span>Category</span>
                  <span>Items</span>
                  <span>Total</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>

                {(orderStatusFilter === 'all' 
                  ? orders 
                  : orders.filter(order => order.status === orderStatusFilter)
                ).map(order => (
                  <div key={order.id} className='orders-row'>
                    <span>{order.id}</span>
                    <span>
                      <strong>{order.customer}</strong>
                      <span className='order-email'>{order.email}</span>
                    </span>
                    <span>{order.category}</span>
                    <span>{order.items}</span>
                    <span>{order.total}</span>
                    <span>
                      <select value={order.status} onChange={e => handleStatusUpdate(order.id, e.target.value)}>
                        {statusOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>{order.date}</span>
                  </div>
                ))}
                {orderStatusFilter !== 'all' && orders.filter(order => order.status === orderStatusFilter).length === 0 && (
                  <div className='empty-state' style={{ padding: '40px', textAlign: 'center' }}>
                    <p>No orders with status "{orderStatusFilter}"</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )

      case 'users':
        return (
          <section className='catalog-panel'>
            <div className='panel-header'>
              <div>
                <p className='eyebrow'>USER MANAGEMENT</p>
                <h2>Registered Users</h2>
                <p className='subheading compact'>
                  View and manage all registered users on the platform.
                </p>
              </div>
            </div>

            {loadingUsers ? (
              <div className='catalog-loading'>Loading users…</div>
            ) : users.length === 0 ? (
              <div className='empty-state'>
                <p>No users found.</p>
              </div>
            ) : (
              <div className='users-table'>
                <div className='orders-row orders-header'>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Provider</span>
                  <span>Verified</span>
                  <span>Sign Up Date</span>
                  <span>Last Login</span>
                </div>
                {users.map(user => (
                  <div key={user._id} className='orders-row'>
                    <span>{user.name || 'N/A'}</span>
                    <span>{user.email}</span>
                    <span>{user.provider || 'local'}</span>
                    <span>{user.isVerified ? 'Yes' : 'No'}</span>
                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )

      case 'catalog':
        return (
          <section className='catalog-panel'>
            <div className='panel-header'>
              <div>
                <p className='eyebrow'>CATALOG CONTROL</p>
                <h2>Collections & Drops</h2>
                <p className='subheading compact'>
                  Use the navigation below to jump directly to each collection and manage products inline.
                </p>
              </div>
            </div>

            <div className='admin-nav-collections' style={{ marginBottom: '30px', justifyContent: 'flex-start' }}>
              {Object.keys(categoryLabels).map(key => (
                <button
                  key={key}
                  className={`admin-nav-link ${selectedCategory === key ? 'active' : ''}`}
                  onClick={() => handleNavClick(key)}
                >
                  {categoryLabels[key]}
                </button>
              ))}
            </div>

            {loadingCategories ? (
              <div className='catalog-loading'>Loading categories…</div>
            ) : (
              <div className='category-sections'>
                {Object.keys(categoryLabels).map(key => (
                  <div key={key} id={`category-${key}`} className='category-section'>
                    <div className='category-details-header'>
                      <div>
                        <p className='eyebrow'>COLLECTION</p>
                        <h3>{categoryLabels[key]}</h3>
                        <p className='category-details-copy'>
                          {(catalog[key] || []).length} listed item{(catalog[key] || []).length === 1 ? '' : 's'}. Keep pricing, inventory, and statuses up to date.
                        </p>
                      </div>
                      <div className='category-details-actions'>
                        <button className='ghost-button' onClick={() => handleAddItem(key)}>
                          + Add Product
                        </button>
                        <button
                          className='primary-button'
                          onClick={() => handleSaveCategory(key)}
                          disabled={savingCategory === key || loadingCategories}
                        >
                          {savingCategory === key ? 'Saving…' : 'Publish Changes'}
                        </button>
                      </div>
                    </div>

                    <div className='catalog-grid'>
                      {(catalog[key] || []).map(item => (
                        <div key={item.id} className='catalog-card'>
                          <div className='catalog-card-header'>
                            <span className='card-chip'>Editing</span>
                            <input
                              type='text'
                              value={item.name || ''}
                              placeholder='Product name'
                              autoFocus={item.isNew}
                              onChange={e => handleCatalogChange(key, item.id, 'name', e.target.value)}
                            />
                            <select
                              value={item.status}
                              onChange={e => handleCatalogChange(key, item.id, 'status', e.target.value)}
                            >
                              {catalogStatusOptions.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className='catalog-fields'>
                            <label>
                              Price
                              <input
                                type='text'
                                value={item.price || ''}
                                placeholder='$0.00'
                                onChange={e => handleCatalogChange(key, item.id, 'price', e.target.value)}
                              />
                            </label>
                            <label>
                              Inventory
                              <input
                                type='text'
                                value={item.inventory || ''}
                                placeholder='0'
                                onChange={e => handleCatalogChange(key, item.id, 'inventory', e.target.value)}
                              />
                            </label>
                            <label className='full-width image-upload-field'>
                              Upload Image
                              <div className='image-upload-controls'>
                                <input
                                  type='file'
                                  accept='image/*'
                                  onChange={e => handleImageUpload(key, item.id, e.target.files?.[0])}
                                />
                                <span className='image-hint'>PNG or JPG, max 5MB</span>
                              </div>
                              {item.imageUrl && (
                                <div className='image-preview'>
                                  <img src={item.imageUrl} alt={item.name || 'Preview'} />
                                  <button
                                    type='button'
                                    className='ghost-button small'
                                    onClick={() => handleCatalogChange(key, item.id, 'imageUrl', '')}
                                  >
                                    Remove Image
                                  </button>
                                </div>
                              )}
                            </label>
                            <label className='full-width'>
                              Description
                              <textarea
                                value={item.description || ''}
                                placeholder='Optional description...'
                                onChange={e => handleCatalogChange(key, item.id, 'description', e.target.value)}
                              />
                            </label>
                          </div>

                          <div className='catalog-card-footer'>
                            <button
                              className='danger-link'
                              onClick={() => handleDeleteItem(key, item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                      {(catalog[key] || []).length === 0 && (
                        <div className='empty-state'>
                          <p>No items yet.</p>
                          <button className='primary-button' onClick={() => handleAddItem(key)}>
                            Add first item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )

      case 'inquiries':
        return (
          <section className='catalog-panel'>
            <div className='panel-header'>
              <div>
                <p className='eyebrow'>CUSTOM REQUESTS</p>
                <h2>Teamwear Inquiries</h2>
                <p className='subheading compact'>
                  Review and manage custom teamwear design requests from customers.
                </p>
              </div>
            </div>

            {loadingInquiries ? (
              <div className='catalog-loading'>Loading inquiries…</div>
            ) : teamwearInquiries.length === 0 ? (
              <div className='empty-state'>
                <p>No teamwear inquiries yet.</p>
              </div>
            ) : (
              <div className='inquiries-list'>
                {teamwearInquiries.map(inquiry => (
                  <div key={inquiry._id} className='inquiry-card'>
                    <div className='inquiry-header'>
                      <div>
                        <h4 className='inquiry-name'>{inquiry.firstName} {inquiry.lastName}</h4>
                        <p className='inquiry-contact'>
                          {inquiry.email} • {inquiry.phoneNumber}
                        </p>
                        <p className='inquiry-date'>
                          Submitted: {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <select
                        className='inquiry-status'
                        value={inquiry.status || 'pending'}
                        onChange={async (e) => {
                          try {
                            const response = await fetch(`${API_URL}/api/teamwear-inquiries/${inquiry._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: e.target.value })
                            })
                            if (response.ok) {
                              await fetchTeamwearInquiries()
                            }
                          } catch (error) {
                            console.error('Failed to update inquiry status:', error)
                          }
                        }}
                      >
                        <option value='pending'>Pending</option>
                        <option value='in-progress'>In Progress</option>
                        <option value='completed'>Completed</option>
                        <option value='cancelled'>Cancelled</option>
                      </select>
                    </div>
                    <div className='inquiry-body'>
                      <p className='inquiry-description'>{inquiry.description}</p>
                      {inquiry.designFile && (
                        <div className='inquiry-image'>
                          <p className='inquiry-image-label'>Reference Image: {inquiry.fileName || 'uploaded-image'}</p>
                          <img src={inquiry.designFile} alt='Design reference' className='inquiry-image-preview' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )

      case 'promocodes':
        return (
          <section className='catalog-panel'>
            <div className='panel-header'>
              <div>
                <p className='eyebrow'>DISCOUNT MANAGEMENT</p>
                <h2>Promo Codes</h2>
                <p className='subheading compact'>
                  Create and manage discount codes for customers.
                </p>
              </div>
            </div>

            <form className='promo-code-form' onSubmit={handlePromoCodeSubmit}>
              <div className='form-row'>
                <div className='form-group'>
                  <label>Promo Code *</label>
                  <input
                    type='text'
                    value={promoCodeForm.code}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, code: e.target.value.toUpperCase() })}
                    placeholder='SUMMER2024'
                    required
                    maxLength={20}
                  />
                </div>
                <div className='form-group'>
                  <label>Discount Type *</label>
                  <select
                    value={promoCodeForm.discountType}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, discountType: e.target.value })}
                    required
                  >
                    <option value='percentage'>Percentage (%)</option>
                    <option value='fixed'>Fixed Amount ($)</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>Discount Value *</label>
                  <input
                    type='number'
                    value={promoCodeForm.discountValue}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, discountValue: e.target.value })}
                    placeholder={promoCodeForm.discountType === 'percentage' ? '10' : '20'}
                    required
                    min='0'
                    step='0.01'
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Description</label>
                  <input
                    type='text'
                    value={promoCodeForm.description}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, description: e.target.value })}
                    placeholder='Summer sale discount'
                  />
                </div>
                <div className='form-group'>
                  <label>Min Purchase Amount ($)</label>
                  <input
                    type='number'
                    value={promoCodeForm.minPurchaseAmount}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, minPurchaseAmount: e.target.value })}
                    placeholder='0'
                    min='0'
                    step='0.01'
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Start Date *</label>
                  <input
                    type='date'
                    value={promoCodeForm.startDate}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>End Date *</label>
                  <input
                    type='date'
                    value={promoCodeForm.endDate}
                    onChange={(e) => setPromoCodeForm({ ...promoCodeForm, endDate: e.target.value })}
                    required
                    min={promoCodeForm.startDate}
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group checkbox-group'>
                  <label>
                    <input
                      type='checkbox'
                      checked={promoCodeForm.isActive}
                      onChange={(e) => setPromoCodeForm({ ...promoCodeForm, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className='form-actions'>
                <button type='submit' className='primary-button'>
                  {editingPromoCode ? 'Update Promo Code' : 'Create Promo Code'}
                </button>
                {editingPromoCode && (
                  <button
                    type='button'
                    className='secondary-button'
                    onClick={() => {
                      setEditingPromoCode(null)
                      setPromoCodeForm({
                        code: '',
                        description: '',
                        discountType: 'percentage',
                        discountValue: '',
                        minPurchaseAmount: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        isActive: true
                      })
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {loadingPromoCodes ? (
              <div className='catalog-loading'>Loading promo codes…</div>
            ) : promoCodes.length === 0 ? (
              <div className='empty-state'>
                <p>No promo codes yet. Create your first one above.</p>
              </div>
            ) : (
              <div className='promo-codes-list' style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px', letterSpacing: '1px' }}>Existing Promo Codes</h3>
                <div className='promo-codes-table'>
                  <div className='orders-row orders-header'>
                    <span>Code</span>
                    <span>Discount</span>
                    <span>Min Purchase</span>
                    <span>Valid Period</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {promoCodes.map(promo => {
                    const isValid = new Date(promo.endDate) >= new Date() && promo.isActive
                    return (
                      <div key={promo._id} className='orders-row'>
                        <span><strong>{promo.code}</strong></span>
                        <span>
                          {promo.discountType === 'percentage' 
                            ? `${promo.discountValue}%`
                            : `$${promo.discountValue}`}
                        </span>
                        <span>${promo.minPurchaseAmount || 0}</span>
                        <span>
                          {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                        <span>
                          <span style={{ 
                            color: isValid ? '#bfff00' : '#f87171',
                            fontWeight: '600'
                          }}>
                            {isValid ? 'Active' : 'Inactive'}
                          </span>
                        </span>
                        <span>
                          <button
                            className='ghost-button small'
                            onClick={() => handleEditPromoCode(promo)}
                            style={{ marginRight: '8px' }}
                          >
                            Edit
                          </button>
                          <button
                            className='danger-link'
                            onClick={() => handleDeletePromoCode(promo._id)}
                          >
                            Delete
                          </button>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className='admin-dashboard'>
      <nav className='admin-top-nav'>
        <div className='admin-brand'>
          <img src={adminLogo} alt='Jerzey Lab' className='brand-logo' />
        </div>
        <div className='admin-header-actions'>
          <button className='primary-button' onClick={() => alert('Future: generate latest performance PDF')}>
            Export Report
          </button>
          <button
            className='secondary-button'
            onClick={() => {
              localStorage.removeItem('isAdminAuthenticated')
              navigate('/admin-login')
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className='admin-layout'>
        <aside className='admin-sidebar'>
          <div className='sidebar-header'>
            <p className='eyebrow'>NAVIGATION</p>
            <h2>Admin Menu</h2>
          </div>
          <nav className='sidebar-menu'>
            <button
              className={`sidebar-menu-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <span>📦</span>
              <span>Orders</span>
            </button>
            <button
              className={`sidebar-menu-item ${activeSection === 'users' ? 'active' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              <span>👥</span>
              <span>Users</span>
            </button>
            <button
              className={`sidebar-menu-item ${activeSection === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveSection('catalog')}
            >
              <span>📋</span>
              <span>Catalog Control</span>
            </button>
            <button
              className={`sidebar-menu-item ${activeSection === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveSection('inquiries')}
            >
              <span>✉️</span>
              <span>Teamwear Inquiries</span>
            </button>
            <button
              className={`sidebar-menu-item ${activeSection === 'promocodes' ? 'active' : ''}`}
              onClick={() => setActiveSection('promocodes')}
            >
              <span>🎟️</span>
              <span>Promo Codes</span>
            </button>
          </nav>
        </aside>

        <main className='admin-main-content'>
          <header className='admin-header'>
            <div>
              <p className='eyebrow'>INTERNAL ACCESS</p>
              <h1>Jerzey Lab Admin</h1>
              <p className='subheading'>Control the drop. Manage jerseys, monitor orders, and keep the culture moving.</p>
            </div>
          </header>

          {statusMessage.text && (
            <div className={`admin-toast ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardPage

