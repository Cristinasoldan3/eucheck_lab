import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminPlansController {
  
  // GET: /Admin/Plans
  public async index(req: Request, res: Response): Promise<void> {
    try {
      let plans = await prisma.subscription_plans_config.findMany({
        orderBy: { price_eur: 'asc' }
      });

      if (!plans || plans.length === 0) {
        await prisma.subscription_plans_config.createMany({
          data: [
            { tier: 'STARTER', display_name: 'Starter Plan', price_eur: 0, tokens_included: 5, can_export_pdf: false, is_active: true, features_list: '5 tokeni inclusi' },
            { tier: 'BUSINESS', display_name: 'Business Pro', price_eur: 49, tokens_included: 50, can_export_pdf: true, is_active: true, features_list: '50 tokeni inclusi, export PDF' },
            { tier: 'ENTERPRISE', display_name: 'Enterprise Unificat', price_eur: 199, tokens_included: 999, can_export_pdf: true, is_active: true, features_list: 'Tokeni nelimitati' }
          ]
        });
        plans = await prisma.subscription_plans_config.findMany({
          orderBy: { price_eur: 'asc' }
        });
      }

      res.render('admin/plans/index', { plans });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // GET: /Admin/Plans/Edit/:id
  public async editGet(req: Request, res: Response): Promise<void> {
    try {
      const planId = Number(req.params.id);
      const plan = await prisma.subscription_plans_config.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        res.status(404).send('Pachetul nu a fost găsit în baza de date.');
        return;
      }

      res.render('admin/plans/edit', { plan });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // POST: /Admin/Plans/Edit/:id
  public async editPost(req: Request, res: Response): Promise<void> {
    try {
      const planId = Number(req.params.id);
      const { display_name, price_eur, tokens_included, can_export_pdf, is_active } = req.body;

      const price = parseFloat(price_eur) || 0;
      const tokens = parseInt(tokens_included, 10) || 0;
      const exportPdf = can_export_pdf === 'on' || can_export_pdf === 'true';
      const active = is_active === 'on' || is_active === 'true';

      // 1. Actualizăm pachetul în baza de date
      await prisma.subscription_plans_config.update({
        where: { id: planId },
        data: {
          display_name,
          price_eur: price,
          tokens_included: tokens,
          can_export_pdf: exportPdf,
          is_active: active
        }
      });

      // 2. Găsim contul oficial de admin și salvăm logul în baza de date
      try {
        let adminAccount = await prisma.accounts.findFirst({
          where: { email: 'admin.eucheck@gmail.com' }
        });

        if (!adminAccount) {
          adminAccount = await prisma.accounts.create({
            data: {
              email: 'admin.eucheck@gmail.com',
              password_hash: 'parola_secura_admin',
              full_name: 'Administrator EUCheck',
              is_admin: true
            }
          });
        }

        await prisma.admin_activity_logs.create({
          data: {
            admin_account_id: adminAccount.id,
            action_type: 'UPDATE_PLAN',
            target_table: 'subscription_plans_config',
            target_id: planId,
            description: `A modificat pachetul "${display_name}" (Preț: ${price} EUR, Tokeni: ${tokens})`
          }
        });

        console.log(`[AUDIT] Modificare salvată cu succes de adminul: ${adminAccount.email}`);
      } catch (logErr) {
        console.log('Eroare la scrierea în admin_activity_logs:', logErr);
      }

      res.redirect('/Admin/Plans');
    } catch (err: any) {
      res.status(500).send('Eroare la actualizarea pachetului: ' + err.message);
    }
  }
}

export const adminPlansController = new AdminPlansController();