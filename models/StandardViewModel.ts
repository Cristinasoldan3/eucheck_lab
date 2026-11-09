export interface StandardFormData {
  id?: number | string;
  code: string;
  title: string;
  category: number | string;
  description?: string;
  is_active?: boolean | string;
  official_url?: string;
  version?: number | string;
}

export class StandardViewModel {
  public id: number | null;
  public code: string;
  public title: string;
  public category: number;
  public description: string;
  public is_active: boolean;
  public official_url: string;
  public version: number;

  constructor(data: StandardFormData) {
    this.id = data.id ? Number(data.id) : null;
    this.code = (data.code || '').trim();
    this.title = (data.title || '').trim();
    this.category = Number(data.category) || 1;
    this.description = (data.description || '').trim();
    this.is_active = data.is_active === true || data.is_active === 'on' || data.is_active === 'true';
    this.official_url = (data.official_url || '').trim();
    this.version = Number(data.version) || 1;
  }

  public static getCategories() {
    return [
      { id: 1, name: 'Directiva Mașini Industriale (2006/42/CE)' },
      { id: 2, name: 'Directiva Joasă Tensiune (2014/35/UE)' },
      { id: 3, name: 'Directiva Siguranță Mediu & RoHS (2011/65/UE)' }
    ];
  }

  public static getCategoryName(id: number): string {
    const list = this.getCategories();
    const found = list.find(c => c.id === id);
    return found ? found.name : 'Necunoscut';
  }
}