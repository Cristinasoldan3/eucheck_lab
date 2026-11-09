import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminController {
  public async dashboard(req: Request, res: Response): Promise<void> {
    try {
      // Poți adăuga date pentru dashboard dacă ai nevoie
      res.render('admin/dashboard');
    } catch (err: any) {
      res.status(500).send('Eroare la încărcarea dashboard-ului: ' + err.message);
    }
  }
}

export const adminController = new AdminController();