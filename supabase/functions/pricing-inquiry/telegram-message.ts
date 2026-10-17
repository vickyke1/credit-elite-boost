export const serviceNames: Record<string, string> = {
  "credit-education": "Credit education",
  "credit-repair": "Credit repair guidance",
  "authorized-user-tradelines": "Authorized-user tradelines",
};

export function inquiryNotification(inquiry: { id: string; name: string; telegram: string; service: string; message: string }) {
  return ["CpnCreditBoost — New pricing inquiry", `Service: ${serviceNames[inquiry.service] ?? inquiry.service}`,
    `Name: ${inquiry.name}`, `Telegram: @${inquiry.telegram.replace(/^@/, "")}`, "", inquiry.message,
    "", `Inquiry: ${inquiry.id}`].join("\n");
}