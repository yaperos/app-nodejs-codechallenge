import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

const router = Router();

router.get('/', RoleController.all);
router.post('/', RoleController.create);
router.get('/:id', RoleController.get);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.remove);

export default router;
