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
  Loader2,
  PlusCircle,
  X,
  Eye,
  ChevronDown,
  ChevronRight,
  Star,
  Building2,
  Tag,
  MicOff
} from "lucide-react";
import API from "../../api"; // Adjust the import path as needed
import { useAuth } from "../../components/AuthContext";
import RetailerCart from "./retailerCart";
import { useLocation } from "react-router-dom";

export default function Shelf() {
  // --- STATE ---
  const { user } = useAuth();
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productData, setProductData] = useState([]);
  const [categoryStructure, setCategoryStructure] = useState({});
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
  const [inventoryArr, setInventoryArr] = useState([]); 
  const [selectedDistributors, setSelectedDistributors] = useState({});

  // Distributor modal state
  const [showDistributorModal, setShowDistributorModal] = useState(false);
  const [distributorSearch, setDistributorSearch] = useState("");
  const [modalDistributor, setModalDistributor] = useState(null);

  // New state for new products
  const [newProducts, setNewProducts] = useState([]);
  const [selectedNewVariants, setSelectedNewVariants] = useState({});
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);

  // State for inventory variants

  const [inventoryStockMap, setInventoryStockMap] = useState({});

  const recognitionRef = useRef(null);

  // --- SAMPLE PRODUCT DATA ---


  // --- FETCH PRODUCTS FROM BACKEND AND BUILD CATEGORY STRUCTURE ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products from connected distributors
        const response = await API.get('/products/connected-distributors');
        const products = response.data.products || [];
        setProductData(products);

        // Build category structure dynamically
        const structure = {};
        products.forEach(product => {
          const category = product.category || "Other";
          const subcategory = product.subcategory || "General";
          if (!structure[category]) structure[category] = {};
          if (!structure[category][subcategory]) structure[category][subcategory] = [];
          structure[category][subcategory].push(product.name);
        });
        setCategoryStructure(structure);

        // Set default active category and subcategory
        const firstCategory = Object.keys(structure)[0] || null;
        setActiveCategory(firstCategory);
        setActiveSubcategory(firstCategory ? Object.keys(structure[firstCategory])[0] : null);

      } catch (error) {
        setProductData([]);
        setCategoryStructure({});
      }
      setIsLoading(false);
    };
    fetchProducts();
    // eslint-disable-next-line
  }, []);

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
  
     useEffect(() => {
    // Only run if inventoryArr or productData are loaded
    if (inventoryArr.length === 0 && productData.length === 0) return;
  
    const fetchCart = async () => {
      try {
        // 1. Fetch from backend
        const res = await API.get('/cart');
        let backendCart = Array.isArray(res.data) ? res.data : [];
              // 3. Enrich cart items with product/variant info
        const enrichedCart = backendCart.map(item => {

          // Find product in inventoryArr or productData
          const product =
            productData.find(p => String(p.id) === String(item.productId))
          if (!product) return item;
          console.log("Found product:", product);
          // Find variant by id or _id
          const variant =
            product.variants.find(
              v => String(v.id) === String(item.variantId) || String(v._id) === String(item.variantId)
            );
          if (!variant) return item;
  
          return {
            ...item,
            id: `${product.id}-${variant.id || variant._id}`,
            productName: product.name,
            productIcon: product.icon,
            variantName: variant.name || "",
            price: variant.sellingPrice || 0,
            totalPrice: (variant.sellingPrice || 0) * (item.quantity || 1),
            distributor: product.distributor || "Unknown Distributor",
            sku: variant.sku || "",
            distributorId: product.distributorId || item.distributorId,
            distributorName: product.distributor || "Unknown Distributor"
          };
        });
        console.log("Enriched cart items:", enrichedCart);
  
        setCartItems(enrichedCart);
      } catch (error) {
        setCartItems([]);
      }
      setProductsLoaded(true);
    };
  
    fetchCart();
    // eslint-disable-next-line
  }, [inventoryArr, productData]);
  
    useEffect(() => {
    if (productsLoaded) {
      API.post('/cart/save', { cartItems });
    }
  }, [cartItems, productsLoaded]);
  
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
        sku: variant.sku || "",
        variantName: variant.name,
        price: variant.sellingPrice,
        quantity,
        unit: orderQuantities[key]?.unit || "box",
        totalPrice: variant.sellingPrice * quantity,
        distributorId: product.distributorId,
        distributor: product.distributor || "Unknown Distributor",
        distributorName: product.distributor || "Unknown Distributor"
      };
    }
    return null;
  }).filter(Boolean);

  if (newItems.length === 0) {
    alert("Please select quantity for at least one variant");
    return;
  }

  setCartItems(prevCart => {
    const updatedCart = [...prevCart];

    newItems.forEach(newItem => {
      const existingIndex = updatedCart.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex !== -1) {
        const existingItem = updatedCart[existingIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        updatedCart[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: newQuantity * existingItem.price,
        };
      } else {
        updatedCart.push(newItem);
      }
    });

    return updatedCart;
  });

  // Reset input quantities
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
          distributorId: product.distributorId,
          sku: variant.sku || "",
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          productIcon: product.icon,
          variantName: variant.name,
          price: variant.sellingPrice,
          quantity,
          unit: orderQuantities[key]?.unit || "box",
          totalPrice: variant.sellingPrice * quantity,
          distributor: product.distributor || "Unknown Distributor",
          distributorName: product.distributor || "Unknown Distributor"
        });
      }
    });
  });

  if (itemsToAdd.length === 0) {
    alert("Please select quantity for at least one item");
    return;
  }

  setCartItems(prevCart => {
    const updatedCart = [...prevCart];

    itemsToAdd.forEach(newItem => {
      const existingIndex = updatedCart.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex !== -1) {
        const existingItem = updatedCart[existingIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        updatedCart[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: newQuantity * existingItem.price,
        };
      } else {
        updatedCart.push(newItem);
      }
    });

    return updatedCart;
  });

  // Reset all selected quantities
  const resetQuantities = {};
  Object.keys(orderQuantities).forEach(key => {
    resetQuantities[key] = { ...orderQuantities[key], quantity: 0 };
  });

  setOrderQuantities(prev => ({
    ...prev,
    ...resetQuantities
  }));
};


