import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PlusCircle, 
  Database, 
  Home, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const menuItems = [
    { path: '/home', label: 'Home', icon: <Home className="mr-2 h-4 w-4" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
    { path: '/add-data', label: 'Add Data', icon: <PlusCircle className="mr-2 h-4 w-4" /> },
    { path: '/crud-data', label: 'Manage Data', icon: <Database className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen w-64 bg-background border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Shadbate</h2>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {isActive(item.path) ? (
                <Button 
                  className="w-full justify-start bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ) : (
                <Button 
                  variant="ghost"
                  className="w-full justify-start bg-transparent hover:bg-transparent text-gray-700 hover:text-gray-900"
                >
                  {item.icon}
                  {item.label}
                </Button>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start bg-transparent hover:bg-transparent text-gray-700 hover:text-gray-900"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start bg-transparent hover:bg-transparent text-red-500 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
