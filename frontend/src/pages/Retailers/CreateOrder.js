import React, { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff, ShoppingCart, Plus, Trash2, Edit3, Volume2, AlertCircle } from "lucide-react";
import { wordsToNumbers } from 'words-to-numbers';

// Enhanced product database with more realistic data
const productDatabase = [
 // Electronics - Smartphones
  { id: 1, item: "iPhone 15 Pro Max", brand: "Apple", rate: 134900, category: "Electronics" },
  { id: 2, item: "iPhone 15 Pro", brand: "Apple", rate: 129900, category: "Electronics" },
  { id: 3, item: "iPhone 15", brand: "Apple", rate: 79900, category: "Electronics" },
  { id: 4, item: "iPhone 14", brand: "Apple", rate: 69900, category: "Electronics" },
  { id: 5, item: "Galaxy S24 Ultra", brand: "Samsung", rate: 129999, category: "Electronics" },
  { id: 6, item: "Galaxy S24 Plus", brand: "Samsung", rate: 99999, category: "Electronics" },
  { id: 7, item: "Galaxy S24", brand: "Samsung", rate: 74999, category: "Electronics" },
  { id: 8, item: "Galaxy A54", brand: "Samsung", rate: 38999, category: "Electronics" },
  { id: 9, item: "Pixel 8 Pro", brand: "Google", rate: 106999, category: "Electronics" },
  { id: 10, item: "Pixel 8", brand: "Google", rate: 75999, category: "Electronics" },
  { id: 11, item: "OnePlus 12", brand: "OnePlus", rate: 64999, category: "Electronics" },
  { id: 12, item: "OnePlus 11", brand: "OnePlus", rate: 56999, category: "Electronics" },

  // Electronics - Laptops
  { id: 13, item: "MacBook Pro 16", brand: "Apple", rate: 249900, category: "Electronics" },
  { id: 14, item: "MacBook Pro 14", brand: "Apple", rate: 199900, category: "Electronics" },
  { id: 15, item: "MacBook Air 15", brand: "Apple", rate: 134900, category: "Electronics" },
  { id: 16, item: "MacBook Air 13", brand: "Apple", rate: 114900, category: "Electronics" },
  { id: 17, item: "XPS 15", brand: "Dell", rate: 159999, category: "Electronics" },
  { id: 18, item: "XPS 13", brand: "Dell", rate: 89999, category: "Electronics" },
  { id: 19, item: "Inspiron 15", brand: "Dell", rate: 65999, category: "Electronics" },
  { id: 20, item: "ThinkPad X1 Carbon", brand: "Lenovo", rate: 189999, category: "Electronics" },
  { id: 21, item: "ThinkPad E15", brand: "Lenovo", rate: 75999, category: "Electronics" },
  { id: 22, item: "IdeaPad Gaming 3", brand: "Lenovo", rate: 85999, category: "Electronics" },
  { id: 23, item: "Pavilion 15", brand: "HP", rate: 69999, category: "Electronics" },
  { id: 24, item: "Spectre x360", brand: "HP", rate: 134999, category: "Electronics" },

  // Electronics - Headphones & Audio
  { id: 25, item: "AirPods Pro 2", brand: "Apple", rate: 24900, category: "Electronics" },
  { id: 26, item: "AirPods 3", brand: "Apple", rate: 19900, category: "Electronics" },
  { id: 27, item: "AirPods Max", brand: "Apple", rate: 59900, category: "Electronics" },
  { id: 28, item: "WH-1000XM5", brand: "Sony", rate: 34990, category: "Electronics" },
  { id: 29, item: "WH-1000XM4", brand: "Sony", rate: 29990, category: "Electronics" },
  { id: 30, item: "WF-1000XM4", brand: "Sony", rate: 19990, category: "Electronics" },
  { id: 31, item: "QuietComfort 45", brand: "Bose", rate: 32900, category: "Electronics" },
  { id: 32, item: "QuietComfort Earbuds", brand: "Bose", rate: 26900, category: "Electronics" },
  { id: 33, item: "Momentum 4", brand: "Sennheiser", rate: 34990, category: "Electronics" },
  { id: 34, item: "Buds2 Pro", brand: "Samsung", rate: 17999, category: "Electronics" },

  // Electronics - Tablets
  { id: 35, item: "iPad Pro 12.9", brand: "Apple", rate: 112900, category: "Electronics" },
  { id: 36, item: "iPad Air", brand: "Apple", rate: 64900, category: "Electronics" },
  { id: 37, item: "iPad Mini", brand: "Apple", rate: 46900, category: "Electronics" },
  { id: 38, item: "Galaxy Tab S9", brand: "Samsung", rate: 79999, category: "Electronics" },
  { id: 39, item: "Surface Pro 9", brand: "Microsoft", rate: 119999, category: "Electronics" },

  // Food & Beverages - Coffee
  { id: 40, item: "Arabica Coffee Beans", brand: "Starbucks", rate: 1299, category: "Food & Beverages" },
  { id: 41, item: "Pike Place Roast", brand: "Starbucks", rate: 899, category: "Food & Beverages" },
  { id: 42, item: "French Roast", brand: "Starbucks", rate: 999, category: "Food & Beverages" },
  { id: 43, item: "Gold Coffee", brand: "Nescafe", rate: 449, category: "Food & Beverages" },
  { id: 44, item: "Classic Coffee", brand: "Nescafe", rate: 299, category: "Food & Beverages" },
  { id: 45, item: "Instant Coffee", brand: "Bru", rate: 189, category: "Food & Beverages" },
  { id: 46, item: "Filter Coffee", brand: "Tata Coffee", rate: 250, category: "Food & Beverages" },

  // Food & Beverages - Tea
  { id: 47, item: "Earl Grey Tea", brand: "Twinings", rate: 450, category: "Food & Beverages" },
  { id: 48, item: "English Breakfast Tea", brand: "Twinings", rate: 399, category: "Food & Beverages" },
  { id: 49, item: "Green Tea", brand: "Twinings", rate: 425, category: "Food & Beverages" },
  { id: 50, item: "Chamomile Tea", brand: "Twinings", rate: 475, category: "Food & Beverages" },
  { id: 51, item: "Premium Tea", brand: "Lipton", rate: 149, category: "Food & Beverages" },
  { id: 52, item: "Green Tea", brand: "Lipton", rate: 179, category: "Food & Beverages" },
  { id: 53, item: "Masala Chai", brand: "Tata Tea", rate: 89, category: "Food & Beverages" },
  { id: 54, item: "Gold Tea", brand: "Tata Tea", rate: 125, category: "Food & Beverages" },

  // Health & Fitness - Protein & Supplements
  { id: 55, item: "Gold Standard Whey", brand: "Optimum Nutrition", rate: 4500, category: "Health & Fitness" },
  { id: 56, item: "Serious Mass", brand: "Optimum Nutrition", rate: 3200, category: "Health & Fitness" },
  { id: 57, item: "Casein Protein", brand: "Optimum Nutrition", rate: 5200, category: "Health & Fitness" },
  { id: 58, item: "Whey Protein", brand: "MuscleBlaze", rate: 2899, category: "Health & Fitness" },
  { id: 59, item: "Mass Gainer", brand: "MuscleBlaze", rate: 2199, category: "Health & Fitness" },
  { id: 60, item: "BCAA", brand: "MuscleBlaze", rate: 1599, category: "Health & Fitness" },
  { id: 61, item: "Creatine", brand: "MuscleBlaze", rate: 899, category: "Health & Fitness" },
  { id: 62, item: "Protein Isolate", brand: "Dymatize", rate: 4899, category: "Health & Fitness" },

  // Sports & Fitness - Shoes
  { id: 63, item: "Air Max 270", brand: "Nike", rate: 12995, category: "Sports & Fitness" },
  { id: 64, item: "Air Force 1", brand: "Nike", rate: 7995, category: "Sports & Fitness" },
  { id: 65, item: "React Infinity Run", brand: "Nike", rate: 13995, category: "Sports & Fitness" },
  { id: 66, item: "Pegasus 40", brand: "Nike", rate: 10995, category: "Sports & Fitness" },
  { id: 67, item: "Ultraboost 22", brand: "Adidas", rate: 15999, category: "Sports & Fitness" },
  { id: 68, item: "Stan Smith", brand: "Adidas", rate: 7999, category: "Sports & Fitness" },
  { id: 69, item: "Superstar", brand: "Adidas", rate: 8999, category: "Sports & Fitness" },
  { id: 70, item: "NMD R1", brand: "Adidas", rate: 12999, category: "Sports & Fitness" },
  { id: 71, item: "Classic Leather", brand: "Reebok", rate: 6999, category: "Sports & Fitness" },
  { id: 72, item: "Club C 85", brand: "Reebok", rate: 7499, category: "Sports & Fitness" },

  // Sports & Fitness - Apparel
  { id: 73, item: "Dri-FIT T-Shirt", brand: "Nike", rate: 1995, category: "Sports & Fitness" },
  { id: 74, item: "Training Shorts", brand: "Nike", rate: 2495, category: "Sports & Fitness" },
  { id: 75, item: "Hoodie", brand: "Nike", rate: 4995, category: "Sports & Fitness" },
  { id: 76, item: "Essentials T-Shirt", brand: "Adidas", rate: 1799, category: "Sports & Fitness" },
  { id: 77, item: "Track Pants", brand: "Adidas", rate: 3499, category: "Sports & Fitness" },
  { id: 78, item: "Running Tights", brand: "Adidas", rate: 2999, category: "Sports & Fitness" },

  // Home & Kitchen - Appliances
  { id: 79, item: "Stand Mixer", brand: "KitchenAid", rate: 45999, category: "Home & Kitchen" },
  { id: 80, item: "Food Processor", brand: "KitchenAid", rate: 28999, category: "Home & Kitchen" },
  { id: 81, item: "Air Fryer", brand: "Philips", rate: 12999, category: "Home & Kitchen" },
  { id: 82, item: "Induction Cooktop", brand: "Philips", rate: 8999, category: "Home & Kitchen" },
  { id: 83, item: "Mixer Grinder", brand: "Preethi", rate: 7999, category: "Home & Kitchen" },
  { id: 84, item: "Pressure Cooker", brand: "Prestige", rate: 2499, category: "Home & Kitchen" },
  { id: 85, item: "Rice Cooker", brand: "Panasonic", rate: 4999, category: "Home & Kitchen" },
  { id: 86, item: "Microwave Oven", brand: "LG", rate: 12999, category: "Home & Kitchen" },

  // Personal Care - Skincare
  { id: 87, item: "Moisturizing Cream", brand: "Nivea", rate: 299, category: "Personal Care" },
  { id: 88, item: "Face Wash", brand: "Nivea", rate: 149, category: "Personal Care" },
  { id: 89, item: "Sunscreen SPF 50", brand: "Nivea", rate: 399, category: "Personal Care" },
  { id: 90, item: "Vitamin C Serum", brand: "The Ordinary", rate: 899, category: "Personal Care" },
  { id: 91, item: "Niacinamide Serum", brand: "The Ordinary", rate: 799, category: "Personal Care" },
  { id: 92, item: "Hyaluronic Acid", brand: "The Ordinary", rate: 999, category: "Personal Care" },
  { id: 93, item: "Glow Serum", brand: "Lakme", rate: 649, category: "Personal Care" },
  { id: 94, item: "Foundation", brand: "Lakme", rate: 459, category: "Personal Care" },

  // Books & Education
  { id: 95, item: "JavaScript Guide", brand: "O'Reilly", rate: 2499, category: "Books" },
  { id: 96, item: "Python Cookbook", brand: "O'Reilly", rate: 2899, category: "Books" },
  { id: 97, item: "Clean Code", brand: "Pearson", rate: 1999, category: "Books" },
  { id: 98, item: "Design Patterns", brand: "Pearson", rate: 2299, category: "Books" },
  { id: 99, item: "Atomic Habits", brand: "Random House", rate: 499, category: "Books" },
  { id: 100, item: "Think and Grow Rich", brand: "Random House", rate: 299, category: "Books" },

  // Grocery & Food Items
  { id: 101, item: "Basmati Rice", brand: "India Gate", rate: 189, category: "Grocery" },
  { id: 102, item: "Whole Wheat Flour", brand: "Aashirvaad", rate: 89, category: "Grocery" },
  { id: 103, item: "Refined Oil", brand: "Fortune", rate: 179, category: "Grocery" },
  { id: 104, item: "Olive Oil", brand: "Figaro", rate: 549, category: "Grocery" },
  { id: 105, item: "Honey", brand: "Dabur", rate: 189, category: "Grocery" },
  { id: 106, item: "Green Tea Bags", brand: "Tetley", rate: 199, category: "Grocery" },
  { id: 107, item: "Oats", brand: "Quaker", rate: 149, category: "Grocery" },
];

