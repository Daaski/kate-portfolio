// next/link гасит клик (preventDefault), когда сам ведёт навигацию внутри сайта; новую вкладку, чужой
// сайт и клик с модификатором он оставляет браузеру. Слушатель на window срабатывает после обработчиков
// React — к этому моменту клик уже погашен. Перетаскивание Embla клик останавливает раньше, сюда он не доходит.
export function onSiteNavigation(callback: (link: HTMLAnchorElement) => void) {
  const handle = (event: MouseEvent) => {
    const link =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (event.defaultPrevented && link) {
      callback(link);
    }
  };
  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
}
