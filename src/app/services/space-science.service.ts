
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface NasaMedia {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: string;
  center?: string;
  keywords?: string[];
}

export interface NasaMediaItem {
  data: NasaMedia[];
  links?: {
    href: string;
    rel: string;
    render?: string;
  }[];
}

interface NasaSearchResponse {
  collection: {
    items: NasaMediaItem[];
    metadata?: {
      total_hits?: number;
    };
  };
}

export interface SpaceNews {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  mediaType: string;
  sourceUrl: string;
  center: string;
  keywords: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SpaceScienceService {

  private readonly apiUrl =
    'https://images-api.nasa.gov/search';

  constructor(private http: HttpClient) {}

  searchNews(
    query: string,
    page: number = 1
  ): Observable<SpaceNews[]> {

    const params = new HttpParams()
      .set('q', query)
      .set('media_type', 'image,video')
      .set('page_size', '24')
      .set('page', page.toString());

    return this.http
      .get<NasaSearchResponse>(this.apiUrl, { params })
      .pipe(
        map(response => {
          const items = response.collection?.items ?? [];

          return items
            .filter(item =>
              item.data?.length > 0 &&
              !!item.data[0].title &&
              !!item.links?.some(link =>
                link.rel === 'preview' &&
                link.render !== 'video'
              )
            )
            .map(item => {
              const data = item.data[0];
              const preview = item.links?.find(link =>
                link.rel === 'preview' &&
                link.render !== 'video'
              );

              return {
                id: data.nasa_id,
                title: data.title,
                description: data.description ||
                  'Ehhez a tartalomhoz nem érhető el leírás.',
                date: data.date_created,
                imageUrl: preview?.href ?? '',
                mediaType: data.media_type,
                sourceUrl:
                  'https://images.nasa.gov/details/' +
                  encodeURIComponent(data.nasa_id),
                center: data.center ?? 'NASA',
                keywords: data.keywords ?? []
              };
            });
        })
      );
  }
}
