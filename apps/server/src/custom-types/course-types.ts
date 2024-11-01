export interface Course {
  title: string;
  description: string;
  published: boolean;
  imageUrl: string;
  price: number;
}

export interface CourseWithAdminId extends Course {
  adminId: number;
}

export interface CourseFromDB extends CourseWithAdminId {
  id: number;
}
