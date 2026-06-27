interface ProjectTranslation {
  language: string;
  title: string;
  description: string;
}

interface Project {
  id?: string;
  imageUrl?: string;
  liveUrl: string;
  repoUrl: string;
  translations: ProjectTranslation[];
  createdAt?: string;
  updatedAt?: string;
}