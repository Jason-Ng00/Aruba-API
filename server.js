const express = require('express');
const auth = require('basic-auth')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json())
app.use(express.urlencoded())

let data = [{
  'id':1,
  'user': 'test1'
}]

let issue_data_list = []

let data_list = []

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

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/data', isAuth, (req, res) => {
  res.send(data);
});

app.get('/powerbi-data', isAuth, (req, res) => {
  res.send(data_list);
});

app.post('/data', isAuth, async (req, res) => {
  const content = {requestBody: req.body}
  // console.log(req.body)
  if (!content) {
    return res.sendStatus(400);
  }

  data.push(content)
  all_data = content['requestBody']

  let all_data_list = []
  let list
  
  
  for (var curr_data of all_data) {
    list = flattenJson(curr_data)
    data_list.push(list)
  }
  await fetch('https://api.powerbi.com/beta/5ba5ef5e-3109-4e77-85bd-cfeb0d347e82/datasets/60e4f48b-7f5b-4b04-aad2-47d76b8d901d/rows?key=Ztn0B0hFc%2FWfoePc2rXNcujNfiq70u24xTc1NF3VLmiq2CkYAMQgrQAiTHzMOwUqF1AkG%2FCjMl0TOXUuD5aK4w%3D%3D', {
    method: 'POST',
    body: JSON.stringify(data_list)
  }).then((res) => {console.log(res.status);console.log(res.statusText)})

  res.send(data_list);
});

app.post('/issue-data', isAuth, (req, res) => {
  const content = {requestBody: req.body}
  console.log(req.body)
  if (!content) {
    return res.sendStatus(400);
  }

  data.push(content)
  all_data = content['requestBody']

  let all_data_list = []
  let list
  for (var curr_data of all_data) {
    console.log(curr_data)
    list = flattenJson(curr_data)
    data_list.push(list)
  }

  res.send(data_list);
});

function flattenJson(ori) {
  let obj = {}
  obj['timestamp'] = ori['timestamp']
  obj['code'] = ori['code']
  obj['target'] = ori['target']
  obj['protocol'] = ori['protocol']
  obj['packets_sent'] = ori['packets_sent']
  obj['packets_received'] = ori['packets_received']
  obj['packets_dropped'] = ori['packets_dropped']
  obj['latency_milliseconds'] = ori['latency_milliseconds']
  obj['latency_min_milliseconds'] = ori['latency_min_milliseconds']
  obj['latency_max_milliseconds'] = ori['latency_max_milliseconds']
  obj['jitter_milliseconds'] = ori['jitter_milliseconds']

  obj['interface_type'] = ori['context']['interface_type']
  obj['interface_name'] = ori['context']['interface_name']
  obj['ip_address'] = ori['context']['ip_address']
  obj['customer_uid'] = ori['context']['customer                     _uid']
  obj['category'] = ori['context']['category']
  obj['default_gateway'] = ori['context']['default_gateway']
  obj['dhcp_server'] = ori['context']['dhcp_server']
  obj['primary_dns'] = ori['context']['primary_dns']
  obj['secondary_dns'] = ori['context']['secondary_dns']
  obj['operator'] = ori['context']['operator']
  obj['ipv6'] = ori['context']['ipv6']
  obj['qbss_channel_utilisation'] = ori['context']['qbss']['channel_utilisation']
  obj['qbss_station_count'] = ori['context']['qbss']['station_count']
  obj['qbss_available_admission_capacity'] = ori['context']['qbss']['available_admission_capacity']
  obj['mac_address'] = ori['context']['mac_address']
  obj['wifi_ssid'] = ori['context']['wifi_ssid']
  obj['wifi_bssid'] =  ori['context']['wifi_bssid']
  obj['wifi_channel'] =  ori['context']['wifi_channel']
  obj['wifi_frequency'] =  ori['context']['wifi_frequency']
  obj['wifi_signal_level'] = ori['context']['wifi_signal_level']
  obj['hierarchy_node_path'] = ori['context']['hierarchy_node_path']
  obj['hierarchy_node_name'] = ori['context']['hierarchy_node_name']
  obj['network_uid'] = ori['context']['network_uid']
  obj['network_name'] = ori['context']['network_name']
  obj['service_uid'] = ori['context']['service_uid']
  obj['service_name'] = ori['context']['service_name']
  obj['sensor_name'] = ori['context']['sensor_name']
  obj['sensor_serial'] = ori['context']['sensor_serial']
  obj['sensor_uid'] = ori['context']['sensor_uid']

  return obj
}

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