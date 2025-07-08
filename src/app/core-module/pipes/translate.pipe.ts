import { Pipe, PipeTransform } from '@angular/core';
import { appConfig } from 'src/app/core-module/config/app';
import * as english from 'src/assets/languages/english/language.json';
import * as spanish from 'src/assets/languages/spanish/language.json';
import * as portuguese from 'src/assets/languages/portuguese/language.json';
// tslint:disable-next-line: no-any
const lang: any = {
  EN: english,
  AR: spanish,
  PT: portuguese
};
/**
 * Author: Shailesh R
 * Desc: pipe to perform pipe transform that performs language translation
 */
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
 /**
   * Author: Shailesh R
   * Desc: Translate language based on JSON key
   */
  public transform(key: string): string {
    return lang[appConfig.CURRENTLANGUAGE] !== undefined ? lang[appConfig.CURRENTLANGUAGE].default[key] || key : key;
  }

}
