import { useCallback, useRef } from "react";

const STORAGE_KEY = "hci-ticketing-evaluation-session";

function createSessionId() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(6);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => characters[value % characters.length]).join("");
}

function createSession() {
  return {
    version: "1.0",
    sessionId: createSessionId(),
    startedAt: Date.now(),
    events: [{ t: 0, type: "prototype_opened" }],
  };
}

function loadSession() {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Continue with an in-memory session if browser storage is unavailable.
  }
  return createSession();
}

function saveSession(session) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Tracking remains available in memory if browser storage is unavailable.
  }
}

export default function useEvaluationTracking() {
  const sessionRef = useRef(null);
  if (!sessionRef.current) {
    sessionRef.current = loadSession();
    saveSession(sessionRef.current);
  }

  const trackEvent = useCallback((type, details = undefined) => {
    const session = sessionRef.current;
    const event = {
      t: Math.round((Date.now() - session.startedAt) / 1000),
      type,
    };
    if (details && Object.keys(details).length) event.details = details;
    session.events.push(event);
    saveSession(session);
  }, []);

  const getEvaluationLog = useCallback(() => {
    const session = sessionRef.current;
    const events = session.events;
    const eventOfType = (type) => events.find((event) => event.type === type);
    const eventsOfType = (type) =>
      events.filter((event) => event.type === type);
    const lastEvent = events[events.length - 1];
    const noMatchRecovery = eventOfType("no_match_recovery");

    return {
      version: session.version,
      sessionId: session.sessionId,
      summary: {
        durationSeconds: lastEvent?.t ?? 0,
        initialPath: "guided",
        usedMapBrowsing: events.some(
          (event) =>
            event.type === "selection_path_changed" &&
            event.details?.path === "browse",
        ),
        noMatchTriggered: Boolean(eventOfType("no_match_triggered")),
        noMatchRecovery: noMatchRecovery?.details?.action ?? null,
        invalidPairAttempts: eventsOfType("invalid_pair_attempted").length,
        isolatedSeatAttempts: eventsOfType("isolated_seat_attempted").length,
        seatSelectionAttempts: eventsOfType("seat_selected").length,
        draftOpened: Boolean(eventOfType("draft_opened")),
        draftSaved: Boolean(eventOfType("draft_saved")),
        draftLoaded: Boolean(eventOfType("draft_loaded")),
        confirmedSelection: Boolean(eventOfType("selection_confirmed")),
      },
      events,
    };
  }, []);

  return { trackEvent, getEvaluationLog };
}
