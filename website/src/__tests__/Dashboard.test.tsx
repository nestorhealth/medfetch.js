import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { mockRuns } from "@/src/data/mockRuns";

// Mock fetch globally
const mockFetch = vi.fn();
beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("DashboardPage", () => {
  it("renders mock runs and matches snapshot", async () => {
    // Mock the fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRuns,
    });

    // Render the server component
    const { container, getByText, getAllByRole } = render(await DashboardPage());

    // Verify all mock run IDs are present as links
    mockRuns.forEach((run) => {
      const link = getByText(run.runId);
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", `/dashboard/runs/${run.runId}`);
    });

    // Verify the "Trigger Ingest" button exists
    const ingestButton = getByText("Trigger Ingest");
    expect(ingestButton).toBeInTheDocument();
    expect(ingestButton.tagName).toBe("A");
    expect(ingestButton).toHaveAttribute("href", "/dashboard/ingest");

    // Verify the table structure
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
    expect(getAllByRole("row")).toHaveLength(mockRuns.length + 1); // +1 for header row

    // Take a snapshot
    expect(container).toMatchSnapshot();
  });

  it("handles fetch errors gracefully", async () => {
    // Mock a failed fetch
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    // Render the server component
    const { container, getByText } = render(await DashboardPage());

    // Verify error message is displayed
    expect(getByText(/failed to fetch runs/i)).toBeInTheDocument();

    // Take a snapshot of the error state
    expect(container).toMatchSnapshot();
  });
}); 