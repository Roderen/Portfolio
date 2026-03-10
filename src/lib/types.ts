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
  name?: string | null;
  telegram: string;
  phone?: string | null;
  email: string;
  message?: string | null;
  read: boolean;
  createdAt: Date | string;
}
