import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Otp from '../models/otp.model';
import generateToken from '../utils/generateToken';
import { sendEmail } from '../utils/mailer';

// We have removed the OAuth2Client import and initialization

export const generateOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp: otpCode });

        await sendEmail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is ${otpCode}. It is valid for 5 minutes.`,
            html: `<b>Your OTP is ${otpCode}</b>. It is valid for 5 minutes.`,
        });
        
        const userExists = await User.findOne({ email });
        res.status(200).json({ 
            message: 'OTP sent successfully',
            isNewUser: !userExists 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
    const { email, otp, name, dob } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const latestOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
        if (!latestOtp) {
            return res.status(400).json({ message: 'OTP not found or expired. Please try again.' });
        }
        
        const isMatch = await bcrypt.compare(otp, latestOtp.otp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            if (!name || !dob) {
                return res.status(400).json({ message: 'Name and Date of Birth are required for new users' });
            }
            user = await User.create({ email, name, dob });
        }
        
        await Otp.deleteMany({ email });

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            dob: user.dob,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during verification' });
    }
};

