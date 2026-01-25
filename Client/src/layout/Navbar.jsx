import { useState } from "react";
import { Menu, X, Bell, Search, Sun, Moon, User } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="w-full bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

       <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
          📊 Blackcoffer Analytics
        </h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-[320px]">
          <Search size={18} className="text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search insights..."
            className="bg-transparent outline-none px-2 w-full text-gray-700 dark:text-white"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
           className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600 dark:text-white" />}
          </button>

         <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition">
          <Bell size={20} className="text-gray-600 dark:text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Adarsh
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Full Stack Dev
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Search Bar */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
            <Search size={18} className="text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search insights..."
              className="bg-transparent outline-none px-2 w-full text-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
