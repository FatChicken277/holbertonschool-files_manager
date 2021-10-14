import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.log(err.message);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const asyncGet = await promisify(this.client.get).bind(this.client);
    const value = await asyncGet(key);

    return value;
  }

  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