// Add this JSX right before the closing </div> of the main container
// (before the Cart Sidebar)
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const selectedItems = getSelectedCartItems();
      // Group by distributor
      const distributorGroups = {};
      selectedItems.forEach(item => {
        const distributor = item.distributorId; // Only use the ID!
        if (!distributorGroups[distributor]) distributorGroups[distributor] = [];
        distributorGroups[distributor].push(item);
      });
      console.log("Placing order payload:", { distributorGroups });

      // Place an order for each distributor
      for (const [distributorId, items] of Object.entries(distributorGroups)) {
        await API.post('/orders/create', {
          distributorId,
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            sku: item.sku,
            quantity: item.quantity,
            unit: item.unit
          }))
        });
      }

      setCartItems([]);
      setShowCart(false);
      alert('Order(s) placed successfully!');
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
    console.log("Navigating to product:", product);
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
      products = inventoryArr.filter(p =>
        p.category === activeCategory &&
        (!activeSubcategory || p.subcategory === activeSubcategory)
      );
    } else {
      // Group by distributors
      const distributorProducts = {};
      inventoryArr.forEach(product => {
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
  const allDistributors = [...new Set(productData.map(p => p.distributorId).filter(Boolean))];
  const filteredDistributors = allDistributors.filter(d =>
    d.toLowerCase().includes(distributorSearch.toLowerCase())
  );

  // Fetch products for the selected distributor (from Products model)
  const [modalProducts, setModalProducts] = useState([]);
  const fetchDistributorProducts = async (distributorId) => {
    setIsLoading(true);
    try {
      const res = await API.get(`/products/get?distributorId=${distributorId}`);
      setModalProducts(res.data || []);
    } catch {
      setModalProducts([]);
    }
    setIsLoading(false);
  };

  // When modalDistributor changes, fetch products
  useEffect(() => {
    if (modalDistributor) fetchDistributorProducts(modalDistributor);
  }, [modalDistributor]);

  // Cache for distributor products
  const [distributorProductsCache, setDistributorProductsCache] = useState({});

  // Fetch products for the selected distributor (from Products model)
  useEffect(() => {
    if (!modalDistributor) return;

    // If already cached, use cache
    if (distributorProductsCache[modalDistributor]) {
      setModalProducts(distributorProductsCache[modalDistributor]);
      return;
    }
    // Otherwise, fetch and cache
    setIsLoading(true);
    API.get(`/products/get?distributorId=${modalDistributor}`)
      .then(res => {
        const products = res.data || [];
        setModalProducts(products);
        setDistributorProductsCache(prev => ({
          ...prev,
          [modalDistributor]: products
        }));
      })
      .catch(() => setModalProducts([]))
      .finally(() => setIsLoading(false));
  }, [modalDistributor]);

  const updateCartItemQuantity = (itemId, newQuantity) => {
  setCartItems(prev =>
    prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    )
  );
};

  // Fetch inventory variant IDs for quick lookup
  const fetchInventoryVariantIds = async () => {
    try {
      const res = await API.get('/inventory');
      const arr = Array.isArray(res.data) ? res.data : (res.data.inventory || []);
      setInventoryArr(arr);
     

      // Build category structure from inventoryArr
      const structure = {};
      arr.forEach(product => {
        const category = product.category || "Other";
        const subcategory = product.subcategory || "General";
        if (!structure[category]) structure[category] = {};
        if (!structure[category][subcategory]) structure[category][subcategory] = [];
        structure[category][subcategory].push(product.name);
      });
      setCategoryStructure(structure);

      // Set default active category and subcategory if not set
      const firstCategory = Object.keys(structure)[0] || null;
      setActiveCategory(firstCategory);
      setActiveSubcategory(firstCategory ? Object.keys(structure[firstCategory])[0] : null);

      // Build stock map
      const stockMap = {};
      arr.forEach(item => {
        item.variants.forEach(variant => {
          stockMap[variant._id] = variant.stock || 0;
        });
      });
      setInventoryStockMap(stockMap);
    } catch {
      setInventoryArr([]);
      setCategoryStructure({});
      setInventoryStockMap({});
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchInventoryVariantIds();
  }, []);

  const handleAddVariantToInventory = async (variantId) => {
    setIsAddingToInventory(true);
    try {
      await API.post("/inventory/add", { variantId });
      await fetchInventoryVariantIds(); // <-- ensure this is awaited
      alert("Variant added to your inventory!");
    } catch {
      alert("Failed to add variant to inventory.");
    }
    setIsAddingToInventory(false);
  };

  // Distributor information state
  const [distributorInfo, setDistributorInfo] = useState({}); // { distributorId: { companyName, ... } }

  useEffect(() => {
    if (productData.length === 0) return;
    const uniqueIds = [...new Set(productData.map(p => p.distributorId).filter(Boolean))];
    if (uniqueIds.length === 0) return;

    API.post('/distributors/batch', { ids: uniqueIds })
      .then(res => {
        const infoMap = {};
        (res.data.distributors || []).forEach(d => {
          infoMap[d._id] = d;
        });
        setDistributorInfo(infoMap);
      })
      .catch(() => setDistributorInfo({}));
  }, [productData]);

  // New function to group cart items by distributor
  const groupCartByDistributor = () => {
    const groups = {};
    cartItems.forEach(item => {
      const distributorId = item.distributorId;
      if (!distributorId) {
        console.warn('Cart item missing distributorId:', item);
        return;
      }
      if (!groups[distributorId]) groups[distributorId] = [];
      groups[distributorId].push(item);
    });
    return groups;
  };

  const getSelectedCartItems = () => {
    const groups = groupCartByDistributor();
    let selected = [];
    Object.entries(groups).forEach(([distributor, items]) => {
      if (selectedDistributors[distributor] !== false) {
        selected = selected.concat(items);
      }
    });
    return selected;
  };

  const location = useLocation();

  useEffect(() => {
    setShowDistributorModal(false);
    setModalDistributor(null);
  }, [location.pathname]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
<div className="top-0 z-50 bg-white font-eudoxus">
  <div className="px-3 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    
    {/* Left: Inventory Title, Address, Product Count */}
    <div className="flex-1">
      <div className="flex items-center gap-4 flex-wrap md:pl-16 md:pt-4 ">
        <h2 className="text-4xl md:text-5xl font-bold md:leading-tight mb-2 tracking-tight text-between">
              <span className="bg-black bg-clip-text text-transparent font-eudoxus">
                Your Own
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus pl-2">
                 Inventory
              </span>

        </h2>
        <span className="bg-gray-100 text-gray-800 px-3 rounded-full text-sm font-semibold shadow-sm">
          {currentProducts.length} products
        </span>
      </div>
      {/* <div className="text-xl text-gray-600 mb-4  text-left pl-16 mb-4 font-eudoxus w-full pr-16">
              123, Main Bazaar Road, Connaught Place, New Delhi, 110001
      </div> */}
     
    </div>

    {/* Center: Search Bar */}
    <div className="w-full sm:w-96 mt-4 sm:mt-0 md:pb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products, distributors, variants..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            performGlobalSearch(e.target.value);
          }}
          className="w-full pl-10 md:pr-16 md:py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Voice Search Button */}
        <button
          onClick={isListening ? stopVoiceSearch : startVoiceSearch}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${
            isListening
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Global Search Results */}
        {showGlobalSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
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

    {/* Right: Cart Button */}
    <div className="w-full sm:w-auto flex flex-row sm:flex-row gap-2 mt-4 sm:mt-0 items-center">
      <button
        onClick={() => setShowCart(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:inline">Cart</span>
        <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {cartItems.length}
        </span>
      </button>
      <button
        onClick={() => {
          setShowDistributorModal(true);
          setDistributorSearch("");
          setModalDistributor(null);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-full shadow hover:bg-gray-900 transition md:py-4"
      >
        <Building2 className="w-5 h-5" />
        Select Distributor
      </button>

      {/* Stock Filter Buttons (mobile only) */}
      <div className="flex-1 flex gap-2 sm:hidden">
        {[
          { key: "all", label: "All Items", color: "bg-sky-500" },
          { key: "low-stock", label: "Low Stock", color: "bg-yellow-500" },
          { key: "out-of-stock", label: "Out of Stock", color: "bg-red-500" }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`w-full px-0 py-2 rounded-full font-medium text-sm transition-colors ${
              filterType === key
                ? `${color} text-white shadow`
                : "bg-gray-100 text-gray-700 hover:bg-sky-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>


      {/* Category Tabs Bar */}
      <div className="relative z-30 y-auto  w-full">
        <div className="w-full flex items-stretch relative bg-white md:pl-16 md:pr-16 ">
          {/* Tabs */}
          <div className="flex overflow-x-auto w-full overflow-y-hidden scrollbar-hide flex-1 relative z-10 y-auto bg-white ">
            {Object.keys(categoryStructure).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveSubcategory(null);
                  setViewMode("categories");
                }}
                className={`relative px-6 py-4 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors
                  ${activeCategory === cat
                    ? "bg-black text-white shadow-lg rounded-full"
                    : "text-gray-700 hover:text-black"}
                  `}
                style={{
                  outline: "none",
                  border: "none",
                  background: activeCategory === cat ? "black" : "transparent",
                  
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
              className={`px-3 py-3 rounded-full font-medium transition-colors ${
                filterType === "all"
                  ? "bg-blue-700 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-sky-100"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("low-stock")}
              className={`px-3 py-3 rounded-full font-medium transition-colors ${
                filterType === "low-stock"
                  ? "bg-yellow-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                  
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType("out-of-stock")}
              className={`px-3 py-3 rounded-full font-medium transition-colors ${
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

      {/* Main Content: Subcategories + Products */}
      <div
        className="flex w-full px-0 sm:px-6 py-4 sm:py-8 gap-2 sm:gap-6 rounded-3xl"
        style={{
          background: activeCategory ? "#FFFFFF" : undefined,
          transition: "background 0.3s"
        }}
      >
        {/* Subcategory Area */}
        <div
          className="flex-shrink-0 md:pl-8"
          style={{
            width: "220px",
            minWidth: "100px",
            maxWidth: "220px"
          }}
        >
          <div className="bg-white rounded-3xl shadow-sm border-2 p-4 sticky top-[120px] mb-4">
            <div className="flex flex-col gap-2">
              {Object.keys(categoryStructure[activeCategory] || {}).map(subcat => (
                <button
                  key={subcat}
                  onClick={() => handleSubcategoryClick(subcat)}
                  className={`font-eudoxus  px-3 py-2 rounded-full gap-2 font-medium transition-colors ${
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
        <div className="flex-1 min-w-0  md:pr-16 ">
          <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-200 p-4 sticky top-[120px] mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-800 rounded-3xl">
                  <tr>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-white rounded-tl-3xl">Product</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-white hidden sm:table-cell">Distributor</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-white">Price Range</th>
                    <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-white hidden lg:table-cell">Daily Avg Sales</th>
                    <th className="text-right p-2 sm:p-4 text-xs sm:text-sm font-semibold text-white rounded-tr-3xl">Stock Status</th>
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
                    const stockInfo = getStockStatus(product.variants, product.id); // Pass product.id
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
                                        {product.variants.map(variant => {
                                       // Check if this specific variant is in cart
                                        const cartItem = cartItems.find(item => 
                                        String(item.productId) === String(product.id) && 
                                       (String(item.variantId) === String(variant.id) || String(item.variantId) === String(variant._id))
                                       );
  
                                       return (
                                        <tr key={variant.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-1 sm:px-3 sm:py-2">
                                        <span className="text-xs font-medium text-gray-900">{variant.name}</span>
                                         </td>
                                         <td className="px-2 py-1 sm:px-3 sm:py-2">
                                              <span className="text-xs text-gray-500">{variant.sku}</span>
                                         </td>
                                          <td className="px-2 py-1 sm:px-3 sm:py-2 text-right">
                                        {cartItem ? (
                                         <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                         In Cart: {cartItem.quantity}
                                        </span>
                                         ) : (
                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                        variant.stock === 0 ? 'bg-red-100 text-red-700' :
                                        variant.stock <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                         }`}>
                                         {variant.stock} units
                                       </span>
                                       )}
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
                                                    
                                                    className="w-10 sm:w-12 px-1 py-1 text-center text-xs border-t border-b"
                                                  />
                                                  <button
                                                    onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) + 1)}
                                                    
                                                    className="p-1 rounded-r bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                  >
                                                    <Plus className="w-3 h-3" />
                                                  </button>
                                                  <select
                                                    value={orderQuantities[`${product.id}-${variant.id}`]?.unit || "box"}
                                                    onChange={(e) => updateUnit(product.id, variant.id, e.target.value)}
                                                    
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
                                          );
                                        })}
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
                           stockInfo.status === 'out' ? 'bg-red-100 text-red-800' :
                           stockInfo.status === 'in-cart' ? 'bg-blue-100 text-blue-800' : // New cart status
                          'bg-gray-100 text-gray-800'
                          }`}>
                          {stockInfo.text}
                          </span>
                           {/* Optional: Show cart details on hover */}
                          {stockInfo.status === 'in-cart' && (
                           <div className="text-xs text-gray-500 mt-1">
                          {stockInfo.cartItems.map(item => (
                              <div key={item.id} className="truncate">
                                {item.variantName}: {item.quantity}
                              </div>
                            ))}
                          </div>
                        )}
                          </td>
                       </tr>
                      );  // Closing the table row  
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
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
        >
        
          <span className="hidden sm:inline">Add All to </span>
          <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
            {Object.values(orderQuantities).reduce((sum, item) => sum + (item.quantity || 0), 0)}
          </span>
        </button>
        <button
          onClick={() => setShowCart(true)}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Cart</span>
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {cartItems.length}
          </span>
        </button>
      </div>

      {/* Cart Component */}
      <RetailerCart 
        showCart={showCart}
        setShowCart={setShowCart}
        cartItems={cartItems}
        groupCartByDistributor={groupCartByDistributor}
        updateCartItemQuantity={updateCartItemQuantity}
        removeFromCart={removeFromCart}
        distributorInfo={distributorInfo}
        onOrderPlaced={(selectedDistributorIds) => {
        fetchInventoryVariantIds();
        setCartItems(prev =>
          prev.filter(item => !selectedDistributorIds.includes(item.distributorId))
        );
      }}
      />

      {/* Distributor Modal */}
{showDistributorModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center w-full">
    <div className="bg-white rounded-3xl shadow-lg w-full h-5/6 max-w-4xl mx-2 flex flex-col">
      {/* Blue Header */}
      <div className="bg-blue-800 text-white rounded-t-3xl p-6 relative flex items-center justify-between">
        <h2 className="text-xl font-bold">Select Distributor</h2>
        <button
          className="text-white hover:text-gray-300"
          onClick={() => {
            setShowDistributorModal(false);
            setModalDistributor(null);
          }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {!modalDistributor ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search distributors..."
                value={distributorSearch}
                onChange={e => setDistributorSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-full border-2 focus:ring focus:ring-gray-300"
              />
            </div>
            <div className="space-y-2">
              {filteredDistributors.length === 0 && (
                <div className="text-gray-400 text-center py-4">No distributors found</div>
              )}
              {filteredDistributors.map(d => (
                <button
                  key={d}
                  className="w-full text-left px-4 py-2 rounded-3xl hover:bg-blue-200 transition"
                  onClick={() => setModalDistributor(d)}
                >
                  {distributorInfo[d]?.companyName || d}
                  {distributorInfo[d]?.ownerName && (
                    <span className="ml-2 text-gray-500 text-xs">
                      ({distributorInfo[d].ownerName})
                    </span>
                  )}
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
                  {modalProducts.map(product =>
                    product.variants.map(variant => {
                      const inInventory = inventoryStockMap[variant._id] !== undefined;
                      return (
                        <tr key={variant._id} className="border-b last:border-b-0">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{product.icon}</span>
                              <span>{product.name} <span className="text-xs text-gray-400">({variant.name})</span></span>
                            </div>
                          </td>
                          <td className="py-2 text-right">₹{variant.sellingPrice?.toLocaleString()}</td>
                          <td className="py-2 text-right">
                            {inInventory ? (
                              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                Stock: {inventoryStockMap[variant._id]}
                              </span>
                            ) : (
                              <button
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                disabled={isAddingToInventory}
                                onClick={() => handleAddVariantToInventory(variant._id)}
                              >
                                {isAddingToInventory ? "Adding..." : "Add"}
                              </button>
                            )}
                          </td>
                          <td className="py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) - 1)}
                                className="p-1 rounded-l bg-gray-100 hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0}
                                onChange={(e) => updateQuantity(product.id, variant.id, parseInt(e.target.value) || 0)}
                                className="w-10 px-1 py-1 text-center text-xs border-t border-b"
                              />
                              <button
                                onClick={() => updateQuantity(product.id, variant.id, (orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0) + 1)}
                                className="p-1 rounded-r bg-gray-100 hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <select
                                value={orderQuantities[`${product.id}-${variant.id}`]?.unit || "box"}
                                onChange={(e) => updateUnit(product.id, variant.id, e.target.value)}
                                className="ml-2 text-xs border rounded px-2 py-1"
                              >
                                <option value="box">Box</option>
                                <option value="piece">Piece</option>
                                <option value="pack">Pack</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            // Add all selected variants to cart
            const itemsToAdd = [];
            modalProducts.forEach(product => {
              product.variants.forEach(variant => {
                const key = `${product.id}-${variant.id}`;
                const quantity = orderQuantities[key]?.quantity || 0;
                if (quantity > 0) {
                  // Robustly assign distributorId
                  const distributorId =
                    product.distributorId ||
                    (productData.find(p => String(p.id) === String(product.id))?.distributorId) ||
                    modalDistributor ||
                    undefined;

                  itemsToAdd.push({
                    id: key,
                    productId: product.id,
                    variantId: variant.id,
                    productName: product.name,
                    productIcon: product.icon,
                    sku: variant.sku,
                    variantName: variant.name,
                    price: variant.sellingPrice,
                    quantity,
                    unit: orderQuantities[key]?.unit || "box",
                    totalPrice: variant.sellingPrice * quantity,
                    distributorId, // <- always set
                    distributor: distributorInfo[distributorId]?.companyName || distributorId,
                    distributorName: distributorInfo[distributorId]?.companyName || distributorId
                  });
                }
              });
            });
            if (itemsToAdd.length === 0) {
              alert("Please select quantity for at least one variant");
              return;
            }
            setCartItems(prevCart => {
    const updatedCart = [...prevCart];

    itemsToAdd.forEach(newItem => {
      const existingIndex = updatedCart.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex !== -1) {
        const existingItem = updatedCart[existingIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        updatedCart[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: newQuantity * existingItem.price,
        };
      } else {
        updatedCart.push(newItem);
      }
    });

    return updatedCart;
  });
            // Reset quantities
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
    </div>
  </div>
)}

    </div>
  );
}