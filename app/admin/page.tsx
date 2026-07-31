'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  deleteOrderFromDb,
  uploadProductImage,
} from '@/lib/api';
import type { Product, Category, Order, OrderStatus } from '@/types';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Package,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  X,
  Eye,
  Tag,
  DollarSign,
  Layers,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Truck,
  User as UserIcon,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    categorySlug: 'electronics',
    category: 'Electronics',
    stockCount: '15',
    imageUrl: '',
    description: '',
    sku: '',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ordersRes] = await Promise.all([
        getProducts({}, 'featured', 1, 100),
        getCategories(),
        getOrders(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      setOrders(ordersRes);
    } catch (err: any) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    const handleOrderPlaced = () => {
      fetchAdminData();
    };

    window.addEventListener('order-placed', handleOrderPlaced);
    window.addEventListener('storage', handleOrderPlaced);

    return () => {
      window.removeEventListener('order-placed', handleOrderPlaced);
      window.removeEventListener('storage', handleOrderPlaced);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  // ── Product Handlers ──
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG, etc.)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      showToast(`Image "${file.name}" uploaded to Supabase Storage!`);
    } catch (err: any) {
      showToast('Failed to upload image to Supabase Storage', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      categorySlug: categories[0]?.slug || 'electronics',
      category: categories[0]?.name || 'Electronics',
      stockCount: '15',
      imageUrl: '',
      description: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      inStock: true,
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      categorySlug: product.categorySlug,
      category: product.category,
      stockCount: String(product.stockCount),
      imageUrl: product.images[0]?.url || '',
      description: product.description,
      sku: product.sku || '',
      inStock: product.inStock,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please fill in product title and price', 'error');
      return;
    }

    setSaving(true);
    try {
      const selectedCatObj = categories.find((c) => c.slug === formData.categorySlug);
      const categoryName = selectedCatObj ? selectedCatObj.name : formData.category;
      const defaultImgUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
      const finalImgUrl = formData.imageUrl || defaultImgUrl;

      const payload: Partial<Product> = {
        name: formData.name,
        brand: formData.brand || 'Generic',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        categorySlug: formData.categorySlug,
        category: categoryName,
        stockCount: parseInt(formData.stockCount, 10) || 0,
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNew: formData.isNew,
        description: formData.description,
        sku: formData.sku,
        images: [
          {
            id: `img-${Date.now()}`,
            url: finalImgUrl,
            alt: formData.name,
            isPrimary: true,
          },
        ],
      };

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload);
        showToast(`Product "${updated.name}" updated successfully!`);
      } else {
        const created = await createProduct(payload);
        showToast(`Product "${created.name}" created successfully!`);
      }

      setIsModalOpen(false);
      await fetchAdminData();
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      showToast(`Product "${name}" deleted from database.`);
      await fetchAdminData();
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Order Handlers ──
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus.toUpperCase()}".`);
      await fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete Order "${orderNumber}"?`)) return;

    setUpdatingOrderId(orderId);
    try {
      await deleteOrderFromDb(orderId);
      showToast(`Order "${orderNumber}" deleted successfully.`);
      await fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete order', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const customerName = `${ord.shippingAddress?.firstName || ''} ${ord.shippingAddress?.lastName || ''}`.toLowerCase();
    const city = (ord.shippingAddress?.city || '').toLowerCase();
    const q = orderSearch.toLowerCase();

    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(q) ||
      customerName.includes(q) ||
      city.includes(q);

    const matchesStatus =
      orderStatusFilter === 'all' || ord.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Product statistics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  // Order statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered' || o.status === 'shipped').length;

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'confirmed':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
      case 'processing':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 animate-slide-in ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
              </Link>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Backend
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <img
                src="/pnglogo.png"
                alt="Modern Traders Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  Modern Traders • Admin Console
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Manage products, view customer purchases, and track order fulfillment status in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
              title="Refresh console data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 bg-[#B57A20] hover:bg-[#9f641a] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* ─── Navigation Tabs Bar ─── */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog</span>
            <span className="ml-1 bg-slate-950/60 px-2 py-0.5 rounded-full text-xs text-slate-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders</span>
            <span className="ml-1 bg-slate-950/60 px-2 py-0.5 rounded-full text-xs text-slate-300">
              {orders.length}
            </span>
            {pendingOrdersCount > 0 && (
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ─── TAB 1: PRODUCTS MANAGEMENT ────────────────────────────── */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Products Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Products</span>
                  <Package className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">{totalProducts}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">In Stock</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">{inStockCount}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Out of Stock</span>
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-400">{outOfStockCount}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Featured</span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">{featuredCount}</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by title, brand or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                  <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
              {loading ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-sm font-medium">Fetching products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <Package className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-base font-semibold text-slate-300">No products found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching for something else or add your first product using the "Add Product" button.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Tags</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                                alt={product.name}
                                className="w-11 h-11 object-cover rounded-lg bg-slate-800 border border-slate-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate max-w-xs">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                  <span>Brand: {product.brand}</span>
                                  {product.sku && <span className="font-mono">({product.sku})</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-medium">
                              {product.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-white">
                            ${product.price.toFixed(2)}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-slate-500 line-through ml-2 font-normal">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {product.inStock ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {product.stockCount} in stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                Out of stock
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {product.isFeatured && (
                                <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                                  Featured
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-semibold">
                                  Best Seller
                                </span>
                              )}
                              {!product.isFeatured && !product.isBestSeller && (
                                <span className="text-xs text-slate-500">—</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
                                title="View on site"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
                                title="Edit product"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(product.id, product.name)}
                                disabled={deletingId === product.id}
                                className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ─── TAB 2: CUSTOMER ORDERS MANAGEMENT ──────────────────────── */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Orders Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Sales Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">${totalRevenue.toFixed(2)}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">{totalOrders}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Pending Fulfillment</span>
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">{pendingOrdersCount}</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Shipped / Delivered</span>
                  <Truck className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-2xl font-bold text-sky-400">{deliveredOrdersCount}</div>
              </div>
            </div>

            {/* Orders Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders by Order #, Customer Name or City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-52">
                  <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
              {loading ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-sm font-medium">Loading customer orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-base font-semibold text-slate-300">No customer orders found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When customers purchase products from your site, their full purchase details will automatically appear right here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Order # & Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Purchased Items</th>
                        <th className="py-3.5 px-4">Total Paid</th>
                        <th className="py-3.5 px-4">Status & Update</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((ord) => {
                        const addr = ord.shippingAddress || {};
                        const customerName = `${addr.firstName || 'Customer'} ${addr.lastName || ''}`.trim();
                        const locationText = [addr.city, addr.state, addr.country].filter(Boolean).join(', ');

                        return (
                          <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors group">
                            
                            {/* Order # & Date */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-mono font-bold text-white text-sm">
                                  {ord.orderNumber}
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-500" />
                                  <span>{formatDate(ord.createdAt)}</span>
                                </div>
                              </div>
                            </td>

                            {/* Customer Details */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5 max-w-xs">
                                <div className="font-semibold text-white flex items-center gap-1.5">
                                  <UserIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span className="truncate">{customerName}</span>
                                </div>
                                {locationText && (
                                  <div className="text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="truncate">{locationText}</span>
                                  </div>
                                )}
                                {addr.phone && (
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {addr.phone}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Purchased Items */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1.5 max-w-xs">
                                {ord.items.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <img
                                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                                      alt={item.name}
                                      className="w-8 h-8 object-cover rounded bg-slate-800 border border-slate-700 shrink-0"
                                    />
                                    <div className="min-w-0 text-xs">
                                      <div className="font-medium text-slate-200 truncate max-w-[170px]">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        Qty: {item.quantity} • ${item.price.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {ord.items.length > 2 && (
                                  <div className="text-[11px] font-medium text-indigo-400">
                                    +{ord.items.length - 2} more item(s)
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Total Paid */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-emerald-400 text-sm">
                                  ${ord.total.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <CreditCard className="w-3 h-3 text-slate-500" />
                                  <span>{ord.paymentMethod || 'Credit Card'}</span>
                                </div>
                              </div>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1.5">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit capitalize ${getOrderStatusBadge(ord.status)}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {ord.status}
                                </span>

                                <select
                                  value={ord.status}
                                  disabled={updatingOrderId === ord.id}
                                  onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                                  className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                                >
                                  <option value="pending">Set: Pending</option>
                                  <option value="confirmed">Set: Confirmed</option>
                                  <option value="processing">Set: Processing</option>
                                  <option value="shipped">Set: Shipped</option>
                                  <option value="delivered">Set: Delivered</option>
                                  <option value="cancelled">Set: Cancelled</option>
                                </select>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
                                  title="View full order details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                                  disabled={updatingOrderId === ord.id}
                                  className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
                                  title="Delete order record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ─── ADD / EDIT PRODUCT MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingProduct
                    ? `Updating "${editingProduct.name}" in database`
                    : 'Create a new product directly in your database'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sony, Apple, Nike"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const catObj = categories.find((c) => c.slug === slug);
                      setFormData({
                        ...formData,
                        categorySlug: slug,
                        category: catObj ? catObj.name : slug,
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Original Price (Rs.) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="30000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Stock Count */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SNY-WH1000"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Product Image File Upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Product Image File *
                  </label>

                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/80 rounded-xl p-4 transition-colors flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview Thumbnail */}
                    <div className="w-24 h-24 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-inner">
                      {formData.imageUrl ? (
                        <>
                          <img
                            src={formData.imageUrl}
                            alt="Product Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-400 font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-2 text-slate-600">
                          <ImageIcon className="w-7 h-7 mx-auto mb-1 opacity-60" />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>

                    {/* File Upload Trigger */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}>
                          {uploadingImage ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Uploading to Supabase Storage...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Choose & Upload Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>

                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors border border-slate-700"
                          >
                            Clear Image
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Upload an image file directly from your computer (PNG, JPG, WEBP, SVG max 5MB).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe key features, specs, and details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-xs font-medium text-slate-300">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-xs font-medium text-slate-300">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-xs font-medium text-slate-300">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-xs font-medium text-slate-300">Is New</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                >
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── FULL ORDER DETAILS RECEIPT MODAL ─── */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-100 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-white">
                    {selectedOrderDetails.orderNumber}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getOrderStatusBadge(selectedOrderDetails.status)}`}>
                    {selectedOrderDetails.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {formatDate(selectedOrderDetails.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" /> Customer Information
                </h4>
                <p className="text-sm font-semibold text-white">
                  {selectedOrderDetails.shippingAddress?.firstName} {selectedOrderDetails.shippingAddress?.lastName}
                </p>
                {selectedOrderDetails.shippingAddress?.phone && (
                  <p className="text-xs text-slate-400 font-mono">
                    Phone: {selectedOrderDetails.shippingAddress.phone}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  Payment: <span className="font-medium text-slate-200">{selectedOrderDetails.paymentMethod}</span>
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Shipping Address
                </h4>
                <p className="text-xs text-slate-300">
                  {selectedOrderDetails.shippingAddress?.line1}
                  {selectedOrderDetails.shippingAddress?.line2 ? `, ${selectedOrderDetails.shippingAddress.line2}` : ''}
                </p>
                <p className="text-xs text-slate-300">
                  {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} {selectedOrderDetails.shippingAddress?.zip}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedOrderDetails.shippingAddress?.country || 'United States'}
                </p>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Order Items ({selectedOrderDetails.items.length})
              </h4>
              <div className="divide-y divide-slate-800/80 border-t border-b border-slate-800">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-800 border border-slate-700 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                        <p className="text-xs text-slate-400">
                          Qty: <span className="font-bold text-slate-200">{item.quantity}</span>
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Totals */}
            <div className="space-y-2 text-xs text-slate-400 border-b border-slate-800 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${selectedOrderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{selectedOrderDetails.shipping === 0 ? 'Free' : `$${selectedOrderDetails.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${selectedOrderDetails.tax.toFixed(2)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-${selectedOrderDetails.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-emerald-400">${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
