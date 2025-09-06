import { Prisma, PrismaClient } from '@prisma/client';
import { clearCart, getCart } from '../cart/cart.service';

const prisma = new PrismaClient();

export async function getOrderHistory(userId: number) {
    return prisma.order.findMany({
        where: { user_id: userId },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        },
        orderBy: {
            order_date: 'desc'
        }
    });
}

export async function createOrder(userId: number) {
    const cartItems = await getCart(userId);

    if (cartItems.length === 0) {
        return null;
    }

    const totalAmount = cartItems.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
        data: {
            user_id: userId,
            total_amount: new Prisma.Decimal(totalAmount),
            orderItems: {
                create: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: new Prisma.Decimal(item.product.price)
                }))
            }
        },
        include: {
            orderItems: true
        }
    });

    await clearCart(userId);

    return order;
}
