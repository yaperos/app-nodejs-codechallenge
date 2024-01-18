import mongoose from 'mongoose';
import { config } from '.';

export const dbConnect = async () => {
    await mongoose.connect(
        `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:27017/${config.DB_NAME}?authSource=admin`
    );
}
