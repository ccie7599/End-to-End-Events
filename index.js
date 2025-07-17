const mqtt = require('mqtt');

const MQTT_URL = 'mqtts://cdi-events.connected-cloud.io:8883';
const MQTT_TOPIC = 'events-export';

exports.handler = async (event) => {
  console.log('🚀 Lambda triggered by SNS');

  const messages = event.Records.map((record) => {
    try {
      return JSON.parse(record.Sns.Message);
    } catch {
      return record.Sns.Message;
    }
  });

  return new Promise((resolve, reject) => {
    const client = mqtt.connect(MQTT_URL);

    client.on('connect', async () => {
      console.log('✅ MQTT connected');

      try {
        for (const msg of messages) {
          // Inject publish_time if message is an object
          let enriched;
          if (typeof msg === 'object' && msg !== null) {
            enriched = { ...msg, publish_time: Date.now() };
          } else {
            enriched = msg;
          }

          const payload = typeof enriched === 'string' ? enriched : JSON.stringify(enriched);

          await new Promise((res, rej) => {
            client.publish(MQTT_TOPIC, payload, { qos: 0 }, (err) => {
              if (err) {
                console.error('❌ Publish error:', err);
                rej(err);
              } else {
                console.log('✅ Published:', payload);
                res();
              }
            });
          });
        }

        setTimeout(() => {
          client.end();
          resolve();
        }, 20); // Slight delay to flush TCP
      } catch (err) {
        client.end();
        reject(err);
      }
    });

    client.on('error', (err) => {
      console.error('❌ MQTT connection error:', err);
      reject(err);
    });
  });
};
