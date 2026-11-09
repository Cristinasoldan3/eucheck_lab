import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Activează log-ul SQL ca să se vadă interogările în consolă
  log: ['query'],
});

async function main() {
  console.log('--- Populare rapidă cu un rând de test (Seed) ---');
  const standardTest = await prisma.standards.upsert({
    where: { code: 'DIR_2006_42_EC' },
    update: {},
    create: {
      code: 'DIR_2006_42_EC',
      title: 'Directiva Masini 2006/42/CE',
      category: 1,
      compliance_rules: {
        create: [
          {
            clause_reference: 'Art 1.2.4',
            title: 'Oprire de Urgenta',
            keywords: ['emergency stop', 'oprire urgenta'],
            weight: 25,
            recommendation: 'Instalati buton tip ciuperca.',
          },
        ],
      },
    },
  });

  console.log('\n======================================================');
  console.log('1. TEST EAGER LOADING (Adulce totul dintr-un singur query)');
  console.log('======================================================');
  // Folosim "include" pentru Eager Loading
  const eagerStandard = await prisma.standards.findUnique({
    where: { id: standardTest.id },
    include: {
      compliance_rules: true, // <- AICI se activează Eager Loading!
    },
  });

  console.log('Rezultat Eager Loading:');
  console.log('Titlu Standard:', eagerStandard?.title);
  console.log('Reguli gasite direct:', eagerStandard?.compliance_rules);

  console.log('\n======================================================');
  console.log('2. TEST LAZY LOADING (Incarcare separata, la cerere)');
  console.log('======================================================');
  // Pasul A: Aducem doar standardul (fara reguli)
  const lazyStandard = await prisma.standards.findUnique({
    where: { id: standardTest.id },
  });
  console.log('Standard incarcat singur:', lazyStandard?.title);

  // Pasul B: Doar cand avem nevoie, interogam regulile asociate
  console.log('... declansam incarcarea regulilor mai tarziu (Lazy) ...');
  const reguliLaCerere = await prisma.standards
    .findUnique({ where: { id: standardTest.id } })
    .compliance_rules(); // <- Fluent API (interogare la cerere)

  console.log('Regulile aduse la cerere:', reguliLaCerere);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });