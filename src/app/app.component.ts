import { Component, OnInit } from '@angular/core';
import { PhotoGalleryComponent } from './photo-gallery.component';
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
    RouterModule,
    PhotoGalleryComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    // Zwraca tylko elementy typu 'foto' z podanej tablicy linków
    public getPhotoElements(links: SingleLink[]): { image: string; label?: string }[] {
      return Array.isArray(links)
        ? links
            .filter(l => l.type === 'foto' && typeof l.image === 'string')
            .map(l => ({ image: l.image as string, label: l.label }))
        : [];
    }
  // Zwraca liczbę zdjęć typu 'foto' w podanej tablicy linków
  public getPhotoCount(links: SingleLink[]): number {
    return Array.isArray(links) ? links.filter(l => l.type === 'foto').length : 0;
  }
// ...istniejący kod...
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

  summaryPassword = 'syn';

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

  // Automatyczne otwieranie folderów z dzisiejsą datą
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
  toggle = (obj: Item) => {
    this.folderVisibilityService.toggle(this.items, obj, () => this.stopAllAudio());
    // Specjalna logika dla 'utrzymanie 3 nowe filtry' - tylko reset opisu
    if (obj.links) {
      const utrzymanie = obj.links.find(g => g.name === 'utrzymanie 3 nowe filtry');
      if (utrzymanie && utrzymanie.links) {
        const tekst = utrzymanie.links.find(l => l.type === 'opis');
        if (tekst) tekst.show = false;
      }
    }
  };

  // Zatrzymuje wszystkie odtwarzane audio przez serwis
  stopAllAudio = () => {
  this.audioPlayer.stopAll();
  this.audioPlayer.pause(this.audioUrl);
  };

  // ----------------------
  // CHRONIONE TEKSTY
  // ----------------------
  toggleLink = (group: LinkGroup) => this.folderVisibilityService.toggleLink(group, this.summaryPassword);

  // Metoda do przełączania zagnieżdżonych grup (tylko jeden otwarty, kliknięcie na otwarty zamyka)
  toggleOnlyNestedGroup = (nestedGroup: any, siblings: any[]) => {
    if (!siblings || siblings.length < 2) {
      nestedGroup.show = !nestedGroup.show;
      return;
    }
    if (nestedGroup.show) {
      nestedGroup.show = false;
      return;
    }
    siblings.forEach(s => s.show = false);
    nestedGroup.show = true;
  };

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
  // TRACKBY dla zagnieżdżonych linków
  // ----------------------
  trackByNestedLink(index: number, link: SingleLink) {
    return link.label || link.url || index;
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


readonly firstWeekDay1 = FirstWeekTexts.dzien1;
readonly firstWeekDay2 = FirstWeekTexts.dzien2;
readonly firstWeekDay3 = FirstWeekTexts.dzien3;


readonly secondWeekDay0 = SecondWeekTexts.dzien0;
readonly secondWeekDay1 = SecondWeekTexts.dzien1;
readonly secondWeekZakresy = SecondWeekTexts.zakresy;


readonly thirdWeekMHC = ThirdWeekTexts.MHC;
readonly thirdWeekDay1 = ThirdWeekTexts.dzien1;




items: Item[] = [
 
{
  title: DynamicTitles.getFirstWeekTitle(this.startDate),
  show: false, // opcjonalnie, żeby nie był od razu rozwinięty
  links: [
 

    {
        name: 'XForm sprawdzające naruszenia w komunikatach',
        show: false,
        links: [
          { image: 'assets/tydzien1/pismaAdres.jpg',type:'foto', label: 'adres na pismach' },
           { text: this.firstWeekDay1, type:'opis', label: 'adres sms/maile' },
          { text: this.firstWeekDay2, type:'opis', label: 'maile czcionka' },
          { text: this.firstWeekDay3, type:'opis', label: 'zakazane znaki w sms' },
        ]
      }
    ] 
},

{
  title: DynamicTitles.getSecondWeekTitle(this.startDate),
  show: false,
   links: [
  {
        name: 'CA-11798 Klauzula na współmałżonka cz. 1',
        show: false,
        links: [
          {
            name: 'Przegląd kodu',
            show: false,
            links: [
          { image: 'assets/tydzien2/0a.jpg',type:'foto', label: 'przelew plik pdf' },
          { image: 'assets/tydzien2/1a.jpg',type:'foto', label: 'szukanie po ciągu znaków' },
          { image: 'assets/tydzien2/2a.jpg',type:'foto', label: 'przypisanie do właściwej kategorii' },
            ]
          },
            { text: this.secondWeekDay1, type:'opis', label: 'klauzula' },
        ]
      },
        {
        name: 'CA-11792 RODO do GP aktualizacja',
        show: false,
        links: [
          {
            name: 'zalacznik',
            show: false,
            links: [
              // Możesz dodać więcej plików PDF lub obrazków analogicznie jak w Przegląd kodu
              { type: 'pdf', url: 'assets/tydzien2/rodo.pdf', label: '<b>CA-11792</b> Klauzula RODO dla GP ' }
            ]
          }
        ]
      },
       {
        name: 'utrzymanie: 3 nowe filtry',
        show: false,
        links: [
          {
            name: 'Przegląd kodu',
            show: false,
            links: [
              { image: 'assets/tydzien2/CAM-3986.jpg',type:'foto', label: '<b>CAM-3986</b> <br>Tylko sprawy, gdzie termin pierwszej licytacji przypada nie wcześniej jak za 2 tyg.' },
              { image: 'assets/tydzien2/CAM-3987.jpg',type:'foto', label: '<b>CAM-3987</b> <br>Tylko sprawy z zabezpieczoną nieruchomością lub sprawy bez zabepieczonej nieruchomości' },
              { image: 'assets/tydzien2/CAM-4071.jpg',type:'foto', label: '<b>CAM-4071</b> <br>Tylko klienci, którzy mają PESEL lub klienci bez nr PESEL' },
              { image: 'assets/tydzien2/CAM-4071a.jpg',type:'foto', label: '<b>CAM-4071</b> <br>Tylko klienci, którzy mają PESEL lub klienci bez nr PESEL' },
              { image: 'assets/tydzien2/CAM-4071b.jpg',type:'foto', label: '<b>CAM-4071</b> <br>Tylko klienci, którzy mają PESEL lub klienci bez nr PESEL' }
            ]
          },
            { text: this.secondWeekDay1, type:'opis', label: 'filtry' },
        ]
      },
      {
        name: 'CAM-2028: zmiana zakresów ukrywania nieuzywanych pism',
        show: false,
        links: [
          {
            name: 'Przegląd kodu',
            show: false,
            links: [
              { image: 'assets/tydzien2/zakres1.jpg',type:'foto', label: '<b>CAM-2028</b> <i>DEL_SP_MailingLetterTemplate_Deleted</i> <br>procedura pilnująca zakresów' },
              { image: 'assets/tydzien2/zakres2.jpg',type:'foto', label: '<b>CAM-2028</b> <br>Przykłady zakresów' },
            ]
          },
            { text: this.secondWeekZakresy, type:'opis', label: 'zakresy' },
        ]
      }
    ] 
},
{
  title: DynamicTitles.getThirdWeekTitle(this.startDate),
  show: false,
   links: [
      {
        name: 'CA-11798 Klauzula na współmałżonka cz. 2',
        show: false,
        links: [
          {
            name: 'Przegląd kodu',
            show: false,
            links: [
          { image: 'assets/tydzien3/0a.jpg',type:'foto', label: 'kod kolektora MailingService' },
          { image: 'assets/tydzien3/1a.jpg',type:'foto', label: 'Nowe pismo testowe: Generator masowy z załacznikami' },
          { image: 'assets/tydzien3/2a.jpg',type:'foto', label: 'Podpiecie paczki z kolektorem do pisma' },
          { image: 'assets/tydzien3/3a.jpg',type:'foto', label: 'Generowanie pisma i wybor załacznika, za którego odpowiada kolektor' },
          { image: 'assets/tydzien3/3a.jpg',type:'foto', label: 'Generowanie pisma i wybor załacznika, za którego odpowiada kolektor' },
            ]
          },
          { type: 'pdf', url: 'assets/tydzien3/PismoiZalacznik.pdf', label: '<b>CA-11798 </b> Klauzula na współmałżonka z załacznikiem' }
        ]
      },
          {
        name: 'CA-11837 [AMI EXPRESS] Wdrażanie pisma GP',
        show: false,
        links: [
           {
            name: 'zalacznik',
            show: false,
            links: [
              // Możesz dodać więcej plików PDF lub obrazków analogicznie jak w Przegląd kodu
              { type: 'pdf', url: 'assets/tydzien3/GP.pdf', label: '<b>CA-11837</b> BRAND_GP_AMIEXPRESS' }
            ]
          }
        ]
      },
      {
        name: 'MHC xyz',
        show: false,
        links: [
          {
            name: 'Przegląd kodu',
            show: false,
            links: [
              { image: 'assets/tydzien3/mhc1.jpg',type:'foto', label: '<b>mhc</b>' },
              { image: 'assets/tydzien3/mhc2.jpg',type:'foto', label: '<b>mhc</b>' },
            ]
          },
            { text: this.thirdWeekMHC, type:'opis', label: 'MHC-ugoda' },
            { type: 'pdf', url: 'assets/tydzien3/mhc.pdf', label: '<b>mhc</b>' }
        ]
      }
  ]
}
];
}