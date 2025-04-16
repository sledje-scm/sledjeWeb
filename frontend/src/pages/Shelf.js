import { useState, useEffect } from "react";
import { Search, Filter, Plus, Minus, Mic, ShoppingCart, X, ChevronRight } from "lucide-react";

export default function Shelf() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showHiddenColumns, setShowHiddenColumns] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, low-stock, out-of-stock
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Electronics");
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolled down more than 20px, hide the header
      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);


  // Initialize order quantities
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
  }, []);

  const categories = [
    "Electronics",
    "Clothing",
    "Home Goods",
    "Groceries",
    "Beauty",
    "Office Supplies"
  ];

  // Sample product data
  const productData = [
    {
      id: 1,
      name: "Smartphone X",
      icon: "📱",
      distributor: "TechGlobal",
      category: "Electronics",
      variants: [
        { id: 1, name: "64GB Black", stock: 15, price: 699, expiry: "N/A", sku: "SMX-64-B" },
        { id: 2, name: "128GB Black", stock: 8, price: 799, expiry: "N/A", sku: "SMX-128-B" },
        { id: 3, name: "64GB White", stock: 2, price: 699, expiry: "N/A", sku: "SMX-64-W" },
        { id: 4, name: "128GB White", stock: 0, price: 799, expiry: "N/A", sku: "SMX-128-W" }
      ]
    },
    {
      id: 2,
      name: "Bluetooth Headphones",
      icon: "🎧",
      distributor: "AudioTech",
      category: "Electronics",
      variants: [
        { id: 1, name: "Black", stock: 25, price: 129, expiry: "N/A", sku: "BH-BLK" },
        { id: 2, name: "White", stock: 18, price: 129, expiry: "N/A", sku: "BH-WHT" },
        { id: 3, name: "Blue", stock: 5, price: 129, expiry: "N/A", sku: "BH-BLU" }
      ]
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      icon: "👕",
      distributor: "FashionWear",
      category: "Clothing",
      variants: [
        { id: 1, name: "Small White", stock: 30, price: 19.99, expiry: "N/A", sku: "CT-S-W" },
        { id: 2, name: "Medium White", stock: 25, price: 19.99, expiry: "N/A", sku: "CT-M-W" },
        { id: 3, name: "Large White", stock: 20, price: 19.99, expiry: "N/A", sku: "CT-L-W" },
        { id: 4, name: "Small Black", stock: 30, price: 19.99, expiry: "N/A", sku: "CT-S-B" },
        { id: 5, name: "Medium Black", stock: 20, price: 19.99, expiry: "N/A", sku: "CT-M-B" },
        { id: 6, name: "Large Black", stock: 15, price: 19.99, expiry: "N/A", sku: "CT-L-B" }
      ]
    },
    {
      id: 4,
      name: "Organic Milk",
      icon: "🥛",
      distributor: "FarmFresh",
      category: "Groceries",
      variants: [
        { id: 1, name: "1 Liter", stock: 40, price: 3.99, expiry: "2025-05-15", sku: "OM-1L" },
        { id: 2, name: "2 Liter", stock: 25, price: 6.99, expiry: "2025-05-15", sku: "OM-2L" }
      ]
    }
  ];

  const toggleHiddenColumns = () => {
    setShowHiddenColumns(!showHiddenColumns);
  };

  const getPriceRange = (variants) => {
    const prices = variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `$${min}` : `$${min} - $${max}`;
  };

  const getTotalStock = (variants) => {
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

  const getVariantNames = (variants) => {
    return variants.map(v => v.name).join(", ");
  };

  const getExpiryDates = (variants) => {
    const expiryDates = [...new Set(variants.map(v => v.expiry))];
    return expiryDates.join(", ");
  };

  const getSKUs = (variants) => {
    return variants.map(v => v.sku).join(", ");
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

  // Count total items ordered for a product
  const getTotalOrderedItems = (product) => {
    let total = 0;
    product.variants.forEach(variant => {
      const key = `${product.id}-${variant.id}`;
      total += orderQuantities[key]?.quantity || 0;
    });
    return total;
  };

  // Check if product has any low stock or out of stock variants
  const hasLowStock = (product) => {
    return product.variants.some(v => v.stock > 0 && v.stock <= 5);
  };

  const hasOutOfStock = (product) => {
    return product.variants.some(v => v.stock === 0);
  };

  const getOrderedItemsLabel = (product) => {
    const totalOrdered = getTotalOrderedItems(product);
    const hasOut = hasOutOfStock(product);
    const hasLow = hasLowStock(product);
    
    if (totalOrdered === 0 && !hasOut && !hasLow) {
      return null; // Return null when no orders and stock levels are fine
    }
    
    let labels = [];
    
    if (totalOrdered > 0) {
      labels.push(`${totalOrdered} ordered`);
    }
    
    if (hasOut) {
      labels.push("Out of stock");
    } else if (hasLow) {
      labels.push("Low stock");
    }
    
    return labels.join(" • ");
  };

  const addAllToCart = () => {
    // Create cart items for all products with quantities > 0
    const newCartItems = [];
    
    productData.forEach(product => {
      // Filter variants that have quantity > 0
      const selectedVariants = product.variants.filter(variant => {
        const key = `${product.id}-${variant.id}`;
        return orderQuantities[key]?.quantity > 0;
      });
      
      if (selectedVariants.length > 0) {
        selectedVariants.forEach(variant => {
          const key = `${product.id}-${variant.id}`;
          newCartItems.push({
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            productIcon: product.icon,
            variantName: variant.name,
            price: variant.price,
            quantity: orderQuantities[key].quantity,
            unit: orderQuantities[key].unit,
            totalPrice: variant.price * orderQuantities[key].quantity
          });
        });
      }
    });

    if (newCartItems.length === 0) {
      alert("Please select quantity for at least one product variant");
      return;
    }

    // Add to cart
    setCartItems(prev => [...prev, ...newCartItems]);
    
    // Reset all quantities
    const updatedQuantities = { ...orderQuantities };
    Object.keys(updatedQuantities).forEach(key => {
      updatedQuantities[key] = {
        ...updatedQuantities[key],
        quantity: 0
      };
    });
    setOrderQuantities(updatedQuantities);

    // Show cart
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
  };

  const startVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setSearchQuery(voiceQuery);
      handleSearch(voiceQuery);
    };
    recognition.start();
  };

  const handleSearch = (query) => {
    if (!query) {
      return;
    }
    
    setSearchQuery(query);
    
    // Check if there are matching products in any category
    const matchingProducts = productData.filter(product => matchesSearch(product, query));
    
    // If there are matches and none in current category, switch to the first category with matches
    if (matchingProducts.length > 0) {
      const currentCategoryHasMatches = matchingProducts.some(product => product.category === activeCategory);
      
      if (!currentCategoryHasMatches) {
        // Switch to the category of the first matching product
        setActiveCategory(matchingProducts[0].category);
      }
    }
  };

  const matchesSearch = (product, query) => {
    if (!query) return true;
    
    const searchTerms = query.toLowerCase().split(" ");
    
    // Check if ALL search terms are found somewhere in the product data
    return searchTerms.every(term => {
      // Check product name
      if (product.name.toLowerCase().includes(term)) return true;
      
      // Check distributor name
      if (product.distributor.toLowerCase().includes(term)) return true;
      
      // Check variant names
      if (product.variants.some(v => v.name.toLowerCase().includes(term))) return true;
      
      // Check SKUs
      if (product.variants.some(v => v.sku.toLowerCase().includes(term))) return true;
      
      return false;
    });
  };

  const filteredProducts = productData
    .filter(product => {
      // Filter by category
      if (product.category !== activeCategory) return false;
      
      // Filter by search query
      if (!matchesSearch(product, searchQuery)) return false;
      
      // Filter by stock status
      if (filterType === "low-stock") {
        return product.variants.some(v => v.stock > 0 && v.stock <= 5);
      } else if (filterType === "out-of-stock") {
        return product.variants.some(v => v.stock === 0);
      }
      
      return true;
    });

  return (
    <div className="min-h-screen relative font-sans">
      {/* Sticky header that shows/hides based on scroll direction */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-white z-50  ${
          showHeader ? 'translate-y-20 ' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Search bar with voice input inside */}
            <div className="relative flex-1 max-w-lg shadow-inner">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDownCapture={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              <button 
                className="absolute right-1 top-1 bottom-1 p-1 px-2 rounded-full bg-blue-700 text-white hover:bg-blue-600 shadow-inner transition-colors flex items-center gap-3"
                onClick={startVoiceSearch}
              >
                <span className="text-xs">Use voice input</span>
                <Mic className="h-4 w-4" />
              </button>
            </div>
            
            {/* Cart button */}
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg relative hover:bg-blue-700 transition-colors shadow-md"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
          
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Filter options */}
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl ${
                filterType === "all" 
                  ? "bg-blue-800 text-white shadow-md" 
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              } transition-all`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("low-stock")}
              className={`px-4 py-2 rounded-xl ${
                filterType === "low-stock" 
                  ? "bg-yellow-500 text-white shadow-md" 
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              } transition-all`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType("out-of-stock")}
              className={`px-4 py-2 rounded-xl ${
                filterType === "out-of-stock" 
                  ? "bg-red-500 text-white shadow-md" 
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              } transition-all`}
            >
              Out of Stock
            </button>
            <button
              onClick={toggleHiddenColumns}
              className="px-4 py-2 rounded-xl bg-white text-gray-700 border border-gray-200 flex items-center gap-1 hover:bg-gray-50 shadow-sm transition-all"
            >
              <Filter className="h-4 w-4" />
              {showHiddenColumns ? "Hide" : "Show"} SKU/Expiry
            </button>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="sticky top-16 z-10 overflow-x-auto py-3 border-b mb-6">
          <div className="flex gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 whitespace-nowrap rounded-xl transition-all ${
                  activeCategory === category 
                    ? "bg-blue-800 text-white shadow-md" 
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Inventory Table */}
          <div className={`bg-white rounded-xl shadow-lg overflow-x-auto ${showCart ? 'lg:w-2/3' : 'w-full'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  {showHiddenColumns && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className="transition-all duration-200 ease-in-out hover:bg-gray-50"
                    onMouseEnter={() => setHoveredRow(product.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 min-w-64">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-50 rounded-xl text-2xl shadow-sm">
                          {product.icon}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.distributor}</div>
                          
                          {/* Expanded order form - only visible on hover */}
                          {hoveredRow === product.id && (
                            <div className="mt-3 bg-gray-50 p-4 rounded-xl border shadow-sm">
                              <div className="space-y-2">
                                {product.variants.map(variant => (
                                  <div key={variant.id} className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-xs font-medium">
                                      {variant.name}
                                      {variant.stock === 0 && (
                                        <span className="ml-1 text-red-500 text-xs font-semibold">(Out of stock)</span>
                                      )}
                                      {variant.stock > 0 && variant.stock <= 5 && (
                                        <span className="ml-1 text-yellow-500 text-xs font-semibold">(Low stock: {variant.stock})</span>
                                      )}
                                    </span>
                                    <div className="flex items-center">
                                      <button 
                                        className="bg-gray-200 p-1 rounded-l-lg hover:bg-gray-300 transition-colors"
                                        onClick={() => {
                                          const key = `${product.id}-${variant.id}`;
                                          const currentQty = orderQuantities[key]?.quantity || 0;
                                          updateQuantity(product.id, variant.id, Math.max(0, currentQty - 1));
                                        }}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <input
                                        type="number"
                                        className="w-12 px-1 py-1 border-t border-b text-center text-xs"
                                        min="0"
                                        value={orderQuantities[`${product.id}-${variant.id}`]?.quantity || 0}
                                        onChange={(e) => updateQuantity(product.id, variant.id, parseInt(e.target.value) || 0)}
                                      />
                                      <button 
                                        className="bg-gray-200 p-1 rounded-r-lg hover:bg-gray-300 transition-colors"
                                        onClick={() => {
                                          const key = `${product.id}-${variant.id}`;
                                          const currentQty = orderQuantities[key]?.quantity || 0;
                                          updateQuantity(product.id, variant.id, currentQty + 1);
                                        }}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                      <select 
                                        className="ml-2 border rounded-lg px-2 py-1 text-xs bg-white"
                                        value={orderQuantities[`${product.id}-${variant.id}`]?.unit || "box"}
                                        onChange={(e) => updateUnit(product.id, variant.id, e.target.value)}
                                      >
                                        <option value="box">Box</option>
                                        <option value="piece">Piece</option>
                                        <option value="pack">Pack</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-32">
                      {hoveredRow === product.id ? (
                        <div className="grid grid-cols-1 gap-1">
                          {product.variants.map(variant => (
                            <div key={variant.id} className="text-xs text-gray-900">{variant.name}</div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 truncate max-w-32">{getVariantNames(product.variants)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 min-w-16">
                      {hoveredRow === product.id ? (
                        <div className="grid grid-cols-1 gap-1">
                          {product.variants.map(variant => (
                            <div key={variant.id} className={`text-xs font-medium ${
                              variant.stock === 0 
                                ? 'text-red-500' 
                                : variant.stock <= 5 
                                  ? 'text-yellow-500' 
                                  : 'text-green-500'
                            }`}>
                              {variant.stock}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-sm font-medium ${
                          getTotalStock(product.variants) === 0 
                            ? 'text-red-500' 
                            : getTotalStock(product.variants) <= 5 
                              ? 'text-yellow-500' 
                              : 'text-green-500'
                        }`}>
                          {getTotalStock(product.variants)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 min-w-20">
                      {hoveredRow === product.id ? (
                        <div className="grid grid-cols-1 gap-1">
                          {product.variants.map(variant => (
                            <div key={variant.id} className="text-xs text-gray-900">${variant.price}</div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">{getPriceRange(product.variants)}</div>
                      )}
                    </td>
                    {showHiddenColumns && (
                      <>
                        <td className="px-6 py-4 min-w-20">
                          {hoveredRow === product.id ? (
                            <div className="grid grid-cols-1 gap-1">
                              {product.variants.map(variant => (
                                <div key={variant.id} className="text-xs text-gray-900">{variant.expiry}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-900">{getExpiryDates(product.variants)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 min-w-20">
                          {hoveredRow === product.id ? (
                            <div className="grid grid-cols-1 gap-1">
                              {product.variants.map(variant => (
                                <div key={variant.id} className="text-xs text-gray-500">{variant.sku}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">{getSKUs(product.variants)}</div>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 min-w-24">
                      {hoveredRow === product.id ? (
                        <div className="grid grid-cols-1 gap-1">
                          {product.variants.map(variant => {
                            const key = `${product.id}-${variant.id}`;
                            const quantity = orderQuantities[key]?.quantity || 0;
                            
                            if (variant.stock === 0) {
                              return (
                                <div key={variant.id} className="text-xs font-medium text-red-500">
                                  Out of stock
                                </div>
                              );
                            } else if (variant.stock <= 5) {
                              return (
                                <div key={variant.id} className="text-xs font-medium text-yellow-500">
                                  Low stock: {variant.stock}
                                  {quantity > 0 && ` (${quantity} ordered)`}
                                </div>
                              );
                            } else if (quantity > 0) {
                              return (
                                <div key={variant.id} className="text-xs font-medium text-blue-500">
                                  {quantity} {orderQuantities[key]?.unit || "box"}(s)
                                </div>
                              );
                            } else {
                              return <div key={variant.id} className="text-xs">&nbsp;</div>;
                            }
                          })}
                        </div>
                      ) : (
                        <>
                          {getOrderedItemsLabel(product) ? (
                            <div className="flex flex-wrap gap-1 items-center">
                              {/* Display ordered items count */}
                              {getTotalOrderedItems(product) > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getTotalOrderedItems(product)} ordered
                                </span>
                              )}
                              
                              {/* Display stock status */}
                              {hasOutOfStock(product) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Out of stock
                                </span>
                              )}
                              
                              {!hasOutOfStock(product) && hasLowStock(product) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Low stock
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>&nbsp;</div> // Display nothing when not ordered and stock is normal
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          </div>
          </div>
        )}