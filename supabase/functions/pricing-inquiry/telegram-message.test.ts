import { describe, expect, test } from "bun:test";
import { inquiryNotification } from "./telegram-message";

describe("Telegram inquiries", () => {
  test("education inquiries include the submitted contact and goals", () => {
    const message = inquiryNotification({ id: "test-id", name: "Test owner", telegram: "@testuser", service: "credit-education", message: "Understand utilization" });
    expect(message).toContain("Service: Credit education");
    expect(message).toContain("Telegram: @testuser");
    expect(message).toContain("Understand utilization");
    expect(message).toContain("Inquiry: test-id");
  });
  test("tradeline pricing goes through the same notification formatter", () => {
    expect(inquiryNotification({ id: "123", name: "Test", telegram: "testuser", service: "authorized-user-tradelines", message: "Compare monthly prices" })).toContain("Service: Authorized-user tradelines");
  });
});