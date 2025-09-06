import { Router } from 'express';
import * as imageService from './images.service';

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const image = await imageService.getImageById(id);

        if (!image || !image.imageData || !image.mimetype) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.setHeader('Content-Type', image.mimetype);
        res.send(image.imageData);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