const knownUnits = ['kg', 'kilogram', 'g', 'gram', 'liters', 'liter', 'bottles', 'packets', 'pieces', 'dozen', 'box', 'boxes', 'l', 'ml', 'milliliter', 'cups', 'pints', 'quarts', 'ounces', 'units', 'pair', 'pairs'];


// Utility functions from the first file
function detectUnit(itemStr) {
  if (typeof itemStr !== 'string') {
    console.warn('Expected string but got:', typeof itemStr, itemStr);
    return { unit: 'unit', item: 'unknown' };
  }
  const words = itemStr.trim().toLowerCase().split(/\s+/);

  // Check if first word is a unit
  if (knownUnits.includes(words[0])) {
    return {
      unit: words[0],
// Convert words to numbers manually since we don't have the library
      item: words.slice(1).join(' ') || 'unknown'
    };
  }

  // Check unit at the end (e.g., "water bottles")
  const last = words[words.length - 1];
  if (knownUnits.includes(last)) {
    return {
      unit: last,
      item: words.slice(0, -1).join(' ') || 'unknown'
    };
  }

  return {
    unit: 'unit',
    item: itemStr.trim()
  };
}

function parseMultipleOrders(transcript) {
  if (typeof transcript !== 'string') {
    console.error('Invalid input: transcript must be a string');
    return [];
  }

  let normalized;
  try {
    transcript = transcript.replace(/[^a-zA-Z0-9\s.,]/g, ''); // Remove unwanted characters
    transcript = transcript.replace(/\s+/g, ' ').trim(); // Normalize spaces
    transcript = transcript.replace(/\bto\b/g, "two"); // Replace "to" with "two"
    normalized = wordsToNumbers(transcript); // Convert word numbers to digits
  } catch (error) {
    console.error('Error converting words to numbers:', error);
    normalized = transcript; // Fall back to original transcript if conversion fails
  }
  
  console.log("Normalized transcript:", normalized);
  
  const orders = [];
  // Number followed by a word or words that don't contain numbers
 const regex = /(\d+(?:\.\d+)?)\s+([a-zA-Z][a-zA-Z\s]*?)(?=\s+\d+|$)/g;
  
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    const [, quantity, itemText] = match;
    const { unit, item } = detectUnit(itemText.trim());
    
    // Try to extract brand from the item text
    const words = item.split(' ');
    let extractedBrand = '';
    let cleanItem = item;
    
    // Check if any word matches a known brand
    const knownBrands = [...new Set(productDatabase.map(p => p.brand.toLowerCase()))];
    const brandWord = words.find(word => 
      knownBrands.includes(word.toLowerCase())
    );
    
    if (brandWord) {
      extractedBrand = brandWord;
      cleanItem = words.filter(word => word.toLowerCase() !== brandWord.toLowerCase()).join(' ');
    }
    
    orders.push({
      item: cleanItem || item,
      brand: extractedBrand,
      quantity: parseFloat(quantity),
      unit
    });
    
    console.log(`Parsed: ${quantity} × ${cleanItem} (Brand: ${extractedBrand || 'Not specified'}, Unit: ${unit})`);
  }
  
  return orders;
}

