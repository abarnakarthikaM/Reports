import { Pipe, PipeTransform } from '@angular/core';
/**
 * Author: Sudhakar M
 * Desc: pipe to transfor linear array to 2D array implemented in custom reports review page
 */
@Pipe({
  name: 'toMatrix'
})
export class ToMatrixPipe implements PipeTransform {

  transform(arr: number[], n: number): number[][] {
    let validArr:any = [];
    arr.map((data:any) => {
      if(data.status === 'Y'){
        validArr.push(data);
      }
    });
    const rows = Array.from({ length: Math.ceil(validArr.length / n) }, (_, i) => i);
    return rows.map(idx => validArr?.slice(idx * n, idx * n + n));
  }

}
