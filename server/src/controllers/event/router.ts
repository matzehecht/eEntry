import Router from '@koa/router';
import { checkOneOfRoles } from '../../utils/auth';
import { deleteImage } from './deleteImage';
import { get } from './get';
import { patch } from './patch';
import { postImage } from './postImage';

const router = new Router();

const checkHasAdminRole = checkOneOfRoles(['admin']);

router.post('/image', checkHasAdminRole, postImage);
router.delete('/image', checkHasAdminRole, deleteImage);

router.get('/', get);
router.patch('/', checkHasAdminRole, patch);

export { router as event };
