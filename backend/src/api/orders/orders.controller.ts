import { Response } from 'express';
import * as orderService from './orders.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function getOrderHistory(req: AuthRequest, res: Response) {
    try {
        const orders = await orderService.getOrderHistory(req.user!.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function checkout(req: AuthRequest, res: Response) {
    try {
        const order = await orderService.createOrder(req.user!.id);
        if (!order) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
