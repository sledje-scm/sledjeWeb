import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Minus,
  Mic,
  ShoppingCart,
  Grid3X3,
  List,
  Package,
  TrendingUp,
  AlertTriangle,
  X,
  Eye,
  ChevronDown,
  ChevronRight,
  Star,
  Building2,
  Tag,
  MicOff
} from "lucide-react";


// --- CATEGORY STRUCTURE MUST BE ABOVE useState ---
const categoryStructure = {
  "Electronics": {
    "Laptops": ["MacBook Pro 16-inch", "Dell XPS 13", "HP Spectre x360"],
    "Smartphones": ["iPhone 15 Pro", "Samsung Galaxy S24", "Google Pixel 8"],
    "Tablets": ["iPad Pro", "Samsung Tab S9"],
    "Accessories": ["Apple Magic Mouse", "Dell Docking Station"]
  },
  "Clothing": {
    "Casual Wear": ["Premium Cotton T-Shirt", "Denim Jeans"],
    "Formal Wear": ["Slim Fit Blazer", "Formal Trousers"],
    "Footwear": ["Running Shoes", "Leather Loafers"],
    "Accessories": ["Leather Belt", "Silk Scarf"]
  },
  "Home Goods": {
    "Furniture": ["Modern Sofa", "Dining Table Set"],
    "Decor": ["Wall Art", "Table Lamp"],
    "Kitchen": ["Non-stick Pan", "Chef Knife"],
    "Cleaning": ["Vacuum Cleaner", "Microfiber Cloth"]
  },
  "Groceries": {
    "Grains & Cereals": ["Organic Basmati Rice", "Quinoa"],
    "Fruits & Vegetables": ["Fresh Apples", "Broccoli"],
    "Dairy": ["Organic Milk", "Cheddar Cheese"],
    "Beverages": ["Green Tea", "Orange Juice"]
  },
  "Beauty": {
    "Skincare": ["Aloe Vera Gel", "Vitamin C Serum"],
    "Makeup": ["Matte Lipstick", "Liquid Foundation"],
    "Hair Care": ["Argan Oil Shampoo", "Hair Mask"],
    "Fragrances": ["Eau de Parfum", "Body Mist"]
  },
  "Office Supplies": {
    "Stationery": ["Gel Pens", "A4 Notebooks"],
    "Electronics": ["Wireless Mouse", "USB Hub"],
    "Furniture": ["Office Chair", "Standing Desk"],
    "Storage": ["Filing Cabinet", "Desk Organizer"]
  }
};

