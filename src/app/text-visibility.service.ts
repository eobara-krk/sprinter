import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TextVisibilityService {
  toggleTextVisibility(linkItem: any) {
    if (linkItem.type === 'opis') {
      if (linkItem.show) {
        linkItem.show = false;
        setTimeout(() => {
          let parentElem = null;
          if (linkItem.label) {
            const allGroups = document.querySelectorAll('.group-container');
            for (let elem of Array.from(allGroups)) {
              if (elem.textContent && elem.textContent.includes(linkItem.label)) {
                parentElem = elem;
                break;
              }
            }
          }
          if (!parentElem) {
            const allFolders = document.querySelectorAll('[id^="folder-"]');
            if (allFolders.length > 0) {
              parentElem = allFolders[0];
            }
          }
          if (parentElem) {
            (parentElem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else {
        linkItem.show = true;
        setTimeout(() => {
          const popup = document.querySelector('.text-fullscreen-content') as HTMLElement;
          if (popup) {
            popup.style.backgroundColor = '#e3f2fd';
            popup.style.border = '4px solid #2563eb';
            popup.style.borderRadius = '18px';
            popup.style.boxShadow = '0 8px 32px rgba(59,130,246,0.18)';
            popup.style.padding = '32px';
            popup.style.color = '#111';
            // Jasno niebieskie tło pod literami
            const subText = popup.querySelector('.sub-text') as HTMLElement;
            if (subText) {
              subText.style.backgroundColor = '#e6f0ff';
              subText.style.borderRadius = '8px';
              subText.style.padding = '4px 8px';
            }
          }
        }, 50);
      }
    }
  }
}
