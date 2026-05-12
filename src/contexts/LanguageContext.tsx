import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type LangCode = "en" | "hi" | "kn" | "ta" | "te";

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

type Dict = Record<string, string>;
const STRINGS: Record<LangCode, Dict> = {
  en: {
    continue: "Continue",
    safe_payment: "Your payment is safe",
    money_released: "Money released after delivery confirmation",
    need_help: "Need help?",
    place_order: "Place Order",
    pay_upi: "UPI",
    pay_cod: "Cash on Delivery",
    payment_method: "Payment method",
    no_orders: "No orders yet",
    add_product: "Add Product",
    upload_list: "Upload Product List",
    language: "Language",
  },
  hi: {
    continue: "जारी रखें",
    safe_payment: "आपका भुगतान सुरक्षित है",
    money_released: "डिलीवरी पुष्टि के बाद पैसा भेजा जाएगा",
    need_help: "मदद चाहिए?",
    place_order: "ऑर्डर करें",
    pay_upi: "UPI",
    pay_cod: "कैश ऑन डिलीवरी",
    payment_method: "भुगतान का तरीका",
    no_orders: "अभी कोई ऑर्डर नहीं",
    add_product: "उत्पाद जोड़ें",
    upload_list: "उत्पाद सूची अपलोड करें",
    language: "भाषा",
  },
  kn: {
    continue: "ಮುಂದುವರಿಸಿ",
    safe_payment: "ನಿಮ್ಮ ಪಾವತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ",
    money_released: "ವಿತರಣೆ ದೃಢೀಕರಣದ ನಂತರ ಹಣ ಬಿಡುಗಡೆ",
    need_help: "ಸಹಾಯ ಬೇಕೇ?",
    place_order: "ಆದೇಶ ಮಾಡಿ",
    pay_upi: "UPI",
    pay_cod: "ವಿತರಣೆಯ ಮೇಲೆ ನಗದು",
    payment_method: "ಪಾವತಿ ವಿಧಾನ",
    no_orders: "ಇನ್ನೂ ಯಾವುದೇ ಆದೇಶಗಳಿಲ್ಲ",
    add_product: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    upload_list: "ಉತ್ಪನ್ನ ಪಟ್ಟಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    language: "ಭಾಷೆ",
  },
  ta: {
    continue: "தொடரவும்",
    safe_payment: "உங்கள் கட்டணம் பாதுகாப்பானது",
    money_released: "டெலிவரி உறுதிப்படுத்தலுக்குப் பிறகு பணம் வழங்கப்படும்",
    need_help: "உதவி தேவையா?",
    place_order: "ஆர்டர் செய்யவும்",
    pay_upi: "UPI",
    pay_cod: "டெலிவரியில் பணம்",
    payment_method: "கட்டண முறை",
    no_orders: "இதுவரை ஆர்டர்கள் இல்லை",
    add_product: "பொருளைச் சேர்க்கவும்",
    upload_list: "பொருள் பட்டியலை பதிவேற்றவும்",
    language: "மொழி",
  },
  te: {
    continue: "కొనసాగించండి",
    safe_payment: "మీ చెల్లింపు సురక్షితం",
    money_released: "డెలివరీ నిర్ధారణ తర్వాత డబ్బు విడుదల అవుతుంది",
    need_help: "సహాయం కావాలా?",
    place_order: "ఆర్డర్ చేయండి",
    pay_upi: "UPI",
    pay_cod: "డెలివరీపై నగదు",
    payment_method: "చెల్లింపు విధానం",
    no_orders: "ఇంకా ఆర్డర్‌లు లేవు",
    add_product: "ఉత్పత్తిని జోడించండి",
    upload_list: "ఉత్పత్తి జాబితా అప్‌లోడ్ చేయండి",
    language: "భాష",
  },
};

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "coopnet:lang:v1";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    return saved && STRINGS[saved] ? saved : "en";
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      /* noop */
    }
  }, [lang]);

  const t = (key: string) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
