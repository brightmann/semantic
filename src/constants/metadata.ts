export const METADATA = {
  AUTHOR: {
    NAME: "Knesssn",
    TWITTER: "https://twitter.com/masonthecode",
  },
  SITE: {
    DESCRIPTION: "Make your ✨gorgeous blog with semantic",
    LANGUAGE: "en-US",
    NAME: "semantic",
    PREVIEW_IMAGE:
      process.env.GHPAGES === "1"
        ? "https://brightmann.github.io/semantic/static/preview.png"
        : "https://semantic.luckypoem.workers.dev/static/preview.png",
    URL:
      process.env.GHPAGES === "1"
        ? "https://brightmann.github.io/semantic"
        : "https://semantic.luckypoem.workers.dev",
  },
};

export const POST = {
  PER_PAGE: 5,
};
