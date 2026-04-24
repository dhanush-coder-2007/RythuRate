const axios = require('axios');
const cron = require('node-cron');
const Crop = require('../models/Crop');

// Data.gov.in Agmarknet Resource ID
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'; 

const indiaLocations = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar"],
  "Delhi (NCT)": ["Central Delhi", "East Delhi", "New Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur"],
  "Jammu and Kashmir": ["Anantnag", "Bandipore", "Baramulla"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Pune", "Nashik"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima"],
  "Odisha": ["Angul", "Balangir", "Balasore"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara"],
  "Tamil Nadu": ["Ariyalur", "Chennai", "Coimbatore"],
  "Telangana": ["Adilabad", "Hyderabad", "Khammam", "Rangareddy", "Warangal"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Lucknow", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Dehradun"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Kolkata"]
};

function generateMockData() {
  const crops = [
    { name: 'Tomato', category: 'Vegetables', basePrice: 2500 },
    { name: 'Onion', category: 'Vegetables', basePrice: 1800 },
    { name: 'Potato', category: 'Vegetables', basePrice: 1200 },
    { name: 'Cabbage', category: 'Vegetables', basePrice: 800 },
    { name: 'Carrot', category: 'Vegetables', basePrice: 2000 },
    { name: 'Garlic', category: 'Vegetables', basePrice: 8000 },
    { name: 'Ginger', category: 'Vegetables', basePrice: 5000 },
    { name: 'Cauliflower', category: 'Vegetables', basePrice: 1500 },
    { name: 'Brinjal', category: 'Vegetables', basePrice: 1300 },
    { name: 'Lady Finger', category: 'Vegetables', basePrice: 2200 },
    { name: 'Rice (Paddy)', category: 'Cereals', basePrice: 2200 },
    { name: 'Wheat', category: 'Cereals', basePrice: 2500 },
    { name: 'Maize', category: 'Cereals', basePrice: 1900 },
    { name: 'Jowar', category: 'Cereals', basePrice: 2800 },
    { name: 'Cotton', category: 'Fibers', basePrice: 7500 },
    { name: 'Chilli (Red)', category: 'Spices', basePrice: 15000 },
    { name: 'Turmeric', category: 'Spices', basePrice: 8500 },
    { name: 'Mango', category: 'Fruits', basePrice: 4500 },
    { name: 'Banana', category: 'Fruits', basePrice: 1500 },
    { name: 'Apple', category: 'Fruits', basePrice: 8000 },
    { name: 'Orange', category: 'Fruits', basePrice: 4000 },
    { name: 'Grapes', category: 'Fruits', basePrice: 6000 },
    { name: 'Groundnut', category: 'Oilseeds', basePrice: 5500 },
    { name: 'Soyabean', category: 'Oilseeds', basePrice: 4500 },
    { name: 'Mustard', category: 'Oilseeds', basePrice: 5200 },
    { name: 'Chana', category: 'Pulses', basePrice: 5000 },
    { name: 'Moong', category: 'Pulses', basePrice: 7500 },
    { name: 'Toor Dal', category: 'Pulses', basePrice: 9000 }
  ];

  const generated = [];

  for (const [state, districts] of Object.entries(indiaLocations)) {
    for (const district of districts) {
      const market = `${district} Market`;
      
      // Each market gets 8-12 random crops
      const marketCrops = crops.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 8);

      for (const item of marketCrops) {
        const randomVariation = (Math.random() * 0.4) - 0.2;
        const modalPrice = Math.floor(item.basePrice * (1 + randomVariation));
        const predictVariation = (Math.random() * 0.15) - 0.05;
        const predictedPrice = Math.floor(modalPrice * (1 + predictVariation));

        generated.push({
          name: item.name,
          state: state,
          district: district,
          market: market,
          min_price: Math.floor(modalPrice * 0.9),
          max_price: Math.floor(modalPrice * 1.1),
          modal_price: modalPrice,
          commodity_category: item.category,
          arrival_date: new Date(),
          trend: randomVariation > 0.05 ? 'up' : (randomVariation < -0.05 ? 'down' : 'stable'),
          future_price_prediction: predictedPrice,
          prediction_trend: predictVariation > 0.02 ? 'increase' : (predictVariation < -0.02 ? 'decrease' : 'stable')
        });
      }
    }
  }
  return generated;
}

async function fetchAndStoreDailyData() {
  const apiKey = process.env.DATA_GOV_IN_API_KEY;
  let useMockData = false;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️ No valid Data.gov.in API key found in .env. Falling back to High-Quality Mock Data.');
    useMockData = true;
  }

  try {
    let recordsToProcess = [];

    if (!useMockData) {
      console.log('Fetching live crop data from Data.gov.in...');
      const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, {
        params: {
          'api-key': apiKey,
          'format': 'json',
          'limit': 1000
        }
      });

      const records = response.data.records;
      if (!records || records.length === 0) {
        console.log('No records found in API response. Falling back to mock data.');
        useMockData = true;
      } else {
        // Map raw API records to our schema
        recordsToProcess = records.map(record => {
          const currentPrice = parseInt(record.modal_price) || 0;
          const predictedPrice = Math.floor(currentPrice * 1.02); // Simple mock AI prediction
          return {
            name: record.commodity,
            state: record.state,
            district: record.district,
            market: record.market,
            min_price: parseInt(record.min_price),
            max_price: parseInt(record.max_price),
            modal_price: currentPrice,
            commodity_category: record.group || 'Unknown',
            arrival_date: new Date(record.arrival_date || Date.now()),
            trend: 'stable',
            future_price_prediction: predictedPrice,
            prediction_trend: 'increase'
          };
        });
      }
    }

    if (useMockData) {
      console.log('Generating realistic mock dataset...');
      recordsToProcess = generateMockData();
    }

    console.log(`Processing ${recordsToProcess.length} records...`);

    for (const cropData of recordsToProcess) {
      await Crop.findOneAndUpdate(
        { 
          name: cropData.name, 
          market: cropData.market, 
          // Match roughly by date to overwrite today's data rather than infinitely duplicate
          arrival_date: { 
            $gte: new Date(new Date().setHours(0,0,0,0)), 
            $lt: new Date(new Date().setHours(23,59,59,999)) 
          }
        },
        { $set: cropData },
        { upsert: true, new: true }
      );
    }
    console.log('Successfully updated database with latest crop data!');
  } catch (error) {
    console.error('Error in fetchAndStoreDailyData:', error.message);
  }
}

// Schedule to run daily at 6 AM
cron.schedule('0 6 * * *', () => {
  fetchAndStoreDailyData();
});

module.exports = {
  fetchAndStoreDailyData,
  generateMockData
};
