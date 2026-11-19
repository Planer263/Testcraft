# Wildblock — launch login update

## Install on your current GitHub Pages site
Replace the site's existing index.html with the attached index.html, commit,
wait for deployment and reload the SAME site URL. If needed, hard-refresh with
Ctrl+Shift+R / Cmd+Shift+R. Do NOT clear site data: accounts/worlds are local.
The ZIP contains the complete ready-to-publish site with index.html at its root.

## Normal use
- Returning player: the launch screen shows your last-used account. Type its
  existing password and press Enter or click Log in. With one account there is
  no unnecessary account dropdown; with several, select the intended account.
- First visit: a separate Create account form asks for player name, password
  (at least 10 characters) and confirmation. Creation also logs you in.
- Import account backup can restore an existing encrypted identity to another
  browser/profile, but its original password is still required.
- Log in opens the title menu. Continue your existing world or create a new one.
- Sign out / switch account saves the current solo/host state where supported,
  leaves/ends an active room after confirmation, and returns to the login screen.
- Reloading or reopening the website requires the password again. Passwords are
  NOT remembered by game storage; your browser's password manager is separate.

## Existing accounts and items
Do NOT recreate an existing account. The original encrypted vault format,
account IDs, signing keys, password derivation and world-profile mapping remain.
Existing vaults are opened with the SAME password; signing identity is unchanged.
The login UI never deletes a world, account, inventory or old survivor record.
Items are still saved per host world under their existing player/account ID.
Name-only legacy inventories are not silently assigned to a new signed account.

Browser local storage belongs to an origin/site. A file:// copy, another browser,
a new hostname or cleared site data will not automatically find the account from
your previous hosted URL. Use encrypted account backups AND host-world backups.
This login is an encrypted LOCAL identity, not cloud/email/password-reset service.
Losing both the usable vault/backup or its password can make recovery impossible.
The client-side login gate is not a server-side security boundary or anti-cheat.

## What changed
The old Unlock button read the password from the Create account row, while errors
were shown elsewhere in the co-op panel. It has been replaced by a dedicated
launch login form with immediate inline errors and Enter-key submission.
The old Unlock/Lock controls and name-only survivor-switch row are removed from
the visible account UI. In-game account controls now offer account backup and
Sign out / switch account. Co-op panel text contrast is improved.

## Startup / black-screen protections retained
All required game/account/multiplayer/login code is bundled in index.html.
Title scene generation waits until modules/textures are ready and builds nearby
meshes progressively. A visible startup/recovery overlay handles script/texture/
WebGL context errors, with safe graphics and last-local-world export.
No startup .js network requests are required. PeerJS still loads separately from
its configured CDN only for Host/Join, and needs internet/signaling service access.
Reference/editable .js files remain in the ZIP, but the bundled blocks in
index.html are the runtime source; editing a separate source alone will not
change this one-file build.

## Co-op and Pages
Create or load a Survival world after logging in, then use Host room / Join room
and the eight-character PeerJS code. All players need compatible builds/config.
GitHub Pages serves the website, not a dedicated game/account/signaling server.
Public service availability and direct internet connectivity are not guaranteed.
No new TURN relay, cloud account service or complete Minecraft roadmap is added.
Keep the host awake and export backups regularly. Existing alpha limits remain.

For a new repository: upload extracted CONTENTS, not the ZIP or an extra wrapper
folder. Settings > Pages > Deploy from a branch > publishing branch > /(root).
Keep .nojekyll, the model studio, editor, notices and mods alongside index.html.

## Verification
See docs/LAUNCH-LOGIN-TESTS.json. Actual Chromium/Web Crypto tests covered first
signup, confirmation mismatch, mandatory launch gate, wrong-password handling,
Enter-key login, reload requiring password, original account-ID persistence,
unchanged encrypted vault bytes, stored inventory restoration, sign-out,
old-version account compatibility and encrypted backup import into a new profile.
Public PeerJS Cloud, hardware Chromebook performance and every gameplay path
were not retested in this focused account-UI update.

All existing user-supplied asset rights and license notices remain applicable.
