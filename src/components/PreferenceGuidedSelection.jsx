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
    minPrice: 130,
    seatPrice: 130,
    view: "left",
    matchPriority: 5,
    direction: "Left-side viewing direction",
    expectedViewLabel: "Left-side view from Stalls",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
    adjacentAvailability: "2 adjacent pairs available",
    availabilityColor: "success",
  },
  {
    id: "circle-2-a",
    label: "Best match",
    name: "Circle 2 / Section A",
    price: "$120–$150",
    minPrice: 120,
    seatPrice: 120,
    view: "center",
    matchPriority: 10,
    direction: "Central viewing direction",
    expectedViewLabel: "Central view from Circle 2",
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
    minPrice: 90,
    seatPrice: 90,
    view: "center",
    matchPriority: 0,
    direction: "Further from stage",
    expectedViewLabel: "Distant central view from Circle 3",
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
    minPrice: 150,
    seatPrice: 150,
    view: "center",
    matchPriority: 5,
    direction: "Close central viewing direction",
    expectedViewLabel: "Close central view from Stalls",
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
    minPrice: 130,
    seatPrice: 130,
    view: "right",
    matchPriority: 5,
    direction: "Right-side viewing direction",
    expectedViewLabel: "Right-side view from Stalls",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
    adjacentAvailability: "2 adjacent pairs available",
    availabilityColor: "success",
  },
  {
    id: "circle-2-left",
    label: "Available",
    name: "Circle 2 / Left",
    price: "$110-$140",
    minPrice: 110,
    seatPrice: 110,
    view: "left",
    matchPriority: 10,
    direction: "Left-side viewing direction",
    expectedViewLabel: "Left-side view from Circle 2",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
    adjacentAvailability: "5 adjacent pairs available",
    availabilityColor: "success",
  },
  {
    id: "circle-2-right",
    label: "Available",
    name: "Circle 2 / Right",
    price: "$110-$140",
    minPrice: 110,
    seatPrice: 110,
    view: "right",
    matchPriority: 10,
    direction: "Right-side viewing direction",
    expectedViewLabel: "Right-side view from Circle 2",
    explanation: "Browse directly on the venue map.",
    status: "Available",
    warning: false,
    adjacentAvailability: "5 adjacent pairs available",
    availabilityColor: "success",
  },
];

const MIN_AVAILABLE_PRICE = Math.min(
  ...venueSections.map((section) => section.minPrice),
);

const viewLabels = {
  left: "left-side view",
  center: "central view",
  right: "right-side view",
  any: "any viewing direction",
};

function buildRecommendedSections(preferences) {
  const preferredView = preferences.view ?? "any";

  return venueSections
    .map((section) => {
      const withinBudget = section.minPrice <= preferences.maxPrice;
      const viewMatches =
        preferredView === "any" || section.view === preferredView;
      const viewScore = viewMatches
        ? 60
        : preferredView !== "center" && section.view === "center"
          ? 20
          : 0;
      const overBudgetBy = Math.max(
        0,
        section.minPrice - preferences.maxPrice,
      );
      const score =
        (withinBudget ? 100 : 0) +
        viewScore +
        section.matchPriority -
        overBudgetBy * 2;

      return { section, withinBudget, viewMatches, overBudgetBy, score };
    })
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.section.minPrice - second.section.minPrice,
    )
    .slice(0, 3)
    .map(({ section, withinBudget, viewMatches, overBudgetBy }, index) => {
      if (!withinBudget) {
        return {
          ...section,
          label: index === 0 ? "Closest available" : "Alternative",
          status: `Starts at $${section.minPrice}`,
          explanation: viewMatches
            ? `Matches your ${viewLabels[preferredView]} preference, but starts $${overBudgetBy} above your budget.`
            : "Does not meet the current price or viewing preference.",
          warning: true,
        };
      }

      if (viewMatches) {
        return {
          ...section,
          label: index === 0 ? "Best match" : "Also matches",
          status: index === 0 ? "Recommended" : "Within requirements",
          explanation:
            preferredView === "any"
              ? "Within budget; no viewing direction preference was applied."
              : `Within budget and matches your ${viewLabels[preferredView]} preference.`,
          warning: false,
        };
      }

      return {
        ...section,
        label: index === 0 ? "Best available" : "View alternative",
        status: "View differs",
        explanation: `Within budget, but offers a ${viewLabels[section.view]} instead of your preferred ${viewLabels[preferredView]}.`,
        warning: false,
      };
    });
}

