import Router from '@koa/router';
import { checkOneOfRoles } from '../../utils/auth';
import { deleteById } from './deleteById';
import { deleteImage } from './deleteImage';
import { get } from './get';
import { getById } from './getById';
import { patchById } from './patchById';
import { post } from './post';
import { postImage } from './postImage';

const router = new Router();

const checkHasAdminRole = checkOneOfRoles(['admin']);

router.post('/:id/image', checkHasAdminRole, postImage);
router.delete('/:id/image', checkHasAdminRole, deleteImage);

router.get('/:id', getById);
router.patch('/:id', checkHasAdminRole, patchById);
router.delete('/:id', checkHasAdminRole, deleteById);

router.get('/', get);
router.post('/', checkHasAdminRole, post);

export { router as tickettypes };
