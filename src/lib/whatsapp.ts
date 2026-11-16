export const intl = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("254") ? digits : "254" + digits.replace(/^0/, "");
};

export const wa = (phone: string, text: string) =>
  `https://wa.me/${intl(phone)}?text=${encodeURIComponent(text)}`;
