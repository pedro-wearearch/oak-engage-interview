import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, Mock } from "vitest";
import App from "../src/App";
import React from "react";

vi.stubGlobal("fetch", vi.fn());

describe("App Component", () => {
  it("displays validation errors", async () => {
    render(<App />);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(
      () => {
        const addressErrors = screen.queryAllByText(/Address is required/i);
        const guarantorAddressErrors = screen.queryAllByText(
          /Guarantor address is required/i
        );

        expect(addressErrors.length).toBeGreaterThan(0);
        expect(guarantorAddressErrors.length).toBeGreaterThan(0);
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Employer name is required/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Guarantor address is required/i)
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
  it("submits the correct payload", async () => {
    const mockResponse = { success: true };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const firstName = "First name";
    const lastName = "Last name";
    const address = "Address 1, Address 2, ...";
    const employerName = "Employer";
    const startDate = "20180301";
    const endDate = "20190815";
    const guarantorName = "Guarantor Name";
    const guarantorAddress = "Guarantor Address";
    const relationship = "sibling";

    render(<App />);

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: firstName },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: lastName },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: address },
    });

    fireEvent.change(screen.getByLabelText("Employer Name"), {
      target: { value: employerName },
    });
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: startDate },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: endDate },
    });

    fireEvent.change(screen.getByLabelText("Guarantor Name"), {
      target: { value: guarantorName },
    });
    fireEvent.change(screen.getByLabelText("Guarantor Address"), {
      target: { value: guarantorAddress },
    });
    fireEvent.change(screen.getByLabelText("Relationship to guarantor"), {
      target: { value: relationship },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://ref-api.goodlord.co/reference/new",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personal: {
              first_name: firstName,
              last_name: lastName,
              current_address: address,
            },
            employer: [
              {
                name: employerName,
                start_date: startDate,
                end_date: endDate,
              },
            ],
            guarantor: {
              name: guarantorName,
              address: guarantorAddress,
              relationship: relationship,
            },
          }),
        }
      );
    });
  });
});
