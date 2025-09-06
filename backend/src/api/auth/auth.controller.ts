import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from './auth.service';
import { verifyPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AuthRequest } from '../../middleware/auth.middleware';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    const user = await authService.createUser(username, email, password);
    const token = generateToken({ userId: user.id });
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.issues });
    }
    if (error instanceof Error && error.message === 'User with this email or username already exists') {
        return res.status(409).json({ message: 'User with this email or username already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
});

const verifyOtpSchema = z.object({
    userId: z.number().int(),
    otp: z.string().length(6),
});

const setTwoFactorSchema = z.object({
    enabled: z.boolean(),
});

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = loginSchema.parse(req.body);
    const user = await authService.findUserByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // --- 2FA Logic ---
    if (user.two_factor_enabled) {
        await authService.generateAndSendOtp(user);
        return res.status(200).json({ twoFactorEnabled: true, userId: user.id });
    }
    // --- End 2FA Logic ---

    const token = generateToken({ userId: user.id });
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(200).json({ token, user: userWithoutPassword });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function verifyOtp(req: Request, res: Response) {
    try {
        const { userId, otp } = verifyOtpSchema.parse(req.body);
        const user = await authService.verifyOtp(userId, otp);
        
        const token = generateToken({ userId: user.id });
        const { password_hash, ...userWithoutPassword } = user;
        
        res.status(200).json({ token, user: userWithoutPassword });

    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid input', errors: error.issues });
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getMe(req: AuthRequest, res: Response) {
    try {
        const user = await authService.findUserById(req.user!.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password_hash, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);
        await authService.sendPasswordResetEmail(email);
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid input', errors: error.issues });
        }
        // We send a generic success message even if the user doesn't exist to prevent email enumeration attacks
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { token, password } = resetPasswordSchema.parse(req.body);
        await authService.resetPassword(token, password);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid input', errors: error.issues });
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function setTwoFactorStatus(req: AuthRequest, res: Response) {
    try {
        const { enabled } = setTwoFactorSchema.parse(req.body);
        const result = await authService.setTwoFactor(req.user!.id, enabled);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid input', errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}
