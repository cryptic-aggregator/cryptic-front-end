import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/endpoints/authApi";
import SignUp from "./SignUp";
import React from 'react';
import '@testing-library/jest-dom';

// Мокуємо API-запит
jest.mock("../../api/endpoints/authApi", () => ({
  authApi: {
    register: jest.fn(),
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("SignUp Component", () => {
  it("рендерить компонент SignUp", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText("signUp.topic")).toBeInTheDocument();
  });

  it("відображає помилку при незаповнених полях", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "signUp.button" }));

    await waitFor(() => {
      const requiredMessages = screen.queryAllByText("signUp.required");
      expect(requiredMessages.length).toBeGreaterThan(0); // очікує показ повідомлень про обов’язковість полів.
      
    });
  });

  it("відображає помилку, якщо пароль і підтвердження не співпадають", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderPassword"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderConfirmPassword"), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: "signUp.button" }));

    await waitFor(() => {
      expect(screen.getByText("signUp.patternConfirmPassword")).toBeInTheDocument();
    });
  });

  it("відправляє форму при правильних даних", async () => {
    authApi.register.mockResolvedValue({ data: { message: "Success" } });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderLogin"), { target: { value: "TestUser" } });
    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderEmail"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderPassword"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("signUp.placeholderConfirmPassword"), { target: { value: "password123" } });
    fireEvent.click(screen.getByLabelText("signUp.check"));
    fireEvent.click(screen.getByRole("button", { name: "signUp.button" }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        name: "TestUser",
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});