import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
      aria-label="Back"
      className="fixed left-4 top-20 z-40 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-[#0d2b2b] shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-white hover:text-[#2abfbf]"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
};

export default BackButton;