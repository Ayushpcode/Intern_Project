import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AnimatedBackground } from "./../components/authComponents/Animatedbackground";
import { BrandPanel } from "./../components/authComponents/BrandPanel";
import { LoginCard } from "./../components/authComponents/LoginCard";
import heroBg1 from "../assets/hero1.png"
import heroBg2 from "../assets/hero2.png"

export default function PaintLoginPage({ onLogin }) {
  const [splash, setSplash] = useState(true);
  const [dark, setDark] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const images = [heroBg1, heroBg2];

  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto switch
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full relative" style={{ fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #a855f744; border-radius: 3px; }
        .ripple {
          position: absolute; border-radius: 50%; transform: scale(0);
          background: rgba(255,255,255,0.35);
          animation: rippleKf 0.6s linear;
          pointer-events: none;
        }
        @keyframes rippleKf { to { transform: scale(4); opacity: 0; } }
      `}</style>

      <>
        <div className="fixed inset-0">
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: i === current ? 1 : 0,
                transition: "opacity 1.5s ease-in-out",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center  lg:justify-center px-4 py-12 ">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:items-stretch gap-6 px-5 pr-12 ">

            <BrandPanel />


            <LoginCard onLogin={onLogin} />

          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
          toastStyle={{
            borderRadius: "16px",
            fontFamily: "'Inter',sans-serif",
            fontSize: "14px",
            fontWeight: 500,
          }}
        />
      </>
    </div>
  );
}
