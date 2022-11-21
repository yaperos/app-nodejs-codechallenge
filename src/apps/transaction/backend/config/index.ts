
import 'dotenv/config';
export default class Configuration {
  static readonly MONGO_ATLAS_SRV = `${process.env.MONGO_ATLAS_SRV}`;
  static readonly KAFKA_BROKER = `${process.env.KAFKA_BROKER}`;
  static readonly PORT = process.env.PORT || 4000;
}
