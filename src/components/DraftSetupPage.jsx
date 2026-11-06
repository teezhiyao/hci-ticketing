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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const viewLabels = {
  left: "Left",
  center: "Center",
  right: "Right",
  any: "Any direction",
};

export default function DraftSetupPage({ initialDraft, onBack, onSave }) {
  const [name, setName] = useState(initialDraft?.name ?? "Concert default");
  const [tickets, setTickets] = useState(initialDraft?.tickets ?? 2);
  const [maxPrice, setMaxPrice] = useState(initialDraft?.maxPrice ?? 150);
  const [sitTogether, setSitTogether] = useState(initialDraft?.sitTogether ?? true);
  const [view, setView] = useState(initialDraft?.view ?? "center");
  const [excludeRestricted, setExcludeRestricted] = useState(
    initialDraft?.excludeRestricted ?? true
  );
  const [allowSideView, setAllowSideView] = useState(
    initialDraft?.fallback?.includes("Side view allowed") ?? true
  );

  const fallback = allowSideView
    ? `Side view allowed; do not exceed $${maxPrice}`
    : `Keep the preferred view; do not exceed $${maxPrice}`;

  const handleSave = () => {
    onSave({
      ...initialDraft,
      name: name.trim() || "Concert default",
      tickets,
      maxPrice,
      sitTogether,
      view,
      excludeRestricted,
      fallback,
    });
  };

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto" }}>
      <Button onClick={onBack} sx={{ mb: 2 }}>
        &larr; Back to booking
      </Button>

      <Box sx={{ mb: 3 }}>
        <Chip label="Before ticket sales" color="primary" size="small" />
        <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
          Create a seat-selection draft
        </Typography>
        <Typography color="text.secondary">
          Save your requirements in advance, then load them when sales open.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This preparation would typically be completed hours before ticket sales
        open. A draft saves preferences only; saving it does not load the draft,
        reserve seats, or complete a purchase.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 340px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">1. Draft details</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Give the draft a recognizable name and set the basic limits.
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label="Draft name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Number of tickets"
                  type="number"
                  value={tickets}
                  onChange={(event) =>
                    setTickets(Math.max(1, Number(event.target.value) || 1))
                  }
                  slotProps={{ htmlInput: { min: 1, max: 8 } }}
                  fullWidth
                />
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
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">2. Seat requirements</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Hard requirements will not be relaxed automatically.
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sitTogether}
                      onChange={(event) => setSitTogether(event.target.checked)}
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
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">3. Preferences and fallback</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Preferences guide the ranking, but may be relaxed using the
                fallback rule below.
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography gutterBottom>Preferred viewing direction</Typography>
                  <ToggleButtonGroup
                    value={view}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setView(value)}
                  >
                    <ToggleButton value="left">Left</ToggleButton>
                    <ToggleButton value="center">Center</ToggleButton>
                    <ToggleButton value="right">Right</ToggleButton>
                    <ToggleButton value="any">Any</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Box>
                  <Typography gutterBottom>Priority order</Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Chip label="1  Price limit" variant="outlined" />
                    <Chip label="2  Seats together" variant="outlined" />
                    <Chip label="3  Viewing direction" variant="outlined" />
                  </Stack>
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowSideView}
                      onChange={(event) => setAllowSideView(event.target.checked)}
                    />
                  }
                  label="Allow a side view if central sections are unavailable"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card variant="outlined" sx={{ position: { md: "sticky" }, top: 24 }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Draft summary
            </Typography>
            <Typography variant="h6">{name || "Untitled draft"}</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              <Typography><strong>Tickets:</strong> {tickets}</Typography>
              <Typography><strong>Maximum:</strong> ${maxPrice} per ticket</Typography>
              <Typography>
                <strong>Group seating:</strong>{" "}
                {sitTogether ? "Keep together" : "May split"}
              </Typography>
              <Typography>
                <strong>Preferred view:</strong> {viewLabels[view]}
              </Typography>
              <Typography>
                <strong>Restricted views:</strong>{" "}
                {excludeRestricted ? "Exclude" : "Allow"}
              </Typography>
              <Typography><strong>Fallback:</strong> {fallback}</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Button variant="contained" size="large" onClick={handleSave}>
                Save draft
              </Button>
              <Button variant="text" onClick={onBack}>Cancel</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
