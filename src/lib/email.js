export async function sendEmail({ subject, name, email, message }) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) throw new Error("Saknar VITE_WEB3FORMS_ACCESS_KEY");

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject,
      from_name: name || "Bokrummet",
      email: email || undefined,
      message,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Kunde inte skicka mejlet");
  return data;
}
