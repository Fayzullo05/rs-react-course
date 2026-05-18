export type Person = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image?: string;
  type?: string;
  origin?: {
    name: string;
  };
  location?: {
    name: string;
  };
};
