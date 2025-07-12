import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
  // State to manage the current page view: 'roleSelection' or 'authForm'
  const [currentPage, setCurrentPage] = useState('roleSelection');
  // State to store the selected role: 'retailer', 'distributor', or 'agent'
  const [selectedRole, setSelectedRole] = useState(null);
  // State to manage the authentication form type: 'login' or 'signup'
  const [authFormType, setAuthFormType] = useState('login');

  // Function to handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('authForm'); // Navigate to the authentication form
    setAuthFormType('login'); // Default to login when a role is selected
  };

  // Function to navigate back to role selection
  const handleBackToRoles = () => {
    setCurrentPage('roleSelection');
    setSelectedRole(null); // Clear selected role
  };

  // Function to toggle between login and signup forms
  const toggleAuthFormType = () => {
    setAuthFormType(prevType => (prevType === 'login' ? 'signup' : 'login'));
  };

  // Render the appropriate component based on currentPage state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-white text-white font-inter flex items-center justify-center p-4">
      {currentPage === 'roleSelection' ? (
        <RoleSelection onSelectRole={handleRoleSelect} />
      ) : (
        <AuthForm
          role={selectedRole}
          formType={authFormType}
          onBack={handleBackToRoles}
          onToggleFormType={toggleAuthFormType}
        />
      )}
    </div>
  );
};

// Role Selection Component
const RoleSelection = ({ onSelectRole }) => {
  const roles = [
    { name: 'Retailer', icon: '🛍️' },
    { name: 'Distributor', icon: '🚚' },
    { name: 'Agent', icon: '🤝' },
  ];

  return (
    <div className="w-full max-w-5xl bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-2xl p-32 transform transition-all duration-300 hover:scale-[1.01]">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome! Choose Your Role
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roles.map((role) => (
          <div
            key={role.name}
            onClick={() => onSelectRole(role.name.toLowerCase())}
            className="flex flex-col items-center justify-center p-8 bg-gray-700 bg-opacity-60 rounded-2xl shadow-xl cursor-pointer hover:bg-purple-700 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-transparent hover:border-purple-500"
          >
            <span className="text-6xl mb-4">{role.icon}</span>
            <h2 className="text-2xl font-semibold text-white">{role.name}</h2>
            <p className="text-gray-300 text-center mt-2 text-sm">
              Access features tailored for {role.name.toLowerCase()}s.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Authentication Form Component (Login/Signup)
const AuthForm = ({ role, formType, onBack, onToggleFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (formType === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (formType === 'login') {
        // In a real app, you'd send email/password to a backend for login
        setMessage(`Logging in as ${role} with email: ${email}`);
      } else {
        // In a real app, you'd send email/password to a backend for signup
        setMessage(`Signing up as ${role} with email: ${email}`);
      }
      // Clear form fields after submission
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-3 bg-gray-700 bg-opacity-50 rounded-full text-white text-xl hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Back to role selection"
      >
        &larr;
      </button>

      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        {formType === 'login' ? 'Login' : 'Sign Up'} as {role}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-200"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-200"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {formType === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-200"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {message && (
          <p className="text-center text-sm font-medium text-yellow-400 mt-4">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {formType === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          {formType === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={onToggleFormType}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 focus:outline-none focus:underline"
          >
            {formType === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default App;





const cards = [
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/apple_intelligence__gbh77cvflkia_large.jpg", title: "Shop" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/camera__exi2qfijti0y_large.jpg", title: "Inventory" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/privacy__ckc0wa30o55y_large_2x.jpg", title: "Orders" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/safety__bwp7rsowtjiu_large.jpg", title: "Shelf" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/apple_intelligence__gbh77cvflkia_large.jpg", title: "You" }
  ];