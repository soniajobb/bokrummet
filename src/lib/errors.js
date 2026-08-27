const GENERIC_FALLBACK = "Något gick fel just nu. Testa igen om en liten stund.";

// Supabase (and other libraries) sometimes return error objects whose
// .message is missing, empty, or otherwise not a real sentence (this is how
// a signup failure once showed up on screen as the literal text "{}").
// Every place that shows an error to the user should go through this so a
// broken error object never becomes confusing on-screen text.
export function safeErrorMessage(error, fallback = GENERIC_FALLBACK) {
  if (!error) return fallback;
  const raw = typeof error === "string" ? error : error.message;
  if (typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "{}" || trimmed === "[object Object]") return fallback;
  return trimmed;
}

// Friendly Swedish text for the errors Supabase Auth's signUp() can return.
export function getSignUpErrorMessage(signUpError) {
  const raw = safeErrorMessage(signUpError, "");
  if (/registered/i.test(raw)) {
    return "Den e-postadressen är redan registrerad.";
  }
  if (/rate limit/i.test(raw)) {
    return "För många mejl har skickats på kort tid. Vänta en liten stund och försök igen.";
  }
  if (/sending confirmation email/i.test(raw)) {
    return "Kunde inte skicka bekräftelsemejl till den där adressen. Kontrollera att e-postadressen är rätt stavad och giltig.";
  }
  if (/invalid format|unable to validate email/i.test(raw)) {
    return "Ange en giltig e-postadress, t.ex. namn@exempel.se.";
  }
  return safeErrorMessage(signUpError);
}

// Friendly Swedish text for supabase.auth.signInWithPassword() errors.
export function getLoginErrorMessage(signInError) {
  const raw = safeErrorMessage(signInError, "");
  if (/confirm/i.test(raw)) {
    return "Du måste bekräfta din e-postadress innan du kan logga in. Kolla din inkorg (och skräppost) efter mejlet med bekräftelselänken.";
  }
  return "Fel e-post eller lösenord.";
}

// Friendly Swedish text for resetPasswordForEmail() / other rate-limited calls.
export function getRateLimitMessage(error, fallback = GENERIC_FALLBACK) {
  const raw = safeErrorMessage(error, "");
  if (/rate limit/i.test(raw)) {
    return "För många mejl har skickats på kort tid. Vänta en liten stund och försök igen.";
  }
  return fallback;
}
