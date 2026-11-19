# Wildblock: Green Grass & Smooth Streaming

Patch on the supplied Builder's Workshop/Frontiers build. All content, account IDs, block IDs, inventory recipes, terrain formulas and generator identifiers are retained.

## Grass fix
Legacy grass-top and short-grass aliases pointed at grayscale source masks although colored Java textures were already embedded. They now use the colored tiles. Grass sides are composited with their green overlay, and the grass model uses the same complete six faces in full and Simple Models modes. Dirt stays brown. Embedded UI/held-item aliases are synchronized.

## Streamed loading
Web Worker generates/prefetches terrain outside the UI thread using the SAME generator functions/content mappings. Blob worker is embedded and requires no network request. Create/Continue/Import UI paths prewarm streamed terrain with visible progress. Nearby origin shifts reuse overlapping voxel/light/height data and GPU chunk buffers; a shader offset translates retained meshes. Only incoming strips are copied/recomputed. Lighting/visible meshing are cooperative jobs advanced across frames; completed meshes replace old geometry. Lighting may refine after terrain appears. Lighting invalidation uses 64-block global cells, not each16-block step. Prefetch begins before the window edge; if not ready, movement stays safely inside loaded terrain rather than generating terrain in the movement callback. Bounded base cache is448 chunks (was384). Edits remain in the existing separate ledger. Worker failure uses incremental main-thread prefetch. Workers/caches are not serialized.

## Limits
Still the Frontiers rolling-window engine. No zero-hitch or FPS guarantee. Typed-array commits, ledger capture, garbage collection and GPU uploads can cause short stalls. Cooperative budgets are not hard deadlines. Programmatic/internal synchronous loads/teleports remain supported and can be slower than prewarmed UI paths. Worker-unavailable initial loading may pause more. No real Chromebook/public-network/production-deployment benchmark was run.

## Install
Export account/world backups. Replace the SAME site's contents, keeping index.html/.nojekyll at root. Refresh; do NOT clear site data. No new world or destructive conversion required. Keep URL/origin/path. For localhost: python -m http.server 8000. Do not use file:// for encrypted accounts. Streamed worlds remain solo-only. Finite co-op/content build ID unchanged.

See docs/SMOOTH-STREAMING-TESTS.json. Earlier reports are historical. Active code is inline in index.html; smooth-streaming.js/frontiers-world.js are reference companions, not script-src additions. Preserve supplied licenses.
