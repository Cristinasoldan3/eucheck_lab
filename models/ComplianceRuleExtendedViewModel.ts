export class ComplianceRuleExtendedViewModel {
  public id: string;
  public clauseReference: string;
  public title: string;
  public weight: number;
  public isMandatory: boolean;
  
  // Date din a 2-a tabelă (Standards - prin cheia străină standard_id)
  public standardCode: string;
  public standardTitle: string;

  // Date din a 3-a tabelă (Accounts - de exemplu, administratorul sau contul asociat)
  public creatorEmail: string;

  constructor(rule: any) {
    this.id = rule.id;
    this.clauseReference = rule.clause_reference || '';
    this.title = rule.title || '';
    this.weight = rule.weight || 0;
    this.isMandatory = rule.is_mandatory || false;

    // Extragem datele din tabela 'standards' (A 2-a tabelă)
    this.standardCode = rule.standards ? rule.standards.code : 'N/A';
    this.standardTitle = rule.standards ? rule.standards.title : 'N/A';

    // Extragem datele din tabela 'accounts' sau altă tabelă conexă (A 3-a tabelă)
    this.creatorEmail = rule.accounts ? rule.accounts.email : 'Admin EUCheck';
  }
}