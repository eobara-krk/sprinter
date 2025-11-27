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
    this.photoIndex = 0; // resetuj indeks przy zmianie zdjęć
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
    if (idx < 0) idx = max - 1;
    if (idx >= max) idx = 0;
    this.photoIndex = idx;
  }

  getCurrentPhoto() {
    return this.photos[this.photoIndex] || this.photos[0];
  }
}
