import Router from '@koa/router';
import { checkOneOfRoles } from '../../utils/auth';
import { checkin } from './checkin';
import { checkout } from './checkout';
import { deleteById } from './deleteById';
import { get } from './get';
import { getById } from './getById';
import { patchById } from './patchById';
import { post } from './post';

const router = new Router();

const checkHasAdminOrBoxOfficeRole = checkOneOfRoles(['admin', 'boxoffice']);

router.post('/:id/checkin', checkin);
router.post('/:id/checkout', checkout);

router.get('/:id', getById);
router.patch('/:id', checkHasAdminOrBoxOfficeRole, patchById);
router.delete('/:id', checkHasAdminOrBoxOfficeRole, deleteById);

router.get('/', get);
router.post('/', checkHasAdminOrBoxOfficeRole, post);

export { router as tickets };
