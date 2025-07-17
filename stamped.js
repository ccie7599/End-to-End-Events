const mqtt = require('mqtt');

// Insecure options — use only for local testing
const options = {
  host: 'localhost',
  port: 8883,
  protocol: 'mqtts',
  rejectUnauthorized: false  // Disables server certificate validation
};

const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  client.subscribe('events-export', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to events-export');
    }
  });

  client.subscribe('ack', (err) => {
    if (err) {
      console.error('Subscription error (ack):', err);
    } else {
      console.log('Subscribed to ack');
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());

    if (topic === 'events-export') {
      payload.edge_time = Date.now();
      const stamped = JSON.stringify(payload);
      client.publish('events-export-stamped', stamped, { qos: 1 }, (err) => {
        if (err) {
          console.error('Publish error (stamped):', err);
        }
      });

    } else if (topic === 'ack') {
      const {
        message_id,
        edge_time,
        ack_time,
        client_id,
        lat,
        lon
      } = payload;

      if (!message_id || !edge_time || !ack_time) {
        console.warn('⚠️ Incomplete ACK received, skipping:', payload);
        return;
      }

      const deliver_time = Date.now() - edge_time;

      const metrics = {
        message_id,
        deliver_time,
        client_id,
        lat,
        lon
      };

      client.publish('metrics', JSON.stringify(metrics), { qos: 1 }, (err) => {
        if (err) {
          console.error('Publish error (metrics):', err);
        } else {
          console.log(`📊 Metrics published for ${message_id}: ${deliver_time}ms`);
        }
      });
    }

  } catch (e) {
    console.error(`Failed to parse JSON on topic "${topic}":`, e.message);
  }
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});
