import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent {
  private _photos: { image: string; label?: string }[] = [];
  @Input() set photos(val: { image: string; label?: string }[]) {
    this._photos = val || [];
    // Nie resetuj photoIndex jeśli album jest fullscreen
    if (this.photoIndex >= this._photos.length) {
      this.photoIndex = 0;
    }
  }
  get photos() {
    return this._photos;
  }
  @Input() groupName: string = '';

  photoIndex: number = 0;

  getPhotoCount(): number {
    return this.photos.length;
  }

  setPhotoIndex(idx: number): void {
    const max = this.getPhotoCount();
    if (max === 0) {
      this.photoIndex = 0;
      return;
    }
    // Obsługa przesuwania w lewo/prawo z zawijaniem
    this.photoIndex = ((idx % max) + max) % max;
  }

  getCurrentPhoto() {
    return this.photos[this.photoIndex] || this.photos[0];
  }
}
