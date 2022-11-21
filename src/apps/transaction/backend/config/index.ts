
import 'dotenv/config';
export default class Configuration {
  static readonly MONGO_ATLAS_SRV = `${process.env.MONGO_ATLAS_SRV}`;
  static readonly NATS_HOST = `${process.env.NATS_HOST}`;
  static readonly PORT = process.env.PORT || 4000;
}
