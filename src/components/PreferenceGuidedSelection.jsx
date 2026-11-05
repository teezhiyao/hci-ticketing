import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Radio,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const venueSections = [
  {
    id: "circle-2-a",
    label: "Best match",
    name: "Circle 2 / Section A",
    price: "$120–$150",
    direction: "Central viewing direction",
    explanation: "Matches your budget and preferred view.",
    status: "Recommended",
    warning: false,
  },
  {
    id: "circle-3-b",
    label: "Lower price",
    name: "Circle 3 / Section B",
    price: "$90–$120",
    direction: "Further from stage",
    explanation: "Costs less, but is further from the stage.",
    status: "Lowest price",
    warning: false,
  },
  {
    id: "stalls-c",
    label: "Closest",
    name: "Stalls / Section C",
    price: "$150–$170",
    direction: "Side viewing direction",
    explanation: "Closer to the stage, but may exceed your budget.",
    status: "Over budget",
    warning: true,
  },
];

function Preferences({ onApply, loadedDraft }) {
  const [tickets, setTickets] = useState(2);
  const [maxPrice, setMaxPrice] = useState(150);
  const [sitTogether, setSitTogether] = useState(true);
  const [view, setView] = useState("center");
  const [excludeRestricted, setExcludeRestricted] = useState(true);

  useEffect(() => {
    if (!loadedDraft) return;
    setTickets(loadedDraft.tickets);
    setMaxPrice(loadedDraft.maxPrice);
    setSitTogether(loadedDraft.sitTogether);
    setView(loadedDraft.view);
    setExcludeRestricted(loadedDraft.excludeRestricted);
    onApply(loadedDraft);
  }, [loadedDraft]);

  function applyPreferences() {
    onApply({ tickets, maxPrice, sitTogether, view, excludeRestricted });
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Seat preferences</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tell us what matters to you. We will suggest suitable sections.
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Number of tickets"
            type="number"
            value={tickets}
            onChange={(event) => setTickets(Number(event.target.value))}
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
              aria-label="Maximum price per ticket"
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={sitTogether}
                onChange={(event) => setSitTogether(event.target.checked)}
              />
            }
            label="Keep all seats together"
          />

          <Box>
            <Typography gutterBottom>Preferred view</Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              fullWidth
              size="small"
              onChange={(_, value) => value && setView(value)}
              aria-label="Preferred viewing direction"
            >
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
              <ToggleButton value="any">Any</ToggleButton>
            </ToggleButtonGroup>
          </Box>

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

          <Button variant="contained" size="large" onClick={applyPreferences}>
            Find matching sections
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionOption({ section, selected, onSelect }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected ? "action.selected" : "background.paper",
      }}
    >
      <CardActionArea onClick={() => onSelect(section.id)}>
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Radio checked={selected} sx={{ mt: -1 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color={section.warning ? "warning.main" : "primary.main"}
                  >
                    {section.label}
                  </Typography>
                  <Typography variant="h6">{section.name}</Typography>
                </Box>
                <Chip
                  label={section.status}
                  size="small"
                  color={section.warning ? "warning" : "default"}
                />
              </Stack>

              <Typography sx={{ mt: 1, fontWeight: 600 }}>
                {section.price}
              </Typography>
              <Typography variant="body2">
                {section.direction} — {section.explanation}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MatchingVenueSections({ preferences, onSelectSection }) {
  const [selectedSection, setSelectedSection] = useState("circle-2-a");
  const selected = venueSections.find(
    (section) => section.id === selectedSection,
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography variant="h6">Matching venue sections</Typography>
            <Typography variant="body2" color="text.secondary">
              Ranked using your price and viewing preferences.
            </Typography>
          </Box>
          <Chip
            label={`${preferences.tickets} tickets`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {venueSections.map((section) => (
            <SectionOption
              key={section.id}
              section={section}
              selected={selectedSection === section.id}
              onSelect={setSelectedSection}
            />
          ))}
        </Stack>

        {selected?.warning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This section may exceed your maximum price of $
            {preferences.maxPrice} per ticket.
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Button variant="outlined" fullWidth>
            View on map
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onSelectSection?.(selected)}
          >
            Select section
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function PreferenceGuidedSelection({
  onSelectSection,
  loadedDraft,
  onPreferencesChange,
}) {
  const [preferences, setPreferences] = useState({
    tickets: 2,
    maxPrice: 150,
    sitTogether: true,
    view: "center",
    excludeRestricted: true,
  });

  function applyPreferences(nextPreferences) {
    setPreferences(nextPreferences);
    onPreferencesChange?.(nextPreferences);
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "360px minmax(0, 1fr)" },
        gap: 3,
        alignItems: "start",
      }}
    >
      <Preferences onApply={applyPreferences} loadedDraft={loadedDraft} />
      <MatchingVenueSections
        preferences={preferences}
        onSelectSection={onSelectSection}
      />
    </Box>
  );
}
