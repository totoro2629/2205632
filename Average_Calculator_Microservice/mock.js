const express = require('express');
const app = express();
const PORT = 8080;

const mockData = {
    primes: [2, 3, 5, 7, 13],
    fibo: [55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765],
    even: [8, 10, 12, 14, 16, 18, 20, 22, 24, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56],
    rand: [12, 19, 25, 7, 4, 24, 27, 27, 30, 21, 14, 18, 23]
  };

  app.get('/evaluation-service/:type', (req, res) => {
    const typeMap = {
      primes: 'primes',
      fibo: 'fibo',
      even: 'even',
      rand: 'rand'
    };
    
    const dataType = typeMap[req.params.type];
    if (!dataType) return res.status(404).send('Not found');
    
    res.json({
      numbers: mockData[dataType]
    });
  });

  app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
  });