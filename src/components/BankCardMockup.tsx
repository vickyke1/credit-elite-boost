import { useState } from "react";
import { Wifi } from "lucide-react";

// Maps each issuing bank to its primary web domain so we can pull the real
// brand logo from a logo CDN (Clearbit). Anything not listed here gracefully
// falls back to the embossed bank-name text below.
const BANK_DOMAINS: Record<string, string> = {
  "Chase": "chase.com",
  "American Express": "americanexpress.com",
  "Capital One": "capitalone.com",
  "Citi": "citi.com",
  "Bank of America": "bankofamerica.com",
  "Wells Fargo": "wellsfargo.com",
  "Discover": "discover.com",
  "Barclays": "barclays.com",
  "U.S. Bank": "usbank.com",
  "PNC": "pnc.com",
  "TD Bank": "td.com",
  "Regions": "regions.com",
  "SunTrust": "suntrust.com",
  "Fifth Third": "53.com",
  "KeyBank": "key.com",
  "Huntington": "huntington.com",
  "Synchrony": "synchrony.com",
  "Navy Federal": "navyfederal.org",
  "USAA": "usaa.com",
  "First National": "fnni.com",
  "Citizens Bank": "citizensbank.com",
  "BB&T": "bbt.com",
  "Union Bank": "unionbank.com",
  "HSBC": "hsbc.com",
  "Goldman Sachs": "goldmansachs.com",
  "Morgan Stanley": "morganstanley.com",
  "Charles Schwab": "schwab.com",
  "Fidelity": "fidelity.com",
  "Vanguard": "vanguard.com",
  "Ally Bank": "ally.com",
  "Marcus": "marcus.com",
  "Truist": "truist.com",
  "BMO Harris": "bmoharris.com",
  "M&T Bank": "mtb.com",
  "Santander": "santanderbank.com",
  "Citizens": "citizensbank.com",
  "First Citizens": "firstcitizens.com",
  "Comerica": "comerica.com",
  "Zions": "zionsbank.com",
  "Webster Bank": "websterbank.com",
  "BOK Financial": "bokfinancial.com",
  "Synovus": "synovus.com",
  "Valley National": "valley.com",
  "Old National": "oldnational.com",
  "First Horizon": "firsthorizon.com",
  "Umpqua": "umpquabank.com",
  "BancorpSouth": "bancorpsouth.com",
  "Arvest": "arvest.com",
  "Frost Bank": "frostbank.com",
  "Associated Bank": "associatedbank.com",
  "Commerce Bank": "commercebank.com",
  "Pinnacle": "pnfp.com",
  "Texas Capital": "texascapitalbank.com",
  "CIT Bank": "cit.com",
};

