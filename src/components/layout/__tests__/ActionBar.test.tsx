import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useOfficeStore } from "@/store/office-store";
import { ActionBar } from "../ActionBar";

const nullRef = { current: null };

beforeEach(() => {
  useOfficeStore.setState({
    selectedAgentId: null,
    agents: new Map(),
    operatorScopes: [],
    connectionStatus: "connected",
  });
});

describe("ActionBar", () => {
  it("is hidden when no agent selected and no meeting agents", () => {
    const { container } = render(<ActionBar wsClient={nullRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.transform).toBe("translateY(100%)");
  });

  it("is visible when an agent is selected", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    const { container } = render(<ActionBar wsClient={nullRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.transform).toBe("translateY(0)");
  });

  it("shows tooltip on spawn button click", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    render(<ActionBar wsClient={nullRef} />);
    const spawnBtn = screen.getByText("派生子Agent").closest("button")!;
    fireEvent.click(spawnBtn);
    expect(screen.getByText("功能开发中")).toBeDefined();
  });

  it("renders all three action buttons", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    render(<ActionBar wsClient={nullRef} />);
    expect(screen.getByText("暂停")).toBeDefined();
    expect(screen.getByText("派生子Agent")).toBeDefined();
    expect(screen.getByText("对话")).toBeDefined();
  });
});
