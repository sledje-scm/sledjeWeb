import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

const ProductTable = ({ products = [], addToOrder, initialShowAll = false, defaultUnit = 'box' }) => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showAll, setShowAll] = useState(initialShowAll);
  const tableRef = useRef(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const quantityRefs = useRef({});

  const toggleProduct = (productId) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setExpandedProduct(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const collapseAll = () => setExpandedProduct(null);

  const handleAddToCart = (variantId) => {
    const quantity = parseInt(quantityRefs.current[variantId]?.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      const variant = products.flatMap(p => p.variants).find(v => v.id === variantId);
      addToOrder(variant, quantity);
    }
  };

  return (
    <div ref={tableRef} className="bg-white rounded-lg shadow mb-6">
      <div className="sticky top-0 p-3 bg-gray-50 z-10 flex justify-between items-center border-b">
        <span className="text-sm mb-2 md:mb-0">Category: {products.length > 0 ? products[0]?.category : 'No products available'}</span>
        <div className="flex gap-2">
          <button onClick={collapseAll} className="text-xs px-3 py-1 bg-gray-200 rounded-md">Collapse All</button>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-md"
          >
            {showAll ? 'Hide Additional Details' : 'Show All'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase"></th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Variant</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Distributor</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
              {showAll && <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>}
              {showAll && <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Expiry</th>}
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr
                  className={`cursor-pointer transition-transform ${expandedProduct === product.id ? 'bg-gray-50 scale-[1.01]' : 'bg-white'} hover:bg-gray-100 ${activeProductId === product.id ? 'ring-2 ring-blue-300' : ''}`}
                  onMouseEnter={() => setExpandedProduct(product.id)}
                  onClick={() => toggleProduct(product.id)}
                >
                  <td className="px-3 py-3">
                    <button className="p-1 rounded-md bg-gray-100 border-none">
                      {expandedProduct === product.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td className="px-3 py-3 flex items-center gap-2">
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="px-3 py-3">{product.variants.length} variants</td>
                  <td className="px-3 py-3">{[...new Set(product.variants.map(v => v.distributor))].length} distributors</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.variants.some(v => v.stock === 0)
                        ? 'bg-red-100 text-gray-800'
                        : product.variants.some(v => v.stock <= v.reorderPoint)
                        ? 'bg-yellow-100 text-gray-800'
                        : 'bg-green-100 text-gray-800'
                    }`}>
                      {product.variants.reduce((total, v) => total + v.stock, 0)} total
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    ${Math.min(...product.variants.map(v => parseFloat(v.unitPrice)))} - ${Math.max(...product.variants.map(v => parseFloat(v.unitPrice)))}
                  </td>
                  {showAll && <td className="px-3 py-3">Multiple</td>}
                  {showAll && <td className="px-3 py-3">Various</td>}
                  <td className="px-3 py-3">
                    <select defaultValue={defaultUnit} className="text-xs p-1 rounded-md border border-gray-300">
                      <option value="box">Box</option>
                      <option value="piece">Piece</option>
                    </select>
                    <input type="number" min="1" defaultValue="1" className="w-12 ml-2 text-sm border rounded-md px-1" />
                    <button
                      className="text-xs ml-2 px-2 py-1 bg-blue-100 border border-blue-300 text-blue-600 rounded-md inline-flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProductId(product.id);
                      }}
                    >
                      <Plus size={12} className="mr-1" /> Add
                    </button>
                  </td>
                </tr>
                {expandedProduct === product.id && product.variants.map((variant) => (
                  <tr key={variant.id} className="bg-gray-100">
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2 font-medium">{variant.variantValue}</td>
                    <td className="px-3 py-2">{variant.distributor}</td>
                    <td className="px-3 py-2">{variant.stock} {variant.unit}s</td>
                    <td className="px-3 py-2">${variant.unitPrice}</td>
                    {showAll && <td className="px-3 py-2">{variant.sku}</td>}
                    {showAll && <td className="px-3 py-2">{variant.expiryDate}</td>}
                    <td className="px-3 py-2">
                      <select defaultValue={defaultUnit} className="text-xs p-1 rounded-md border border-gray-300">
                        <option value="box">Box</option>
                        <option value="piece">Piece</option>
                      </select>
                      <input
                        ref={(el) => (quantityRefs.current[variant.id] = el)}
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="w-12 ml-2 text-sm border rounded-md px-1"
                      />
                      <button
                        className="text-xs ml-2 px-2 py-1 bg-blue-100 border border-blue-300 text-blue-600 rounded-md inline-flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(variant.id);
                        }}
                      >
                        <Plus size={12} className="mr-1" /> Add
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3">
        
      </div>
    </div>
  );
};

export default ProductTable;
