import React, { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { wordsToNumbers } from 'words-to-numbers';

// Sample product database for order parsing
const productDatabase = [
  { item: "Product A", brand: "Brand X", rate: 100 },
  { item: "Product B", brand: "Brand Y", rate: 150 },
  { item: "Product C", brand: "Brand Z", rate: 80 },
  { item: "Product D", brand: "Brand X", rate: 90 },
  { item: "Product E", brand: "Brand X", rate: 120 },
  { item: "Product F", brand: "Brand Y", rate: 70 },
  { item: "Product G", brand: "Brand Z", rate: 60 },
  { item: "Product H", brand: "Brand X", rate: 200 },
];

const knownUnits = ['kg', 'kilogram', 'g', 'gram', 'liters', 'liter', 'bottles', 'packets', 'pieces', 'dozen', 'box', 'boxes', 'l', 'ml', 'milliliter', 'cups', 'pints', 'quarts', 'ounces'];

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
    
    orders.push({
      item,
      quantity: parseFloat(quantity),
      unit
    });
    
    console.log(`Parsed: ${quantity} × ${itemText.trim()} (${unit})`);
  }
  
  return orders;
}

const CreateOrder = ({ isOpen, onClose, onAddOrder }) => {
  const [newOrder, setNewOrder] = useState({ customerName: '', orderId: '', items: [] });
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedItems, setParsedItems] = useState([]);
  const recognitionRef = useRef(null);

  // Generate a unique order ID
  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD${timestamp.toString().slice(-4)}${randomNum}`;
  };
  const createSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  
  // Check for different speech recognition APIs
  const SpeechRecognition = window.SpeechRecognition || 
                           window.webkitSpeechRecognition 
                           
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false; // Changed to false for better mobile support
  recognition.interimResults = false; // Changed to false for better mobile support
  recognition.maxAlternatives = 1;
  recognition.lang = 'en-US'; // Set language explicitly

  return recognition;
};
  // Initialize recognition
useEffect(() => {
  try {
    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        setTranscript(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access to use voice input.');
        } else if (event.error === 'no-speech') {
          alert('No speech was detected. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Automatically restart listening on mobile
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }
      };
    }
  } catch (error) {
    console.error('Error initializing speech recognition:', error);
  }

  return () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
}, [isOpen, isListening]);


const startListening = async () => {
  try {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try using Chrome.');
      return;
    }

    // For iOS Safari, we need to request permission differently
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error('Microphone permission denied:', err);
        alert('Please allow microphone access to use voice input.');
        return;
      }
    }

    setTranscript('');
    await recognitionRef.current.start();
    setIsListening(true);
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (error.name === 'NotAllowedError') {
      alert('Please allow microphone access in your browser settings.');
    } else {
      alert('Could not start voice input. Please try again.');
    }
    setIsListening(false);
  }
};

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.quantity * item.rate, 0);

  const handleOrderInput = (field, value) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewOrder = () => {
    if (!newOrder.customerName) {
      newOrder.customerName = "Custom";
    }
    
    const items = parsedItems.length > 0 ? parsedItems : [
      { id: Date.now(), item: "Sample Product", brand: "Brand X", quantity: 1, rate: 100 }
    ];
    
    const orderWithItems = {
      ...newOrder,
      items: items
    };
    
    onAddOrder(orderWithItems);
    
    // Reset state
    setNewOrder({ customerName: '', orderId: '', items: [] });
    setParsedItems([]);
    setTranscript('');
    onClose();
  };

  const parseOrder = () => {
    try {
      const parsed = parseMultipleOrders(transcript);
      console.log("Parsed items:", parsed);
      
      // Map the parsed items to the format expected by your app
      const mappedItems = parsed.map(parsedItem => {
        // Try to find a matching product in the database
        const matchingProduct = productDatabase.find(
          product => product.item.toLowerCase().includes(parsedItem.item.toLowerCase()) ||
                    parsedItem.item.toLowerCase().includes(product.item.toLowerCase())
        );
        
        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          item: matchingProduct ? matchingProduct.item : parsedItem.item,
          brand: matchingProduct ? matchingProduct.brand : "Unknown",
          quantity: parsedItem.quantity || 1,
          rate: matchingProduct ? matchingProduct.rate : 100, // Default price if not found
          unit: parsedItem.unit || "piece"
        };
      });
      
      setParsedItems(mappedItems);
    } catch (error) {
      console.error("Error parsing order:", error);
      alert("Could not parse the order. Please try again or enter manually.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Take Order</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full px-3 py-2 border rounded"
            value={newOrder.customerName}
            onChange={(e) => handleOrderInput("customerName", e.target.value)}
          />
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Order ID (Auto-generated)"
              className="w-full px-3 py-2 border rounded bg-gray-100"
              value={newOrder.orderId}
              readOnly
            />
          </div>
          
          <div className="relative">
            <textarea
              placeholder="Enter order details or use voice input..."
              className="w-full px-3 py-2 border rounded h-32"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            ></textarea>
            
            <div className="flex justify-between mt-2">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <MicOff className="mr-1 w-4 h-4" /> Stop Listening
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <Mic className="mr-1 w-4 h-4" /> Start Listening
                </button>
              )}
              
              <button
                onClick={parseOrder}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
              >
                Parse Order
              </button>
            </div>
          </div>
          
          {parsedItems.length > 0 && (
            <div className="border p-3 rounded bg-gray-50">
              <h3 className="text-sm font-semibold mb-2">Parsed Items:</h3>
              <ul className="text-sm">
                {parsedItems.map((item, index) => (
                  <li key={index} className="flex justify-between mb-1">
                    <span>{item.quantity} {item.unit}x {item.item} ({item.brand})</span>
                    <span>₹{item.rate * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right text-sm font-semibold">
                Total: ₹{calculateTotal(parsedItems)}
              </div>
            </div>
          )}
          
          <button
            onClick={handleAddNewOrder}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Add Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;