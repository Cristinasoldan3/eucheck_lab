import { PrismaClient } from '@prisma/client';

class DatabaseContext {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseContext.instance) {
      DatabaseContext.instance = new PrismaClient();
    }
    return DatabaseContext.instance;
  }
}

export const dbContext = DatabaseContext.getInstance();
export default dbContext;
