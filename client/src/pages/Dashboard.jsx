import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, {user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your upcoming contests will appear here.</h2>
          <p className="text-gray-400">We will build this out in the next phases.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
