
import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, PlusCircle, Eye, AlertTriangle, Package, X, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../api";
import { useAuth } from "../../components/AuthContext";

export default function DistributorProducts() {
  const { user } = useAuth();
  const distributorId = user?._id;
  const [active, setActive] = useState("Groceries");
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistributorship, setSelectedDistributorship] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  
  const distributorships = ["Groceries", "Beverages", "Personal Care"];

  // Fetch products using the backend's pagination and filtering
 const fetchProducts = useCallback(async () => {
  if (!distributorId) return;

  setLoading(true);
  setError("");

  try {
    const params = {
      distributorId, // ✅ include this
      //distributorships: selectedDistributorship,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const response = await API.get("/products/get", { params });

    setProducts(response.data);

  } catch (error) {
    console.error("Error fetching products:", error);
    setError(error.response?.data?.message || "Failed to fetch products.");
  } finally {
    setLoading(false);
  }
}, [distributorId, selectedDistributorship, active, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [active, searchTerm, selectedDistributorship]);

  const handleAddProduct = async (product) => {
    if (!product.name?.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Generate unique product ID using timestamp + random
      const productId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate SKUs for variants that don't have them
      const variantsWithSKU = product.variants.map((variant, index) => ({
        ...variant,
        id: variant.id || `${productId}-VAR-${index + 1}`,
        sku: variant.sku || `${productId}-VAR-${index + 1}`,
        expiry: variant.expiry || 'N/A',
        stock: Number(variant.stock) || 0,
        sellingPrice: Number(variant.sellingPrice) || 0,
        costPrice: Number(variant.costPrice) || 0
      }));

      const response = await API.post("/products/add", {
        ...product,
        id: productId,
        distributorships: [active],
        category: active,
        variants: variantsWithSKU,
      });
      
      // Refresh the products list instead of manually updating state
      await fetchProducts();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.response?.data?.message || "Failed to add product. Please check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (updated) => {
    if (!updated.name?.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Ensure all variants have required fields
      const updatedVariants = updated.variants.map((variant) => ({
        ...variant,
        sku: variant.sku || `${updated.id}-VAR-${variant.id}`,
        expiry: variant.expiry || 'N/A',
        stock: Number(variant.stock) || 0,
        sellingPrice: Number(variant.sellingPrice) || 0,
        costPrice: Number(variant.costPrice) || 0
      }));

      await API.put(`/products/${updated._id}`, {
        ...updated,
        distributorships: [active],
        category: active,
        variants: updatedVariants,
      });
      
      // Refresh the products list
      await fetchProducts();
      setShowEditModal(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.response?.data?.message || "Failed to update product. Please check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      setError("");
      
      await API.delete(`/products/${id}`);
      
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.response?.data?.message || "Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await API.get(`/products/${productId}`);
      setViewProduct(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(error.response?.data?.message || "Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalStock = (variants) => {
    return (variants || []).reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
  };   

  const getPriceRange = (variants) => {
    if (!variants?.length) return "₹0";
    
    const prices = variants
      .map(v => Number(v.sellingPrice) || 0)
      .filter(p => p > 0);
    
    if (!prices.length) return "₹0";
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
  };

  const getLowStockVariants = (variants) => {
    return (variants || []).filter((v) => (Number(v.stock) || 0) <= 10);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setEditProduct(null);
    setViewProduct(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  if (!distributorId) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600">Please log in to manage products.</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Product Management</h1>
        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
          Total Products: {pagination.totalProducts || 0}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {distributorships.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={`px-5 py-2 rounded-full border-2 transition-all duration-200 font-medium ${
              active === name 
                ? "bg-blue-700 text-white border-blue-700 shadow-lg" 
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Search
            </button>
          </form>
          
          <div className="flex gap-2 items-center">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedDistributorship}
              onChange={(e) => setSelectedDistributorship(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Distributorships</option>
              {distributorships.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-6 py-4 text-left font-semibold">Total Stock</th>
                  <th className="px-6 py-4 text-left font-semibold">Price Range</th>
                  <th className="px-6 py-4 text-left font-semibold">Variants</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products?.length ? (
                  products.map((product, index) => {
                    const lowStockVariants = getLowStockVariants(product.variants);
                    return (
                      <tr
                        key={product._id}
                        className={`hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={18} className="text-gray-500" />
                            <span className="font-medium">{getTotalStock(product.variants)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          {getPriceRange(product.variants)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {lowStockVariants.length > 0 ? (
                            <div className="flex items-center gap-2 text-orange-600">
                              <AlertTriangle size={16} />
                              <span className="text-sm font-medium">Low Stock</span>
                            </div>
                          ) : (
                            <span className="text-green-600 text-sm font-medium">In Stock</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewProduct(product._id)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                              disabled={loading}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEditProduct(product);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit Product"
                              disabled={loading}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Product"
                              disabled={loading}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Package size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">
                        {searchTerm ? `No products match "${searchTerm}"` : `Add your first product in ${active} to get started.`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalProducts)} of {pagination.totalProducts} products
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage || loading}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setShowAddModal(true)}
        disabled={loading}
        className="mt-6 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <PlusCircle size={20} /> Add New Product
      </button>

      {showAddModal && (
        <ProductModal
          title="Add New Product"
          category={active}
          onClose={closeModals}
          onSubmit={handleAddProduct}
          loading={loading}
        />
      )}

      {showEditModal && editProduct && (
        <ProductModal
          title="Edit Product"
          product={editProduct}
          category={active}
          onClose={closeModals}
          onSubmit={handleEditProduct}
          loading={loading}
        />
      )}

      {showViewModal && viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={closeModals}
        />
      )}
    </div>
  );
}

function ProductModal({ title, product = {}, category, onClose, onSubmit, loading = false }) {
  const [name, setName] = useState(product.name || "");
  const [icon, setIcon] = useState(product.icon || "📦");
  const [variants, setVariants] = useState(
    product.variants?.length > 0 
      ? product.variants.map(v => ({...v, stock: v.stock || 0, sellingPrice: v.sellingPrice || 0, costPrice: v.costPrice || 0}))
      : [{ id: Date.now(), name: "", stock: 0, sellingPrice: 0, costPrice: 0, sku: "", expiry: "" }]
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    variants.forEach((variant, index) => {
      if (!variant.name.trim()) {
        newErrors[`variant_${index}_name`] = "Variant name is required";
      }
      if (Number(variant.sellingPrice) <= 0) {
        newErrors[`variant_${index}_sellingPrice`] = "Selling price must be greater than 0";
      }
      if (Number(variant.costPrice) < 0) {
        newErrors[`variant_${index}_costPrice`] = "Cost price cannot be negative";
      }
      if (Number(variant.stock) < 0) {
        newErrors[`variant_${index}_stock`] = "Stock cannot be negative";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        name: "", 
        stock: 0, 
        sellingPrice: 0, 
        costPrice: 0, 
        sku: "", 
        expiry: "" 
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
    
    // Clear specific error when user starts typing
    if (errors[`variant_${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`variant_${index}_${field}`]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = { 
      ...product, 
      name: name.trim(), 
      icon,
      category,
      variants: variants.map(variant => ({
        ...variant,
        name: variant.name.trim(),
        stock: Number(variant.stock) || 0,
        sellingPrice: Number(variant.sellingPrice) || 0,
        costPrice: Number(variant.costPrice) || 0,
        sku: variant.sku.trim()
      }))
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Product Name *</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({...prev, name: undefined}));
                }}
                className={`w-full border-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Product Icon</label>
              <input
                type="text"
                placeholder="📦"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Product Variants *</h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                disabled={loading}
              >
                <PlusCircle size={16} /> Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Variant {index + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-500 hover:text-red-700 font-medium"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., 500ml, Large, Red"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                        className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`variant_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors[`variant_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_name`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        placeholder="Auto-generated if empty"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                        className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`variant_${index}_stock`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        disabled={loading}
                      />
                      {errors[`variant_${index}_stock`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_stock`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={variant.sellingPrice}
                        onChange={(e) => handleVariantChange(index, "sellingPrice", e.target.value)}
                        className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`variant_${index}_sellingPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                      {errors[`variant_${index}_sellingPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_sellingPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price *</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={variant.costPrice}
                        onChange={(e) => handleVariantChange(index, "costPrice", e.target.value)}
                        className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`variant_${index}_costPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                      {errors[`variant_${index}_costPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_costPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={variant.expiry && variant.expiry !== 'N/A' ? variant.expiry : ''}
                        onChange={(e) => handleVariantChange(index, "expiry", e.target.value || 'N/A')}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductViewModal({ product, onClose }) {
  const getTotalStock = (variants) => {
    return (variants || []).reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
  };

  const getTotalValue = (variants) => {
    return (variants || []).reduce((sum, variant) => sum + ((Number(variant.stock) || 0) * (Number(variant.sellingPrice) || 0)), 0);
  };

  const getVariantProfit = (variant) => {
    const selling = Number(variant.sellingPrice) || 0;
    const cost = Number(variant.costPrice) || 0;
    const profit = selling - cost;
    const margin = cost > 0 ? (profit / cost) * 100 : 0;
    return { profit, margin };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Product Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{product.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-blue-600 font-medium">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Product ID: {product.id}</p>
              </div>
            </div>
            
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getTotalStock(product.variants)}</div>
                  <div className="text-sm text-gray-600">Total Stock</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{getTotalValue(product.variants).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{product.variants?.length || 0}</div>
                  <div className="text-sm text-gray-600">Variants</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Variants Details */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-800">Variant Details</h4>
            <div className="grid gap-4">
              {(product.variants || []).map((variant, index) => {
                const { profit, margin } = getVariantProfit(variant);
                const stock = Number(variant.stock) || 0;
                const isLowStock = stock <= 10;
                
                return (
                  <div key={variant.id || index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-lg font-semibold text-gray-900">{variant.name}</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">SKU</span>
                        <span className="font-mono">{variant.sku || 'Not set'}</span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">Stock</span>
                        <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {stock} units
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">Selling Price</span>
                        <span className="font-bold text-green-600">₹{Number(variant.sellingPrice) || 0}</span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">Cost Price</span>
                        <span className="font-bold text-blue-600">₹{Number(variant.costPrice) || 0}</span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">Profit Margin</span>
                        <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{profit.toFixed(2)} ({margin.toFixed(1)}%)
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium block">Expiry</span>
                        <span className="text-gray-900">
                          {variant.expiry === 'N/A' || !variant.expiry ? 'No expiry' : variant.expiry}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}