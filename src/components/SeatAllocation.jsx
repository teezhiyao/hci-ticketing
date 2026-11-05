import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import expectedViewImage from "../assets/expected-view.jpg";

const rows = [
  {
    row: "J",
    seats: [
      { number: 9, status: "restricted" },
      { number: 10, status: "available" },
      { number: 11, status: "available" },
      { number: 12, status: "available" },
      { number: 13, status: "available" },
      { number: 14, status: "unavailable" },
      { number: 15, status: "unavailable" },
      { number: 16, status: "unavailable" },
    ],
  },
  {
    row: "K",
    seats: [
      { number: 9, status: "available" },
      { number: 10, status: "available" },
      { number: 11, status: "available" },
      { number: 12, status: "available" },
      { number: 13, status: "available" },
      { number: 14, status: "unavailable" },
      { number: 15, status: "unavailable" },
      { number: 16, status: "unavailable" },
    ],
  },
  {
    row: "L",
    seats: [
      { number: 9, status: "available" },
      { number: 10, status: "available" },
      { number: 11, status: "available" },
      { number: 12, status: "available" },
      { number: 13, status: "restricted" },
      { number: 14, status: "unavailable" },
      { number: 15, status: "unavailable" },
      { number: 16, status: "unavailable" },
    ],
  },
];

const seatPrice = 140;

const viewControlStyles = {
  display: "grid",
  placeItems: "center",
  borderRadius: 1,
  bgcolor: "rgba(0,0,0,.72)",
  color: "common.white",
  fontSize: 16,
  fontWeight: 700,
};

function seatKey(seat) {
  return `${seat.row}-${seat.number}`;
}

function SeatButton({ seat, selected, onSelect }) {
  const disabled = seat.status !== "available";
  const labels = {
    available: `Row ${seat.row}, seat ${seat.number}, available`,
    unavailable: `Row ${seat.row}, seat ${seat.number}, unavailable`,
    restricted: `Row ${seat.row}, seat ${seat.number}, restricted view`,
  };

  return (
    <Button
      aria-label={labels[seat.status]}
      title={labels[seat.status]}
      disabled={disabled}
      onClick={() => onSelect(seat)}
      variant={selected ? "contained" : "outlined"}
      sx={{
        minWidth: 40,
        width: 40,
        height: 38,
        p: 0,
        borderRadius: "50% 50% 8px 8px",
        ...(seat.status === "unavailable" && {
          bgcolor: "grey.300",
          borderColor: "grey.400",
          color: "grey.600",
        }),
        ...(seat.status === "restricted" && {
          bgcolor: "warning.light",
          borderColor: "warning.main",
          color: "warning.dark",
        }),
      }}
    >
      {seat.number}
    </Button>
  );
}

function LegendItem({ color, borderColor, label }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50% 50% 4px 4px",
          bgcolor: color,
          border: "1px solid",
          borderColor,
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}

