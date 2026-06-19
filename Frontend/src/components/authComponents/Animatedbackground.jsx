import { motion } from "framer-motion";

const BLOBS = [
  { size: 500, top: "-10%", left: "-10%", colorDark: "#6c3483cc", colorLight: "#e74c3c44", dur: 18 },
  { size: 400, top: "60%",  left: "70%",  colorDark: "#1a5276cc", colorLight: "#8e44ad33", dur: 22 },
  { size: 350, top: "30%",  left: "50%",  colorDark: "#512e5fcc", colorLight: "#c0392b33", dur: 15 },
  { size: 300, top: "70%",  left: "10%",  colorDark: "#0e6655cc", colorLight: "#e67e2244", dur: 20 },
];

const DROP_COLORS = ["#e74c3c", "#f39c12", "#8e44ad", "#27ae60", "#2980b9"];

const DROPS = Array.from({ length: 18 }, (_, i) => ({
  width: Math.random() * 12 + 4,
  height: Math.random() * 12 + 4,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  color: DROP_COLORS[i % 5],
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

export function AnimatedBackground({ dark }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: dark
            ? "linear-gradient(135deg,#0f0c29 0%,#1a1040 40%,#0d1b2a 100%)"
            : "linear-gradient(135deg,#fdf6ec 0%,#f0e6d3 35%,#e8d5c4 65%,#dfc9b8 100%)",
        }}
      />

      {/* Animated blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: dark ? b.colorDark : b.colorLight,
          }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Floating paint drops */}
      {DROPS.map((drop, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute rounded-full opacity-20"
          style={{
            width: drop.width,
            height: drop.height,
            left: drop.left,
            top: drop.top,
            background: drop.color,
          }}
          animate={{ y: [0, -60, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Wave SVG at bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path
          d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
          fill={dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)"}
          animate={{
            d: [
              "M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z",
              "M0,40 C360,0 1080,120 1440,40 L1440,120 L0,120 Z",
              "M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}