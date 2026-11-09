import dbContext from '../db/context';

export class AccountsAccessor {
  async getById(id: number) {
    return await dbContext.accounts.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return await dbContext.accounts.findUnique({
      where: { email },
    });
  }

  async getAccountWithDossiers(accountId: number) {
    return await dbContext.accounts.findUnique({
      where: { id: accountId },
      include: {
        technical_dossiers: true,
      },
    });
  }

  async updateTokens(id: number, newBalance: number) {
    return await dbContext.accounts.update({
      where: { id },
      data: { tokens_balance: newBalance },
    });
  }
}
