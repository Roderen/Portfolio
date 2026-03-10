export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  skills: string[];
  order: number;
  visible: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}
