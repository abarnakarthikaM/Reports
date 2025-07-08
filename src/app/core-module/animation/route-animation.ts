import { trigger, animate, transition, style, query, group } from '@angular/animations';
// tslint:disable-next-line: no-any
/**
 * Author : Padma Priya CK
 * Desc : router animation
 */
export const fadeAnimation: any =

    trigger('fadeAnimation', [

        transition('* <=> *', [
            query(':enter, :leave', style({ position: 'fixed', width: '90%',top:'10px'}), { optional: true }),
            group([
                query(':enter', [style({ transform: 'translateX(-100%)' }), animate('1.5s ease-out', style({ transform: 'translateX(0%)' }))], {
                    optional: true,
                }),
                query(':leave', [style({ transform: 'translateX(0%)' }), animate('1.5s ease-out', style({ transform: 'translateX(100%)' }))], {
                    optional: true,
                }),
            ])
        ])
    ]);
