# Hearth & Company — Pages Preview 2

This release prepares the supplied Survival Co-op Alpha for static hosting.
The downloadable ZIP has a real root-level `index.html`, not an enclosing folder.

## Deployment
Relative library/editor links, `.nojekyll`, SVG favicon and updated app metadata.
The lightweight deployment archive omits redundant raw assets; the complete
source archive includes them. Both include the playable application and studio.

## Small reliability fixes
Hosted saves now use a repository-path namespace. Legacy hosted/browser-local
saves must be exported/imported as described in README.md. Local-file save keys
are unchanged. Added validation for pasted WebRTC offer/answer types and length,
a new same-build handshake ID, and a clearer secure-context compatibility error.
Shared timers also tick during host death instead of stopping completely. The
status indicator now identifies Solo, Hosting or Guest.

## No unsupported completion claim
Trusted-peer alpha limitations remain. See README.md and the original survival
notes. This is not an authoritative public server or all twelve roadmap updates.
Nothing has been deployed to a remote GitHub repository by this packaging task.
