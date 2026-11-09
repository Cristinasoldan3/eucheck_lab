import { PrismaClient } from '@prisma/client';
import { AccountViewModel } from '../models/AccountViewModel';

const prisma = new PrismaClient();

export class AccountsAccessor {
  // Returnează toți utilizatorii pentru Index
  public async getAll() {
    return await prisma.accounts.findMany({
      orderBy: { id: 'asc' }
    });
  }

  // Returnează un cont după ID pentru Details și Edit
  public async getById(id: number) {
    return await prisma.accounts.findUnique({
      where: { id }
    });
  }

  // Creare utilizator nou / Client B2B
  public async addEntity(vm: AccountViewModel) {
    return await prisma.accounts.create({
      data: {
        email: vm.email,
        password_hash: 'parola_securizata_demo',
        full_name: vm.full_name,
        company_name: vm.company_name,
        vat_number: vm.vat_number,
        is_company: Boolean(vm.company_name || vm.vat_number),
        tier: vm.tier,
        tokens_balance: vm.tokens_balance,
        can_export_pdf: vm.can_export_pdf,
        has_unlimited_scans: vm.has_unlimited_scans,
        is_admin: vm.is_admin
      }
    });
  }

  // Aprobare pachet / Actualizare tokeni și drepturi (Edit)
  public async updateEntity(id: number, vm: AccountViewModel) {
    return await prisma.accounts.update({
      where: { id },
      data: {
        email: vm.email,
        full_name: vm.full_name,
        company_name: vm.company_name,
        vat_number: vm.vat_number,
        is_company: Boolean(vm.company_name || vm.vat_number),
        tier: vm.tier,
        tokens_balance: vm.tokens_balance,
        can_export_pdf: vm.can_export_pdf,
        has_unlimited_scans: vm.has_unlimited_scans,
        is_admin: vm.is_admin
      }
    });
  }
  // Ștergere utilizator din baza EUCheck
  public async deleteEntity(id: number) {
    return await prisma.accounts.delete({
      where: { id }
    });
  }
}

export const accountsAccessor = new AccountsAccessor();