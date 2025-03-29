
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="w-24 h-24 bg-swiggy-orange/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl font-bold text-swiggy-orange">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-swiggy-orange hover:bg-swiggy-dark-orange">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
