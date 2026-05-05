import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Tiny inline-SVG icon set. Lives as a single component so we can ship
 * crisp, monochrome icons without pulling a 200kB icon library.
 *
 * Add new icons by extending the switch in the template — keep them
 * 24×24, 1.6 stroke and aligned to the visual rhythm of the rest of
 * the system.
 */
export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'calendar'
  | 'check'
  | 'clock'
  | 'download'
  | 'facebook'
  | 'instagram'
  | 'leaf'
  | 'map-pin'
  | 'menu'
  | 'parking'
  | 'phone'
  | 'play'
  | 'pin-mountain'
  | 'plus'
  | 'sparkles'
  | 'star'
  | 'tripadvisor'
  | 'users'
  | 'utensils'
  | 'whatsapp'
  | 'wifi'
  | 'x';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="icon"
      [attr.viewBox]="viewBox"
      [attr.aria-hidden]="ariaHidden"
      [attr.role]="ariaHidden ? null : 'img'"
      [attr.aria-label]="ariaHidden ? null : label"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      @switch (name) {
        @case ('arrow-right') {
          <path d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7M9 7h8v8" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        }
        @case ('check') {
          <path d="m4 12 5 5L20 6" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        }
        @case ('download') {
          <path d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14" />
        }
        @case ('facebook') {
          <path
            d="M14 22v-9h3l1-4h-4V6.5c0-1.2.4-2 2.1-2H18V1h-2.7C12.4 1 11 2.7 11 5.4V9H8v4h3v9z"
            stroke-linejoin="round"
          />
        }
        @case ('instagram') {
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        }
        @case ('leaf') {
          <path d="M5 19c0-7 5-13 14-13 0 9-6 14-13 14M5 19c0-1.5.5-3 1.5-4.5" />
        }
        @case ('map-pin') {
          <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" />
          <circle cx="12" cy="10" r="2.5" />
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('parking') {
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M10 17V8h3.5a2.5 2.5 0 0 1 0 5H10" />
        }
        @case ('phone') {
          <path
            d="M22 17v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6.2.6.1 1.3-.4 1.7L8 9.4a16 16 0 0 0 6.6 6.6l1.4-1.4c.4-.4 1-.6 1.7-.4.8.3 1.7.5 2.6.6A2 2 0 0 1 22 17Z"
          />
        }
        @case ('pin-mountain') {
          <path d="M3 19h18M5 19l5-9 4 6 3-4 4 7" />
        }
        @case ('play') {
          <path d="M7 5v14l12-7Z" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('sparkles') {
          <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
          <path d="m6 6 1.5 1.5M16.5 16.5 18 18M6 18l1.5-1.5M16.5 7.5 18 6" />
        }
        @case ('star') {
          <path
            d="m12 3 2.6 5.4 5.9.6-4.4 4 1.3 5.8-5.4-3-5.4 3 1.3-5.8-4.4-4 5.9-.6Z"
            stroke-linejoin="round"
          />
        }
        @case ('tripadvisor') {
          <circle cx="12" cy="12" r="9" />
          <circle cx="8.5" cy="12" r="2" />
          <circle cx="15.5" cy="12" r="2" />
        }
        @case ('users') {
          <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
          <circle cx="9.5" cy="8" r="3.5" />
          <path d="M21 20v-1a4 4 0 0 0-3-3.9M16 4a3.5 3.5 0 0 1 0 7" />
        }
        @case ('utensils') {
          <path d="M7 3v9a2 2 0 0 0 2 2v7M5 3v6M9 3v6M15 14V8c0-2.2 1.5-4 3-5v18" />
        }
        @case ('whatsapp') {
          <path d="M21 12a9 9 0 1 1-3.7-7.3L21 4l-1 3.7A9 9 0 0 1 21 12Z" />
          <path
            d="M9 9.5c.2 1.5 1 2.7 2.2 3.6 1.2.9 2.5 1.4 3.6 1.5l.7-1.4-2.1-1-.9.8c-.6-.3-1.2-.7-1.7-1.3-.5-.5-.9-1.1-1.2-1.7l.8-.9-1-2.1-1.4.7Z"
          />
        }
        @case ('wifi') {
          <path d="M2 9a18 18 0 0 1 20 0" />
          <path d="M5 13a13 13 0 0 1 14 0" />
          <path d="M8.5 16.5a8 8 0 0 1 7 0" />
          <circle cx="12" cy="20" r="0.8" fill="currentColor" />
        }
        @case ('x') {
          <path d="m6 6 12 12M18 6 6 18" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      line-height: 0;
    }

    .icon {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() label?: string;
  @Input() viewBox = '0 0 24 24';

  protected get ariaHidden(): boolean {
    return !this.label;
  }
}
