import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome",
          "dashboard": "Dashboard",
          "agent": "InWallet Agent",
          "portfolio": "Portfolio",
          "market": "Market",
          "news": "News",
          "transactions": "Transactions",
          "goals": "Financial Goals",
          "total_net_worth": "TOTAL NET WORTH",
          "income": "TOTAL INCOME",
          "expense": "REAL EXPENSES",
          "assets": "Assets",
          "health_score": "Financial Health Score",
          "ai_insights": "AI Strategic Insights",
          "logout": "Logout",
          "profile": "Profile",
          "settings": "Settings",
          "buy": "Buy",
          "sell": "Sell",
          "add_asset": "Add Asset",
          "calculate": "Calculate",
          "export_pdf": "Export Report (PDF)",
          "recurring": "Recurring",
          "inflation": "Inflation",
          "emergency": "Emergency Fund",
          "simulator": "Simulator",
          "dca": "DCA Planner"
        }
      },
      tr: {
        translation: {
          "welcome": "Hoş Geldiniz",
          "dashboard": "Ana Ekran",
          "agent": "InWallet Agent",
          "portfolio": "Portföy",
          "market": "Piyasa",
          "news": "Haberler",
          "transactions": "İşlemler",
          "goals": "Finansal Hedefler",
          "total_net_worth": "TOPLAM NET VARLIK",
          "income": "TOPLAM GELİR",
          "expense": "GERÇEK GİDERLER",
          "assets": "Varlıklar",
          "health_score": "Finansal Sağlık Skoru",
          "ai_insights": "AI Stratejik Öngörüler",
          "logout": "Çıkış Yap",
          "profile": "Profil",
          "settings": "Ayarlar",
          "buy": "Al",
          "sell": "Sat",
          "add_asset": "Varlık Ekle",
          "calculate": "Hesapla",
          "export_pdf": "Rapor Al (PDF)",
          "recurring": "Düzenli",
          "inflation": "Enflasyon",
          "emergency": "Acil Durum Fonu",
          "simulator": "Senaryo Simülatörü",
          "dca": "DCA Planlayıcı"
        }
      }
    },
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
