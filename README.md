# Wildblock: Color & Crystal — Overworld Update

This is the complete static-site game, not a data-only mod.

## Install
Export account and world backups first. Replace the contents of your EXISTING GitHub Pages site with this ZIP's contents, keeping index.html and .nojekyll at the site root. Keep the same site URL/path to retain local data access. Refresh after deployment. Do NOT clear browser site data. No npm build is needed.

For local testing, extract and run `python -m http.server 8000`, then open `http://localhost:8000/`. Use localhost or HTTPS, not file://, for encrypted account support.

## What's new
- 18 new block entries: all 16 glazed terracotta colors, plus missing light-blue and light-gray terracotta.
- Four new items: amethyst shards, emeralds, golden carrots, pumpkin pie.
- 34 new crafting recipes and 20 new smelting mappings.
- Dyed terracotta crafting for every color, then smelting into matching glazed blocks.
- Glazed pattern placement orientation, six-face Java-style geometry/UV rotations and persistent direction metadata.
- New terrain-v5 worlds: calcite-lined amethyst geodes, underground tuff deposits, small emerald veins in hills, including occasional deepslate emerald ore.
- Wooden pickaxe or better harvests four amethyst shards per amethyst block. Four shards reconstruct one block. Iron pickaxe or better harvests emerald ore.
- Tuff/polished-tuff/tuff-brick recipes connect to existing stairs/slabs. New chiseled stone/sandstone recipes, deepslate tiles, cracked deepslate processing, cut/smooth sandstone and coarse dirt recipes.
- Search `overworld` in the item browser to find this release's additions and promoted building content.
- Release card on the title menu and updated in-game field guide.

## No Nether shortcut
NO Nether dimension, Nether resource generation, ancient debris progression, netherite gear, new froglights or shroomlight is added. Existing content in the supplied original is not deleted. New geodes use calcite, not basalt, for their outer shell.

## Existing saves
Terrain versions 1–4 retain their original generator. The browser test checked an original terrain-v4 save against the new runtime: identical SHA-256 block-array hashes. New crafting/smelting recipes work in existing worlds, but new natural deposits require a new world. All preexisting item keys/block associations are unchanged. Native IDs 700–717 are assigned permanently to this update. Mod slots 156–254 are unchanged.

Do not open a new terrain-v5 save in an older game build; older releases do not understand the generator or new blocks. Keep a pre-update backup if rollback matters. All co-op participants must run this same release; the build handshake isolates older registries.

## Explicit gameplay adaptations
- Geodes are finite shell deposits. This release does not implement budding-amethyst cluster growth. Amethyst blocks drop shards rather than intact blocks, and four shards craft one block.
- Pumpkin pie uses pumpkin + sugar + wheat, shapeless. There is no egg-producing chicken system in this build.
- Golden carrots restore six hunger; pie restores eight. Separate saturation and potion/status effects are not added.
- Emeralds support collecting and decorative storage blocks, not villager trading.
- Tinted-glass crafting is unlocked, but its inherited renderer remains; Java-exact tinted-glass light blocking is not added.
- No real two-device multiplayer, public signaling/TURN, hardware FPS, or production deployment test is claimed. See docs/OVERWORLD-TESTS.json for the actual validation record.

## Maintenance
The active content code is embedded in index.html immediately before bootMods(). overworld-content.js is a matching reference companion; do NOT load it again with script src. Seven inline scripts and the original account/login/multiplayer wrapper order are preserved. See docs/OVERWORLD-HANDOFF.md and the original development guide.

Original release documents under docs and other release notes are historical and may describe earlier build IDs or counts. This README and the Overworld test report describe this release. Supplied license notices remain included.
