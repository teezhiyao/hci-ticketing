import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const seatRows = [
  {
    label: "Row 9",
    seats: [
      "available",
      "available",
      "unavailable",
      "unavailable",
      "available",
      "available",
    ],
  },
  {
    label: "Row 10",
    seats: [
      "available",
      "available",
      "recommended",
      "recommended",
      "available",
      "unavailable",
    ],
  },
  {
    label: "Row 11",
    seats: [
      "unavailable",
      "available",
      "available",
      "available",
      "available",
      "unavailable",
    ],
  },
];

function Seat({ status }) {
  const styles = {
    available: {
      backgroundColor: "white",
      borderColor: "grey.500",
    },
    recommended: {
      backgroundColor: "primary.main",
      borderColor: "primary.dark",
    },
    unavailable: {
      backgroundColor: "grey.300",
      borderColor: "grey.400",
    },
  };

  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        border: "2px solid",
        borderRadius: "50% 50% 6px 6px",
        ...styles[status],
      }}
    />
  );
}

function SeatMap() {
  return (
    <Box>
      <Box
        sx={{
          border: "2px solid",
          borderColor: "grey.500",
          borderRadius: "50%",
          textAlign: "center",
          py: 1,
          mb: 3,
          backgroundColor: "grey.100",
        }}
      >
        <Typography variant="caption" fontWeight={700}>
          STAGE
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {seatRows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{ width: 55, color: "text.secondary" }}
            >
              {row.label}
            </Typography>

            {row.seats.map((status, index) => (
              <Seat key={`${row.label}-${index}`} status={status} />
            ))}
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={2.5} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Seat status="available" />
          <Typography variant="caption">Available</Typography>
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <Seat status="recommended" />
          <Typography variant="caption">Recommended</Typography>
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <Seat status="unavailable" />
          <Typography variant="caption">Unavailable</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function PreSaleDraftMode() {
  const [tickets, setTickets] = useState(2);
  const [maxPrice, setMaxPrice] = useState(150);
  const [view, setView] = useState("center");
  const [keepTogether, setKeepTogether] = useState(true);
  const [excludeRestricted, setExcludeRestricted] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1fr) 70px minmax(0, 1fr)",
        },
        gap: 2,
        alignItems: "stretch",
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <Chip
            label="Before ticket sales"
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography variant="h5">Create a seat-selection draft</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Save your requirements before sales open. This does not reserve or
            purchase seats.
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom>Number of tickets</Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                >
                  -
                </Button>

                <Typography
                  variant="h6"
                  sx={{ minWidth: 30, textAlign: "center" }}
                >
                  {tickets}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => setTickets(Math.min(8, tickets + 1))}
                >
                  +
                </Button>

                <Chip
                  label={`${tickets} adjacent seats`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box>
              <Typography gutterBottom>
                Maximum price per ticket: ${maxPrice}
              </Typography>

              <Slider
                value={maxPrice}
                onChange={(_, value) => setMaxPrice(value)}
                min={50}
                max={300}
                step={10}
                marks={[
                  { value: 50, label: "$50" },
                  { value: 150, label: "$150" },
                  { value: 300, label: "$300" },
                ]}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Preferred viewing direction</Typography>

              <ToggleButtonGroup
                value={view}
                exclusive
                fullWidth
                size="small"
                onChange={(_, value) => value && setView(value)}
              >
                <ToggleButton value="left">Left</ToggleButton>
                <ToggleButton value="center">Center</ToggleButton>
                <ToggleButton value="right">Right</ToggleButton>
                <ToggleButton value="any">Any</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keepTogether}
                    onChange={(event) =>
                      setKeepTogether(event.target.checked)
                    }
                  />
                }
                label="Keep all seats together"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={excludeRestricted}
                    onChange={(event) =>
                      setExcludeRestricted(event.target.checked)
                    }
                  />
                }
                label="Exclude restricted-view seats"
              />
            </Stack>

            <Box>
              <Typography gutterBottom fontWeight={600}>
                Priority order
              </Typography>

              <Stack spacing={1}>
                {["1  Viewing angle", "2  Price", "3  Distance"].map(
                  (priority) => (
                    <Box
                      key={priority}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                      }}
                    >
                      <Typography variant="body2">
                        = &nbsp; {priority}
                      </Typography>
                    </Box>
                  )
                )}
              </Stack>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => setDraftSaved(true)}
            >
              Save draft
            </Button>

            {draftSaved && (
              <Alert severity="success">
                Draft saved. It can be loaded when ticket sales open.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: { xs: 70, lg: "auto" } }}
      >
        <Typography
          variant="h3"
          sx={{
            transform: {
              xs: "rotate(90deg)",
              lg: "none",
            },
          }}
        >
          &rarr;
        </Typography>

        <Typography variant="caption" align="center" color="text.secondary">
          Sales open
        </Typography>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Chip
            label="Live booking"
            size="small"
            color="primary"
            sx={{ mb: 2 }}
          />

          <Typography variant="h5">Saved draft loaded</Typography>

          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
            <Chip label={`${tickets} adjacent seats`} />
            <Chip label={`Up to $${maxPrice} each`} />
            <Chip label={`${view} view`} />
            {excludeRestricted && <Chip label="No restricted view" />}
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <SeatMap />

          <Alert severity="success" sx={{ mt: 3 }}>
            A valid adjacent pair was found. This selection does not leave an
            isolated seat.
          </Alert>

          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="overline" color="primary.main">
                    Best valid match
                  </Typography>

                  <Typography variant="h6">
                    Circle 2 / Section A
                  </Typography>

                  <Typography>Row 10 / Seats 12-13</Typography>
                </Box>

                <Chip label="$140 each" color="primary" />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={0.5}>
                <Typography variant="body2">&#10003; Seats are adjacent</Typography>
                <Typography variant="body2">&#10003; Within budget</Typography>
                <Typography variant="body2">
                  &#10003; Central viewing direction
                </Typography>
                <Typography variant="body2">
                  &#10003; No restricted view identified
                </Typography>
                <Typography variant="body2">
                  &#10003; No isolated seat created
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" fullWidth>
              Show other matches
            </Button>

            <Button variant="contained" fullWidth>
              Reserve this pair
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
