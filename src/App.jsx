import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

const steps = ["Preferences", "Recommendations", "Select seats", "Review"];

const defaultPreferences = {
  tickets: 2,
  maxPrice: 150,
  keepTogether: true,
  preferredView: "Central",
  excludeRestricted: true,
};

function PlaceholderScreen({ title, description, back, next, nextLabel }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>

        {title === "Select exact seats" && (
          <Alert severity="info" sx={{ mt: 3 }}>
            Add the venue map, clickable seat grid, expected-view preview, and
            early adjacency feedback here.
          </Alert>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          {back && <Button onClick={back}>Back</Button>}
          {next && (
            <Button variant="contained" onClick={next}>
              {nextLabel}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function BookingSummary({ step, preferences }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Booking summary</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1.25}>
          <Typography>Tickets: {preferences.tickets}</Typography>
          <Typography>Maximum: ${preferences.maxPrice} each</Typography>
          <Typography>Preferred view: {preferences.preferredView}</Typography>
          <Typography>
            Seats together: {preferences.keepTogether ? "Required" : "Flexible"}
          </Typography>
          <Typography>
            Restricted views: {preferences.excludeRestricted ? "Excluded" : "Allowed"}
          </Typography>
          <Chip
            label={`Current step: ${steps[step]}`}
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start", mt: 1 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [preferences] = useState(defaultPreferences);

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const screens = [
    {
      title: "Seat preferences",
      description:
        "Add ticket quantity, budget, adjacency, viewing direction, restricted-view controls, and the optional saved-draft action here.",
      nextLabel: "Find matching sections",
    },
    {
      title: "Recommended sections",
      description:
        "Add ranked section cards, match explanations, prices, adjacent-seat availability, and map links here.",
      nextLabel: "View on map",
    },
    {
      title: "Select exact seats",
      description:
        "Allow users to verify the recommendation and choose a valid adjacent seat group.",
      nextLabel: "Review seats",
    },
    {
      title: "Review selection",
      description:
        "Add selected seats, subtotal, view preview, constraint confirmations, reservation status, and final confirmation here.",
      nextLabel: null,
    },
  ];

  const screen = screens[step];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
          Concert seat selection
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Find and verify seats that match your requirements.
        </Typography>

        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 330px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <PlaceholderScreen
            title={screen.title}
            description={screen.description}
            back={step > 0 ? back : null}
            next={step < steps.length - 1 ? next : null}
            nextLabel={screen.nextLabel}
          />
          <BookingSummary step={step} preferences={preferences} />
        </Box>
      </Box>
    </Box>
  );
}
