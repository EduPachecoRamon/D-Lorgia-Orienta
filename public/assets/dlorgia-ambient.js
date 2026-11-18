/** Pausa ambientaciones cuando la ventana no está visible o hay ahorro de datos.
 *  Los keyframes de CSS no alteran la opacidad propia de los símbolos. */
export function initAmbient(layer) {
  if (!layer) return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const update = () => {
    const paused = document.hidden || media.matches || Boolean(connection?.saveData);
    layer.classList.toggle('dlorgia-motion-paused', paused);
  };
  document.addEventListener('visibilitychange',update);
  media.addEventListener?.('change',update);
  connection?.addEventListener?.('change',update);
  update();
  return () => {document.removeEventListener('visibilitychange',update);media.removeEventListener?.('change',update);connection?.removeEventListener?.('change',update)};
}
