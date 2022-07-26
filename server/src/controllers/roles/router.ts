import Router from '@koa/router';
import { checkOneOfRoles } from '../../utils/auth';
import { get } from './get';

const router = new Router();

const checkHasAdminRole = checkOneOfRoles(['admin']);

router.use(checkHasAdminRole);

router.get('/', checkHasAdminRole, get);

export { router as roles };
