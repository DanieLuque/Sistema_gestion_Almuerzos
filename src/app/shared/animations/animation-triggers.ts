import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-out', style({ opacity: 1 }))
  ])
]);

export const slideUpAnimation = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(30px)', opacity: 0 }),
    animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const slideDownAnimation = trigger('slideDown', [
  transition(':enter', [
    style({ transform: 'translateY(-30px)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const scaleInAnimation = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

export const rotateInAnimation = trigger('rotateIn', [
  transition(':enter', [
    style({ transform: 'rotate(-10deg)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'rotate(0)', opacity: 1 }))
  ])
]);

export const bounceInAnimation = trigger('bounceIn', [
  transition(':enter', [
    style({ transform: 'scale(0.3)', opacity: 0 }),
    animate('600ms ease-out', [
      style({ transform: 'scale(1.05)', offset: 0.7 }),
      style({ transform: 'scale(1)', opacity: 1, offset: 1 })
    ])
  ])
]);

export const expandCollapseAnimation = trigger('expandCollapse', [
  state('expanded', style({
    height: '*',
    opacity: 1
  })),
  state('collapsed', style({
    height: '0px',
    opacity: 0
  })),
  transition('expanded <=> collapsed', animate('300ms ease-in-out'))
]);

export const modalAnimation = trigger('modalAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
  ])
]);

export const swipeAnimation = trigger('swipe', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ])
]);

export const shakeAnimation = trigger('shake', [
  transition('* => *', [
    animate('400ms', style({ transform: 'translateX(5px)' })),
    animate('200ms', style({ transform: 'translateX(-5px)' })),
    animate('200ms', style({ transform: 'translateX(5px)' })),
    animate('200ms', style({ transform: 'translateX(-5px)' })),
    animate('200ms', style({ transform: 'translateX(0)' }))
  ])
]);
