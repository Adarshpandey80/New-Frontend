export default function ChartModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur flex items-center justify-center">
      <div className="relative bg-[#020617] rounded-2xl shadow-2xl w-[95vw] h-[90vh] p-5 border border-white/10">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xl text-white hover:text-red-400 transition"
        >
          ✕
        </button>

        <div className="w-full h-full">
          {children}
        </div>

      </div>
    </div>
  );
}
