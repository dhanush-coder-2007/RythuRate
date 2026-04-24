import React from 'react';
import { useTranslation } from 'react-i18next';

const cropIconMap = {
  'paddy': '🌾',
  'rice': '🌾',
  'wheat': '🌾',
  'maize': '🌽',
  'corn': '🌽',
  'tomato': '🍅',
  'potato': '🥔',
  'onion': '🧅',
  'cotton': '☁️',
  'mango': '🥭',
  'banana': '🍌',
  'sugarcane': '🎋',
  'chana': '🫘',
  'gram': '🫘',
  'groundnut': '🥜',
  'peanut': '🥜',
  'chilli': '🌶️',
  'apple': '🍎',
  'orange': '🍊',
  'grapes': '🍇',
  'carrot': '🥕',
  'cabbage': '🥬',
  'cauliflower': '🥦',
  'brinjal': '🍆',
  'eggplant': '🍆',
  'lady finger': '🥒',
  'jowar': '🌾',
  'turmeric': '🫚',
  'moong': '🫘',
  'toor': '🫘',
  'dal': '🫘',
  'soyabean': '🌱',
  'mustard': '🌼',
  'garlic': '🧄',
  'ginger': '🫚'
};

const getCropIcon = (name) => {
  if (!name) return '🌱';
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(cropIconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return '🌱';
};

const CropCard = ({ crop }) => {
  const { t } = useTranslation();

  const getTrendClass = (trend) => {
    if (trend === 'up' || trend === 'increase') return 'trend-up';
    if (trend === 'down' || trend === 'decrease') return 'trend-down';
    return 'trend-stable';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up' || trend === 'increase') return 'fa-arrow-trend-up';
    if (trend === 'down' || trend === 'decrease') return 'fa-arrow-trend-down';
    return 'fa-minus';
  };

  return (
    <div className="crop-card">
      <div className="crop-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          fontSize: '2rem',
          background: 'var(--bg-light)',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          flexShrink: 0
        }}>
          {getCropIcon(crop.name)}
        </div>
        <div>
          <div className="crop-name">{crop.name}</div>
          <div className="crop-market">
            <i className="fa-solid fa-location-dot" style={{marginRight: '6px', color: 'var(--secondary-accent)'}}></i>
            {crop.market}, {crop.district}
          </div>
        </div>
      </div>
      
      <div className="price-section">
        <div>
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'}}>{t('current_price')}</div>
          <span className="current-price">₹{crop.modal_price}</span>
          <span className="price-unit">{t('per_quintal')}</span>
        </div>
        
        <div className={`trend-indicator ${getTrendClass(crop.trend)}`}>
          <i className={`fa-solid ${getTrendIcon(crop.trend)}`}></i>
          {t(`trend_${crop.trend === 'up' ? 'increase' : crop.trend === 'down' ? 'decrease' : 'stable'}`)}
        </div>
      </div>

      {crop.future_price_prediction && (
        <div className="future-prediction">
          <i className="fa-solid fa-wand-magic-sparkles prediction-icon"></i>
          <div className="prediction-text">
            <strong>{t('ai_prediction')}</strong>
            <span>₹{crop.future_price_prediction}</span> 
            <span style={{fontSize: '0.9rem', marginLeft: '5px', color: 'var(--text-secondary)'}}>
               ({crop.prediction_trend === 'increase' ? '▲' : crop.prediction_trend === 'decrease' ? '▼' : '−'})
            </span>
          </div>
        </div>
      )}

      <div className="last-updated">
        <i className="fa-regular fa-clock" style={{marginRight: '5px'}}></i>
        {t('last_updated')} {new Date(crop.arrival_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
      </div>
    </div>
  );
};

export default CropCard;
