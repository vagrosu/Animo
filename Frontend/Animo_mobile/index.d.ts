declare module "emoji-mart-native/data/apple.json" {
  const emojis: {
    compressed: boolean;
    categories: {
      id: string;
      name: string;
      emojis: string[];
    }[];
    emojis: {
      [key: string]: {
        a: string;
        b: string;
        h: string[];
        i: number[];
        m: number;
      };
    }[];
    aliases: {
      [key: string]: string;
    };
  };

  export default emojis;
}

declare module "emoji-mart-native/data/local-images/apple" {
  const dataRequires: { emojis: Record<string, unknown> };

  export default dataRequires;
}

declare module "emoji-mart-native" {
  export const Emoji: React.ComponentType<any>;
}
