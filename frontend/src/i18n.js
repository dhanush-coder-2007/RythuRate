import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "RythuRate",
      "search_placeholder": "Search for crops (e.g., Tomato)...",
      "locate_me": "📍 Use My GPS Location",
      "or": "--- OR ---",
      "select_state": "Select State",
      "select_district": "Select District",
      "get_prices": "Get Prices",
      "current_price": "Current Price",
      "per_quintal": "/ quintal",
      "trend_increase": "Price Up",
      "trend_decrease": "Price Down",
      "trend_stable": "Stable",
      "ai_prediction": "AI Prediction (Next 7 Days):",
      "last_updated": "Last updated:",
      "no_crops": "No crop data found for this location.",
      "loading": "Fetching latest prices..."
    }
  },
  te: {
    translation: {
      "app_title": "రైతురేట్",
      "search_placeholder": "పంటల కోసం వెతకండి (ఉదా., టమాటా)...",
      "locate_me": "📍 నా ప్రస్తుత స్థానాన్ని వాడండి",
      "or": "--- లేదా ---",
      "select_state": "రాష్ట్రాన్ని ఎంచుకోండి",
      "select_district": "జిల్లాను ఎంచుకోండి",
      "get_prices": "ధరలను చూడండి",
      "current_price": "ప్రస్తుత ధర",
      "per_quintal": "/ క్వింటాల్‌కు",
      "trend_increase": "ధర పెరిగింది",
      "trend_decrease": "ధర తగ్గింది",
      "trend_stable": "స్థిరంగా ఉంది",
      "ai_prediction": "AI అంచనా (తదుపరి 7 రోజులు):",
      "last_updated": "చివరిగా నవీకరించబడింది:",
      "no_crops": "ఈ ప్రాంతానికి ఎలాంటి పంటల డేటా కనుగొనబడలేదు.",
      "loading": "తాజా ధరలను పొందుతున్నాము..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