function Preferences({ onApply, loadedDraft, onTrack }) {
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
    const nextPreferences = {
      tickets,
      maxPrice,
      sitTogether,
      view,
      excludeRestricted,
    };
    onTrack?.("preferences_applied", nextPreferences);
    if (maxPrice < MIN_AVAILABLE_PRICE) {
      onTrack?.("no_match_triggered", { maxPrice });
    }
    onApply(nextPreferences);
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

function VenueSectionMap({
  selectedSection,
  onSelect,
  recommendationMode,
  recommendedSectionIds = [],
}) {
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
            const recommendationIndex = recommendedSectionIds.indexOf(
              section.id,
            );
            const recommendationColors = ["#e3f2fd", "#eef1f5", "#fff4e5"];
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
                      ? recommendationColors[recommendationIndex]
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
            <Typography variant="caption">Blue: top match</Typography>
            <Typography variant="caption">Grey: second match</Typography>
            <Typography variant="caption">Orange: third match</Typography>
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
  onBrowseMap,
  onTrack,
}) {
  const [selectedSection, setSelectedSection] = useState("circle-2-a");
  const recommendedSections = buildRecommendedSections(preferences);
  const recommendedSectionIds = recommendedSections.map(
    (section) => section.id,
  );
  const selected =
    (selectionMode === "guided" &&
      recommendedSections.find((section) => section.id === selectedSection)) ||
    venueSections.find((section) => section.id === selectedSection);
  const noExactMatch =
    selectionMode === "guided" &&
    preferences.maxPrice < MIN_AVAILABLE_PRICE;

  const selectMapSection = (sectionId) => {
    setSelectedSection(sectionId);
    onTrack?.("map_section_inspected", { sectionId });
  };

  const selectRecommendation = (sectionId) => {
    setSelectedSection(sectionId);
    onTrack?.("recommendation_inspected", { sectionId });
  };

  useEffect(() => {
    if (selectionMode === "guided" && recommendedSections.length) {
      setSelectedSection(recommendedSections[0].id);
    }
  }, [
    selectionMode,
    preferences.tickets,
    preferences.maxPrice,
    preferences.sitTogether,
    preferences.view,
    preferences.excludeRestricted,
  ]);

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
                ? noExactMatch
                  ? "Closest available alternatives"
                  : "Matching venue sections"
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
        {noExactMatch && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={onBrowseMap}>
                Browse full map
              </Button>
            }
          >
            No section can satisfy the ${preferences.maxPrice} maximum price
            together with the current requirements. Increase the budget to at
            least ${MIN_AVAILABLE_PRICE}, or inspect all sections on the venue
            map.
          </Alert>
        )}
        <VenueSectionMap
          selectedSection={selectedSection}
          onSelect={selectMapSection}
          recommendationMode={selectionMode === "guided"}
          recommendedSectionIds={recommendedSectionIds}
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
                  onSelect={selectRecommendation}
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
            disabled={noExactMatch}
            onClick={() =>
              onSelectSection?.(selected, { selectionMode })
            }
          >
            {noExactMatch ? "Resolve requirements to continue" : "Select section"}
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
  onTrack,
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
              onChange={(_, value) => {
                if (!value) return;
                onTrack?.("selection_path_changed", { path: value });
                setSelectionMode(value);
              }}
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
          <Preferences
            onApply={applyPreferences}
            loadedDraft={loadedDraft}
            onTrack={onTrack}
          />
        )}
        <MatchingVenueSections
          preferences={preferences}
          onSelectSection={onSelectSection}
          selectionMode={selectionMode}
          onBrowseMap={() => {
            onTrack?.("no_match_recovery", { action: "browse-map" });
            onTrack?.("selection_path_changed", { path: "browse" });
            setSelectionMode("browse");
          }}
          onTrack={onTrack}
        />
      </Box>
    </Stack>
  );
}
