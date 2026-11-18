// Herramientas de difusión sin analítica invasiva, API pagada ni permisos extras.
(() => {
  const descriptions = {
    intro: () => `Conoce D’Lorgia Orienta: explora tratamientos, aclara tus dudas y prepara tu siguiente paso con tranquilidad. ${location.origin}/conoce`,
    conoce: () => location.origin + '/conoce',
    experiencias: () => location.origin + '/experiencias',
    sedes: () => location.origin + '/sedes',
    ayuda: () => location.origin + '/ayuda'
  };
  const status = document.querySelector('#marketing-feedback');
  document.querySelectorAll('[data-campaign-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = descriptions[button.dataset.campaignCopy]?.();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        if (status) status.textContent = 'Contenido copiado. Puedes compartirlo desde las redes de D’Lorgia.';
      } catch {
        if (status) status.textContent = 'No pudimos copiar automáticamente. Abre la página y copia su enlace desde el navegador.';
      }
    });
  });
})();
