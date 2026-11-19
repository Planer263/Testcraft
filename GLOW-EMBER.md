# Glow & Ember — lighting update

## Start / GitHub Pages
Extract this ZIP. The entry point is index.html at the root. Upload the extracted
contents to your Pages publishing folder, retaining peer-config.js and folders.
No build step, Python or JAR is required. The short-code PeerJS system is retained;
its public SDK/cloud still require internet when hosting/joining.
Export a save backup before upgrading. No new world is needed for lighting.

## Lighting changes
All graphics presets now use a voxel-propagated block-light field. Lava, torches,
burning furnaces and supported luminous blocks light adjacent spaces instead
of merely drawing a bright texture. The old Fast mode ignored lava/furnace
illumination around neighboring blocks and only approximated nearby torches.
Torch source 14, furnace 13 and lava 15 are retained as simulation values; a new
rendering curve makes the falloff much more readable, without changing spawning.
Opaque blocks stop light; light can spread around corners. Partial-block opacity
remains approximate (slabs/stairs/doors are not full Java light-shape simulation).
Furnaces illuminate only while fuel is burning, with a self-lit front texture.
Source placement/removal and furnace ignition/extinction invalidate nearby
lighting and meshes. Network furnace transitions also refresh guest lighting.

Supported extra sources include glowstone, sea lantern, jack o'lantern,
shroomlight/froglights where present, crying obsidian and magma blocks.
A shared adjustable warm block-light tint is used, not separate RGB propagation.

## Brighter, more readable rendering
- Higher dark-area visibility and brighter moonlit surfaces.
- Smoother block-light falloff and lifted directional/AO shadow contrast.
- Adjustable warm light color; brighter source-adjacent surfaces.
- Softer distance fog and a brighter night-sky base.
- Existing smooth vertex lighting is enabled in new Chromebook/Balanced defaults;
  Ultra Low retains flat lighting. Saved personal preferences remain respected.

Options now has three sliders:
- Brightness / dark-area visibility (default .85).
- Torch / furnace / lava brightness (default 1.18).
- Warm light color (default .55).
These are rendering preferences, not changes to block light levels, world time
or spawn rules. No light-related save format or block-ID migration is needed.

## Performance
Block lighting is computed in a bounded region around the view with an extra
halo; later block edits refresh a smaller region. It no longer checks distances
to up to 32 torches per vertex. No per-fragment loops over every light source,
shadow maps, bloom or ray tracing are added. The mesh and resolution presets
remain available. Lighting can still cause CPU spikes on movement/large edits;
this is not asynchronous worker lighting and hardware Chromebook FPS is not
guaranteed. Existing global sky/block arrays remain allocated as in the base.

Fast skylight uses direct column exposure. Quality adds side-propagated skylight.
Both modes use the same propagated block lighting. Fast skylight can make closed
interiors darker than Quality before brightness correction; the new ambient/
gamma controls keep them readable. Flowing-water opacity changes can lag until
another lighting refresh; this is not a complete Minecraft lighting engine.

## Retained features and limits
Short room codes, personal survivor state, shared containers, existing world
sizes, water, stairs/slabs, shaded icons, model studio and mod editor remain.
This release focuses on lighting, not completing all planned Minecraft systems.
PeerJS SDK/cloud operation, restricted-network traversal, full Java parity,
authoritative public-server security and all roadmap updates remain out of scope.
See README.md, peer-config.js, prior release notes and included asset notices.

## Verification
Actual checks are listed in docs/GLOW-EMBER-TESTS.json. Historical reports describe
their earlier builds. Public-service PeerJS connectivity and hardware FPS are
not implied by local browser/lighting tests.
