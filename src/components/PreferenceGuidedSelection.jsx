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
    id: "stalls-left",
    label: "Available",
    name: "Stalls / Left",
    price: "$130-$160",
    direction: "Left-side viewing direction",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
  },
  {
    id: "circle-2-a",
    label: "Best match",
    name: "Circle 2 / Section A",
    price: "$120–$150",
    direction: "Central viewing direction",
    explanation: "Matches your budget and preferred view.",
    status: "Recommended",
    warning: false,
    adjacentAvailability: "4 adjacent pairs available",
    availabilityColor: "success",
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
    adjacentAvailability: "8 adjacent pairs available",
    availabilityColor: "success",
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
    adjacentAvailability: "Only 1 adjacent pair remaining",
    availabilityColor: "warning",
  },
  {
    id: "stalls-right",
    label: "Available",
    name: "Stalls / Right",
    price: "$130-$160",
    direction: "Right-side viewing direction",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
  },
  {
    id: "circle-2-left",
    label: "Available",
    name: "Circle 2 / Left",
    price: "$110-$140",
    direction: "Left-side viewing direction",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
  },
  {
    id: "circle-2-right",
    label: "Available",
    name: "Circle 2 / Right",
    price: "$110-$140",
    direction: "Right-side viewing direction",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
  },
];

const recommendedSectionIds = ["circle-2-a", "circle-3-b", "stalls-c"];

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
              {section.adjacentAvailability && (
                <Chip
                  label={section.adjacentAvailability}
                  size="small"
                  color={section.availabilityColor}
                  variant="outlined"
                  sx={{ mt: 1.25 }}
                />
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function VenueSectionMap({ selectedSection, onSelect, recommendationMode }) {
  const mapSections = [
    {
      id: "stalls-left",
      shortName: "Stalls Left",
      gridColumn: "1 / 2",
      background: "#f5f5f5",
    },
    {
      id: "stalls-c",
      shortName: "Stalls C",
      gridColumn: "2 / 3",
      background: "#fff4e5",
    },
    {
      id: "stalls-right",
      shortName: "Stalls Right",
      gridColumn: "3 / 4",
      background: "#f5f5f5",
    },
    {
      id: "circle-2-left",
      shortName: "Circle 2 / Left",
      gridColumn: "1 / 2",
      background: "#f5f5f5",
    },
    {
      id: "circle-2-a",
      shortName: "Circle 2 / A",
      gridColumn: "2 / 3",
      background: "#e3f2fd",
    },
    {
      id: "circle-2-right",
      shortName: "Circle 2 / Right",
      gridColumn: "3 / 4",
      background: "#f5f5f5",
    },
    {
      id: "circle-3-b",
      shortName: "Circle 3 / B",
      gridColumn: "1 / 4",
      background: "#eef1f5",
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography fontWeight={700}>Venue section map</Typography>
          <Typography variant="body2" color="text.secondary">
            Select a section on the map or compare it in the list below.
          </Typography>
        </Box>
        <Chip label="Stage at top" size="small" variant="outlined" />
      </Stack>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "#fafafa",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "62%",
            mx: "auto",
            mb: 2,
            py: 1,
            borderRadius: "50% 50% 8px 8px",
            bgcolor: "#263444",
            color: "common.white",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          STAGE
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.25,
            maxWidth: 560,
            mx: "auto",
          }}
        >
          {mapSections.map((section) => {
            const selected = selectedSection === section.id;
            const recommended = recommendedSectionIds.includes(section.id);
            return (
              <Button
                key={section.id}
                variant="outlined"
                onClick={() => onSelect(section.id)}
                aria-pressed={selected}
                sx={{
                  gridColumn: section.gridColumn,
                  minHeight: section.id === "circle-3-b" ? 62 : 82,
                  bgcolor: selected
                    ? "primary.main"
                    : recommendationMode && recommended
                      ? section.background
                      : "#f5f5f5",
                  color: selected ? "common.white" : "text.primary",
                  borderColor: selected ? "primary.main" : "grey.400",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: selected ? "primary.dark" : "action.hover",
                    borderColor: "primary.main",
                  },
                }}
              >
                {section.shortName}
              </Button>
            );
          })}
        </Box>

        {recommendationMode && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            spacing={{ xs: 0.5, sm: 2 }}
            sx={{ mt: 1.5 }}
          >
            <Typography variant="caption">Blue: best match</Typography>
            <Typography variant="caption">Grey: lower price</Typography>
            <Typography variant="caption">Orange: closest / over budget</Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

function MatchingVenueSections({
  preferences,
  onSelectSection,
  selectionMode,
}) {
  const [selectedSection, setSelectedSection] = useState("circle-2-a");
  const selected = venueSections.find(
    (section) => section.id === selectedSection,
  );
  const recommendedSections = venueSections.filter((section) =>
    recommendedSectionIds.includes(section.id),
  );

  useEffect(() => {
    if (
      selectionMode === "guided" &&
      !recommendedSectionIds.includes(selectedSection)
    ) {
      setSelectedSection("circle-2-a");
    }
  }, [selectionMode, selectedSection]);

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
            <Typography variant="h6">
              {selectionMode === "guided"
                ? "Matching venue sections"
                : "Browse venue sections"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectionMode === "guided"
                ? "Ranked using your price and viewing preferences."
                : "Choose a section directly without using a recommendation."}
            </Typography>
          </Box>
          <Chip
            label={`${preferences.tickets} tickets`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />
        <VenueSectionMap
          selectedSection={selectedSection}
          onSelect={setSelectedSection}
          recommendationMode={selectionMode === "guided"}
        />

        {selectionMode === "guided" ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              {recommendedSections.map((section) => (
                <SectionOption
                  key={section.id}
                  section={section}
                  selected={selectedSection === section.id}
                  onSelect={setSelectedSection}
                />
              ))}
            </Stack>
          </>
        ) : (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Selected from map
              </Typography>
              <Typography variant="h6">{selected?.name}</Typography>
              <Typography fontWeight={700}>{selected?.price}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selected?.direction}
              </Typography>
            </CardContent>
          </Card>
        )}

        {selected?.warning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This section may exceed your maximum price of $
            {preferences.maxPrice} per ticket.
          </Alert>
        )}

        <Stack sx={{ mt: 3 }}>
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
  const [selectionMode, setSelectionMode] = useState("guided");
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

  useEffect(() => {
    if (loadedDraft) setSelectionMode("guided");
  }, [loadedDraft]);

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            gap={2}
          >
            <Box>
              <Typography variant="h6">Choose a section-selection path</Typography>
              <Typography variant="body2" color="text.secondary">
                Browse the venue yourself or use preferences to receive a shortlist.
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={selectionMode}
              exclusive
              size="small"
              onChange={(_, value) => value && setSelectionMode(value)}
              aria-label="Section selection path"
            >
              <ToggleButton value="browse">Browse map</ToggleButton>
              <ToggleButton value="guided">Guided recommendations</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            selectionMode === "guided"
              ? { xs: "1fr", md: "360px minmax(0, 1fr)" }
              : "minmax(0, 1fr)",
          gap: 3,
          alignItems: "start",
        }}
      >
        {selectionMode === "guided" && (
          <Preferences onApply={applyPreferences} loadedDraft={loadedDraft} />
        )}
        <MatchingVenueSections
          preferences={preferences}
          onSelectSection={onSelectSection}
          selectionMode={selectionMode}
        />
      </Box>
    </Stack>
  );
}
