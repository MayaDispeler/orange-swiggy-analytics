import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Enhanced background with gradient and mesh */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/30 z-0"></div>
        
        {/* Mesh pattern overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.07] mix-blend-overlay" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        {/* Radial gradient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-indigo-500/5 to-transparent z-0"></div>
        
        {/* Animated color blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-600/10 blur-3xl z-0 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-25%] left-[-15%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-400/5 blur-3xl z-0 pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        
        {/* Smaller colorful orbs */}
        <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/5 to-rose-500/5 blur-2xl z-0 pointer-events-none animate-float" style={{ animationDuration: '18s' }}></div>
        <div className="absolute top-[60%] right-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-l from-emerald-500/5 to-teal-500/5 blur-2xl z-0 pointer-events-none animate-float" style={{ animationDuration: '22s', animationDelay: '5s' }}></div>
        <div className="absolute top-[10%] left-[60%] w-[200px] h-[200px] rounded-full bg-gradient-to-bl from-amber-400/5 to-yellow-500/5 blur-xl z-0 pointer-events-none animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}></div>
        
        {/* Noise texture overlay (subtle) */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      </div>
      
      {/* Content container */}
      <div className="flex w-full h-full relative z-10">
        {/* Sidebar */}
        <div className="relative z-20">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
