// Импорт mp3 отдаёт URL файла: правило "*.mp3" с type "asset" в next.config.ts.
declare module "*.mp3" {
  const src: string;
  export default src;
}
