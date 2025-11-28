import { Component, OnInit } from '@angular/core';
import { PhotoGalleryComponent } from './photo-gallery.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirstWeekTexts } from './firstWeek-texts';
import  {SecondWeekTexts } from './secondWeek-texts';
import {ThirdWeekTexts} from './thirdWeek-texts';  
import { TextFormatService } from './text-format.service';
import { TextVisibilityService } from './text-visibility.service';
import { FolderVisibilityService } from './folder-visibility.service';
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
    CommonModule,        // <-- potrzebne do date pipe i dyrektyw typu ngIf
    NgFor,
    NgIf,
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
    public textVisibilityService: TextVisibilityService,
    public textFormatService: TextFormatService,
    // public audioPlayer: AudioPlayerService,
    public folderVisibilityService: FolderVisibilityService,
    // ...existing code...
    // public linkService: LinkService,
    public imageService: ImageService
  ) {}
  
  title = '33';

  // AUDIO PLAYER TOTUS TUUS przez serwis
  // Removed leftover audio logic
  currentDateTime: Date = new Date(); // data biezaca
   //currentDateTime: Date | null = new Date(2026, 4, 1); // (2025, 4, 2) = 2 maj


  // KONFIGURACJA DAT - tutaj ustawiasz datę startu 
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




  fullscreenImage: string | null = null; // <-- globalny fullscreen
  private hasScrolledToToday: boolean = false; // Flaga czy już przewinięto do dzisiejszej daty


  // ----------------------
  // INICJALIZACJA - AUTOMATYCZNE OTWIERANIE DZISIEJSZYCH FOLDERÓW
  // ----------------------
  ngOnInit() {
    // this.openTodayFolders() removed
    setTimeout(() => {
      this.scrollToToday();
    }, 2000);
  }


  // Automatyczne otwieranie folderów z dzisiejsą datą

   // ----------------------
  // OTWIERANIE LINKÓW
  // ----------------------
  openLink(linkOrGroup: SingleLink | SingleLink[]) {
    if (Array.isArray(linkOrGroup)) {
      if (linkOrGroup.length > 0) window.open(linkOrGroup[0].url, '_blank');
      return;
    }
    if (linkOrGroup.url) window.open(linkOrGroup.url, '_blank');
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
    // Funkcja pusta, audio usunięte
  };
  summaryPassword = 'syn';
  get startDate(): Date {
    // Przykładowa implementacja, dostosuj według potrzeb
    return new Date();
  }

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
  // ...existing code...

  // ----------------------
  // OTWIERANIE TYLKO JEDNEJ GRUPY
  // ----------------------
  openOnly = (groupToOpen: LinkGroup, item: Item) => {
    this.folderVisibilityService.openOnly(this.items, groupToOpen, item, this.summaryPassword);
  };

    // NOWA METODA: BEZPIECZNY GŁÓWNY LINK
  // ----------------------
  getMainLink = (group: LinkGroup): string | null => {
    if (!group.links || group.links.length === 0) return null;
    return group.links.length === 1 ? group.links[0]?.url || null : null;
  };

  // ----------------------
  // KONTROLKI NAWIGACJI MOBILE
  // ----------------------
  collapseAll = () => this.folderVisibilityService.collapseAll(this.items);

  expandToday = () => this.folderVisibilityService.expandToday(this.items, () => {});

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
  title: '<b>XFormy</b> na potrzeby komunikatów mail/sms/pismo',
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
      },
{
        name: 'CAM-2028: zmiana zakresów ukrywania nieużywanych pism',
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
    ],   
},

{
  title: '<b>Sprint 10:</b> <i>12 XI - 26 XI</i>',
  show: false,
   links: [
  

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
          }

        ]
      }
    ] 
},
{
  title: '<b>Sprint 11:</b> <i>26 XI - 10 XII</i>',
  show: false,
   links: [
            {
        name: 'CA-11792 RODO do GP aktualizacja',
        show: false,
        links: [
            { type: 'pdf', url: 'assets/tydzien2/rodo.pdf', label: '<b>CA-11792</b> Klauzula RODO dla GP ' }
        ]
      },
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
            { type: 'pdf', url: 'assets/tydzien3/amiexpres.pdf', label: '<b>CA-11837</b> BRAND_GP_AMIEXPRESS' }
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