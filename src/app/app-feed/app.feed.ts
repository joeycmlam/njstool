import feedGenerator from "./feedGenerator";

(async () => {
    const generator = new feedGenerator('test.json');
    await generator.generateFeed();
  })();

