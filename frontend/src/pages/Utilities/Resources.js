import React, { useState } from "react";

export default function Shelf() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // example categories data
  const categories = [
    {
      id: "groceries",
      name: "Groceries",
      subcategories: [
        { id: "fruits", name: "Fruits" },
        { id: "vegetables", name: "Vegetables" },
      ],
    },
    {
      id: "beverages",
      name: "Beverages",
      subcategories: [
        { id: "soft-drinks", name: "Soft Drinks" },
        { id: "juices", name: "Juices" },
      ],
    },
  ];
  return (
    <aside className="w-full md:w-64 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-4 bg-white shadow-sm border-r font-eudoxus">
  <h3 className="text-lg font-bold mb-4">Categories</h3>
  {categories.map((cat) => (
    <div key={cat.id} className="mb-2">
      <button
        onClick={() => setSelectedCategory(cat.id)}
        className={`block w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100 ${
          selectedCategory === cat.id ? 'bg-gray-200 font-semibold' : ''
        }`}
      >
        {cat.name}
      </button>
      {selectedCategory === cat.id && cat.subcategories?.length > 0 && (
        <div className="pl-4 mt-1">
          {cat.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`block w-full text-left text-xs px-2 py-1 rounded hover:bg-gray-100 ${
                selectedSubcategory === sub.id ? 'bg-gray-300 font-medium' : ''
              }`}
            >
              ▸ {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  ))}
</aside>

  );
}



