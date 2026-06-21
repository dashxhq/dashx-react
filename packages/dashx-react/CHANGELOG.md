# Changelog

All notable changes to `@dashx/react` are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [0.3.0] — 2026-06-18

### Added

- **In-App Chat hook + widgets.** A two-way in-app chat surface for visitors:
  - `useInAppChat({ identityId, idempotencyKey, initialMessage? })` — manages the conversation lifecycle (start → subscribe → fetch history), exposes `messages`, `sendMessage(text)`, and loading/error state, and reconciles optimistic sends against the realtime echoes (deduping by message id and external uid). Refetches history on reconnect so a reply that landed during an outage isn't missed.
  - `<InAppChat>` — the chat surface (header / message list / composer).
  - `<InAppChatButton>` — a floating launcher that opens `<InAppChat>` in a popover. Props: `identityId`, `idempotencyKey`, `position` (`'bottom-right'` | `'bottom-left'` | `'top-right'` | `'top-left'`, default `'bottom-right'`), and `theme` (accent color, mode, roundness, …). The chat mounts lazily on open, so no conversation is created until the visitor opens the launcher.

  In-App Chat requires a visitor identity token configured on `DashXProvider` (see below); render the chat only once that token is available.

  Example — `<InAppChatButton>` with a `theme` override (all `ThemeProps` fields are optional and otherwise inherit from a surrounding `<Theme>` / `DashXProvider`):

  ```tsx
  <InAppChatButton
    identityId="<dashx-chat-identity-id>"
    idempotencyKey="main"
    position="bottom-right"
    theme={{
      accentBaseColor: '#6d28d9',
      mode: 'dark',
      roundness: 'large',
    }}
  />
  ```
- **`DashXProvider` identity props.** New optional `identityUid?` and `identityToken?`. When set, the identity is applied on both transports — the Apollo `X-Identity-Token` header and the WebSocket handshake — which is the visitor auth In-App Chat needs. Pass `null` to clear on logout; omit (`undefined`) to leave unchanged. Pair `identityUid` with `identityToken` to address the same identity on both transports.

### Changed

- **Bumped `@dashx/browser` to `^0.8.0`** — for the In-App Chat client methods, the `subscribeToChannel` helper, and the `setIdentity` "undefined = leave unchanged" semantics this provider relies on.
- **Identity is now applied synchronously at client creation**, and the provider reconnects its own WebSocket when `identityToken` changes (so tracked chat channels re-subscribe under the new identity). Existing consumers that pass neither `identityUid` nor `identityToken` are unaffected — no extra `setIdentity` call, no reconnect, and the client is not recreated.
