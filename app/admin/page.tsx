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
    imageUrls: [] as string[],
    description: '',
    sku: '',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
  });

  const [newUrlInput, setNewUrlInput] = useState('');

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
  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showToast(`"${file.name}" is not a valid image file`, 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`"${file.name}" exceeds 5MB limit`, 'error');
        return;
      }
    }

    setUploadingImage(true);
    try {
      const uploadPromises = files.map((file) => uploadProductImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
      showToast(`${files.length} image(s) uploaded successfully!`);
    } catch (err: any) {
      showToast('Failed to upload image(s) to Supabase Storage', 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, newUrlInput.trim()],
    }));
    setNewUrlInput('');
    showToast('Image URL added!');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== index),
    }));
  };

  const handleMakePrimary = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.imageUrls];
      const [selected] = updated.splice(index, 1);
      return {
        ...prev,
        imageUrls: [selected, ...updated],
      };
    });
    showToast('Image set as primary!');
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setNewUrlInput('');
    setFormData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      categorySlug: categories[0]?.slug || 'electronics',
      category: categories[0]?.name || 'Electronics',
      stockCount: '15',
      imageUrls: [],
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
    setNewUrlInput('');
    const existingUrls = product.images?.map((img) => img.url).filter(Boolean) || [];
    setFormData({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      categorySlug: product.categorySlug,
      category: product.category,
      stockCount: String(product.stockCount),
      imageUrls: existingUrls.length > 0 ? existingUrls : [product.images[0]?.url || ''],
      description: product.description,
      sku: product.sku || '',
      inStock: (Number(product.stockCount) || 0) > 0,
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
      const finalUrls = formData.imageUrls.filter(Boolean).length > 0
        ? formData.imageUrls.filter(Boolean)
        : [defaultImgUrl];
      const stockCountNum = parseInt(formData.stockCount, 10) || 0;

      const payload: Partial<Product> = {
        name: formData.name,
        brand: formData.brand || 'Generic',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        categorySlug: formData.categorySlug,
        category: categoryName,
        stockCount: stockCountNum,
        inStock: stockCountNum > 0,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNew: formData.isNew,
        description: formData.description,
        sku: formData.sku,
        images: finalUrls.map((url, idx) => ({
          id: `img-${Date.now()}-${idx}`,
          url,
          alt: `${formData.name} - Image ${idx + 1}`,
          isPrimary: idx === 0,
        })),
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
  const inStockCount = products.filter((p) => p.inStock && p.stockCount > 0).length;
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
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#131213] font-sans p-4 sm:p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 animate-slide-in ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e7dccb] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#131213] hover:text-[#B57A20] transition-colors bg-white border border-[#e7dccb] px-3.5 py-1.5 rounded-lg shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
              </Link>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Database Backend
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <img
                src="/logo1.png"
                alt="Modern Traders Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#131213] leading-none uppercase">
                  Modern Traders • Admin Console
                </h1>
                <p className="text-neutral-500 text-xs mt-1">
                  Manage products, view customer purchases, and track order fulfillment status in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 border border-[#e7dccb] text-[#131213] font-bold px-4 py-2.5 rounded-xl transition-all text-sm shadow-sm"
              title="Refresh console data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 bg-[#B57A20] hover:bg-[#8e5c12] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* ─── Navigation Tabs Bar ─── */}
        <div className="flex items-center gap-2 bg-white border border-[#e7dccb] p-1.5 rounded-2xl w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#B57A20] text-white shadow-md'
                : 'text-neutral-600 hover:text-[#131213] hover:bg-[#FAF6F0]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog</span>
            <span className="ml-1 bg-[#FAF6F0] border border-[#e7dccb] px-2 py-0.5 rounded-full text-xs text-[#131213] font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'bg-[#B57A20] text-white shadow-md'
                : 'text-neutral-600 hover:text-[#131213] hover:bg-[#FAF6F0]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders</span>
            <span className="ml-1 bg-[#FAF6F0] border border-[#e7dccb] px-2 py-0.5 rounded-full text-xs text-[#131213] font-bold">
              {orders.length}
            </span>
            {pendingOrdersCount > 0 && (
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
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
              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
                  <Package className="w-5 h-5 text-[#B57A20]" />
                </div>
                <div className="text-2xl font-extrabold text-[#131213]">{totalProducts}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">In Stock</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">{inStockCount}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="text-2xl font-extrabold text-rose-600">{outOfStockCount}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Featured</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-amber-600">{featuredCount}</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#e7dccb] shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products by title, brand or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] placeholder-neutral-400 focus:outline-none focus:border-[#B57A20] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                  <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20] appearance-none cursor-pointer font-medium"
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
            <div className="bg-white border border-[#e7dccb] rounded-2xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-neutral-500 flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#B57A20]" />
                  <p className="text-sm font-semibold">Fetching products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-3">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto" />
                  <p className="text-base font-semibold text-neutral-800">No products found</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try searching for something else or add your first product using the "Add Product" button.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#131213]">
                    <thead className="bg-[#FAF6F0] text-neutral-600 uppercase text-[11px] tracking-wider font-bold border-b border-[#e7dccb]">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price (PKR)</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Tags</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7dccb]/60">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-[#FAF6F0]/60 transition-colors group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                                alt={product.name}
                                className="w-11 h-11 object-cover rounded-lg bg-neutral-100 border border-[#e7dccb] shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-[#131213] truncate max-w-xs">
                                  {product.name}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-2">
                                  <span>Brand: {product.brand}</span>
                                  {product.sku && <span className="font-mono">({product.sku})</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-[#FAF6F0] text-[#131213] text-xs px-2.5 py-1 rounded-md border border-[#e7dccb] font-semibold">
                              {product.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-[#131213]">
                            {formatPrice(product.price)}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-neutral-400 line-through ml-2 font-normal">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {product.inStock && product.stockCount > 0 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {product.stockCount} in stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Out of stock (0)
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {product.isFeatured && (
                                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                                  Featured
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold">
                                  Best Seller
                                </span>
                              )}
                              {!product.isFeatured && !product.isBestSeller && (
                                <span className="text-xs text-neutral-400">—</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="p-2 text-neutral-600 hover:text-[#131213] bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
                                title="View on site"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-2 text-[#B57A20] hover:text-[#8e5c12] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                                title="Edit product"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(product.id, product.name)}
                                disabled={deletingId === product.id}
                                className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
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
              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
                  <Tag className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">{formatPrice(totalRevenue)}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#B57A20]" />
                </div>
                <div className="text-2xl font-extrabold text-[#131213]">{totalOrders}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Fulfillment</span>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-amber-600">{pendingOrdersCount}</div>
              </div>

              <div className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Shipped / Delivered</span>
                  <Truck className="w-5 h-5 text-sky-600" />
                </div>
                <div className="text-2xl font-extrabold text-sky-600">{deliveredOrdersCount}</div>
              </div>
            </div>

            {/* Orders Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#e7dccb] shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders by Order #, Customer Name or City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] placeholder-neutral-400 focus:outline-none focus:border-[#B57A20] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-52">
                  <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20] appearance-none cursor-pointer font-medium"
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
            <div className="bg-white border border-[#e7dccb] rounded-2xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-neutral-500 flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#B57A20]" />
                  <p className="text-sm font-semibold">Loading customer orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                  <p className="text-base font-semibold text-neutral-800">No customer orders found</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    When customers purchase products from your site, their full purchase details will automatically appear right here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#131213]">
                    <thead className="bg-[#FAF6F0] text-neutral-600 uppercase text-[11px] tracking-wider font-bold border-b border-[#e7dccb]">
                      <tr>
                        <th className="py-3.5 px-4">Order # & Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Purchased Items</th>
                        <th className="py-3.5 px-4">Total Paid (PKR)</th>
                        <th className="py-3.5 px-4">Status & Update</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7dccb]/60">
                      {filteredOrders.map((ord) => {
                        const addr = ord.shippingAddress || {};
                        const customerName = `${addr.firstName || 'Customer'} ${addr.lastName || ''}`.trim();
                        const locationText = [addr.city, addr.state, addr.country].filter(Boolean).join(', ');

                        return (
                          <tr key={ord.id} className="hover:bg-[#FAF6F0]/60 transition-colors group">
                            
                            {/* Order # & Date */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-mono font-extrabold text-[#131213] text-sm">
                                  {ord.orderNumber}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-neutral-400" />
                                  <span>{formatDate(ord.createdAt)}</span>
                                </div>
                              </div>
                            </td>

                            {/* Customer Details */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5 max-w-xs">
                                <div className="font-bold text-[#131213] flex items-center gap-1.5">
                                  <UserIcon className="w-3.5 h-3.5 text-[#B57A20] shrink-0" />
                                  <span className="truncate">{customerName}</span>
                                </div>
                                {locationText && (
                                  <div className="text-xs text-neutral-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                    <span className="truncate">{locationText}</span>
                                  </div>
                                )}
                                {addr.phone && (
                                  <div className="text-[11px] text-neutral-500 font-mono">
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
                                      className="w-8 h-8 object-cover rounded bg-neutral-100 border border-[#e7dccb] shrink-0"
                                    />
                                    <div className="min-w-0 text-xs">
                                      <div className="font-semibold text-[#131213] truncate max-w-[170px]">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] text-neutral-500">
                                        Qty: {item.quantity} • {formatPrice(item.price)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {ord.items.length > 2 && (
                                  <div className="text-[11px] font-bold text-[#B57A20]">
                                    +{ord.items.length - 2} more item(s)
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Total Paid */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-extrabold text-emerald-700 text-sm">
                                  {formatPrice(ord.total)}
                                </div>
                                <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                                  <CreditCard className="w-3 h-3 text-neutral-400" />
                                  <span>{ord.paymentMethod || 'Credit Card'}</span>
                                </div>
                              </div>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1.5">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border w-fit capitalize ${getOrderStatusBadge(ord.status)}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {ord.status}
                                </span>

                                <select
                                  value={ord.status}
                                  disabled={updatingOrderId === ord.id}
                                  onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                                  className="text-xs bg-[#FAF6F0] border border-[#e7dccb] rounded-lg px-2 py-1 text-[#131213] focus:outline-none focus:border-[#B57A20] cursor-pointer disabled:opacity-50 font-medium"
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
                                  className="p-2 text-[#B57A20] hover:text-[#8e5c12] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                                  title="View full order details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                                  disabled={updatingOrderId === ord.id}
                                  className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e7dccb] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-[#131213]">
            <div className="flex items-center justify-between border-b border-[#e7dccb] pb-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#131213]">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {editingProduct
                    ? `Updating "${editingProduct.name}" in database`
                    : 'Create a new product directly in your database'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-500 hover:text-[#131213] rounded-lg bg-[#FAF6F0] hover:bg-neutral-100 border border-[#e7dccb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury Embroidered Lawn Dress"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Traders"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const cat = categories.find((c) => c.slug === slug);
                      setFormData({
                        ...formData,
                        categorySlug: slug,
                        category: cat ? cat.name : slug,
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20] font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price (PKR) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Price (PKR Rs.) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="e.g. 4500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 6000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={formData.stockCount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseInt(val, 10) || 0;
                      setFormData({
                        ...formData,
                        stockCount: val,
                        inStock: num > 0,
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MT-PRET-101"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20] font-mono"
                  />
                </div>

                {/* Product Images (Multiple Upload + Gallery) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Product Images Gallery ({formData.imageUrls.length}) *
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      The 1st image will be displayed as Main Cover Image
                    </span>
                  </div>

                  {/* Upload & Add URL Controls */}
                  <div className="border-2 border-dashed border-[#e7dccb] hover:border-[#B57A20] bg-[#FAF6F0] rounded-xl p-4 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Multiple Files Upload */}
                      <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#B57A20] hover:bg-[#8e5c12] text-white rounded-xl text-xs font-bold shadow-md transition-all ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}>
                        {uploadingImage ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Uploading Images to Storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Choose & Upload Multiple Files</span>
                          </>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageFilesChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      <span className="text-xs text-neutral-400 font-medium hidden sm:inline">OR</span>

                      {/* Manual Image URL Input */}
                      <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                        <input
                          type="url"
                          placeholder="Paste image URL directly (e.g. https://...)"
                          value={newUrlInput}
                          onChange={(e) => setNewUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-[#e7dccb] rounded-xl text-xs text-[#131213] focus:outline-none focus:border-[#B57A20]"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3.5 py-2 bg-white hover:bg-neutral-100 border border-[#e7dccb] text-[#131213] text-xs font-bold rounded-xl transition-colors shrink-0"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Image Gallery Previews */}
                  {formData.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.imageUrls.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          className="relative rounded-xl bg-white border border-[#e7dccb] p-1.5 shadow-sm group space-y-1.5"
                        >
                          <div className="relative h-28 w-full rounded-lg overflow-hidden bg-neutral-100 border border-[#e7dccb]">
                            <img
                              src={url}
                              alt={`Product Image ${idx + 1}`}
                              className="w-full h-full object-cover object-center"
                            />
                            {idx === 0 && (
                              <span className="absolute top-1.5 left-1.5 bg-[#B57A20] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
                                MAIN COVER
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            {idx !== 0 ? (
                              <button
                                type="button"
                                onClick={() => handleMakePrimary(idx)}
                                className="text-[10px] font-bold text-[#B57A20] hover:underline"
                              >
                                Set Main
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700">Primary</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      No images added yet. Click "Choose & Upload Multiple Files" or paste an Image URL above.
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a detailed description of the product fabric, design and sizing..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] border border-[#e7dccb] rounded-xl text-sm text-[#131213] focus:outline-none focus:border-[#B57A20]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-[#FAF6F0] border border-[#e7dccb] p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-[#B57A20] rounded"
                  />
                  <span className="text-xs font-bold text-[#131213]">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#FAF6F0] border border-[#e7dccb] p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#B57A20] rounded"
                  />
                  <span className="text-xs font-bold text-[#131213]">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#FAF6F0] border border-[#e7dccb] p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-[#B57A20] rounded"
                  />
                  <span className="text-xs font-bold text-[#131213]">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#FAF6F0] border border-[#e7dccb] p-2.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-[#B57A20] rounded"
                  />
                  <span className="text-xs font-bold text-[#131213]">New Arrival</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7dccb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-neutral-50 rounded-xl text-sm font-bold text-[#131213] border border-[#e7dccb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#B57A20] hover:bg-[#8e5c12] text-white rounded-xl text-sm font-bold transition-colors shadow-md"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e7dccb] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-[#131213] space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#e7dccb] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-lg text-[#131213]">
                    {selectedOrderDetails.orderNumber}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border capitalize ${getOrderStatusBadge(selectedOrderDetails.status)}`}>
                    {selectedOrderDetails.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Placed on {formatDate(selectedOrderDetails.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-neutral-500 hover:text-[#131213] rounded-lg bg-[#FAF6F0] hover:bg-neutral-100 border border-[#e7dccb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#e7dccb]">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#B57A20]" /> Customer Information
                </h4>
                <p className="text-sm font-bold text-[#131213]">
                  {selectedOrderDetails.shippingAddress?.firstName} {selectedOrderDetails.shippingAddress?.lastName}
                </p>
                {selectedOrderDetails.shippingAddress?.phone && (
                  <p className="text-xs text-neutral-600 font-mono">
                    Phone: {selectedOrderDetails.shippingAddress.phone}
                  </p>
                )}
                <p className="text-xs text-neutral-600">
                  Payment: <span className="font-semibold text-[#131213]">{selectedOrderDetails.paymentMethod}</span>
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Shipping Address
                </h4>
                <p className="text-xs text-neutral-700">
                  {selectedOrderDetails.shippingAddress?.line1}
                  {selectedOrderDetails.shippingAddress?.line2 ? `, ${selectedOrderDetails.shippingAddress.line2}` : ''}
                </p>
                <p className="text-xs text-neutral-700">
                  {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} {selectedOrderDetails.shippingAddress?.zip}
                </p>
                <p className="text-xs text-neutral-500">
                  {selectedOrderDetails.shippingAddress?.country || 'Pakistan'}
                </p>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Order Items ({selectedOrderDetails.items.length})
              </h4>
              <div className="divide-y divide-[#e7dccb] border-t border-b border-[#e7dccb]">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-neutral-100 border border-[#e7dccb] shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-bold text-[#131213]">{item.name}</h5>
                        <p className="text-xs text-neutral-500">
                          Qty: <span className="font-bold text-[#131213]">{item.quantity}</span>
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-[#131213]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Totals */}
            <div className="space-y-2 text-xs text-neutral-600 border-b border-[#e7dccb] pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(selectedOrderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">{selectedOrderDetails.shipping === 0 ? 'Free' : formatPrice(selectedOrderDetails.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">{formatPrice(selectedOrderDetails.tax)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrderDetails.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[#131213] pt-2 border-t border-[#e7dccb]">
                <span>Grand Total</span>
                <span className="text-emerald-700">{formatPrice(selectedOrderDetails.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-[#B57A20] hover:bg-[#8e5c12] text-white rounded-xl text-sm font-bold transition-colors shadow-md"
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