export default function Shelf() {
  // --- STATE ---
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(Object.keys(categoryStructure)[0]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [viewMode, setViewMode] = useState("categories"); // categories or distributors
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Distributor modal state
  const [showDistributorModal, setShowDistributorModal] = useState(false);
  const [distributorSearch, setDistributorSearch] = useState("");
  const [modalDistributor, setModalDistributor] = useState(null);

  const recognitionRef = useRef(null);

  // --- SAMPLE PRODUCT DATA ---
  const mockProducts = [
    // Electronics
    {
      id: 1,
      name: "MacBook Pro 16-inch",
      category: "Electronics",
      subcategory: "Laptops",
      distributor: "Apple Inc.",
      icon: "💻",
      dailyAvgSales: 7,
      variants: [
        {
          id: 101,
          name: "M3 Pro 512GB Space Black",
          stock: 12,
          sellingPrice: 249900,
          costPrice: 220000,
          sku: "MBP-M3P-512-SB",
          expiry: "N/A"
        },
        {
          id: 102,
          name: "M3 Max 1TB Silver",
          stock: 3,
          sellingPrice: 349900,
          costPrice: 310000,
          sku: "MBP-M3M-1TB-SL",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      category: "Electronics",
      subcategory: "Smartphones",
      distributor: "Apple Inc.",
      icon: "📱",
      dailyAvgSales: 12,
      variants: [
        {
          id: 201,
          name: "128GB Natural Titanium",
          stock: 0,
          sellingPrice: 134900,
          costPrice: 115000,
          sku: "IP15P-128-NT",
          expiry: "N/A"
        },
        {
          id: 202,
          name: "256GB Blue Titanium",
          stock: 8,
          sellingPrice: 144900,
          costPrice: 125000,
          sku: "IP15P-256-BT",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 3,
      name: "Dell XPS 13",
      category: "Electronics",
      subcategory: "Laptops",
      distributor: "Dell Technologies",
      icon: "💻",
      dailyAvgSales: 6,
      variants: [
        {
          id: 301,
          name: "Intel i7 16GB 512GB",
          stock: 5,
          sellingPrice: 129900,
          costPrice: 110000,
          sku: "XPS13-I7-16-512",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      category: "Electronics",
      subcategory: "Smartphones",
      distributor: "Samsung Electronics",
      icon: "📱",
      dailyAvgSales: 8,
      variants: [
        {
          id: 401,
          name: "256GB Phantom Black",
          stock: 15,
          sellingPrice: 89900,
          costPrice: 75000,
          sku: "S24-256-PB",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 5,
      name: "HP Spectre x360",
      category: "Electronics",
      subcategory: "Laptops",
      distributor: "HP",
      icon: "💻",
      dailyAvgSales: 5,
      variants: [
        {
          id: 501,
          name: "i7 16GB 1TB",
          stock: 7,
          sellingPrice: 159900,
          costPrice: 140000,
          sku: "HPSX360-I7-16-1TB",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 6,
      name: "Google Pixel 8",
      category: "Electronics",
      subcategory: "Smartphones",
      distributor: "Google",
      icon: "📱",
      dailyAvgSales: 9,
      variants: [
        {
          id: 601,
          name: "128GB Obsidian",
          stock: 10,
          sellingPrice: 79900,
          costPrice: 70000,
          sku: "PIX8-128-OB",
          expiry: "N/A"
        }
      ]
    },
    // Clothing
    {
      id: 7,
      name: "Premium Cotton T-Shirt",
      category: "Clothing",
      subcategory: "Casual Wear",
      distributor: "Fashion Co.",
      icon: "👕",
      dailyAvgSales: 15,
      variants: [
        {
          id: 701,
          name: "Size M Navy Blue",
          stock: 25,
          sellingPrice: 1299,
          costPrice: 800,
          sku: "TCT-M-NB",
          expiry: "N/A"
        },
        {
          id: 702,
          name: "Size L White",
          stock: 2,
          sellingPrice: 1299,
          costPrice: 800,
          sku: "TCT-L-WH",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 8,
      name: "Denim Jeans",
      category: "Clothing",
      subcategory: "Casual Wear",
      distributor: "Denim World",
      icon: "👖",
      dailyAvgSales: 10,
      variants: [
        {
          id: 801,
          name: "32 Regular",
          stock: 12,
          sellingPrice: 1999,
          costPrice: 1200,
          sku: "DJ-32R",
          expiry: "N/A"
        }
      ]
    },
    {
      id: 9,
      name: "Slim Fit Blazer",
      category: "Clothing",
      subcategory: "Formal Wear",
      distributor: "Blazer House",
      icon: "🧥",
      dailyAvgSales: 4,
      variants: [
        {
          id: 901,
          name: "Size 40 Black",
          stock: 4,
          sellingPrice: 4999,
          costPrice: 3500,
          sku: "SFB-40-BK",
          expiry: "N/A"
        }
      ]
    },
    // Groceries
    {
      id: 10,
      name: "Organic Basmati Rice",
      category: "Groceries",
      subcategory: "Grains & Cereals",
      distributor: "Organic Farms Ltd.",
      icon: "🍚",
      dailyAvgSales: 20,
      variants: [
        {
          id: 1001,
          name: "5KG Premium Quality",
          stock: 15,
          sellingPrice: 899,
          costPrice: 650,
          sku: "OBR-5KG-P",
          expiry: "2025-12-31"
        }
      ]
    },
    {
      id: 11,
      name: "Fresh Apples",
      category: "Groceries",
      subcategory: "Fruits & Vegetables",
      distributor: "Fruit Mart",
      icon: "🍎",
      dailyAvgSales: 25,
      variants: [
        {
          id: 1101,
          name: "1KG Pack",
          stock: 20,
          sellingPrice: 199,
          costPrice: 120,
          sku: "FA-1KG",
          expiry: "2024-09-01"
        }
      ]
    },
    {
      id: 12,
      name: "Organic Milk",
      category: "Groceries",
      subcategory: "Dairy",
      distributor: "Dairy Best",
      icon: "🥛",
      dailyAvgSales: 18,
      variants: [
        {
          id: 1201,
          name: "1L Tetra Pack",
          stock: 30,
          sellingPrice: 79,
          costPrice: 60,
          sku: "OM-1L",
          expiry: "2024-06-30"
        }
      ]
    }
    // Add more as needed for other categories/subcategories
  ];

  const [productData, setProductData] = useState(mockProducts);

  // --- ORDER QUANTITIES ---
  useEffect(() => {
    const initialQuantities = {};
    productData.forEach(product => {
      product.variants.forEach(variant => {
        initialQuantities[`${product.id}-${variant.id}`] = {
          quantity: 0,
          unit: "box"
        };
      });
    });
    setOrderQuantities(initialQuantities);
  }, [productData]);

  // --- UTILITY FUNCTIONS ---
  const updateUnit = (productId, variantId, unit) => {
    const key = `${productId}-${variantId}`;
    setOrderQuantities(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        unit
      }
    }));
  };

  const addToCart = (product) => {
    const newItems = product.variants.map(variant => {
      const key = `${product.id}-${variant.id}`;
      const quantity = orderQuantities[key]?.quantity || 0;
      if (quantity > 0) {
        return {
          id: key,
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          productIcon: product.icon,
          variantName: variant.name,
          price: variant.sellingPrice,
          quantity,
          unit: orderQuantities[key]?.unit || "box",
          totalPrice: variant.sellingPrice * quantity
        };
      }
      return null;
    }).filter(Boolean);

    if (newItems.length === 0) {
      alert("Please select quantity for at least one variant");
      return;
    }

    setCartItems(prev => [...prev, ...newItems]);

    // Reset quantities for this product's variants
    const resetQuantities = {};
    product.variants.forEach(variant => {
      const key = `${product.id}-${variant.id}`;
      resetQuantities[key] = {
        ...orderQuantities[key],
        quantity: 0
      };
    });

    setOrderQuantities(prev => ({
      ...prev,
      ...resetQuantities
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toLocaleString();
  };

// First, add this helper function inside your component
const hasAnyQuantities = () => {
  return Object.values(orderQuantities).some(item => item.quantity > 0);
};

// Add this function to handle adding all items
const addAllToCart = () => {
  const itemsToAdd = [];
  
  currentProducts.forEach(product => {
    product.variants.forEach(variant => {
      const key = `${product.id}-${variant.id}`;
      const quantity = orderQuantities[key]?.quantity || 0;
      if (quantity > 0) {
        itemsToAdd.push({
          id: key,
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          productIcon: product.icon,
          variantName: variant.name,
          price: variant.sellingPrice,
          quantity,
          unit: orderQuantities[key]?.unit || "box",
          totalPrice: variant.sellingPrice * quantity
        });
      }
    });
  });

  if (itemsToAdd.length === 0) {
    alert("Please select quantity for at least one item");
    return;
  }

  setCartItems(prev => [...prev, ...itemsToAdd]);
  
  // Reset all quantities
  const resetQuantities = {};
  Object.keys(orderQuantities).forEach(key => {
    resetQuantities[key] = {
      ...orderQuantities[key],
      quantity: 0
    };
  });
  
  setOrderQuantities(resetQuantities);
};

// Add this JSX right before the closing </div> of the main container
// (before the Cart Sidebar)
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unit: item.unit
        })),
        total: parseFloat(getCartTotal().replace(/,/g, ''))
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCartItems([]);
      setShowCart(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SEARCH ---
  const performGlobalSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowGlobalSearch(false);
      return;
    }
    const results = [];
    const queryLower = query.toLowerCase();
    productData.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower)) {
        results.push({ ...product, matchType: 'product' });
      } else if (product.distributor.toLowerCase().includes(queryLower)) {
        results.push({ ...product, matchType: 'distributor' });
      } else {
        const matchingVariants = product.variants.filter(variant =>
          variant.name.toLowerCase().includes(queryLower)
        );
        if (matchingVariants.length > 0) {
          results.push({ ...product, matchType: 'variant', matchingVariants });
        }
      }
    });
    setSearchResults(results);
    setShowGlobalSearch(results.length > 0);
  };

  // --- VOICE SEARCH ---
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        performGlobalSearch(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };
  const stopVoiceSearch = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const navigateToProduct = (product) => {
    setActiveCategory(product.category);
    setActiveSubcategory(product.subcategory);
    setShowGlobalSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, (match) => `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`),
        }}
      />
    );
  };

  const getStockStatus = (variants) => {
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const hasOutOfStock = variants.some(v => v.stock === 0);
    const hasLowStock = variants.some(v => v.stock > 0 && v.stock <= 5);
    if (totalStock === 0) return { status: 'out', color: 'red', text: 'Out of Stock' };
    if (hasOutOfStock || hasLowStock) return { status: 'low', color: 'yellow', text: 'Low Stock' };
    return { status: 'good', color: 'green', text: 'In Stock' };
  };

  const getPriceRange = (variants) => {
    const prices = variants.map(v => v.sellingPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₹${min.toLocaleString()}` : `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const updateQuantity = (productId, variantId, value) => {
    const key = `${productId}-${variantId}`;
    setOrderQuantities(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity: Math.max(0, value)
      }
    }));
  };

  // --- CATEGORY/SUBCATEGORY LOGIC ---
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveSubcategory(null); // Reset subcategory when changing category
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  // --- PRODUCT FILTERING ---
  const getCurrentProducts = () => {
    let products;
    if (viewMode === "categories") {
      products = productData.filter(p =>
        p.category === activeCategory &&
        (!activeSubcategory || p.subcategory === activeSubcategory)
      );
    } else {
      // Group by distributors
      const distributorProducts = {};
      productData.forEach(product => {
        if (!distributorProducts[product.distributor]) {
          distributorProducts[product.distributor] = [];
        }
        distributorProducts[product.distributor].push(product);
      });
      products = distributorProducts[activeCategory] || [];
    }
    // Apply filters
    return products.filter(product => {
      if (filterType === "low-stock") {
        return product.variants.some(v => v.stock > 0 && v.stock <= 5);
      } else if (filterType === "out-of-stock") {
        return product.variants.some(v => v.stock === 0);
      }
      return true;
    }).sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'stock':
          aVal = a.variants.reduce((sum, v) => sum + v.stock, 0);
          bVal = b.variants.reduce((sum, v) => sum + v.stock, 0);
          break;
        case 'price':
          aVal = Math.min(...a.variants.map(v => v.sellingPrice));
          bVal = Math.min(...b.variants.map(v => v.sellingPrice));
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  };

  const currentProducts = getCurrentProducts();

  // --- DISTRIBUTOR MODAL LOGIC ---
  const allDistributors = [...new Set(productData.map(p => p.distributor))];
  const filteredDistributors = allDistributors.filter(d =>
    d.toLowerCase().includes(distributorSearch.toLowerCase())
  );
  const modalProducts = modalDistributor
    ? productData.filter(p => p.distributor === modalDistributor)
    : [];

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg">
        <div className="px-3 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Inventory Title, Address, Product Count */}
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Inventory
              </h1>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentProducts.length} products
              </span>
            </div>
            
            <div className="mt-1 text-white text-sm sm:text-base opacity-90">
              123, Main Bazaar Road, Connaught Place, New Delhi, 110001
            </div>
          </div>
          {/* Center: Search Bar */}
          <div className="w-full sm:w-96 mt-4 sm:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, distributors, variants..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  performGlobalSearch(e.target.value);
                }}
                className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {/* Voice Search Button */}
              <button
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              {/* Global Search Results */}
              {showGlobalSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map(product => (
                    <div
                      key={`search-${product.id}`}
                      onClick={() => navigateToProduct(product)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{product.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {highlightText(product.name, searchQuery)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {highlightText(product.distributor, searchQuery)} • {product.category} → {product.subcategory}
                          </p>
                          {product.matchType === 'variant' && (
                            <p className="text-xs text-blue-600">
                              Variants: {product.matchingVariants.map(v => v.name).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Right: Select Distributor Button */}
          <div className="w-full sm:w-auto flex flex-row sm:flex-row gap-2 mt-4 sm:mt-0 items-center">
            <button
              onClick={() => {
                setShowDistributorModal(true);
                setDistributorSearch("");
                setModalDistributor(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
            >
              <Building2 className="w-5 h-5" />
              Select Distributor
            </button>
             {/* Stock Filter Buttons - show on right of distributor button on mobile */}
            <div className="flex-1 flex gap-2 sm:hidden">
              <button
                onClick={() => setFilterType("all")}
                className={`w-full px-0 py-2 rounded font-medium text-sm transition-colors ${
                  filterType === "all"
                    ? "bg-sky-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilterType("low-stock")}
                className={`w-full px-0 py-2 rounded font-medium text-sm transition-colors ${
                  filterType === "low-stock"
                    ? "bg-yellow-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilterType("out-of-stock")}
                className={`w-full px-0 py-2 rounded font-medium text-sm transition-colors ${
                  filterType === "out-of-stock"
                    ? "bg-red-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="relative z-30 y-auto">
        <div className="w-full flex items-stretch relative bg-white border-b shadow-sm">
          {/* Tabs */}
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide flex-1 relative z-10 y-auto">
            {Object.keys(categoryStructure).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveSubcategory(null);
                  setViewMode("categories");
                }}
                className={`relative px-6 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors
                  ${activeCategory === cat
                    ? "bg-black-600 text-white shadow-lg rounded-t-md rounded-b-none z-20"
                    : "text-gray-700 hover:text-sky-700"}
                  `}
                style={{
                  outline: "none",
                  border: "none",
                  background: activeCategory === cat ? "linear-gradient(90deg, #0096FF 0%, #0F52BA 100%)" : "transparent",
                  zIndex: activeCategory === cat ? 20 : 10,
                  marginTop: activeCategory === cat ? "-6px" : "0",
                  marginBottom: activeCategory === cat ? "-3px" : "0"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Stock Filter Buttons */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 flex-shrink-0 bg-white border-l relative z-10">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterType === "all"
                  ? "bg-sky-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-sky-100"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("low-stock")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterType === "low-stock"
                  ? "bg-yellow-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                  
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType("out-of-stock")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterType === "out-of-stock"
                  ? "bg-red-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-sky-100"
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
        {/* Blue highlight covers below the selected tab */}
        <div
          className="w-full transition-all duration-300"
          style={{
            background: "#F0FFFF",
            minHeight: "0rem",
            height: "0rem"
          }}
        />
      </div>

      {/* Main Content: Subcategories + Products */}
      <div
        className="flex w-full px-0 sm:px-6 py-4 sm:py-8 gap-2 sm:gap-6"
        style={{
          background: activeCategory ? "##F0FFFF" : undefined,
          transition: "background 0.3s"
        }}
      >
        {/* Subcategory Area */}
        <div
          className="flex-shrink-0"
          style={{
            width: "140px",
            minWidth: "100px",
            maxWidth: "180px"
          }}
        >
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-4 sticky top-[120px] mb-4">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Subcategories</h3>
            <div className="flex flex-col gap-2">
              {Object.keys(categoryStructure[activeCategory] || {}).map(subcat => (
                <button
                  key={subcat}
                  onClick={() => handleSubcategoryClick(subcat)}
                  className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeSubcategory === subcat
                      ? "bg-blue-900 text-white border-blue-700 shadow"
                      : "bg-blue-50 text-blue-900 border-blue-100 hover:bg-blue-100"
                  }`}
                  style={{
                    fontWeight: activeSubcategory === subcat ? 700 : 500,
                    fontSize: "1rem"
                  }}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Product Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-4 sticky top-[120px] mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">Product</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">Distributor</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">Price Range</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900 hidden lg:table-cell">Daily Avg Sales</th>
                    <th className="text-right p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="bg-white rounded-xl shadow-sm border-2 border-blue-100 p-8 text-center text-gray-400 w-full">
                        No products found for this category/subcategory.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map(product => {
                      const stockInfo = getStockStatus(product.variants);
                      const isHovered = hoveredProduct === product.id;
                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                          onMouseEnter={() => setHoveredProduct(product.id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                        >
                          <td className="p-2 sm:p-4">
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                  {product.icon}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
                                    {product.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 sm:hidden">{product.distributor}</p>
                                  <p className="text-xs text-gray-400">{product.variants.length} variants</p>
                                </div>
                              </div>
                              {/* Variants section - shows on hover */}
                              {isHovered && (
                                <div className="mt-2 sm:mt-3 bg-gray-50 p-2 sm:p-4 rounded-xl border shadow-sm">
                                  <div className="space-y-2">
                                    <table className="w-full text-xs sm:text-sm">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-500">Variant</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-right text-xs font-medium text-gray-500">Stock</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-right text-xs font-medium text-gray-500">Cost Price</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-right text-xs font-medium text-gray-500">Selling Price</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-right text-xs font-medium text-gray-500">Expiry</th>
                                          <th className="px-2 py-1 sm:px-3 sm:py-2 text-center text-xs font-medium text-gray-500">Order</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {product.variants.map(variant => (
                                          <tr key={variant.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1 sm:px-3 sm:py-2">
                                              <span className="text-xs font-medium text-gray-900">{variant.name}</span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2">
                                              <span className="text-xs text-gray-500">{variant.sku}</span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">
                                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                variant.stock === 0 ? 'bg-red-100 text-red-700' :
                                                variant.stock <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                              }`}>
                                                {variant.stock} units
                                              </span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">
                                              <span className="text-xs text-gray-900">₹{variant.costPrice.toLocaleString()}</span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">
                                              <span className="text-xs text-gray-900">₹{variant.sellingPrice.toLocaleString()}</span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">
                                              <span className="text-xs text-gray-500">{variant.expiry === "N/A" ? "-" : new Date(variant.expiry).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-2 py-1 sm:px-3 sm:py-2">
                                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                <div className="flex items-center">
                                                  <button
                                                    onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) - 1)}
                                                    disabled={variant.stock === 0}
                                                    className="p-1 rounded-l bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                  >
                                                    <Minus className="w-3 h-3" />
                                                  </button>
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max={variant.stock}
                                                    value={orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0}
                                                    onChange={(e) => updateQuantity(product.id, variant.id, parseInt(e.target.value) || 0)}
                                                    disabled={variant.stock === 0}
                                                    className="w-10 sm:w-12 px-1 py-1 text-center text-xs border-t border-b"
                                                  />
                                                  <button
                                                    onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) + 1)}
                                                    disabled={variant.stock === 0}
                                                    className="p-1 rounded-r bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                  >
                                                    <Plus className="w-3 h-3" />
                                                  </button>
                                                  <select
                                                    value={orderQuantities[`${product.id}-${variant.id}`]?.unit || "box"}
                                                    onChange={(e) => updateUnit(product.id, variant.id, e.target.value)}
                                                    disabled={variant.stock === 0}
                                                    className="ml-1 sm:ml-2 text-xs border rounded px-2 py-1"
                                                  >
                                                    <option value="box">Box</option>
                                                    <option value="piece">Piece</option>
                                                    <option value="pack">Pack</option>
                                                  </select>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="mt-2 sm:mt-4 flex justify-end">
                                    <button
                                      onClick={() => addToCart(product)}
                                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                                    >
                                      Add Selected to Cart
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2 sm:p-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                            {product.distributor}
                          </td>
                          <td className="p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">
                            {getPriceRange(product.variants)}
                          </td>
                          <td className="p-2 sm:p-4 hidden lg:table-cell">
                            <div className="flex items-center">
                              <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                                {product.dailyAvgSales} /day
                              </span>
                            </div>
                          </td>
                          <td className="p-2 sm:p-4 text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              stockInfo.status === 'good' ? 'bg-green-100 text-green-800' :
                              stockInfo.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {stockInfo.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add All to Cart Button */}
      <div className="fixed bottom-4 right-2 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={addAllToCart}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Add All to Cart</span>
          <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
            {Object.values(orderQuantities).reduce((sum, item) => sum + (item.quantity || 0), 0)}
          </span>
        </button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl border-l z-50">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {item.productIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-xs text-gray-500">{item.variantName}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs">
                            {item.quantity} {item.unit}(s) × ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium">₹{item.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-lg font-semibold">₹{getCartTotal()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Distributor Modal */}
      {showDistributorModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-700"
              onClick={() => {
                setShowDistributorModal(false);
                setModalDistributor(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Select Distributor</h2>
            {!modalDistributor ? (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search distributors..."
                    value={distributorSearch}
                    onChange={e => setDistributorSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredDistributors.length === 0 && (
                    <div className="text-gray-400 text-center py-4">No distributors found</div>
                  )}
                  {filteredDistributors.map(d => (
                    <button
                      key={d}
                      className="w-full text-left px-4 py-2 rounded hover:bg-blue-100 transition"
                      onClick={() => setModalDistributor(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <button
                    className="mr-2 text-blue-700 hover:underline text-sm"
                    onClick={() => setModalDistributor(null)}
                  >
                    ← Back
                  </button>
                  <span className="font-semibold text-blue-700">{modalDistributor}</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {modalProducts.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No products for this distributor</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left py-2">Product</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Stock</th>
                          <th className="text-center py-2">Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modalProducts.map(product => (
                          product.variants.map(variant => (
                            <tr key={variant.id} className="border-b last:border-b-0">
                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{product.icon}</span>
                                  <span>{product.name} <span className="text-xs text-gray-400">({variant.name})</span></span>
                                </div>
                              </td>
                              <td className="py-2 text-right">₹{variant.sellingPrice.toLocaleString()}</td>
                              <td className="py-2 text-right">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  variant.stock === 0 ? 'bg-red-100 text-red-700' :
                                  variant.stock <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {variant.stock} units
                                </span>
                              </td>
                              <td className="py-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) - 1)}
                                    disabled={variant.stock === 0}
                                    className="p-1 rounded-l bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    max={variant.stock}
                                    value={orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0}
                                    onChange={(e) => updateQuantity(product.id, variant.id, parseInt(e.target.value) || 0)}
                                    disabled={variant.stock === 0}
                                    className="w-10 px-1 py-1 text-center text-xs border-t border-b"
                                  />
                                  <button
                                    onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) + 1)}
                                    disabled={variant.stock === 0}
                                    className="p-1 rounded-r bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <select
                                    value={orderQuantities[`${product.id}-${variant.id}`]?.unit || "box"}
                                    onChange={(e) => updateUnit(product.id, variant.id, e.target.value)}
                                    disabled={variant.stock === 0}
                                    className="ml-2 text-xs border rounded px-2 py-1"
                                  >
                                    <option value="box">Box</option>
                                    <option value="piece">Piece</option>
                                    <option value="pack">Pack</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      // Add all selected variants for this distributor to cart
                      const itemsToAdd = [];
                      modalProducts.forEach(product => {
                        product.variants.forEach(variant => {
                          const key = `${product.id}-${variant.id}`;
                          const quantity = orderQuantities[key]?.quantity || 0;
                          if (quantity > 0) {
                            itemsToAdd.push({
                              id: key,
                              productId: product.id,
                              variantId: variant.id,
                              productName: product.name,
                              productIcon: product.icon,
                              variantName: variant.name,
                              price: variant.sellingPrice,
                              quantity,
                              unit: orderQuantities[key]?.unit || "box",
                              totalPrice: variant.sellingPrice * quantity
                            });
                          }
                        });
                      });
                      if (itemsToAdd.length === 0) {
                        alert("Please select quantity for at least one variant");
                        return;
                      }
                      setCartItems(prev => [...prev, ...itemsToAdd]);
                      // Reset quantities for these variants
                      const resetQuantities = {};
                      modalProducts.forEach(product => {
                        product.variants.forEach(variant => {
                          const key = `${product.id}-${variant.id}`;
                          resetQuantities[key] = {
                            ...orderQuantities[key],
                            quantity: 0
                          };
                        });
                      });
                      setOrderQuantities(prev => ({
                        ...prev,
                        ...resetQuantities
                      }));
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Add Selected to Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}