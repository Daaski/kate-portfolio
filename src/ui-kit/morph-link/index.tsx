"use client";

import Link from "next/link";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  use,
  useCallback,
  useState,
  ViewTransition,
  type ViewTransitionProps,
} from "react";
import { type PreloadImage, preloadImage } from "@/lib/preload-image";

// Клиентская часть карточки-источника морфа: сама карточка остаётся серверной. Ссылка знает, что по ней
// пошла навигация, обложка внутри неё — берёт имя морфа.
const Opening = createContext(false);

type MorphLinkProps = ComponentProps<typeof Link> & {
  /** Картинка страницы назначения: грузится заранее, пока пользователь наводит или переходит. */
  targetImage?: PreloadImage;
};

export function MorphLink({ targetImage, ...props }: MorphLinkProps) {
  const [opening, setOpening] = useState(false);
  const warm = useCallback(() => {
    if (targetImage) {
      preloadImage(targetImage);
    }
  }, [targetImage]);
  const open = useCallback(() => {
    warm();
    setOpening(true);
  }, [warm]);

  return (
    <Opening value={opening}>
      <Link {...props} onFocus={warm} onNavigate={open} onPointerEnter={warm} />
    </Opening>
  );
}

interface MorphCoverProps {
  children: ReactNode;
  /** Морф обложки при переходе по ссылке. */
  transition?: ViewTransitionProps;
}

// Имя морфа — только у обложки ссылки, по которой пошла навигация: одинаковых карточек на странице
// может быть несколько, а два одинаковых имени React не допускает. onNavigate срабатывает только
// для навигации внутри сайта — клик в новую вкладку имени не даёт.
export function MorphCover({ children, transition }: MorphCoverProps) {
  const opening = use(Opening);
  return (
    <ViewTransition default="none" {...(opening ? transition : undefined)}>
      {children}
    </ViewTransition>
  );
}
