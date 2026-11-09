import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ComplianceRuleExtendedViewModel } from '../models/ComplianceRuleExtendedViewModel';

const prisma = new PrismaClient();

export class ComplianceRulesController {
  
  // ACȚIUNEA INDEX: Aduce date din tabele (compliance_rules + standards)
  public async index(req: Request, res: Response): Promise<void> {
    try {
      const rawRules = await prisma.compliance_rules.findMany({
        include: {
          standards: true,
        },
        orderBy: { id: 'asc' }
      });

      const viewModelList = rawRules.map(r => new ComplianceRuleExtendedViewModel(r));

      res.render('compliance/index', { rules: viewModelList });
    } catch (err: any) {
      res.status(500).send('Eroare la încărcare: ' + err.message);
    }
  }

  // ACȚIUNEA CREATE (GET): Trimite și lista de standarde pentru dropdown
  public async createGet(req: Request, res: Response): Promise<void> {
    try {
      const standards = await prisma.standards.findMany();
      res.render('compliance/create', { standards });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // ACȚIUNEA CREATE (POST): Salvează în baza de date
  public async createPost(req: Request, res: Response): Promise<void> {
    try {
      await prisma.compliance_rules.create({
        data: {
          standard_id: Number(req.body.standard_id),
          clause_reference: req.body.clause_reference,
          title: req.body.title,
          weight: Number(req.body.weight) || 10,
          is_mandatory: req.body.is_mandatory === 'on' || req.body.is_mandatory === 'true',
          recommendation: req.body.recommendation || '',
          keywords: []
        }
      });
      res.redirect('/ComplianceRules');
    } catch (err: any) {
      res.status(500).send('Eroare la salvare: ' + err.message);
    }
  }

  // ACȚIUNEA EDIT (GET): Încarcă regula și lista de standarde
  public async editGet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const rule = await prisma.compliance_rules.findUnique({
        where: { id: id }
      });

      if (!rule) {
        res.status(404).send('Regula de conformitate nu a fost găsită.');
        return;
      }

      const standards = await prisma.standards.findMany();
      res.render('compliance/edit', { rule, standards });
    } catch (err: any) {
      res.status(500).send('Eroare: ' + err.message);
    }
  }

  // ACȚIUNEA EDIT (POST): Actualizează în baza de date
  public async editPost(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      await prisma.compliance_rules.update({
        where: { id: id },
        data: {
          standard_id: Number(req.body.standard_id),
          clause_reference: req.body.clause_reference,
          title: req.body.title,
          weight: Number(req.body.weight) || 10,
          is_mandatory: req.body.is_mandatory === 'on' || req.body.is_mandatory === 'true',
          recommendation: req.body.recommendation || ''
        }
      });
      res.redirect('/ComplianceRules');
    } catch (err: any) {
      res.status(500).send('Eroare la actualizare: ' + err.message);
    }
  }

  // ACȚIUNEA DELETE (POST): Șterge regula din baza de date
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      await prisma.compliance_rules.delete({
        where: { id: id }
      });
      res.redirect('/ComplianceRules');
    } catch (err: any) {
      res.status(500).send('Eroare la ștergerea regulii: ' + err.message);
    }
  }
}

export const complianceRulesController = new ComplianceRulesController();