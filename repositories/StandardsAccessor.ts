import { PrismaClient } from '@prisma/client';
import { StandardViewModel } from '../models/StandardViewModel';

const prisma = new PrismaClient();

export class StandardsAccessor {
  // Obține lista de directive din tabela standards
  public async getAll() {
    return await prisma.standards.findMany({
      orderBy: { id: 'asc' }
    });
  }

  // Obține o directivă pe baza ID-ului
  public async getById(id: number) {
    return await prisma.standards.findUnique({
      where: { id }
    });
  }

  // Salvează o directivă nouă (Create)
  public async addEntity(vm: StandardViewModel) {
    return await prisma.standards.create({
      data: {
        code: vm.code,
        title: vm.title,
        category: vm.category,
        description: vm.description,
        is_active: vm.is_active,
        official_url: vm.official_url,
        version: vm.version
      }
    });
  }

  // Modifică directiva existentă (Edit)
  public async updateEntity(id: number, vm: StandardViewModel) {
    return await prisma.standards.update({
      where: { id },
      data: {
        code: vm.code,
        title: vm.title,
        category: vm.category,
        description: vm.description,
        is_active: vm.is_active,
        official_url: vm.official_url,
        version: vm.version
      }
    });
  }
}

export const standardsAccessor = new StandardsAccessor();