const getBankLogo = (bankName: string): string | null => {
  const domain = BANK_DOMAINS[bankName];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

// Subtle brand tint applied over the metallic silver base so each card
// visually "belongs" to its issuing bank while keeping the premium look.
const BANK_ACCENTS: Array<{ match: RegExp; color: string }> = [
  { match: /chase/i, color: "#117ACA" },
  { match: /american express|amex/i, color: "#006FCF" },
  { match: /capital one/i, color: "#A6192E" },
  { match: /\bciti\b/i, color: "#056DAE" },
  { match: /bank of america/i, color: "#E31837" },
  { match: /wells fargo/i, color: "#D71E28" },
  { match: /discover/i, color: "#FF6000" },
  { match: /barclays/i, color: "#00AEEF" },
  { match: /u\.s\. bank/i, color: "#0C2074" },
  { match: /navy federal|usaa/i, color: "#003366" },
  { match: /goldman sachs|marcus/i, color: "#6B96C3" },
  { match: /pnc/i, color: "#F58025" },
  { match: /td bank/i, color: "#34A853" },
  { match: /hsbc/i, color: "#DB0011" },
  { match: /truist|bb&t|suntrust/i, color: "#2E1A47" },
  { match: /synchrony/i, color: "#FBC600" },
  { match: /ally/i, color: "#650360" },
];

const getBankAccent = (bankName: string): string => {
  for (const { match, color } of BANK_ACCENTS) {
    if (match.test(bankName)) return color;
  }
  return "#5B6470"; // neutral slate for banks without a mapped brand color
};

interface BankCardMockupProps {
  bankName: string;
  lastFour?: string;
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Premium metallic credit card mockup. Pure CSS — renders a silver gradient
 * card with EMV chip, contactless icon, embossed numbers and expiry date,
 * tilted slightly in 3D with a soft floor shadow underneath.
 */
export const BankCardMockup = ({
  bankName,
  lastFour = "3456",
  size = "sm",
  className = "",
}: BankCardMockupProps) => {
  const accent = getBankAccent(bankName);
  const lg = size === "lg";

  // Real bank logo (falls back to the embossed name if it's missing or fails).
  const logoUrl = getBankLogo(bankName);
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = logoUrl && !logoFailed;

  const embossStyle = {
    color: "#3a3f45",
    textShadow: "0 1px 0 rgba(255,255,255,0.75), 0 -1px 1px rgba(0,0,0,0.3)",
  };

  return (
    <div
      className={`relative ${lg ? "pb-6" : "pb-4"} ${className}`}
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      {/* Soft shadow under the card */}
      <div className="absolute bottom-0 left-1/2 h-4 w-[82%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-md" />

      <div
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-xl border border-white/50"
        style={{
          transform: "rotateY(-7deg) rotateX(4deg)",
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(135deg, #f8f9fa 0%, #e4e7ea 25%, #c6cacf 50%, #edeff1 72%, #b6bac0 100%)",
          boxShadow:
            "0 20px 40px -14px rgba(15, 23, 42, 0.5), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Metallic sweep highlights */}
        <div
          className="absolute -left-1/4 -top-3/4 h-[170%] w-[120%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 62%)",
          }}
        />
        <div
          className="absolute -right-1/3 top-1/4 h-[130%] w-[90%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 58%)",
          }}
        />
        {/* Brand color tint */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(125deg, ${accent}29 0%, transparent 42%, ${accent}38 100%)`,
          }}
        />

        <div
          className={`relative flex h-full flex-col justify-between ${lg ? "p-6" : "p-4"}`}
        >
          {/* Bank logo (with name fallback) + contactless */}
          <div className="flex items-start justify-between gap-2">
            {showLogo ? (
              <img
                src={logoUrl}
                alt={bankName}
                onError={() => setLogoFailed(true)}
                className={`w-auto max-w-[62%] object-contain object-left ${
                  lg ? "h-8" : "h-5"
                }`}
              />
            ) : (
              <span
                className={`font-bold tracking-wide text-[#23272d] ${
                  lg ? "text-xl" : "text-sm leading-tight"
                }`}
              >
                {bankName}
              </span>
            )}
            <Wifi
              className={`shrink-0 rotate-90 text-[#3a3f45]/80 ${lg ? "h-6 w-6" : "h-4 w-4"}`}
            />
          </div>

          {/* EMV chip + embossed card number */}
          <div className={lg ? "space-y-3" : "space-y-1.5"}>
            <div
              className={`relative rounded-md border border-black/15 ${
                lg ? "h-9 w-12" : "h-6 w-8"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, #efe9da 0%, #d6cfbe 45%, #b5ae9c 100%)",
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/20" />
              <div className="absolute inset-y-0 left-1/3 w-px bg-black/20" />
              <div className="absolute inset-y-0 right-1/3 w-px bg-black/20" />
              <div className="absolute inset-1 rounded-sm border border-black/15" />
            </div>
            <div
              className={`font-mono font-semibold ${
                lg ? "text-xl tracking-[0.18em]" : "text-xs tracking-[0.14em]"
              }`}
              style={embossStyle}
            >
              1234 5678 9012 {lastFour.padStart(4, "0")}
            </div>
          </div>

          {/* Cardholder + expiry */}
          <div className="flex items-end justify-between">
            <div>
              <div
                className={`uppercase tracking-widest text-[#3a3f45]/60 ${
                  lg ? "text-[10px]" : "text-[8px]"
                }`}
              >
                Card Holder
              </div>
              <div
                className={`font-medium tracking-wide ${lg ? "text-sm" : "text-[10px]"}`}
                style={embossStyle}
              >
                AUTHORIZED USER
              </div>
            </div>
            <div className="text-right">
              <div
                className={`uppercase tracking-widest text-[#3a3f45]/60 ${
                  lg ? "text-[10px]" : "text-[8px]"
                }`}
              >
                Valid Thru
              </div>
              <div
                className={`font-mono font-semibold ${lg ? "text-sm" : "text-[10px]"}`}
                style={embossStyle}
              >
                12/29
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
