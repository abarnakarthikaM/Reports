import { Injectable } from '@angular/core';
declare let CryptoJS: any;
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  decryptData(data: any): void {
    let value = data[0].split("@$%");
    let decryptedData = CryptoJS.AES.decrypt(
      value[0]?.replace(/^"(.*)"$/, '$1'),
      CryptoJS.enc.Base64.parse(value[1]),
      { mode: CryptoJS.mode.ECB }
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  loadConfig(): Promise<void> {
    return this.http.get('./assets/token')
      .toPromise()
      .then(config => {
        this.config = config
      });
  }

  get(key: string): string {
    const decryptData = this?.decryptData(this.config)[key];
    return decryptData ? decryptData : null;
  }
}
