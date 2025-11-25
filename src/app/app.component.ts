import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirstWeekTexts } from './firstWeek-texts';
import  {SecondWeekTexts } from './secondWeek-texts';
import {ThirdWeekTexts} from './thirdWeek-texts';  
import { WhatsAppFormatterService } from './whatsapp-formatter.service';
import { TextFormatService } from './text-format.service';
import { TextVisibilityService } from './text-visibility.service';
import { WhatsappCopyService } from './whatsapp-copy.service';
import { getDaysToEnd, getDaysRangeLabel } from './cycle-utils';
import { DynamicTitles } from './dynamic-titles';
import { AudioPlayerService } from './audio-player.service';
import { getWiosnaStart, getWiosnaStop } from './constants';
import { FolderVisibilityService } from './folder-visibility.service';
import { DateUtilsService } from './date-utils.service';
import { LinkService } from './link.service';
import { ImageService } from './image.service';

// Typy dla linków i itemów
interface LinkGroup {
  name: string;
  show?: boolean;
  type?: string;         // opis, html, audio...
  links?: SingleLink[];  // <-- teraz można używać label
  text?: string;
  protected?: boolean;
  image?: string;  // opcjonalne pole na obrazek
  fullscreen?: boolean; 
  url?: string; // <-- dodajemy opcjonalne pole url
}
interface SingleLink {
  url?: string;
  type?: string;
  label?: string;  // <-- dodajemy opcjonalne pole label
  fullscreen?: boolean; // jeśli chcesz obsługiwać fullscreen dla linków
  image?: string; // 🆕 obrazek do wyświetlenia
  name?: string; // nazwa dla zagnieżdżonych grup
  show?: boolean; // czy grupa zagnieżdżona jest rozwinięta
  links?: SingleLink[]; // zagnieżdżone linki
  text?: string; // 🆕 tekst do wyświetlenia jako podlink
  hidden?: boolean; // ukrywa link w aplikacji
}

interface Meeting {
  date: string;
  show: boolean;
  links?: LinkGroup[];
  meetings?: Meeting[]; // dla spotkań z podziałem na daty
}

interface Item {
  title: string;
  show: boolean;
  image?: string;       // 🆕 obrazek JPG lub PNG
  fullscreen?: boolean; // 🆕 tryb pełnoekranowy po kliknięciu
 links?: LinkGroup[];
  meetings?: Meeting[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,        // <-- potrzebne do date pipe i dyrektyw typu ngSwitch
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private whatsappCopyService: WhatsappCopyService,
    private whatsappFormatter: WhatsAppFormatterService,
    public audioPlayer: AudioPlayerService,
    public textVisibilityService: TextVisibilityService,
    public textFormatService: TextFormatService,
    public folderVisibilityService: FolderVisibilityService,
    public dateUtilsService: DateUtilsService,
    public linkService: LinkService,
    public imageService: ImageService
  ) {}
  
  title = '33';

  // AUDIO PLAYER TOTUS TUUS przez serwis
  audioUrl = 'assets/totus_tuus.mp3';

  private readonly summaryPassword = 'syn';

  currentDateTime: Date = new Date(); // data biezaca
   //currentDateTime: Date | null = new Date(2026, 4, 1); // (2025, 4, 2) = 2 maj


  // KONFIGURACJA DAT - tutaj ustawiasz datę startu 
 get startDate(): Date {
    const today = this.currentDateTime ?? new Date();
    today.setHours(0,0,0,0);
    const year = today.getFullYear();
    const wiosnaStart = getWiosnaStart(year);
    const wiosnaStop = getWiosnaStop(year);
    if (today >  wiosnaStart && today < wiosnaStop) {
      return new Date(year, 2, 22); // 22 marca
    } else {
      return new Date(year, 9, 27); // 27 października
    }
  }

    // Licznik dni do 8 grudnia lub 3 maja
  get daysToEnd(): string {
    return getDaysToEnd(this.currentDateTime);
  }

  get daysRangeLabel(): string {
    return getDaysRangeLabel(this.currentDateTime);
  }


