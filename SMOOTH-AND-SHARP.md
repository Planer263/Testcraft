# Wildblock: Smooth & Sharp + Player Nametags

## Install / use
Replace index.html on your EXISTING GitHub Pages site with the attached index.html,
or replace the site with the extracted ZIP contents. index.html is at ZIP root.
Keep the same URL to keep access to browser-local accounts/world saves. Hard-
refresh after deployment if necessary; do NOT clear site data. Export backups.
The login screen, encrypted account format, block IDs and world format remain.
No new world is required for these rendering changes.

## Enable the performance profile
After logging in, click Smooth & Sharp on the title screen, or choose it in
Options / Performance. It targets 60 FPS, a 48-block view distance, smooth vertex
lighting, transparent animated water and full block models. It does not promise
60 FPS on every Chromebook. Existing custom/safety settings are respected; the
preset is opt-in. A previous 30-FPS cap stays 30 until you change it/the preset.
New users start at 90% render scale and a 60-FPS cap; existing saved settings win.

Adaptive resolution in Smooth & Sharp starts at 100% and may reduce WORLD-only
resolution to 85% after sustained missed frame targets. It restores gradually.
HUD, text, inventory and nametags remain native resolution. The floor is adjustable;
turn Adaptive world render scale off for fixed resolution. It cannot solve a CPU-
bound mesh stall and avoids reacting while measured mesh work is expensive.
Render scale does not change texture assets, block geometry, lighting or saves.

## Low/no-quality-loss engine changes
- Conservative camera-frustum rejection for chunks and entity/drop assembly.
  Nearby chunks stay resident, so turning around does not intentionally unload them.
- Indexed quad geometry: four stored vertices instead of six, preserving EXACT
  position, UV, lighting, AO and material attributes. No greedy texture stretching.
  All triangle order/attribute pairs are retained. WebGL1 fallback remains.
- Cached vertex-array layouts on supporting devices; fallback uses normal bindings.
- Reusable CPU arrays and a small ring of dynamic GPU buffers for draw batches.
- Reuse water sorting while view position and visible water chunk set are unchanged.
- Skip identical HUD reconstruction. Geometry and propagated local lighting stay.
- No preserved previous drawing buffer; F2 renders immediately before PNG capture.
- Built-in draw/geometry/mesh/scale counters in exported diagnostics.

This first pass does NOT add worker-based full voxel meshing or greedy surface
merging. Those require a larger, separately tested renderer/world-state refactor.
No true infinite terrain, new server, changed network transport or FPS guarantee.

## Player nametags
Names appear above REMOTE players, follow their interpolated positions and use
screen-space CSS text independent of dynamic world resolution. White lettering,
dark translucent background and gentle distance scaling/fade. Your own label is
hidden. Names are inserted as plain text, never player-supplied HTML.
Tags hide behind the camera, out of range, through obstructing solid terrain,
while menus/login/death/HUD-hidden states are active, or when disabled in Options.
Default range: 32 blocks, limited to the entity draw distance. Glass/leaves and
liquids do not count as opaque tag blockers; partial solid shapes use their boxes.
Occlusion is cached for about 150 ms and invalidated by block edits/movement.
Disconnected player elements are removed. No new player information is broadcast.

## Validation
See docs/SMOOTH-SHARP-TESTS.json for actual results and test limits.
In one fixed software-WebGL test scene, four views matched pixel-for-pixel with
culling/indexing disabled vs enabled. Terrain/water draw submissions fell from
78 to 28-32 in those views. Indexed geometry used 4 stored vertices per quad
instead of 6 (33% fewer attribute vertices, excluding index-buffer bytes).
This is NOT a measured 33%/60% FPS gain or a Chromebook hardware benchmark.
Tests cover startup/login/world rendering, labels, occlusion, settings and errors.
Public multiplayer service/connectivity is not revalidated by injected-label tests.

## Unchanged services and rights
PeerJS remains on-demand for co-op; online services/TURN limitations remain.
No public account backend is added. Existing supplied-asset notices still apply.
