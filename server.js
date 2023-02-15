const express = require('express');
const bodyParser = require('body-parser')
const auth = require('basic-auth')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

let data = [{
  'id':1,
  'user': 'test1'
}]

// App
const app = express();
app.use(express.json())
app.use(express.urlencoded())

function isAuth(req, res, next) {
  var user = auth(req);

  if (user === undefined || user['name'] !== 'admin' || user['pass'] !== 'arubaUXI') {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
      res.end('Unauthorized');
  } else {
      next();
  }
}

app.get('/', isAuth, (req, res) => {
  res.send('Hello World');
});

app.get('/data', isAuth, (req, res) => {
  res.send(data);
});

app.post('/data', isAuth, (req, res) => {
  const content = {requestBody: req.body}
  console.log(req.body)
  if (!content) {
    return res.sendStatus(400);
  }

  data.push(content)
  res.send(data);
});

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

// Export the Express API
module.exports = app;