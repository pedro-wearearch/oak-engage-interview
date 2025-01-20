import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../src/App";
import React, { act } from "react";

describe("App", () => {
  it("should render the App component", () => {
    render(<App />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("should toggle the button state", () => {
    render(<App />);

    let buttonWithState: HTMLElement;
    act(() => {
      const button = screen.getByRole("button");
      button.click();
    });

    buttonWithState = screen.getByRole("button", { pressed: true });
    expect(buttonWithState).toBeInTheDocument();

    act(() => {
      const button = screen.getByRole("button");
      button.click();
    });

    buttonWithState = screen.getByRole("button", { pressed: false });
    expect(buttonWithState).toBeInTheDocument();
  });

  it("should reset the button state after 2 seconds", () => {
    vi.useFakeTimers();
    render(<App />);

    act(() => {
      const button = screen.getByRole("button");
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const button = screen.getByRole("button", { pressed: false });
    expect(button).toBeInTheDocument();

    vi.useRealTimers();
  });
});
