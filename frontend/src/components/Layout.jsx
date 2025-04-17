import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setAnimationClass('animate-slide-in-left');
      setIsMobileMenuOpen(true);
    } else {
      setAnimationClass('animate-slide-out-left');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 300);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar (conditional render) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 animate-fade-in"
            onClick={toggleMobileMenu}
          />
          
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 w-64 bg-background ${animationClass}`}>
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile header */}
        <div className="flex md:hidden items-center h-16 px-4 border-b w-full">
          <Button variant="ghost" size="icon" className="mr-2" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibold">Shadbate</div>
        </div>
        
        {/* Desktop navbar */}
        <div className="hidden md:block w-full">
          <Navbar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
