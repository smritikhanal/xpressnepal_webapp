import { Router } from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/address.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
} from '../validators/address.validators.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(validate(addAddressSchema), addAddress);

router.route('/:id')
  .put(validate(updateAddressSchema), updateAddress)
  .delete(validate(deleteAddressSchema), deleteAddress);

export default router;
