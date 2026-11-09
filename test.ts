import { AccountsAccessor } from './src/accessors/AccountsAccessor';
import { TechnicalDossiersAccessor } from './src/accessors/TechnicalDossiersAccessor';

async function main() {
  const accountsAcc = new AccountsAccessor();
  const dossiersAcc = new TechnicalDossiersAccessor();

  console.log("=== TESTARE ACCES LA DATE CU PRISMA ===");

  const cont = await accountsAcc.getById(1);
  console.log("Cont extras cu AccountsAccessor:", cont);

  const dosare = await dossiersAcc.getByAccountId(1);
  console.log("Dosare gasite pentru contul 1:", dosare.length);
}

main().catch(console.error);
