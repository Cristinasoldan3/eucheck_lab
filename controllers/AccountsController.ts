import { Request, Response } from 'express';
import { accountsAccessor } from '../repositories/AccountsAccessor';
import { AccountViewModel } from '../models/AccountViewModel';

export class AccountsController {
  // GET: /Accounts (Index)
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const items = await accountsAccessor.getAll();
      res.render('accounts/index', { accounts: items });
    } catch (err: any) {
      res.status(500).send('Eroare la încărcare: ' + err.message);
    }
  }

  // GET: /Accounts/Details/:id
  public async details(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const item = await accountsAccessor.getById(id);
      if (!item) {
        res.status(404).send('Contul nu a fost găsit.');
        return;
      }
      res.render('accounts/details', { account: item });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // GET: /Accounts/Create
  public createGet(req: Request, res: Response): void {
    const tiers = AccountViewModel.getTiers();
    res.render('accounts/create', { tiers });
  }

  // POST: /Accounts/Create
  public async createPost(req: Request, res: Response): Promise<void> {
    try {
      const vm = new AccountViewModel(req.body);
      await accountsAccessor.addEntity(vm);
      res.redirect('/Accounts');
    } catch (err: any) {
      res.status(500).send('Eroare la creare: ' + err.message);
    }
  }

  // GET: /Accounts/Edit/:id (Panoul de aprobare solicitare / tokeni)
  public async editGet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const item = await accountsAccessor.getById(id);
      if (!item) {
        res.status(404).send('Contul nu a fost găsit.');
        return;
      }
      const tiers = AccountViewModel.getTiers();
      res.render('accounts/edit', { account: item, tiers });
    } catch (err: any) {
      res.status(500).send('Eroare la deschidere: ' + err.message);
    }
  }

  // POST: /Accounts/Edit/:id
  public async editPost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const vm = new AccountViewModel(req.body);
      await accountsAccessor.updateEntity(id, vm);
      res.redirect('/Accounts');
    } catch (err: any) {
      res.status(500).send('Eroare la actualizare: ' + err.message);
    }
  }
  // POST: /Accounts/Delete/:id
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      await accountsAccessor.deleteEntity(id);
      res.redirect('/Accounts');
    } catch (err: any) {
      res.status(500).send('Eroare la ștergerea contului: ' + err.message);
    }
  }
}

export const accountsController = new AccountsController();