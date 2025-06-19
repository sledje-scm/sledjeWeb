import { useAuth } from "./AuthContext";
import Login from "./Login";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Page Content */}
        <main className={`flex-grow blur-background`}>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          >
            <div
              className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl"
              style={{
                height: "90vh", // Occupy 90% of the viewport height
                overflowY: "auto", // Allow scrolling if content overflows
              }}
            >
              <Login />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;