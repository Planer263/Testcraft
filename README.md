# Wildblock: Multiplayer Unbound — Preview 1

This update builds on Fleece & Fields and Glow & Ember. It retains farming,
lighting, water, 3D block icons, Chromebook presets, the editor and model studio.
Extract the ZIP; index.html stays at the root for GitHub Pages or local play.
No Python, JAR or build step. Upload the extracted contents, not the ZIP, to
GitHub Pages. Keep peer-config.js and the two unbound JavaScript modules beside
index.html. Publish your branch's /(root). All players need this exact build.

## Player accounts (portable identities, NOT cloud/email accounts)
Open Survivors / Co-op (F8). Create an account with a name and a unique passphrase
of at least 10 characters. Unlock a saved account after reopening the page.
Your ID is a fingerprint of an ECDSA P-256 public key, NOT your display name.
Changing the name does not change the ID or select somebody else's inventory.
Hosts verify possession with signed, expiring per-connection challenges. Guests
also verify the host's challenge signature and pin the host ID for a known world.
This is first-use trust, not an external certificate/account authority.

The private signing key is encrypted with AES-256-GCM using a salted PBKDF2
SHA-256 password-derived key (310,000 iterations). The vault is stored locally;
the unlocked signing key is imported non-extractable and held in memory. The
passphrase/private key is never sent to peers. These Web Crypto primitives are
not a claim of independently audited account-system security.

Export encrypted account backup downloads your identity file. Import that file
and unlock with the SAME passphrase on another browser/device to use that ID.
Never send your account backup/passphrase to another player. One signed account
may be online only once per room. There is no email signup, global username
reservation, cloud inventory, password reset or automatic cross-device sync.
If site data is cleared without a backup, or the passphrase is lost, identity
recovery may be impossible. A short name alone cannot recover the old key.

## Where inventories stay
Each HOST WORLD retains its own inventory record keyed to your stable account ID.
Rejoining that same saved world as the same account resumes its personal slots,
equipment, carried stack and progression. Different worlds have separate items.
The host must keep/restore the world save. Your account file is an identity
backup, NOT a world/inventory backup. Export BOTH account and host-world backups.

New accounts do not silently claim name-only legacy records. For your current
local survivor, check the explicit local-migration checkbox when creating an
account. A host can approve a legacy-to-verified-account transfer in the co-op
panel, after backing up the world; the destination must be empty. Check the
fingerprint with the intended friend. Transfers remove the old record.

## Safer shared inventories / persistence
Shared actions carry per-account sequence numbers and request IDs. The host
tracks sequence/revision metadata and a bounded recent-receipt cache in saves.
Repeating a committed action resynchronizes its result instead of withdrawing
again. Old poses cannot overwrite a newer shared-action inventory revision.
Timed-out requests retry the SAME request/sequence, not a fresh withdrawal.
An unacknowledged action is checkpointed in sessionStorage and can be checked
after reconnect/reload. This is bounded retry/reconciliation, not universal
transactional/anti-cheat correctness for every possible gameplay edge case.

Host snapshots use IndexedDB with latest/previous records and roughly 10-second
autosaves, in addition to the existing local save/export system. Shared-action
acknowledgments wait for the snapshot attempt; failures are surfaced. Browser
quotas, power loss before commit and storage denial can still lose progress.
Recover latest browser host save is available in the co-op panel. Browser-local
storage is NOT a remote server backup. Export regularly; site origins/paths matter.

## Hosting / joining / recovery
Eight-character PeerJS room codes remain. The new namespace prevents mixing
protocols. Unlock accounts before Host/Join. Hosts remain responsible for the
world. Status shows connection phase, application ping and save health.
Unexpected guest disconnects retry up to three times (2/4/8-second delays).
Rejoin last room is available manually. Reconnection requires the SAME host
world/account; changed world or pinned-host identity is rejected rather than
replaying a pending inventory action into the wrong world. Signaling reconnect
is separate from reconnecting a lost game data connection.

Heartbeats detect stale connections. Slow world-state transmissions are
coalesced/skipped while a previous snapshot is in flight or the channel buffer
is high. This is not yet delta-based chunk networking or a dedicated server.

PeerJS SDK still loads on demand from its configured CDN. Public PeerServer
Cloud is the default signaling service; internet is required for Host/Join.
No TURN relay or backend is provisioned. You can configure compatible STUN/TURN
in peer-config.js, but static credentials are public. Restrictive networks can
still block direct connections. Public SDK/cloud availability is not guaranteed.
Single-player does not require these services; account cryptography needs a
supported secure context (HTTPS/localhost; local-file browser behavior varies).

## Camera / input fixes
Inventory acknowledgments preserve the local player's position, view angles,
velocity, grounded/flying state and current hotbar choice. Network-driven
container closures pause instead of trying to capture the mouse automatically.
Pointer-lock transitions and focus loss reset stale drag/key input. Mouse spikes
are filtered/clamped; dragging uses local cursor deltas. Text entry does not
move the camera. Remote player display positions/angles are interpolated while
large teleports snap. This does not add predictive movement or smooth every mob.

## Security / scope limits
Signed identity prevents joining as another account merely by copying a name/ID.
It does NOT make a peer-hosted static client an authoritative, cheat-proof server.
Clients still report personal crafting/combat/movement state; hosts control the
world and can edit saves. No secure public-server moderation, central ban/account
service, dedicated hosting, always-on server or host migration is implemented.
The host tab must remain open/awake; background browser throttling still matters.
First-time host trust and arbitrary site-script/XSS risks are not eliminated.

This is Preview 1, not an assurance that every camera/network bug is fixed or
that the whole Minecraft-like roadmap is complete. See docs/UNBOUND-TESTS.json
for tests actually performed and explicit public-service test limitations.

Asset notices remain in licenses/. Review rights before public redistribution.
