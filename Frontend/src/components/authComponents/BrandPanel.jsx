import logo from "../../assets/imag.png";

const FEATURES = [
  { label: "10,000+ Colour Shades", swatch: "#e74c3c" },
  { label: "Enterprise-Grade Security", swatch: "#2c2c54" },
  { label: "Pan-India Delivery", swatch: "#27ae60" },
];

export function BrandPanel() {
  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bp-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 12px;
          transition: background 0.2s ease, transform 0.2s ease;
          animation: fadeSlideUp 0.5s ease both;
        }
        .bp-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
        }
        .bp-root {
          flex: 1;
          max-width: 500px;
          padding: 48px 20px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .bp-vision {
          display: inline-block;
          background: linear-gradient(
            90deg,
            #e74c3c 0%,
            #f39c12 20%,
            #2ecc71 40%,
            #3498db 60%,
            #9b59b6 80%,
            #e91e8c 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        @media (max-width: 1024px) {
          .bp-root {
            display: none;
          }
        }
      `}</style>

      <div className="bp-root">
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={logo}
              alt="Berger Paints logo"
              style={{
                height: 58,
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 35,
                  fontWeight: 900,
                  color: "#1a1a2e",
                  letterSpacing: 0.5,
                  lineHeight: 1,
                }}
              >
                BERGER
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#8a8a8a",
                }}
              >
                Paint Your Imagination
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 48,
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Colour every
            <br />
            <span
              className="bp-vision"
              style={{ fontStyle: "italic" }}
            >
              {/*545a48 */}
              vision
            </span>{" "}
            to life.
          </h1>
          <p
            style={{
              fontSize: 12.5,
              color: "#7a6a5a",
              lineHeight: 1.65,
              marginTop: 16,
              marginBottom: 0,
            }}
          >
            India's most trusted paint brand — explore  palettes, find <br />
            inspiration &amp; order with confidence.
          </p>
        </div>

        {/* Feature List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bp-feature-row"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span
                className="bp-dot"
                style={{ background: f.swatch }}
              />
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#1a1a2e",
                }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}