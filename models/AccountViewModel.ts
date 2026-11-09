export interface AccountFormData {
  id?: number | string;
  email: string;
  full_name?: string;
  company_name?: string;
  vat_number?: string;
  tier: string;
  tokens_balance: number | string;
  can_export_pdf?: boolean | string;
  has_unlimited_scans?: boolean | string;
  is_admin?: boolean | string;
}

export class AccountViewModel {
  public id: number | null;
  public email: string;
  public full_name: string;
  public company_name: string;
  public vat_number: string;
  public tier: string;
  public tokens_balance: number;
  public can_export_pdf: boolean;
  public has_unlimited_scans: boolean;
  public is_admin: boolean;

  constructor(data: AccountFormData) {
    this.id = data.id ? Number(data.id) : null;
    this.email = (data.email || '').trim();
    this.full_name = (data.full_name || '').trim();
    this.company_name = (data.company_name || '').trim();
    this.vat_number = (data.vat_number || '').trim();
    this.tier = data.tier || 'STARTER';
    this.tokens_balance = Number(data.tokens_balance) || 0;
    // Checkbox-uri tratate
    this.can_export_pdf = data.can_export_pdf === true || data.can_export_pdf === 'on' || data.can_export_pdf === 'true';
    this.has_unlimited_scans = data.has_unlimited_scans === true || data.has_unlimited_scans === 'on' || data.has_unlimited_scans === 'true';
    this.is_admin = data.is_admin === true || data.is_admin === 'on' || data.is_admin === 'true';
  }

  public static getTiers() {
    return [
      { id: 'STARTER', name: 'Plan Gratuit (Starter - 1 Scanare)' },
      { id: 'BUSINESS_PRO', name: 'Business Pro (Export Raport PDF)' },
      { id: 'ENTERPRISE', name: 'Enterprise B2B (Scanări Nelimitate + Reduceri)' }
    ];
  }
}