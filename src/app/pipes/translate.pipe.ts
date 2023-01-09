import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private translateService: TranslateService){}

  transform(value: any): any {
    return this.translateService.getTranslate(value) ? this.translateService.getTranslate(value) : '';
  }

}
