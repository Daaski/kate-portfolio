import Image from "next/image";
import arrowRight from "@/assets/emoji/arrow-right.png";
import diamondBlue from "@/assets/emoji/diamond-blue.png";
import diamondOrange from "@/assets/emoji/diamond-orange.png";

// Эмодзи картинкой, как в Figma: системные шрифты рисуют их по-разному на каждом устройстве.
const EMOJI = {
  "arrow-right": { alt: "Стрелка вправо", src: arrowRight },
  "diamond-blue": { alt: "Синий ромб", src: diamondBlue },
  "diamond-orange": { alt: "Оранжевый ромб", src: diamondOrange },
};

interface EmojiProps {
  /** Смысл эмодзи для скринридера, если он не в тексте рядом (стрелка между шагами — «затем»). */
  label?: string;
  name: keyof typeof EMOJI;
}

export function Emoji({ label, name }: EmojiProps) {
  const { alt, src } = EMOJI[name];
  return (
    // Без label — украшение: смысл несёт текст рядом, скринридер не читает «синий ромб» перед каждым
    // пунктом. alt всё равно непустой — правило проекта. h-lh — высота строки текста: эмодзи по её
    // центру, как в Figma (18px в строке 28px). size-4.5 дублирует width/height не зря: без него
    // preflight ставит height: auto, и Chrome пишет в Issues «Lazy-loaded images should have explicit dimensions».
    <span
      aria-hidden={label ? undefined : true}
      className="inline-flex h-lh shrink-0 items-center align-top"
    >
      <Image
        alt={label ?? alt}
        className="size-4.5"
        height={18}
        src={src}
        width={18}
      />
    </span>
  );
}
