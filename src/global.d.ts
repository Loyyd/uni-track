interface Window {
  storage: {
    get: (key: string) => Promise<{ value?: string } | undefined>;
    set: (key: string, value: string) => Promise<void>;
  };
}

export {}
