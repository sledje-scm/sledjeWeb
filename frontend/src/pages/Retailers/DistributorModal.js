import { X, Minus, Plus } from "lucide-react";

export default function DistributorModal({
  show,
  onClose,
  distributorSearch,
  setDistributorSearch,
  filteredDistributors,
  distributorInfo,
  modalDistributor,
  setModalDistributor,
  modalProducts,
  isAddingToInventory,
  inventoryStockMap,
  orderQuantities,
  updateQuantity,
  updateUnit,
  handleAddVariantToInventory,
  onAddToCart
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center w-full">
      <div className="bg-white rounded-3xl shadow-lg w-full h-5/6 max-w-4xl mx-2 flex flex-col">
        {/* Blue Header */}
        <div className="bg-blue-800 text-white rounded-t-3xl p-6 relative flex items-center justify-between">
          <h2 className="text-xl font-bold">Select Distributor</h2>
          <button
            className="text-white hover:text-gray-300"
            onClick={onClose}
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
            onClick={onAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add Selected to Cart
          </button>
        </div>
      </div>
    </div>
  );
}