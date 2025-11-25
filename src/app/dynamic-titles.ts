// dynamic-titles.ts

export class DynamicTitles {
    static getFirstWeekTitle(startDate: Date): string {
    return 'Sprint 9 <i><b>29 X - 12 XI</b></i>';
    
  }
    static getSecondWeekTitle(startDate: Date): string {
    return 'Sprint 10 <i><b>12 XI - 26 XI</b></i>';
  }

  static getThirdWeekTitle(startDate: Date): string {
   return 'Sprint 11 <i><b>26 XI - 10 XII</b></i>';
  }
}
