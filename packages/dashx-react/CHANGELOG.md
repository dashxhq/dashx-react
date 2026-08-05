# Changelog

All notable changes to `@dashx/react` are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [0.4.1] — 2026-08-05

### Changed

- **`useInAppChatNotifications`'s `onActivate` now receives the message that raised the notification.**

  ```diff
  - onActivate?: () => void
  + onActivate?: (message: InAppChatMessageData) => void
  ```

  Notifications are tagged per conversation, so a surface watching more than one thread could raise several at once — but the old zero-argument callback gave the handler no way to tell them apart, and it closed over whichever message arrived last. Clicking an older notification opened the wrong conversation.

  **Backward compatible.** A `() => void` handler is still assignable and still behaves as before; take the parameter only if you need to route by `message.conversationId`. `InAppChatMessageData` is imported from `@dashx/browser`, same as the existing `renderBody` option on this hook.

## [0.4.0] — 2026-07-29

### Changed

- **BREAKING — In-App Chat no longer creates conversations; the caller supplies one.** `useInAppChat` and both widgets participate in an EXISTING conversation:

  ```diff
  - useInAppChat({ identityId, idempotencyKey, initialMessage? })
  + useInAppChat({ identityId, conversationId })
  ```

  `idempotencyKey` and `initialMessage` are gone, along with the create-on-mount behaviour. `<InAppChat>` and `<InAppChatButton>` take a required `conversationId` prop in place of `idempotencyKey`/`initialMessage`.

  **Why.** Creating a chat is now server-only in DashX: identity-token callers are rejected outright, and the operation requires an `accountUid` naming the visitor — a claim no browser should be able to make. The conversation's `data`/`issueProperties` are metadata the agent console trusts, so they must be derived server-side. `@dashx/browser@0.10.0` therefore removes `startInAppChatConversation`, which is what this hook used.

  **Migration.** Create the conversation in your backend (for JVM services, `dashx-java` ≥ 1.5.0 exposes `DashX.startInAppChatConversation(input)`), return the id to your client, and pass it in:

  ```tsx
  const { conversationId } = useMyBackendChatSession(); // your endpoint
  <InAppChatButton identityId="<chat-identity-id>" conversationId={conversationId} />
  ```

  `conversationId` accepts `null` while you're still fetching it — the hook stays idle (no subscription, no history fetch) rather than guessing, so you can render the widget unconditionally.
- **`conversationId` is no longer returned from the hook.** The caller now owns it, so echoing it back was noise. Everything else in the response is unchanged: `messages`, `isLoading`, `isConnected`, `error`, `sendMessage`.
- `sendMessage(text)` returns `false` when there is no `conversationId` yet (or the hook is disabled) — same contract as before, so callers that keep the composer populated on `false` need no change.
- **`@dashx/browser` dependency raised to `^0.10.0`** (a regular `dependencies` entry, as before), which is the release that removes the creation method.

### Unchanged

- History fetch, realtime subscribe, optimistic send + reconciliation, reconnect refetch, and the notification hook all behave exactly as before. `<InAppChatButton>` still activates lazily on first open, so a launcher the visitor never opens does no chat work.

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
