import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeWrapper: any = document.querySelector('html');
  public productType
  public theme:any;
  public primaryColor:any;
  public secondaryColor:any;
  public airlineCode:any;
  public themeCall(){
    this.primaryColor = sessionStorage.getItem("primaryColor");
    this.secondaryColor = sessionStorage.getItem("secondaryColor");
    this.airlineCode = sessionStorage.getItem("themeCode");
    this.theme = {
      'RM': {
        '--PRIMARYCOLOR' : this.primaryColor.includes('#') ? this.primaryColor : '#' + this.primaryColor,
        '--SECONDARYCOLOR' : this.secondaryColor.includes('#') ? this.secondaryColor : "#" +this.secondaryColor,
        '--DARKBOXSHADOW' : '#0000004d',  
        '--LINK' : '#007bff',   
        '--BGLIGHTER' : '#f2f5f8',
        '--BGDARK' : '#333333',
        '--BGWHITE' : '#ffffff',
        '--TXTDARK' : '#666666',
        '--TXTDARKER' : '#333333',
        '--TXTBLACK' : '#000000',
        '--TXTLIGHT' : '#8b8f97',
        '--TXTLIGHTER' : '#cccccc',
        '--TXTWHITE' : '#ffffff',  
        '--BDRLIGHTER' : '#efefef',
        '--BDRLIGHT' : '#9e9e9e',
        '--BDRREGULAR':'#cccccc',
        '--PRIMARYREGULARFONT': this.airlineCode == 'XY' ? 'Flynas-Regular'  : this.airlineCode == '6E' ? "Poppins-Regular" : this.airlineCode == 'QR' ? "graphik_regular" : "OpenSans-Regular",
        '--PRIMARYLIGHTFONT': this.airlineCode == 'XY' ? "Flynas-Light" : this.airlineCode == '6E' ? "Poppins-Light" : "OpenSans-Light",
        '--PRIMARYMEDIUMFONT': this.airlineCode == 'XY' ? "Flynas-Regular" : this.airlineCode == '6E' ? "Poppins-Medium" : this.airlineCode == 'QR' ? "graphik_medium" : "OpenSans-Medium",
        '--PRIMARYSEMIBOLDFONT': this.airlineCode == 'XY' ? "Flynas-SemiBold" : this.airlineCode == '6E' ? "Poppins-SemiBold" : this.airlineCode == 'QR' ? "graphik_bold" : "OpenSans-SemiBold",
        '--PRIMARYBOLDFONT':this.airlineCode == 'XY' ? 'Flynas-Bold': this.airlineCode == '6E' ? "Poppins-Bold" : this.airlineCode == 'QR' ? "graphik_bold" : "OpenSans-Bold",
        '--SECONDARYFONT':this.airlineCode == 'XY' ? "Flynas-Regular" : this.airlineCode == '6E' ? "Bauhaus-Medium" : this.airlineCode == 'QR' ? "jotia_medium" : "OpenSans-Medium"          
      },
    }
    
    this.productType='RM';  
    for (const [key, value] of Object.entries(this.theme[this.productType])) {
      this.themeWrapper.style.setProperty(key, value);
    }
}
  constructor() { }
}
