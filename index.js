const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const LINZ_API_KEY = process.env.LINZ_API_KEY;

app.get('/linz-proxy/*', async (req, res) => {
  try {
    const linzPath = req.params[0];
    const query = req.originalUrl.split('?')[1] || '';

    const linzUrl = `https://api.linz.govt.nz/v1/${linzPath}?${query}`;

    const response = await fetch(linzUrl, {
      headers: {
        'Authorization': `apikey ${LINZ_API_KEY}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(await response.text());
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINZ Proxy server running on port ${PORT}`);
});