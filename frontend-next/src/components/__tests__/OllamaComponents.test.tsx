import { render, screen } from "@testing-library/react";
import { OllamaStatusCard } from "../OllamaStatusCard";
import { EveningOllamaAssistant } from "../EveningOllamaAssistant";

jest.mock("../OllamaStatusCard", () => ({
  OllamaStatusCard: () => <div>status</div>,
}));

jest.mock("../EveningOllamaAssistant", () => ({
  EveningOllamaAssistant: () => <div>assistant</div>,
}));

describe("Ollama components", () => {
  it("renders status card", () => {
    render(<OllamaStatusCard />);
    expect(screen.getByText("status")).toBeInTheDocument();
  });

  it("renders evening assistant", () => {
    render(<EveningOllamaAssistant />);
    expect(screen.getByText("assistant")).toBeInTheDocument();
  });
});
