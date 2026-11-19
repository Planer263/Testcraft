# Short-code Rooms — PeerJS 3

Replaces manual offer/answer exchanges with custom eight-character host IDs,
prefixed internally with wildblock-hc3-. PeerJS Cloud handles signaling by
default; the host browser still runs the world. The pinned PeerJS 1.5.5 SDK
loads on demand from CDN only when Host/Join is used.

Includes custom/random codes, collision checks/retries, capacity/version checks,
join timeout, readable errors, copy button, signaling reconnect and cleanup.
The code is an address, not an authentication secret. This is still trusted-peer
co-op; no secure accounts, automatic world reconnect or guaranteed NAT traversal.
Game/world/save systems remain from the Pages build. Public service operation
has to be tested from the published site; local test details are in docs/.
