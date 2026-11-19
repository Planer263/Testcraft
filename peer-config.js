// PeerJS loads only when Host/Join is used; single-player has no network dependency.
// Defaults use PeerJS Cloud for signaling. To self-host later, set peerOptions.host,
// peerOptions.port, peerOptions.path and peerOptions.secure below.
window.WILDBLOCK_PEER_CONFIG = {
  prefix: 'wildblock-hc3-',
  sdkUrl: 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.5/peerjs.min.js',
  peerOptions: {secure: true, debug: 0},
  connectTimeoutMs: 30000
};
