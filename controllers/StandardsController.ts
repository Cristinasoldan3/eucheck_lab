import { Request, Response } from 'express';
import { standardsAccessor } from '../repositories/StandardsAccessor';
import { StandardViewModel } from '../models/StandardViewModel';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class StandardsController {
  // GET: /Standards (Index)
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const items = await standardsAccessor.getAll();
      const list = items.map(item => ({
        ...item,
        categoryName: StandardViewModel.getCategoryName(item.category)
      }));
      res.render('standards/index', { standards: list });
    } catch (err: any) {
      res.status(500).send('Eroare la încărcare: ' + err.message);
    }
  }

  // GET: /Standards/Details/:id
  public async details(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const item = await standardsAccessor.getById(id);
      if (!item) {
        res.status(404).send('Directiva nu a fost găsită în baza EUCheck.');
        return;
      }
      res.render('standards/details', {
        standard: {
          ...item,
          categoryName: StandardViewModel.getCategoryName(item.category)
        }
      });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // GET: /Standards/Create
  public createGet(req: Request, res: Response): void {
    const categories = StandardViewModel.getCategories();
    res.render('standards/create', { categories });
  }

  // POST: /Standards/Create
  public async createPost(req: Request, res: Response): Promise<void> {
    try {
      const vm = new StandardViewModel(req.body);
      await standardsAccessor.addEntity(vm);
      res.redirect('/Standards');
    } catch (err: any) {
      res.status(500).send('Eroare la salvare: ' + err.message);
    }
  }

  // GET: /Standards/Edit/:id
  public async editGet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const item = await standardsAccessor.getById(id);
      if (!item) {
        res.status(404).send('Directiva nu a fost găsită.');
        return;
      }
      const categories = StandardViewModel.getCategories();
      res.render('standards/edit', { standard: item, categories });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // POST: /Standards/Edit/:id
  public async editPost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const vm = new StandardViewModel(req.body);
      await standardsAccessor.updateEntity(id, vm);
      res.redirect('/Standards');
    } catch (err: any) {
      res.status(500).send('Eroare la actualizare: ' + err.message);
    }
  }
  /// POST: /Standards/Delete/:id
public async delete(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    await prisma.standards.delete({
      where: { id: id }
    });
    res.redirect('/Standards');
  } catch (err: any) {
    res.status(500).send('Eroare la ștergerea directivei: ' + err.message);
  }
}
}

export const standardsController = new StandardsController();