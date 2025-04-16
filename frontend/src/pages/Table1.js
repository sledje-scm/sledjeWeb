<div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributor</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map(product => (
                      <React.Fragment key={product.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <button 
                              onClick={() => toggleProduct(product.id)}
                              className="p-1 rounded hover:bg-gray-200"
                            >
                              {expandedProduct === product.id ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </button>
                          </td>
                          <td className="px-4 py-2 flex items-center gap-2">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="font-medium">{product.name}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {product.category} &gt; {product.subcategory}
                          </td>
                          <td className="px-4 py-2">
                            {product.variants.length} variants
                          </td>
                          <td className="px-4 py-2">
                            {Array.from(new Set(product.variants.map(v => v.distributor))).length} distributors
                          </td>
                          <td className="px-4 py-2">
                            Multiple
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${product.variants.some(v => v.stock === 0) 
                                ? 'bg-red-100 text-red-800' 
                                : product.variants.some(v => v.stock <= v.reorderPoint)
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {product.variants.reduce((total, v) => total + v.stock, 0)} total
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            ${Math.min(...product.variants.map(v => parseFloat(v.unitPrice)))} - 
                            ${Math.max(...product.variants.map(v => parseFloat(v.unitPrice)))}
                          </td>
                          <td className="px-4 py-2">
                            Various
                          </td>
                          <td className="px-4 py-2">
                            <button 
                              className="inline-flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs border border-blue-200 hover:bg-blue-100"
                              onClick={() => {
                                const lowStockVariant = product.variants.find(v => v.stock <= v.reorderPoint);
                                if (lowStockVariant) {
                                  addToOrder(lowStockVariant, lowStockVariant.qtyPerUnit);
                                }
                              }}
                              disabled={!product.variants.some(v => v.stock <= v.reorderPoint)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Reorder
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expanded variants */}
                        {expandedProduct === product.id && (
                          <>
                            {product.variants.map((variant, idx) => (
                              <tr key={variant.id} className="bg-gray-50">
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 font-medium text-sm">{variant.variantValue}</td>
                                <td className="px-4 py-2 text-sm">{variant.distributor}</td>
                                <td className="px-4 py-2 text-sm">{variant.sku}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                      ${variant.stock === 0 
                                        ? 'bg-red-100 text-red-800' 
                                        : variant.stock <= variant.reorderPoint
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                      }`}
                                    >
                                      {variant.stock} {variant.unit}s
                                    </span>
                                    {variant.stock <= variant.reorderPoint && variant.stock > 0 && (
                                      <span className="ml-2 text-xs text-yellow-600">Below minimum ({variant.reorderPoint})</span>
                                    )}
                                    {variant.stock === 0 && (
                                      <span className="ml-2 text-xs text-red-600">Out of stock</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 font-medium">${variant.unitPrice}</td>
                                <td className="px-4 py-2 text-sm">{variant.expiryDate}</td>
                                <td className="px-4 py-2">
                                  <button 
                                    className="inline-flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs border border-blue-200 hover:bg-blue-100"
                                    onClick={() => addToOrder(variant, variant.qtyPerUnit)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add to Order
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <td colSpan="10" className="px-4 py-2 text-xs text-gray-500">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <span className="font-medium">Last Order:</span> {product.variants[0].lastOrderDate}
                                  </div>
                                  <div>
                                    <span className="font-medium">Qty Per Unit:</span> {product.variants.map(v => v.qtyPerUnit).join(', ')} {product.variants[0].unit}s
                                  </div>
                                  <div>
                                    <span className="font-medium">Min Stock Level:</span> {product.variants.map(v => v.minStockLevel).join(', ')} {product.variants[0].unit}s
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>