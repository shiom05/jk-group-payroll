import React from "react";
import { type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

const Layout = ({ children }: { children: React.ReactNode }) => {
       const { auth: { user } } = usePage<SharedData>().props;
       const directToDashboard = ()=>{
        router.get('/dashboard');
       }
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="text-xl font-bold">JK SECURITY GROUP</div>
          {user && <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition !cursor-pointer">
            Logout
          </button>}

          <button onClick={directToDashboard} className="bg-yellow-600 px-4 py-2 rounded hover:bg-amber-600 transition !cursor-pointer">
            Dashboard
          </button>

        </nav>
        <main className="flex-grow">{children}</main>
      </div>
    );
  };
  
  export default Layout;
  