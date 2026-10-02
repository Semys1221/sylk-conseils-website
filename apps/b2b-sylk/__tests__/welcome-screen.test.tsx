import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock motion to avoid jsdom incompatibility with AnimatePresence
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import WelcomeScreen from "@/components/salle-de-vente/WelcomeScreen";

// ─── Mocks ──────────────────────────────────────────────────────

function createMockStream() {
  const track = {
    kind: "video",
    enabled: true,
    id: "mock-track",
    label: "",
    readyState: "live" as MediaStreamTrackState,
    stop: vi.fn(),
    applyConstraints: vi.fn(),
    getCapabilities: vi.fn(),
    getConstraints: vi.fn(),
    getSettings: vi.fn(),
    clone: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  return {
    getTracks: () => [track],
    getVideoTracks: () => [track],
    getAudioTracks: () => [],
    getTrackById: () => track,
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
    clone: vi.fn(),
    active: true,
    id: "mock-stream",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

let getUserMediaMock = vi.fn();
let enumerateDevicesMock = vi.fn();

beforeEach(() => {
  getUserMediaMock = vi.fn();
  enumerateDevicesMock = vi.fn().mockResolvedValue([]);

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: getUserMediaMock,
      enumerateDevices: enumerateDevicesMock,
    },
    configurable: true,
    writable: true,
  });

  // Mock AudioContext
  const mockOscillator = {
    frequency: { value: 440 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  const mockAudioCtx = {
    state: "running",
    createOscillator: vi.fn().mockReturnValue(mockOscillator),
    close: vi.fn(),
    destination: {},
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  (window as any).AudioContext = vi.fn().mockImplementation(() => mockAudioCtx);
  (window as any).webkitAudioContext = undefined;

  // Mock HTMLVideoElement.srcObject setter
  Object.defineProperty(HTMLVideoElement.prototype, "srcObject", {
    writable: true,
    configurable: true,
    value: null,
  });

  // Mock fetch for room token API
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ token: "mock-token" }),
  });
});

// ─── Tests ──────────────────────────────────────────────────────

describe("WelcomeScreen — Safari Media Fix", () => {
  it("renders the form step with name and email inputs", () => {
    render(<WelcomeScreen onJoin={vi.fn()} />);

    expect(screen.getByText("Votre salle de conseil privée")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Stéphane Lawnicki")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("direction@sylkconseils.com")).toBeInTheDocument();
    expect(screen.getByText("Rejoindre la salle")).toBeInTheDocument();
  });

  it("does NOT call getUserMedia on mount (Safari fix)", () => {
    render(<WelcomeScreen onJoin={vi.fn()} />);

    // getUserMedia should NOT be called automatically (prevents Safari rejection)
    expect(getUserMediaMock).not.toHaveBeenCalled();
  });

  it("shows device badges with unchecked state initially", () => {
    render(<WelcomeScreen onJoin={vi.fn()} />);

    // Badges exist but are not "ok" or "fail" — they show the "not checked" state
    expect(screen.getByText("Caméra")).toBeInTheDocument();
    expect(screen.getByText("Micro")).toBeInTheDocument();
    expect(screen.getByText("Son")).toBeInTheDocument();

    // No call to getUserMedia on mount (Safari fix)
    expect(getUserMediaMock).not.toHaveBeenCalled();
  });

  it("calls getUserMedia when 'Rejoindre la salle' is clicked (user gesture)", async () => {
    const user = userEvent.setup();
    getUserMediaMock.mockResolvedValue(createMockStream());

    render(<WelcomeScreen onJoin={vi.fn()} />);

    // Fill name and email
    await user.type(screen.getByPlaceholderText("Stéphane Lawnicki"), "Test User");
    await user.type(screen.getByPlaceholderText("direction@sylkconseils.com"), "test@test.com");

    // Click join (this is the user gesture that should trigger getUserMedia on Safari)
    await user.click(screen.getByText("Rejoindre la salle"));

    // getUserMedia should be called from the click handler
    expect(getUserMediaMock).toHaveBeenCalledTimes(1);
    expect(getUserMediaMock).toHaveBeenCalledWith({ video: true, audio: true });

    // Should advance to code step (wait for state update)
    expect(await screen.findByPlaceholderText("Code secret")).toBeInTheDocument();
  });

  it("shows error message when getUserMedia fails with NotAllowedError", async () => {
    const user = userEvent.setup();
    const err = new Error("NotAllowedError");
    err.name = "NotAllowedError";
    getUserMediaMock.mockRejectedValue(err);

    render(<WelcomeScreen onJoin={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Stéphane Lawnicki"), "Test User");
    await user.type(screen.getByPlaceholderText("direction@sylkconseils.com"), "test@test.com");

    // Click join — triggers checkDevices (async) + advances to code step
    await user.click(screen.getByText("Rejoindre la salle"));
    await screen.findByPlaceholderText("Code secret");

    // Go back to form step
    await user.click(screen.getByText("Retour"));

    // Wait for the async checkDevices to complete and show error
    await waitFor(() => {
      expect(screen.getByText("Autorisation refusée. Vérifiez les paramètres de votre navigateur.")).toBeInTheDocument();
    });
    expect(screen.getByText("Vérifier à nouveau")).toBeInTheDocument();
  });

  it("shows error message when getUserMedia fails with NotFoundError", async () => {
    const user = userEvent.setup();
    const err = new Error("NotFoundError");
    err.name = "NotFoundError";
    getUserMediaMock.mockRejectedValue(err);

    render(<WelcomeScreen onJoin={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Stéphane Lawnicki"), "Test User");
    await user.type(screen.getByPlaceholderText("direction@sylkconseils.com"), "test@test.com");

    await user.click(screen.getByText("Rejoindre la salle"));
    await screen.findByPlaceholderText("Code secret");
    await user.click(screen.getByText("Retour"));

    await waitFor(() => {
      expect(screen.getByText("Aucun micro ou caméra détecté.")).toBeInTheDocument();
    });
    expect(screen.getByText("Vérifier à nouveau")).toBeInTheDocument();
  });

  it("allows retry after device check failure", async () => {
    const user = userEvent.setup();
    const err = new Error("NotAllowedError");
    err.name = "NotAllowedError";
    getUserMediaMock
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce(createMockStream());

    render(<WelcomeScreen onJoin={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Stéphane Lawnicki"), "Test User");
    await user.type(screen.getByPlaceholderText("direction@sylkconseils.com"), "test@test.com");

    await user.click(screen.getByText("Rejoindre la salle"));
    await screen.findByPlaceholderText("Code secret");
    await user.click(screen.getByText("Retour"));

    await waitFor(() => {
      expect(screen.getByText("Autorisation refusée. Vérifiez les paramètres de votre navigateur.")).toBeInTheDocument();
    });

    // Click retry
    await user.click(screen.getByText("Vérifier à nouveau"));

    // getUserMedia should be called again
    expect(getUserMediaMock).toHaveBeenCalledTimes(2);
  });

  it("cleans up media stream on unmount", async () => {
    const user = userEvent.setup();
    const mockStream = createMockStream();
    getUserMediaMock.mockResolvedValue(mockStream);

    const { unmount } = render(<WelcomeScreen onJoin={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Stéphane Lawnicki"), "Test User");
    await user.type(screen.getByPlaceholderText("direction@sylkconseils.com"), "test@test.com");

    await user.click(screen.getByText("Rejoindre la salle"));

    unmount();

    // Tracks should be stopped on unmount
    expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
  });
});
