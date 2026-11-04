export interface WritingSummary {
  id: number;
  title: string;
  publishedDate: string;
  excerpt: string;
  coverImage: string | null;
}

export interface Writing extends WritingSummary {
  contentHtml: string;
}

export interface WritingRequest {
  title: string;
  publishedDate: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
}
