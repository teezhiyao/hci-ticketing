import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import expectedViewImage from "../assets/expected-view.jpg";

const PRICE_PER_SEAT = 140;
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export default function BookingReview({
  active,
  event,
  selectedSection,
  selectedSeats,
  secondsRemaining,
  onChangeSeats,
  onConfirm,
  getEvaluationLog,
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");

  const reservationKey = useMemo(
    () => selectedSeats.map((seat) => `${seat.row}${seat.number}`).join("-"),
    [selectedSeats],
  );

  useEffect(() => {
    if (!active) return;
    setConfirmed(false);
    setCopyStatus("idle");
  }, [active, reservationKey]);

  const evaluationLogText = confirmed
    ? JSON.stringify(getEvaluationLog?.() ?? {}, null, 2)
    : "";

  const handleConfirm = () => {
    onConfirm?.();
    setConfirmed(true);
  };

  const handleCopyLog = async () => {
    try {
      await navigator.clipboard.writeText(evaluationLogText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("manual");
    }
  };

  const seatLabels = selectedSeats
    .map((seat) => `Row ${seat.row}, Seat ${seat.number}`)
    .join("; ");
  const subtotal = selectedSeats.length * PRICE_PER_SEAT;

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
      >
        <Box>
          <Typography variant="h5">Review your seat selection</Typography>
          <Typography color="text.secondary">
            Check the complete selection before confirming the reservation.
          </Typography>
        </Box>
        <Chip
          color={secondsRemaining > 120 ? "warning" : "error"}
          label={`Seats held for ${formatTime(secondsRemaining)}`}
        />
      </Stack>

      {secondsRemaining === 0 && (
        <Alert severity="error">
          The reservation hold has expired. Return to seat allocation to check
          current availability.
        </Alert>
      )}

      {confirmed && (
        <Stack spacing={2}>
          <Alert severity="success">
            Seat selection confirmed for this prototype. No payment or real
            purchase has been made.
          </Alert>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Anonymous evaluation log</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                This log contains only actions performed in this prototype and
                elapsed task time. Copy it and paste it into the evaluation
                survey. Nothing is submitted automatically.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button variant="contained" onClick={handleCopyLog}>
                  Copy evaluation log
                </Button>
                {copyStatus === "copied" && (
                  <Chip label="Copied to clipboard" color="success" />
                )}
              </Stack>
              {copyStatus === "manual" && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Clipboard access was unavailable. Select and copy the log
                    below manually.
                  </Alert>
                  <TextField
                    value={evaluationLogText}
                    multiline
                    minRows={6}
                    fullWidth
                    slotProps={{ htmlInput: { readOnly: true } }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 310px" },
          gap: 3,
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">Booking details</Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2.25}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Event
                </Typography>
                <Typography fontWeight={700}>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.venue}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Date and time
                </Typography>
                <Typography>
                  {event.date}, {event.time}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Section and seats
                </Typography>
                <Typography fontWeight={700}>{selectedSection?.name}</Typography>
                <Typography>{seatLabels}</Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Selection checks
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Chip label="Adjacent seats" color="success" size="small" />
                  <Chip label="No restricted view" color="success" size="small" />
                  <Chip label="Within budget" color="success" size="small" />
                </Stack>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Ticket type
                </Typography>
                <Typography>Standard admission</Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatically selected because this is the only applicable
                  ticket type.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          <Card variant="outlined">
            <Box
              component="img"
              src={expectedViewImage}
              alt="Illustrative expected view from the selected section"
              sx={{ width: "100%", height: 150, objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Expected view
              </Typography>
              <Typography fontWeight={700}>Central view from Circle 2</Typography>
              <Typography variant="caption" color="text.secondary">
                Illustrative section-level preview; the exact view may vary by
                seat.
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Price summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>
                    {selectedSeats.length} tickets × ${PRICE_PER_SEAT}
                  </Typography>
                  <Typography>${subtotal}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Booking fee</Typography>
                  <Typography>$0</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={700}>Subtotal</Typography>
                  <Typography variant="h6">${subtotal}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="outlined" onClick={onChangeSeats} disabled={confirmed}>
          Change seats
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={confirmed || secondsRemaining === 0}
        >
          {confirmed ? "Selection confirmed" : "Confirm selection"}
        </Button>
      </Stack>
    </Stack>
  );
}