  // Metoda pomocnicza do generowania nazwy dnia z datą
  private getDayName(date: Date): string {
    const dayNames = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName} ${day}.${month}.${year} r.`;
  }

  // Metoda do generowania daty o N dni później
  getDatePlusDays(startDate: Date, days: number): string {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    return this.getDayName(newDate);
  }


  // Debounce helper
  private lastAudioToggle = 0;
  private debounceMs = 400;

  // Unified audio toggle for any audio file (Totus Tuus or local) with debounce
  toggleAudio(url: string = this.audioUrl) {
    const now = Date.now();
    if (now - this.lastAudioToggle < this.debounceMs) {
      return;
    }
    this.lastAudioToggle = now;

    const audioEl = (this.audioPlayer as any).audioElements?.[url];
    if (audioEl && audioEl.paused && audioEl.currentTime > 0 && (this.audioPlayer.getCurrentUrl() === null)) {
      audioEl.play();
      (this.audioPlayer as any).playingUrl = url;
    } else if (this.audioPlayer.isPlaying(url)) {
      this.audioPlayer.pauseOnly(url);
    } else {
      // Stop all other audio
      this.audioPlayer.stopAll();
      this.audioPlayer.play(
        url,
        0.8,
        () => {},
        () => {}
      );
    }
  }

  // Stop any audio by url
  stopAudio(url: string = this.audioUrl) {
  this.audioPlayer.pause(url);
  }
 
  // Sprawdza czy w tablicy linków jest audio z url
  hasAudioLink(links: SingleLink[]): boolean {
    return Array.isArray(links) && links.some(x => x.type === 'audio' && !!x.url);
  }


  // Kopiowanie tekstu + linku audio w formacie WhatsApp
  copyAudioTextToClipboard(links: SingleLink[]) {
    this.whatsappCopyService.copyAudioTextToClipboard(links, this.whatsappFormatter);
  }

  copyAsWhatsapp(text: string) {
    const formatted = this.whatsappFormatter.simpleFormatForWhatsApp(text);
    navigator.clipboard.writeText(formatted);
  }

  fullscreenImage: string | null = null; // <-- globalny fullscreen
  private hasScrolledToToday: boolean = false; // Flaga czy już przewinięto do dzisiejszej daty


  // ----------------------
  // INICJALIZACJA - AUTOMATYCZNE OTWIERANIE DZISIEJSZYCH FOLDERÓW
  // ----------------------
  ngOnInit() {
    this.openTodayFolders();
    setTimeout(() => {
      this.scrollToToday();
    }, 2000);
  }

  // Odtwarzanie lokalnych audio przez serwis
  playLocalAudio(url: string, volume = 1, onEnd?: () => void, onError?: () => void) {
    this.audioPlayer.play(url, volume, onEnd, onError);
  }

  isLocalAudioPlaying(url: string): boolean {
    return this.audioPlayer.isPlaying(url);
  }

  // Automatyczne otwieranie folderów z dzisiejszą datą
  openTodayFolders = () => this.folderVisibilityService.openTodayFolders(
    this.items,
    (title: string) => this.dateUtilsService.isTodayInTitleRange(title, this.currentDateTime),
    (name: string) => this.dateUtilsService.isToday(name, this.currentDateTime)
  );

   // ----------------------
  // OTWIERANIE LINKÓW
  // ----------------------
  openLink(linkOrGroup: SingleLink | SingleLink[]) {
    this.linkService.openLink(linkOrGroup);
  }

  // ----------------------
  // ROZWIJANIE/ZWIJANIE EVENTÓW
  // ----------------------
  toggle = (obj: Item) => this.folderVisibilityService.toggle(this.items, obj, () => this.stopAllAudio());

  // Zatrzymuje wszystkie odtwarzane audio przez serwis
  stopAllAudio = () => {
  this.audioPlayer.stopAll();
  this.audioPlayer.pause(this.audioUrl);
  };

  // ----------------------
  // CHRONIONE TEKSTY
  // ----------------------
  toggleLink = (group: LinkGroup) => this.folderVisibilityService.toggleLink(group, this.summaryPassword);

  // Metoda do przełączania zagnieżdżonych grup
  toggleNestedGroup = (nestedGroup: SingleLink) => this.folderVisibilityService.toggleNestedGroup(nestedGroup);

  // ----------------------
  // TRACKBY dla *ngFor
  // ----------------------
  trackByTitle(index: number, item: Item) {
    return item.title;
  }

  trackByName(index: number, group: LinkGroup) {
    return group.name;
  }

  // ----------------------
  // TRYB PEŁNOEKRANOWY OBRAZKA
  // ----------------------
  toggleFullscreen = (url?: string) => {
    this.fullscreenImage = this.imageService.toggleFullscreen(this.fullscreenImage, url);
  };

  // Obsługa ładowania obrazka
  onImageLoad = (event: Event) => this.imageService.onImageLoad(event);
  onImageError = (event: Event) => this.imageService.onImageError(event);


  // ----------------------
  // CZY DANA DATA JEST DZISIAJ
  // ----------------------
  isTodayInTitleRange = (title: string) => this.dateUtilsService.isTodayInTitleRange(title, this.currentDateTime);
  isToday = (name: string) => this.dateUtilsService.isToday(name, this.currentDateTime);
  hasInnerTodayElements = (group: LinkGroup) => this.dateUtilsService.hasInnerTodayElements(group, this.currentDateTime);
  hasInnerTodayGroups = (item: Item) => this.dateUtilsService.hasInnerTodayGroups(item, this.currentDateTime);

  // ----------------------
  // OTWIERANIE TYLKO JEDNEJ GRUPY
  // ----------------------
  openOnly = (groupToOpen: LinkGroup, item: Item) => {
    this.folderVisibilityService.openOnly(this.items, groupToOpen, item, this.summaryPassword);
    if (groupToOpen.show) {
      setTimeout(() => {
        const groupElems = document.querySelectorAll('.group-container');
        for (let elem of Array.from(groupElems)) {
          if (elem.textContent && groupToOpen.name && elem.textContent.includes(groupToOpen.name)) {
            (elem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
          }
        }
      }, 300);
    }
  };

    // NOWA METODA: BEZPIECZNY GŁÓWNY LINK
  // ----------------------
  getMainLink = (group: LinkGroup): string | null => this.linkService.getMainLink(group);

  // ----------------------
  // KONTROLKI NAWIGACJI MOBILE
  // ----------------------
  collapseAll = () => this.folderVisibilityService.collapseAll(this.items);

  expandToday = () => this.folderVisibilityService.expandToday(this.items, (items: Item[]) => this.openTodayFolders());

  // ----------------------
  // ZAMYKANIE STRONY
  // ----------------------
  closePage() {
    // Sprawdź czy można zamknąć okno (działa gdy strona została otwarta przez JavaScript)
    const canClose = window.opener !== null || window.history.length <= 1;
    if (canClose) {
      window.close();
      // Jeśli okno się nie zamknęło, przekieruj na about:blank
      setTimeout(() => {
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
      }, 50);
    } else {
      // Jeśli nie można zamknąć, od razu przekieruj na about:blank
      window.location.href = 'about:blank';
    }
  }

  // ----------------------
  // AUTOMATYCZNE PRZEWIJANIE DO DZISIEJSZEGO ELEMENTU
  // ----------------------
  scrollToToday() {
    // Przewijaj tylko jeśli jeszcze tego nie robiono
    if (this.hasScrolledToToday) {
      return;
    }

    // Znajdź pierwszy element z dzisiejszą datą
    const todayElement = document.querySelector('.today-highlight');
    
    if (todayElement) {
      // Proste przewijanie do dzisiejszego elementu z małym offsetem od góry
      const elementTop = todayElement.getBoundingClientRect().top + window.pageYOffset;
      const offset = 150; // Stały offset żeby zostawić miejsce na header
      
      window.scrollTo({
        top: Math.max(0, elementTop - offset),
        behavior: 'smooth'
      });
      
      // Oznacz że przewijanie już się odbyło
      this.hasScrolledToToday = true;
    }
  // Jeśli nie ma dzisiejszego elementu - pozostaw stronę na górze i oznacz jako wykonane
  this.hasScrolledToToday = true;
  }

  // ----------------------
  // SPRAWDZANIE CZY GRUPA MA ELEMENTY FOTO
  // ----------------------
  hasPhotoElements = (links: any[]): boolean => this.imageService.hasPhotoElements(links);


    // Pomocnicza metoda: wstawia datę z pola name na początek tekstu
  prependDateFromName(name: string, text: string): string {
    // Wyciągnij datę z pola name (po dwukropku i spacji)
    const match = name.match(/\d{2}: (.+)/);
    const date = match ? match[1] : name;
    return `<b>${date}</b><br>${text}`;
  }



readonly firstWeekDay0 = FirstWeekTexts.dzien0;
readonly firstWeekDay1 = FirstWeekTexts.dzien1;


readonly secondWeekDay0 = SecondWeekTexts.dzien0;
readonly secondWeekDay1 = SecondWeekTexts.dzien1;


readonly thirdWeekDay0 = ThirdWeekTexts.dzien0;
readonly thirdWeekDay1 = ThirdWeekTexts.dzien1;





items: Item[] = [
 
{
  title: DynamicTitles.getFirstWeekTitle(this.startDate),
  show: false, // opcjonalnie, żeby nie był od razu rozwinięty
  links: [
    {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay0, type:'opis', label: 'CA-cvy' },
        ]
      },
          {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay1, type:'opis', label: 'CA-cvy' },
        ]
      }
    ] 
},
{
  title: DynamicTitles.getSecondWeekTitle(this.startDate),
  show: false,
   links: [
    {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay0, type:'opis', label: 'CA-cvy' },
        ]
      },
          {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay1, type:'opis', label: 'CA-cvy' },
        ]
      }
    ] 
},
{
  title: DynamicTitles.getThirdWeekTitle(this.startDate),
  show: false,
   links: [
    {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay0, type:'opis', label: 'CA-cvy' },
        ]
      },
          {
        name: 'CA-cvy',
        show: false,
        links: [
          { image: 'assets/tydzien1/0.jpg',type:'foto' },
          { text: this.firstWeekDay1, type:'opis', label: 'CA-cvy' },
        ]
      }
    ] 
      },]
}