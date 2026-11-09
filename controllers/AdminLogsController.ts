import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminLogsController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
      // Preluăm logurile EXCLUSIV din baza de date PostgreSQL (tabela admin_activity_logs)
      const adminLogsRaw = await prisma.admin_activity_logs.findMany({
        include: { accounts: true },
        orderBy: { created_at: 'desc' },
        take: 50
      });

      const adminLogs = adminLogsRaw.map(log => ({
        id: log.id,
        action: log.action_type,
        details: log.description,
        user: log.accounts?.email || 'admin.eucheck@gmail.com',
        timestamp: log.created_at ? new Date(log.created_at).toLocaleString('ro-RO') : new Date().toLocaleString('ro-RO')
      }));

      // Fără date simulate pentru utilizatori (lucrăm 100% cu baza de date)
      const userLogs: any[] = [];

      res.render('admin/logs/index', { userLogs, adminLogs });
    } catch (err: any) {
      res.status(500).send('Eroare la citirea jurnalului din baza de date: ' + err.message);
    }
  }
}

export const adminLogsController = new AdminLogsController();