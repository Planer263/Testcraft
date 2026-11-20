# Raised Canopies & High Clouds

Based on Wildblock Expanded Biomes (generation 3).

- Small ordinary trees gain one block of trunk height.
- Natural tree crowns retain at least four blocks above their own trunk-base
  ground; slope-facing leaves also respect local terrain clearance.
- Spruce foliage no longer starts at two blocks above ground. Old-growth spruce
  and pine have higher, proportional canopy starts; pine starts higher than spruce.
- Deliberate low jungle bushes remain understory rather than being turned into
  floating bushes. Giant jungle/dark oak trunk shapes are retained.
- Fixed cloud altitude was 49. New cloud bases are max(160, H+64): 160 in finite
  worlds and 192 in streamed worlds. The cloud field tracks world coordinates,
  spans the player vicinity, and drifts without changing altitude with the player.
- Clouds use a separate sky draw with a long fog range and a 512-unit far plane,
  so raising them does not hide them behind the short terrain fog distance.
  Normal terrain render distance/fog is restored after the cloud draw.
- No clouds in paired Nether or standalone Nether/End realms.

Installation: back up saves, extract and replace site contents at the existing
URL, and refresh all players. Co-op handshake hearth-company-raised-canopies-4.
Existing cloud settings are retained; enable Clouds in options if disabled.
No new block IDs or save format. Generation-3 naturally generated trees use the
revised foliage on regeneration; player leaf/block edits remain authoritative.
Older generation 0-2 algorithms are preserved. This is not a migration of every
hand-placed leaf. Existing biome and standalone-realm limitations still apply.

Tests: all eight inline scripts and worker parse. The 57-preset main/worker and
determinism suite passed again. Flat terrain forest/birch/taiga/dark forest fixtures
have minimum leaf bases of four blocks; tested old-growth pine/spruce bases were
eight/six. Cloud geometry tests verify 160/192 altitude, stable global coordinates
through origin shifts, and Nether/End exclusion. Browser visuals and hardware FPS
were not measured. See docs/RAISED-CANOPIES-TESTS.json and reproducible scripts.
