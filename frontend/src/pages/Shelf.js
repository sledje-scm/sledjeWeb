import { useState, useEffect } from "react";
import { ShoppingCart, AlertCircle, Search, Mic, PlusCircle } from "lucide-react";

export default function Shelf() {
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: "Product A", stock: 5, distributor: "Distributor X" },
    { id: 2, name: "Product B", stock: 15, distributor: "Distributor Y" },
    { id: 3, name: "Product C", stock: 2, distributor: "Distributor Z" },
    { id: 4, name: "Product D", stock: 20, distributor: "Distributor X" }
  ]);
  const [filteredItems, setFilteredItems] = useState(inventoryItems);
  const [selectedItems, setSelectedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsScrollingDown(window.scrollY > lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const addToCart = () => {
    setCartCount(Object.keys(selectedItems).length);
    alert("Items added to cart!");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredItems(
      inventoryItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    );
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

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Search Bar & Cart */}
      <div className={`flex items-center justify-between mb-6 transition-opacity duration-300 ${isScrollingDown ? "opacity-0" : "opacity-100"}`}>
        <div className="flex items-center space-x-2 border p-2 rounded-full shadow-sm flex-1 bg-white text-black">
          <Search className="w-5 h-5 text-gray-900" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search inventory..."
            className="flex-1 outline-none px-2 bg-transparent text-gray-900 text-sm"
          />
          <button className="p-2 rounded-full shadow-sm bg-gray-200" onClick={startVoiceSearch}>
            <Mic className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <button onClick={() => window.location.href = '/orders'} className="ml-4 px-4 py-2 bg-white text-black rounded-lg shadow-md relative hover:scale-105">
          <ShoppingCart className="w-6 h-6 text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>
          )}
        </button>
      </div>

      {/* Inventory Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105 flex flex-col justify-between h-40">
            <div>
              <h3 className="text-md font-medium text-gray-800">{item.name}</h3>
              <p className={`text-xs flex items-center ${item.stock < 10 ? "text-red-500" : "text-green-600"}`}>
                <AlertCircle className="w-4 h-4 mr-1" /> Stock: {item.stock}
              </p>
              <p className="text-gray-600 text-xs">Distributor: {item.distributor}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <input
                type="number"
                min="1"
                className="border p-2 w-16 text-center text-sm rounded-md"
                placeholder="Qty"
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={addToCart} 
        className="fixed bottom-16 right-6 bg-white text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
        <PlusCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