export default function SeatAllocation({
  selectedSection,
  onSelectionChange,
  onContinue,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectionMessage, setSelectionMessage] = useState("");

  const isValidPair = useMemo(() => {
    if (selectedSeats.length !== 2) return false;
    const [first, second] = selectedSeats;
    return (
      first.row === second.row &&
      Math.abs(first.number - second.number) === 1
    );
  }, [selectedSeats]);

  function updateSelection(nextSeats) {
    setSelectedSeats(nextSeats);
    onSelectionChange(nextSeats);
  }

  function selectSeat(seat) {
    setSelectionMessage("");
    const exists = selectedSeats.some(
      (selectedSeat) => seatKey(selectedSeat) === seatKey(seat),
    );

    if (exists) {
      updateSelection(
        selectedSeats.filter(
          (selectedSeat) => seatKey(selectedSeat) !== seatKey(seat),
        ),
      );
      return;
    }

    if (selectedSeats.length === 2) {
      setSelectionMessage(
        "Two tickets were requested. Deselect a seat before choosing another.",
      );
      return;
    }

    updateSelection([...selectedSeats, { ...seat, price: seatPrice }]);
  }

  function clearSelection() {
    setSelectionMessage("");
    updateSelection([]);
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={1}
      >
        <Box>
          <Typography variant="h5">Choose two adjacent seats</Typography>
          <Typography color="text.secondary">
            {selectedSection?.name} · $140 per ticket
          </Typography>
        </Box>
        <Chip
          label={`${selectedSeats.length} of 2 selected`}
          color={isValidPair ? "success" : "default"}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(280px, .9fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Box
              sx={{
                width: "72%",
                mx: "auto",
                mb: 3,
                py: 1,
                textAlign: "center",
                border: "2px solid",
                borderColor: "grey.500",
                borderRadius: "50%",
                bgcolor: "grey.100",
              }}
            >
              <Typography variant="caption" fontWeight={800}>
                STAGE
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ overflowX: "auto", pb: 1 }}>
              {rows.map((row) => (
                <Stack
                  key={row.row}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 430 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ width: 48 }}
                  >
                    Row {row.row}
                  </Typography>
                  {row.seats.map((seat) => {
                    const completeSeat = { ...seat, row: row.row };
                    return (
                      <SeatButton
                        key={seatKey(completeSeat)}
                        seat={completeSeat}
                        selected={selectedSeats.some(
                          (selectedSeat) =>
                            seatKey(selectedSeat) === seatKey(completeSeat),
                        )}
                        onSelect={selectSeat}
                      />
                    );
                  })}
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <LegendItem
                color="white"
                borderColor="primary.main"
                label="Available"
              />
              <LegendItem
                color="primary.main"
                borderColor="primary.dark"
                label="Selected"
              />
              <LegendItem
                color="grey.300"
                borderColor="grey.400"
                label="Unavailable"
              />
              <LegendItem
                color="warning.light"
                borderColor="warning.main"
                label="Restricted view"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <Box sx={{ position: "relative", bgcolor: "grey.900" }}>
            <Box
              component="img"
              src={expectedViewImage}
              alt="Illustrative expected view from the selected section"
              sx={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                display: "block",
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{ position: "absolute", top: 12, left: 12 }}
            >
              <Chip
                label="360° view concept"
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,.92)" }}
              />
              <Chip
                label="Static prototype"
                size="small"
                color="warning"
              />
            </Stack>

            <Box
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 14,
                transform: "translateX(-50%)",
                px: 1.5,
                py: 0.75,
                borderRadius: 5,
                bgcolor: "rgba(0,0,0,.72)",
                color: "common.white",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="caption">
                Drag to look around · Scroll to zoom
              </Typography>
            </Box>

            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                right: 12,
                bottom: 12,
                display: "grid",
                gridTemplateColumns: "repeat(3, 28px)",
                gridTemplateRows: "repeat(2, 28px)",
                gap: 0.5,
              }}
            >
              <Box />
              <Box sx={viewControlStyles}>↑</Box>
              <Box />
              <Box sx={viewControlStyles}>←</Box>
              <Box sx={viewControlStyles}>↓</Box>
              <Box sx={viewControlStyles}>→</Box>
            </Box>
          </Box>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Interactive expected-view preview
            </Typography>
            <Typography variant="h6">Central view from Circle 2</Typography>
            <Typography variant="body2" color="text.secondary">
              Illustrative section-level preview. The exact view may vary by
              row and seat.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              This medium-fidelity prototype uses a static image. In the full
              product, users could pan, rotate, and zoom to inspect other
              viewing directions.
            </Alert>
          </CardContent>
        </Card>
      </Box>

      {selectionMessage && <Alert severity="info">{selectionMessage}</Alert>}

      {selectedSeats.length === 1 && (
        <Alert severity="info">
          Select the seat immediately beside Row {selectedSeats[0].row}, Seat{" "}
          {selectedSeats[0].number} to keep the pair together.
        </Alert>
      )}

      {selectedSeats.length === 2 && !isValidPair && (
        <Alert severity="error">
          These seats are not adjacent. Deselect one seat and choose the seat
          immediately beside the other selection.
        </Alert>
      )}

      {isValidPair && (
        <Alert severity="success">
          Valid adjacent pair selected. Both seats are within budget and no
          restricted view is identified.
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
          >
            <Box>
              <Typography fontWeight={700}>
                {selectedSeats.length
                  ? selectedSeats
                      .map((seat) => `Row ${seat.row}, Seat ${seat.number}`)
                      .join(" · ")
                  : "No seats selected"}
              </Typography>
              <Typography color="text.secondary">
                Subtotal: ${selectedSeats.length * seatPrice}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button onClick={clearSelection} disabled={!selectedSeats.length}>
                Clear
              </Button>
              <Button
                variant="contained"
                disabled={!isValidPair}
                onClick={() => onContinue(selectedSeats)}
              >
                Hold these seats
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
