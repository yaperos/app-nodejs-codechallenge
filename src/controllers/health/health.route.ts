import { Router } from 'express';
import HealthController from './health.controller';

const controller = new HealthController();
const router = Router();

router.get('/', controller.health);

export default router;