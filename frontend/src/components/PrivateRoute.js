import { useAuth } from "./AuthContext";
import Login from "../pages/Login";
const PrivateRoute = ({ children}) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
     return (
         
        <div className="flex flex-col min-h-screen">
          
          {/* Page Content */}
          <main className={`flex-grow blur-background`}>{<div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            >
              <div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
              >
                <Login />
              </div>
            </div>}</main>

          
        </div>
      ); // Simulate clicking the login button
   // Prevent rendering the protected content
  }

  return children;
};

export default PrivateRoute;