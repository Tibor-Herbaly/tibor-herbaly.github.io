import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

interface VideoItem {
  id: string;          // YouTube video ID
  title: string;
  description: string;
  playing?: boolean;   // helyi állapot: éppen játszik-e
}

@Component({
  selector: 'app-music.component',
  standalone: false,
  templateUrl: './music.component.html',
  styleUrl: './music.component.css'
})
export class MusicComponent implements OnInit {
  videos: VideoItem[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // JSON betöltése az assets mappából
    fetch('/assets/videos/music.json')
      .then(res => {
        if (!res.ok) throw new Error('Nem sikerült betölteni a videos.json-t');
        return res.json();
      })
      .then((data: VideoItem[]) => this.videos = data)
      .catch(err => console.error(err));
  }

  getEmbedUrl(video: VideoItem): SafeResourceUrl {
    const autoplay = video.playing ? '1' : '0';
    const url = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&showinfo=0&autoplay=${autoplay}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  playSingle(video: VideoItem) {
    this.videos.forEach(v => v.playing = false);
    video.playing = true;
  }


}
