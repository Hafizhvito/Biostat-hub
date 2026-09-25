export interface MaterialVideo {
  id: number;
  title: string;
  description: string | null;
  youtubeUrl: string;
  sortOrder?: number;
}

export interface MaterialSection {
  id: number;
  name: string;
  description: string | null;
  videos?: MaterialVideo[];
  _count?: { videos: number };
}

export interface SectionsResponse {
  sections: MaterialSection[];
  stats: { total_sections: number; total_videos: number };
}
