const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">

        <div>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            Blackcoffer Analytics
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-indigo-600 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Terms
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
