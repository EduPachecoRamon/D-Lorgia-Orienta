/** Contrato de feedback común. Nunca se enseña un error técnico crudo al usuario. */
export function humanMessage(error, context='general') {
  const raw=String(error instanceof Error ? error.message : error ?? '').trim();
  const s=raw.toLowerCase();
  const status=error && typeof error==='object' ? Number(error.status||0) : 0;
  if (!raw) return 'No pudimos completar la acción. Inténtalo nuevamente.';
  if (status===401 || /unauthoriz|token expired|jwt expired|invalid login|invalid credentials|credenciales|contrase.a incorrecta/.test(s))
    return context==='login'?'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.':'Tu sesión terminó. Inicia sesión para continuar.';
  if (status===403 || /forbidden|permission denied|not authorized|sin permisos/.test(s))
    return 'Tu cuenta no tiene acceso a esta acción.';
  if (status===409 || /duplicate|conflict|ya est[aá] (reservad|ocupad)|already booked|unique constraint/.test(s))
    return context==='appointment'?'Ese horario ya no está disponible. Elige otro para continuar.':'Este dato ya está registrado. Revisa la información e inténtalo de nuevo.';
  if (/failed to fetch|fetch failed|networkerror|sin conexi[oó]n|network request failed|offline/.test(s))
    return 'No logramos conectarnos. Revisa tu conexión e inténtalo otra vez.';
  if (/timeout|timed out|tard[oó] demasiado|aborterror/.test(s))
    return 'La respuesta está tardando más de lo esperado. Comprueba el resultado antes de intentarlo de nuevo.';
  if (status===429 || /too many requests|rate limit/.test(s))
    return 'Se hicieron muchas solicitudes. Inténtalo de nuevo en unos minutos.';
  if (status>=500 || /supabase|postgres|postgresql|database|schema cache|sql|pgrst|relation .*does not exist|internal server error|\[object object\]|traceback|stack trace|service_role|api key|error 5\d\d|el servicio respondi[oó] con error/.test(s))
    return 'No pudimos completar la acción por ahora. Inténtalo nuevamente en unos momentos.';
  return raw.length>190 ? raw.slice(0,187)+'…' : raw;
}
