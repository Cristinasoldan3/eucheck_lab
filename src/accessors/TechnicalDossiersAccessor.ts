import dbContext from '../db/context';
import { technical_dossiers } from '../../generated/prisma';

export class TechnicalDossiersAccessor {
  async getById(id: number): Promise<technical_dossiers | null> {
    return await dbContext.technical_dossiers.findUnique({
      where: { id },
    });
  }

  async getByAccountId(accountId: number): Promise<technical_dossiers[]> {
    return await dbContext.technical_dossiers.findMany({
      where: { account_id: accountId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getDossierWithOwner(id: number) {
    return await dbContext.technical_dossiers.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
  }
}
