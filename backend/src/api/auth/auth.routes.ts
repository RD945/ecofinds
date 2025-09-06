import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword, verifyOtp, setTwoFactorStatus } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 2FA Management
router.post('/2fa/status', protect, setTwoFactorStatus);


export default router;
