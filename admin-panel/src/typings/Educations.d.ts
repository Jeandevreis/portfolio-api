interface EducationTranslation {
  language: string;
  name?: string;
  institution?: string;
  description?: string;
}

interface Education {
  id?: string;
  type: string;
  status: string;
  imageUrl?: string;
  durationHours?: number | string;
  startDate?: string;
  endDate?: string;
  certificateUrl?: string;
  translations: EducationTranslation[];
}