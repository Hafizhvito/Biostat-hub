export interface MaterialVideo {
  id: number;
  title: string;
  description: string | null;
  youtubeUrl: string;
  sortOrder?: number;
}

export interface MaterialResource {
  id: number;
  title: string;
  description: string | null;
  originalName: string;
  fileSize: number;
  createdAt?: string;
}

export interface MaterialSection {
  id: number;
  name: string;
  description: string | null;
  videos?: MaterialVideo[];
  resources?: MaterialResource[];
  _count?: { videos: number; resources?: number };
}

export interface SectionsResponse {
  sections: MaterialSection[];
  stats: { total_sections: number; total_videos: number; total_resources?: number };
}
