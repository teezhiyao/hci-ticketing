import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PreferenceGuidedSelection from "./components/PreferenceGuidedSelection.jsx";
import SeatAllocation from "./components/SeatAllocation.jsx";
import DraftSetupPage from "./components/DraftSetupPage.jsx";
import BookingReview from "./components/BookingReview.jsx";
import useEvaluationTracking from "./hooks/useEvaluationTracking.js";

const event = {
  title: "Feng Ze — Bend The Lines",
  venue: "Esplanade Concert Hall",
  date: "23 October 2026",
  time: "7:30 PM",
};

const HOLD_DURATION_SECONDS = 10 * 60;

function formatHoldTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

const defaultSavedDraft = {
  id: "concert-default",
  name: "Concert default",
  tickets: 2,
  maxPrice: 200,
  sitTogether: true,
  view: "center",
  excludeRestricted: true,
  fallback: "Side view allowed; do not exceed $200",
};

function BookingSection({
  panel,
  number,
  title,
  status,
  expanded,
  onChange,
  disabled = false,
  children,
}) {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange(panel)}
      disabled={disabled}
      disableGutters
      sx={{
        border: "1px solid",
        borderColor: expanded ? "primary.main" : "divider",
        overflow: "visible",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Typography sx={{ color: "common.white", fontSize: 22 }}>
            {expanded ? "−" : "+"}
          </Typography>
        }
        sx={{
          px: 2.5,
          minHeight: 62,
          bgcolor: expanded ? "primary.main" : "#263444",
          color: "common.white",
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "common.white",
              color: expanded ? "primary.main" : "#263444",
              fontWeight: 700,
            }}
          >
            {number}
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
        </Stack>

        {status && (
          <Typography variant="body2" sx={{ color: "grey.200" }}>
            {status}
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

function BookingSummary({
  selectedSection,
  selectedSeats,
  seatsHeld,
  holdSeconds,
  preferences,
}) {
  return (
    <Card
      variant="outlined"
      sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}
    >
      <Box
        sx={{
          height: 145,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          color: "common.white",
          background:
            "linear-gradient(145deg, #14243c 0%, #265b9b 58%, #7a3d87 100%)",
        }}
      >
        <Typography variant="overline">Concert</Typography>
        <Typography variant="h6" fontWeight={700}>
          {event.title}
        </Typography>
        <Typography variant="body2">{event.venue}</Typography>
      </Box>

      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Booking summary</Typography>
          <Chip
            label={
              seatsHeld
                ? `${formatHoldTime(holdSeconds)} left`
                : "No seats held"
            }
            size="small"
            color={seatsHeld ? "primary" : "default"}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2.25}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Date and time
            </Typography>
            <Typography>{event.date}</Typography>
            <Typography>{event.time}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Preferences
            </Typography>
            <Typography>
              {preferences.tickets} {preferences.sitTogether ? "adjacent " : ""}
              seats
            </Typography>
            <Typography>Up to ${preferences.maxPrice} each</Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {preferences.view} view ·{" "}
              {preferences.excludeRestricted
                ? "No restricted view"
                : "Restricted views allowed"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Section
            </Typography>
            <Typography color={selectedSection ? "text.primary" : "text.secondary"}>
              {selectedSection?.name ?? "Not selected"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Seat allocation
            </Typography>
            <Typography color={selectedSeats.length ? "text.primary" : "text.secondary"}>
              {selectedSeats.length
                ? selectedSeats
                    .map((seat) => `${seat.row}${seat.number}`)
                    .join(", ")
                : "Not selected"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="h6">
              {selectedSeats.length
                ? `$${selectedSeats.reduce(
                    (total, seat) =>
                      total + (seat.price ?? selectedSection?.seatPrice ?? 140),
                    0,
                  )}`
                : "—"}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const { trackEvent, getEvaluationLog } = useEvaluationTracking();
  const [page, setPage] = useState("booking");
  const [savedDraft, setSavedDraft] = useState(defaultSavedDraft);
  const [expandedPanel, setExpandedPanel] = useState("seats");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsHeld, setSeatsHeld] = useState(false);
  const [holdSeconds, setHoldSeconds] = useState(HOLD_DURATION_SECONDS);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [loadedDraft, setLoadedDraft] = useState(null);
  const [preferences, setPreferences] = useState({
    tickets: 2,
    maxPrice: 150,
    sitTogether: true,
    view: "center",
    excludeRestricted: true,
  });

  useEffect(() => {
    if (!seatsHeld) return undefined;

    setHoldSeconds(HOLD_DURATION_SECONDS);
    const timer = window.setInterval(() => {
      setHoldSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [seatsHeld]);

  const changePanel = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleSelectSection = (section, metadata = {}) => {
    trackEvent("section_selected", {
      sectionId: section.id,
      path: metadata.selectionMode ?? "unknown",
    });
    setSelectedSection(section);
    setSelectedSeats([]);
    setSeatsHeld(false);
    setExpandedPanel("allocation");
  };

  const handleSeatSelectionChange = (seats) => {
    setSelectedSeats(seats);
    setSeatsHeld(false);
  };

  const handleHoldSeats = (seats) => {
    trackEvent("seats_held", {
      seats: seats.map((seat) => `${seat.row}${seat.number}`),
    });
    trackEvent("review_reached");
    setSelectedSeats(seats);
    setSeatsHeld(true);
    setExpandedPanel("ticket-type");
  };

  const handleChangeSeats = () => {
    trackEvent("change_seats_selected");
    setSeatsHeld(false);
    setExpandedPanel("allocation");
  };

  const handleLoadDraft = () => {
    trackEvent("draft_loaded");
    setLoadedDraft({ ...savedDraft, loadedAt: Date.now() });
    setDraftDialogOpen(false);
  };

  const handleSaveDraft = (draft) => {
    trackEvent("draft_saved", {
      tickets: draft.tickets,
      maxPrice: draft.maxPrice,
    });
    setSavedDraft({ ...draft, savedAt: Date.now() });
    setPage("booking");
    setDraftDialogOpen(true);
  };

  const handleOpenDraft = () => {
    trackEvent("draft_opened");
    setPage("draft");
  };

  const handleOpenSavedDraft = () => {
    trackEvent("saved_draft_previewed");
    setDraftDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef1f5" }}>
      <Box
        component="header"
        sx={{ bgcolor: "#102a4c", color: "common.white", py: 2 }}
      >
        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Ticket selection prototype
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.300" }}>
                {event.title} · {event.venue}
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="outlined"
                onClick={handleOpenDraft}
                sx={{
                  color: "common.white",
                  borderColor: "rgba(255,255,255,.55)",
                }}
              >
                Prepare a draft
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {page === "draft" ? (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          <DraftSetupPage
            initialDraft={savedDraft}
            onBack={() => setPage("booking")}
            onSave={handleSaveDraft}
          />
        </Box>
      ) : (
        <>
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 330px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={2.5}>
          <BookingSection
            panel="date"
            number="1"
            title="Date and time"
            status="Completed"
            expanded={expandedPanel === "date"}
            onChange={changePanel}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
            >
              <Box>
                <Typography fontWeight={700}>{event.date}</Typography>
                <Typography color="text.secondary">{event.time}</Typography>
              </Box>
              <Button variant="text">Edit</Button>
            </Stack>
          </BookingSection>

          <BookingSection
            panel="seats"
            number="2"
            title="Seats — enter preferences and review matches"
            status={selectedSection ? `Completed — ${selectedSection.name}` : "Current step"}
            expanded={expandedPanel === "seats"}
            onChange={changePanel}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5">Find suitable sections</Typography>
                <Typography color="text.secondary">
                  Enter your constraints, then compare the recommended matches.
                </Typography>
              </Box>
              <Tooltip
                arrow
                placement="bottom"
                title="Preview and load preferences saved before ticket sales open."
              >
                <Button
                  variant="outlined"
                  aria-label="Load saved draft. More information is available in the tooltip."
                  onClick={handleOpenSavedDraft}
                >
                  Load saved draft&nbsp; ⓘ
                </Button>
              </Tooltip>
            </Stack>

            <PreferenceGuidedSelection
              onSelectSection={handleSelectSection}
              loadedDraft={loadedDraft}
              onPreferencesChange={setPreferences}
              onTrack={trackEvent}
            />
          </BookingSection>

          <BookingSection
            panel="allocation"
            number="3"
            title="Seat allocation"
            status={
              selectedSection
                ? selectedSection.name
                : "Select a section to continue"
            }
            expanded={expandedPanel === "allocation"}
            onChange={changePanel}
            disabled={!selectedSection}
          >
            <SeatAllocation
              selectedSection={selectedSection}
              maxPrice={preferences.maxPrice}
              onSelectionChange={handleSeatSelectionChange}
              onContinue={handleHoldSeats}
              onTrack={trackEvent}
            />
          </BookingSection>

          <BookingSection
            panel="ticket-type"
            number="4"
            title="Review and confirmation"
            status={seatsHeld ? "Seats held for review" : "Complete seat allocation first"}
            expanded={expandedPanel === "ticket-type"}
            onChange={changePanel}
            disabled={!seatsHeld}
          >
            <BookingReview
              active={seatsHeld}
              event={event}
              selectedSection={selectedSection}
              selectedSeats={selectedSeats}
              maxPrice={preferences.maxPrice}
              secondsRemaining={holdSeconds}
              onChangeSeats={handleChangeSeats}
              onConfirm={() => trackEvent("selection_confirmed")}
              getEvaluationLog={getEvaluationLog}
            />
          </BookingSection>
        </Stack>

        <BookingSummary
          selectedSection={selectedSection}
          selectedSeats={selectedSeats}
          seatsHeld={seatsHeld}
          holdSeconds={holdSeconds}
          preferences={preferences}
        />
      </Box>

      <Dialog
        open={draftDialogOpen}
        onClose={() => setDraftDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Load saved seat preferences</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Review the pre-configuration before applying it. Loading these
            settings does not reserve or purchase seats.
          </Typography>

          <Card variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Typography variant="h6">{savedDraft.name}</Typography>
                <Chip label="Saved before sale" size="small" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.25}>
                <Typography>
                  <strong>Tickets:</strong> {savedDraft.tickets}
                </Typography>
                <Typography>
                  <strong>Maximum price:</strong> ${savedDraft.maxPrice} per
                  ticket
                </Typography>
                <Typography>
                  <strong>Keep seats together:</strong>{" "}
                  {savedDraft.sitTogether ? "Required" : "Flexible"}
                </Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  <strong>Preferred view:</strong> {savedDraft.view}
                </Typography>
                <Typography>
                  <strong>Restricted views:</strong>{" "}
                  {savedDraft.excludeRestricted ? "Exclude" : "Allow"}
                </Typography>
                <Typography>
                  <strong>Fallback:</strong> {savedDraft.fallback}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDraftDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleLoadDraft}>
            Load these settings
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}
    </Box>
  );
}
