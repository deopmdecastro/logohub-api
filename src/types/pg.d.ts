declare module 'pg' {
  export const Pool: any;
}


// Global browser helpers injected by shared.ts COMMON_JS
declare global {
  interface Window {
    LH: {
      fmt: (n: number | string) => string;
      rel: (s: string) => string;
      toast: (kind: string, title: string, msg?: string) => void;
      confirm: (opts: { title: string; msg?: string; danger?: boolean; yes?: string }) => Promise<boolean>;
      openModal: (html: string) => HTMLElement;
      toggleTheme: () => void;
      copy: (text: string) => Promise<void>;
      api: (path: string, opts?: RequestInit) => Promise<any>;
      extractPalette: (file: File) => Promise<string[]>;
      fileToDataUrl: (file: File) => Promise<string>;
      slugify: (s: string) => string;
      authHeader: () => Record<string, string>;
      loadUser: () => Promise<any>;
      toggleUserMenu: () => void;
      logout: () => void;
      loadNotifUnread: () => Promise<number>;
      handleLogoUpload: (input: HTMLInputElement) => void;
      handleFaviconUpload: (input: HTMLInputElement) => void;
    };
    __USER: any;
    NOTIF_UNREAD: number;
  }
  const LH: Window['LH'];
}
export {};
