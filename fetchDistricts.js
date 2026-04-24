const fs = require('fs');
const https = require('https');
https.get('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    let output = 'export const indiaLocations = {\n';
    data.states.forEach(stateObj => {
      output += '  "' + stateObj.state + '": ' + JSON.stringify(stateObj.districts) + ',\n';
    });
    output += '};\n';
    fs.writeFileSync('c:/Users/DELL/OneDrive/Desktop/RythuRate/frontend/src/data/indiaLocations.js', output);
    console.log('Successfully generated indiaLocations.js with API data.');
  });
});
