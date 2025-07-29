import { Router } from 'express';
// We have removed googleLogin from the import
import { generateOtp, verifyOtpAndLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtpAndLogin);

// The /google route has been removed.

export default router;