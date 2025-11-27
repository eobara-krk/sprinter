
// Poziomy drzewa:
// 1. Sprint (tydzień)
// 2. Zadanie (grupa)
// 3. Kod (podgrupa)

export class DynamicTitles {
    static getFirstWeekTitle(startDate: Date): string {
    return 'XFormy monitorujące naruszenia w komunikatach mail/sms/pismo';
    
  }
    static getSecondWeekTitle(startDate: Date): string {
    return '<b>Sprint 10:</b> <i>12 XI - 26 XI</i>';
  }

  static getThirdWeekTitle(startDate: Date): string {
   return '<b>Sprint 11:</b> <i>26 XI - 10 XII</i>';
  }
}