const parseOrderFromText = (text) => {
  return parseMultipleOrders(text);
};

const generateOrderId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `ORD${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
};

const CreateOrder = ({ isOpen, onClose, onAddOrder }) => {
  // State management

  const [dropdownStates, setDropdownStates] = useState({});

  const [orderData, setOrderData] = useState({
    customerName: '',
    orderId: generateOrderId(),
    items: []
  });
  
  const [voiceInput, setVoiceInput] = useState({
    transcript: '',
    isListening: false,
    isSupported: false
  });
  
  const [manualItem, setManualItem] = useState({
  item: '',
  brand: '', // ADD this field
  quantity: 1,
  unit: 'pieces',
  rate: 0
});
  
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' or 'manual'
  
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
const toggleDropdown = (itemId) => {
  setDropdownStates(prev => ({
    ...prev,
    [itemId]: !prev[itemId]
  }));
};

// 3. ADD function to close all dropdowns
const closeAllDropdowns = () => {
  setDropdownStates({});
};
  // Speech Recognition Setup
  const initializeSpeechRecognition = () => {
    if (typeof window === 'undefined') return null;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setVoiceInput(prev => ({ ...prev, isListening: true }));
        setErrors(prev => ({ ...prev, voice: '' }));
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // FIXED: Append to existing transcript instead of overwriting
        setVoiceInput(prev => ({
          ...prev,
          transcript: prev.transcript ? prev.transcript + ' ' + transcript : transcript
        }));
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceInput(prev => ({ ...prev, isListening: false }));
        
        const errorMessages = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
          'no-speech': 'No speech detected. Please try speaking clearly.',
          'network': 'Network error. Please check your connection.',
          'audio-capture': 'No microphone found. Please check your audio settings.'
        };
        
        setErrors(prev => ({ 
          ...prev, 
          voice: errorMessages[event.error] || 'Speech recognition error occurred.' 
        }));
      };
      
      recognition.onend = () => {
        setVoiceInput(prev => ({ ...prev, isListening: false }));
      };
      
      setVoiceInput(prev => ({ ...prev, isSupported: true }));
      return recognition;
    } else {
      setVoiceInput(prev => ({ ...prev, isSupported: false }));
      return null;
    }
  };

  // Effects
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.product-dropdown-container')) {
      closeAllDropdowns();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  useEffect(() => {
    if (isOpen) {
      recognitionRef.current = initializeSpeechRecognition();
      setOrderData(prev => ({ ...prev, orderId: generateOrderId() }));
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen]);

 const findBestProductMatch = (itemText, brandText = '') => {
  const searchText = `${brandText} ${itemText}`.toLowerCase().trim();
  
  // First, try exact brand + item match
  if (brandText) {
    const exactMatch = productDatabase.find(product => 
      product.brand.toLowerCase() === brandText.toLowerCase() && 
      product.item.toLowerCase().includes(itemText.toLowerCase())
    );
    if (exactMatch) return exactMatch;
    
    // Try brand match with partial item match
    const brandMatch = productDatabase.find(product => 
      product.brand.toLowerCase() === brandText.toLowerCase()
    );
    if (brandMatch) return brandMatch;
  }
  
  // Try to find brand name within the combined text
  const brandInText = productDatabase.find(product =>
    searchText.includes(product.brand.toLowerCase()) && 
    searchText.includes(product.item.toLowerCase().split(' ')[0])
  );
  if (brandInText) return brandInText;
  
  // Fallback to item-only matching
  return productDatabase.find(product => 
    product.item.toLowerCase().includes(itemText.toLowerCase()) ||
    itemText.toLowerCase().includes(product.item.toLowerCase().split(' ')[0])
  );
};

  // Event handlers
  const startVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setErrors(prev => ({ ...prev, voice: 'Speech recognition not supported in this browser.' }));
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (error.name === 'NotAllowedError') {
        setErrors(prev => ({ ...prev, voice: 'Please allow microphone access in your browser settings.' }));
      } else {
        setErrors(prev => ({ ...prev, voice: 'Could not start voice input. Please try again.' }));
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setVoiceInput(prev => ({ ...prev, isListening: false }));
  };

 const parseVoiceOrder = () => {
  const parsedItems = parseOrderFromText(voiceInput.transcript);
  
  if (parsedItems.length === 0) {
    setErrors(prev => ({ ...prev, parse: 'Could not parse any items from the transcript. Please try again.' }));
    return;
  }
  
  const mappedItems = parsedItems.map(parsedItem => {
    const matchingProduct = findBestProductMatch(parsedItem.item, parsedItem.brand);
    
    // Enhanced related products search with better scoring
    const relatedProducts = productDatabase
      .filter((product) => {
        const itemWords = parsedItem.item.toLowerCase().split(' ');
        const productWords = product.item.toLowerCase().split(' ');
        
        const itemMatch = itemWords.some(word => 
          productWords.some(pWord => pWord.includes(word) || word.includes(pWord))
        );
        
        const brandMatch = parsedItem.brand ? 
          product.brand.toLowerCase().includes(parsedItem.brand.toLowerCase()) : false;
          
        const categoryMatch = itemWords.some(word => 
          product.category.toLowerCase().includes(word)
        );
        
        return itemMatch || brandMatch || categoryMatch;
      })
      .sort((a, b) => {
        // Sort by relevance: exact matches first, then brand matches, then category matches
        const aExact = a.item.toLowerCase().includes(parsedItem.item.toLowerCase());
        const bExact = b.item.toLowerCase().includes(parsedItem.item.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aBrand = parsedItem.brand && a.brand.toLowerCase().includes(parsedItem.brand.toLowerCase());
        const bBrand = parsedItem.brand && b.brand.toLowerCase().includes(parsedItem.brand.toLowerCase());
        
        if (aBrand && !bBrand) return -1;
        if (!aBrand && bBrand) return 1;
        
        return 0;
      })
      .slice(0, 10); // Limit to top 10 related products
    
    return {
      id: Date.now() + Math.random(),
      item: matchingProduct ? matchingProduct.item : parsedItem.item,
      brand: matchingProduct ? matchingProduct.brand : (parsedItem.brand || "Unknown Brand"),
      quantity: parsedItem.quantity || 1,
      rate: matchingProduct ? matchingProduct.rate : 100,
      unit: parsedItem.unit || "pieces",
      relatedProducts: relatedProducts,
    };
  });
  
  setOrderData(prev => ({ ...prev, items: [...prev.items, ...mappedItems] }));
  setVoiceInput(prev => ({ ...prev, transcript: '' }));
  setErrors(prev => ({ ...prev, parse: '' }));
};

 const updateItemDetails = (itemId, selectedProduct) => {
  setOrderData((prev) => ({
    ...prev,
    items: prev.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            item: selectedProduct.item,
            brand: selectedProduct.brand,
            rate: selectedProduct.rate,
            relatedProducts: item.relatedProducts // Keep the related products
          }
        : item
    ),
  }));
  
  // Close the dropdown after selection
  setDropdownStates(prev => ({
    ...prev,
    [itemId]: false
  }));
};
  const handleItemChange = (itemId, newItem) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, item: newItem } : item
      ),
    }));
  };

const addManualItem = () => {
  if (!manualItem.item.trim()) {
    setErrors(prev => ({ ...prev, manual: 'Please enter an item name.' }));
    return;
  }
  
  if (manualItem.quantity <= 0) {
    setErrors(prev => ({ ...prev, manual: 'Quantity must be greater than 0.' }));
    return;
  }
  
  // Enhanced product matching for manual entry
  const matchingProduct = findBestProductMatch(manualItem.item, manualItem.brand || '');
  
  const newItem = {
    id: Date.now() + Math.random(),
    item: matchingProduct ? matchingProduct.item : manualItem.item,
    brand: matchingProduct ? matchingProduct.brand : (manualItem.brand || "Custom Brand"),
    quantity: manualItem.quantity,
    rate: manualItem.rate || (matchingProduct ? matchingProduct.rate : 100),
    unit: manualItem.unit
  };
  
  setOrderData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  setManualItem({ item: '', brand: '', quantity: 1, unit: 'pieces', rate: 0 });
  setErrors(prev => ({ ...prev, manual: '' }));
};

  const removeItem = (itemId) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const calculateTotal = () => {
    return orderData.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const handleSubmitOrder = () => {
    const newErrors = {};
    
    if (!orderData.customerName.trim()) {
      newErrors.customer = 'Customer name is required.';
    }
    
    if (orderData.items.length === 0) {
      newErrors.items = 'Please add at least one item to the order.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onAddOrder({
      ...orderData,
      total: calculateTotal(),
      timestamp: new Date().toISOString()
    });
    
    // Reset form
    setOrderData({ customerName: '', orderId: generateOrderId(), items: [] });
    setVoiceInput({ transcript: '', isListening: false, isSupported: voiceInput.isSupported });
   setManualItem({ item: '', brand: '', quantity: 1, unit: 'pieces', rate: 0 });
    setErrors({});
    setActiveTab('voice');
    setDropdownStates({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Create New Order</h2>
              <p className="text-blue-100">Add items using voice or manual input</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Customer Information */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={orderData.customerName}
                  onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                />
                {errors.customer && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.customer}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  value={orderData.orderId}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Input Method Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'voice'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mic className="w-4 h-4 inline mr-2" />
                Voice Input
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'manual'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Manual Entry
              </button>
            </div>
          </div>

          {/* Voice Input Tab */}
          {activeTab === 'voice' && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Recognition
                </label>
                <textarea
                  ref={textareaRef}
                  placeholder="Transcript will appear here... Try saying: '2 bottles water, 5 pieces apple, 1 kg rice'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={voiceInput.transcript}
                  onChange={(e) => setVoiceInput(prev => ({ ...prev, transcript: e.target.value }))}
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    {voiceInput.isSupported ? (
                      voiceInput.isListening ? (
                        <button
                          onClick={stopVoiceRecognition}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </button>
                      ) : (
                        <button
                          onClick={startVoiceRecognition}
                          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </button>
                      )
                    ) : (
                      <p className="text-gray-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Voice recognition not supported
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={parseVoiceOrder}
                    disabled={!voiceInput.transcript.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Parse Order
                  </button>
                </div>
                
                {errors.voice && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.voice}
                  </p>
                )}
                
                {errors.parse && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.parse}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Manual Input Tab */}
          {activeTab === 'manual' && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Item Manually
                </label>
               <div className="grid grid-cols-1 md:grid-cols-5 gap-3"> {/* Changed from 4 to 5 columns */}
  <input
    type="text"
    placeholder="Item name"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value={manualItem.item}
    onChange={(e) => setManualItem(prev => ({ ...prev, item: e.target.value }))}
  />
  <input
    type="text"
    placeholder="Brand (optional)"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value={manualItem.brand}
    onChange={(e) => setManualItem(prev => ({ ...prev, brand: e.target.value }))}
  />
  <input
    type="number"
    placeholder="Quantity"
    min="1"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value={manualItem.quantity}
    onChange={(e) => setManualItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
  />
  <select
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value={manualItem.unit}
    onChange={(e) => setManualItem(prev => ({ ...prev, unit: e.target.value }))}
  >
    {knownUnits.map(unit => (
      <option key={unit} value={unit}>{unit}</option>
    ))}
  </select>
  <input
    type="number"
    placeholder="Price (₹)"
    min="0"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value={manualItem.rate}
    onChange={(e) => setManualItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
  />
</div>
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={addManualItem}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>
                
                {errors.manual && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.manual}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Items List */}
          {orderData.items.length > 0 && (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="max-h-60 overflow-y-auto">
        {orderData.items.map((item, index) => (
          <div key={item.id} className={`p-4 ${index !== orderData.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.item}</h4>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                      </div>
                      
                      {/* Product Selection Dropdown */}
                      {item.relatedProducts && item.relatedProducts.length > 0 && (
                        <div className="relative product-dropdown-container">
                          <button
                            onClick={() => toggleDropdown(item.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <span>Change Product</span>
                            <svg 
                              className={`w-4 h-4 transition-transform ${dropdownStates[item.id] ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {dropdownStates[item.id] && (
                            <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                              <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                                  Related Products ({item.relatedProducts.length})
                                </div>
                                {item.relatedProducts.map((product) => (
                                  <button
                                    key={product.id}
                                    onClick={() => updateItemDetails(item.id, product)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900 text-sm">
                                          {product.item}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {product.brand} • {product.category}
                                        </div>
                                      </div>
                                      <div className="text-right ml-2">
                                        <div className="font-medium text-gray-900 text-sm">
                                          ₹{product.rate.toLocaleString()}
                                        </div>
                                        {product.rate !== item.rate && (
                                          <div className="text-xs text-green-600">
                                            {product.rate > item.rate ? '+' : ''}
                                            ₹{(product.rate - item.rate).toLocaleString()}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500 ml-2">{item.unit}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{(item.quantity * item.rate).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">₹{item.rate.toLocaleString()} each</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-600">₹{calculateTotal().toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
)}

          {errors.items && (
            <p className="text-red-500 text-sm mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.items}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitOrder

              }
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;