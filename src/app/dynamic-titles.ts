// dynamic-titles.ts

export class DynamicTitles {
    static getFirstWeekTitle(startDate: Date): string {
    return '<b>Sprint 9:</b> <i>29 X - 12 XI</i>';
    
  }
    static getSecondWeekTitle(startDate: Date): string {
    return '<b>Sprint 10:</b> <i>12 XI - 26 XI</i>';
  }

  static getThirdWeekTitle(startDate: Date): string {
   return '<b>Sprint 11:</b> <i>26 XI - 10 XII</i>';
  }
}
