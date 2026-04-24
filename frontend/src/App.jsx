import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './index.css';
import './i18n';

import CropCard from './components/CropCard';
import LocationPicker from './components/LocationPicker';

function App() {
  const { t, i18n } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState({ state: '', district: '' });

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  const fetchCrops = async (queryParams) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/crops`, { params: queryParams }).catch(() => null);

      
      if (res && res.data && res.data.length > 0) {
        setCrops(res.data);
      } else {
        setCrops([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCrops({});
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 2 || e.target.value.length === 0) {
      fetchCrops({ ...location, search: e.target.value });
    }
  };

  return (
    <>
      <div className="background-layer"></div>
      <div className="background-overlay"></div>
      
      <div className="app-container">
        <header className="header">
          <button className="language-toggle" onClick={toggleLanguage}>
            <i className="fa-solid fa-language" style={{marginRight: '8px'}}></i>
            {i18n.language === 'en' ? 'తెలుగు' : 'English'}
          </button>
          <div className="title-group">
            <h1>{t('app_title')}</h1>
            <p>Real-time AI-powered agricultural market intelligence.</p>
          </div>
          <div className="search-container" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto', flex: 1 }}>
            <i className="fa-solid fa-magnifying-glass" style={{position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)'}}></i>
            <input 
              type="text" 
              className="search-bar" 
              style={{ paddingLeft: '50px' }}
              placeholder={t('search_placeholder')}
              value={search}
              onChange={handleSearch}
            />
          </div>
        </header>

        <div className="glass-panel">
          <LocationPicker onLocationSubmit={(loc) => {
            setLocation(loc);
            fetchCrops({ ...loc, search });
          }} />
        </div>

        <main className="crops-container">
          {loading ? (
            <div className="loading-state" style={{gridColumn: '1 / -1'}}>
              <i className="fa-solid fa-circle-notch loading-spinner"></i>
              <h2>{t('loading')}</h2>
            </div>
          ) : crops.length > 0 ? (
            crops.map(crop => <CropCard key={crop._id} crop={crop} />)
          ) : (
            <div className="empty-state" style={{gridColumn: '1 / -1'}}>
              <i className="fa-solid fa-seedling" style={{fontSize: '3rem', color: 'rgba(255,255,255,0.2)', marginBottom: '1rem'}}></i>
              <h2>{t('no_crops')}</h2>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
