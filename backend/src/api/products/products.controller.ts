import { Response } from 'express';
import { z } from 'zod';
import * as productService from './products.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function getProducts(req: AuthRequest, res: Response) {
  try {
    const { category, search } = req.query;
    const products = await productService.getProducts(category as string, search as string);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getProductById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category_id: z.coerce.number().int().positive(),
  image_url: z.string().url().optional().nullable(),
  quantity: z.coerce.number().int().min(0),
  condition: z.string().min(3),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year_of_manufacture: z.coerce.number().int().optional().nullable(),
  material: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  dimension_l: z.coerce.number().optional().nullable(),
  dimension_w: z.coerce.number().optional().nullable(),
  dimension_h: z.coerce.number().optional().nullable(),
  is_original: z.boolean().optional(),
  has_manual: z.boolean().optional(),
  working_condition: z.string().optional().nullable(),
  // REMOVING 'images' from here, as it will be handled from req.files
});

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    
    const parsedBody = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      category_id: req.body.category_id ? parseInt(req.body.category_id, 10) : undefined,
      quantity: req.body.quantity ? parseInt(req.body.quantity, 10) : undefined,
      year_of_manufacture: req.body.year_of_manufacture ? parseInt(req.body.year_of_manufacture, 10) : undefined,
      dimension_l: req.body.dimension_l ? parseFloat(req.body.dimension_l) : undefined,
      dimension_w: req.body.dimension_w ? parseFloat(req.body.dimension_w) : undefined,
      dimension_h: req.body.dimension_h ? parseFloat(req.body.dimension_h) : undefined,
      is_original: req.body.is_original === 'true',
      has_manual: req.body.has_manual === 'true',
    };

    const parsedData = productSchema.parse(parsedBody);
    
    const productData = {
        ...parsedData,
        seller: { connect: { id: req.user!.id } },
        category: { connect: { id: Number(parsedData.category_id) } },
        images: {
            create: files.map(file => ({
                imageData: file.buffer,
                mimetype: file.mimetype,
            })),
        }
    };
    // @ts-ignore
    delete productData.category_id;


    const product = await productService.createProduct(productData as any);
    res.status(201).json(product);

  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const productUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.coerce.number().positive().optional(),
  category_id: z.coerce.number().int().positive().optional(),
  image_url: z.string().url().optional().nullable(),
  quantity: z.coerce.number().int().min(0).optional(),
  condition: z.string().min(3).optional(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year_of_manufacture: z.coerce.number().int().optional().nullable(),
  material: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  dimension_l: z.coerce.number().optional().nullable(),
  dimension_w: z.coerce.number().optional().nullable(),
  dimension_h: z.coerce.number().optional().nullable(),
  is_original: z.boolean().optional(),
  has_manual: z.boolean().optional(),
  working_condition: z.string().optional().nullable(),
  existingImages: z.array(z.object({ id: z.string(), url: z.string() })).optional(),
});

export async function updateProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  try {
    const parsedBody = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      category_id: req.body.category_id ? parseInt(req.body.category_id, 10) : undefined,
      quantity: req.body.quantity ? parseInt(req.body.quantity, 10) : undefined,
      year_of_manufacture: req.body.year_of_manufacture ? parseInt(req.body.year_of_manufacture, 10) : undefined,
      dimension_l: req.body.dimension_l ? parseFloat(req.body.dimension_l) : undefined,
      dimension_w: req.body.dimension_w ? parseFloat(req.body.dimension_w) : undefined,
      dimension_h: req.body.dimension_h ? parseFloat(req.body.dimension_h) : undefined,
      is_original: req.body.is_original === 'true',
      has_manual: req.body.has_manual === 'true',
    };

    const productData = productUpdateSchema.parse(parsedBody);
    const product = await productService.updateProduct(Number(id), productData, req.user!.id, req.files as Express.Multer.File[]);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.issues });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));

     if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller_id !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await productService.deleteProduct(Number(id), req.user!.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
