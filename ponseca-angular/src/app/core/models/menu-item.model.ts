export type MenuCategory =
  | 'platos-principales'
  | 'entradas'
  | 'criollos'
  | 'sopas'
  | 'bebidas'
  | 'postres';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  spicy?: boolean;
  highlight?: boolean;
  available: boolean;
  tags?: string[];
}
