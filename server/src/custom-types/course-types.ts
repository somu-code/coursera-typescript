export type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  published: boolean;
  imageUrl?: string;
  authorId: number;
};
