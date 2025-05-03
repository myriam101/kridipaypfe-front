export interface Catalog {
    id: number;
    name: string;
    category: string;
    description: string;
    provider: string;
    public: number; // '1' pour public, '0' pour privé  
  }
  
  