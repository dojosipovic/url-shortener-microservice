require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let storage = [];
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;
  dns.lookup(url, (err, address) => {
    if (err) res.json({ error: 'invalid url' });
    else {
      let shortUrl = storage.length + 1;
      let originalUrl = url;
      let add = { id: shortUrl, addr: address}
      storage.push(add);
      res.json({ original_url : originalUrl, short_url : shortUrl});
    }
  });
});
app.get('/api/shorturl/:short_url', function(req, res) {
  let short_url = parseInt(req.params.short_url);
  let url = storage.find(x => x.id == short_url);
  let address = url.addr
  res.redirect(address);
  console.log(url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
