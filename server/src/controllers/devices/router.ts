import Router from '@koa/router';
import { checkOneOfRoles } from '../../utils/auth';
import { deleteById } from './deleteById';
import { get } from './get';
import { getById } from './getById';
import { post } from './post';

const router = new Router();

const checkHasAdminRole = checkOneOfRoles(['admin']);

router.use(checkHasAdminRole);

router.get('/:id', getById);
router.delete('/:id', deleteById);

router.get('/', get);
router.post('/', post);

export { router as devices };
