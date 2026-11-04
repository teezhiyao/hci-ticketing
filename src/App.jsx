import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PreferenceGuidedSelection from "./components/PreferenceGuidedSelection.jsx";

const event = {
  title: "Feng Ze — Bend The Lines",
  venue: "Esplanade Concert Hall",
  date: "23 October 2026",
  time: "7:30 PM",
};

function BookingSection({ number, title, status, active = false, children }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: active ? "primary.main" : "divider",
        borderWidth: active ? 2 : 1,
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          bgcolor: active ? "primary.main" : "#263444",
          color: "common.white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
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
              color: active ? "primary.main" : "#263444",
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
      </Box>

      {children && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </Card>
  );
}

function BookingSummary() {
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
          <Chip label="08:28 left" size="small" color="primary" />
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
            <Typography>2 adjacent seats</Typography>
            <Typography>Up to $150 each</Typography>
            <Typography>Central view · No restricted view</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Section
            </Typography>
            <Typography color="text.secondary">Not selected</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Seat allocation
            </Typography>
            <Typography color="text.secondary">Not selected</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="h6">—</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function App() {
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
            <Chip
              label="Seats are not reserved until confirmation"
              sx={{ bgcolor: "rgba(255,255,255,.12)", color: "common.white" }}
            />
          </Stack>
        </Box>
      </Box>

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
            number="1"
            title="Date and time"
            status="Completed"
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
            number="2"
            title="Seats — enter preferences and review matches"
            status="Current step"
            active
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
              <Button variant="outlined">Load saved draft</Button>
            </Stack>

            <PreferenceGuidedSelection />
          </BookingSection>

          <BookingSection
            number="3"
            title="Seat allocation"
            status="Select a section to continue"
          />

          <BookingSection
            number="4"
            title="Ticket type"
            status="Complete seat allocation first"
          />
        </Stack>

        <BookingSummary />
      </Box>
    </Box>
  );
}
