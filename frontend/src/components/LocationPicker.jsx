import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { indiaLocations } from '../data/indiaLocations';

const LocationPicker = ({ onLocationSubmit }) => {
  const { t } = useTranslation();
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const handleGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Mock reverse geocoding
        onLocationSubmit({ state: 'Telangana', district: 'Hyderabad', search: '' });
      });
    }
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict('');
  };

  return (
    <div>
      <button className="btn-primary" onClick={handleGps}>
        <i className="fa-solid fa-location-crosshairs" style={{marginRight: '8px'}}></i>
        {t('locate_me')}
      </button>
      
      <div style={{ margin: '20px 0', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 'bold' }}>
        {t('or')}
      </div>
      
      <div className="select-group">
        <select className="select-input" value={state} onChange={handleStateChange}>
          <option value="">{t('select_state')}</option>
          {Object.keys(indiaLocations).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select 
          className="select-input" 
          value={district} 
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!state}
        >
          <option value="">{t('select_district')}</option>
          {state && indiaLocations[state] && indiaLocations[state].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      
      <button 
        className="btn-primary" 
        style={{ marginTop: '20px', background: 'linear-gradient(135deg, var(--secondary-accent) 0%, #0284c7 100%)', boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)' }}
        onClick={() => onLocationSubmit({ state, district, search: '' })}
      >
        <i className="fa-solid fa-satellite-dish"></i>
        {t('get_prices')}
      </button>
    </div>
  );
};

export default LocationPicker;
