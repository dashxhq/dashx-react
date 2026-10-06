# @dashx/react

_DashX SDK for React, built on [`@dashx/browser`](https://www.npmjs.com/package/@dashx/browser)._

## Install

```sh
npm install @dashx/react @dashx/browser
```

## Usage

Wrap your app in `DashXProvider`, then reach the client with `useDashXProvider()`:

```tsx
import { DashXProvider, useDashXProvider } from '@dashx/react'

function App() {
  return (
    <DashXProvider publicKey="YOUR_PUBLIC_KEY" targetEnvironment="production">
      <Checkout />
    </DashXProvider>
  )
}

function Checkout() {
  const dashx = useDashXProvider()

  return <button onClick={() => dashx.track('Clicked Buy')}>Buy</button>
}
```

`DashXProvider` accepts every `@dashx/browser` client option as a prop, plus `identityUid` / `identityToken` for the visitor's identity and `initializeWebSocketOnLoad` / `webSocketQueryParams` for the realtime connection.

### Autocapture

Pass `autocapture` to record a `$pageview` on load and on every client-side navigation, and a `$pageleave` when the visitor moves on. Route changes are picked up from the browser's History API, so it works with any router and needs no router integration.

```tsx
<DashXProvider publicKey="..." targetEnvironment="production" autocapture>
```

Pass `autocapture={{ pageleave: false }}` (or `pageviews: false`) to turn either event off. Autocapture starts when the provider mounts and stops when it unmounts, so React StrictMode's double mount does not record a page twice.

Events carry the page, a session id and the landing page's UTM campaign. See the `@dashx/browser` README for what each event contains.

### Privacy

```tsx
<DashXProvider
  publicKey="..."
  targetEnvironment="production"
  autocapture
  // Replaces ad-click ids (gclid, fbclid, msclkid and similar) in captured URLs and referrers with `<masked>`.
  maskPersonalDataProperties
  // Masks these query parameters too; only applies with maskPersonalDataProperties.
  customPersonalDataProperties={['token', 'email']}
  // Runs on every event, autocaptured or from track(), before it is sent. Return null to drop it.
  beforeSend={(event) => (event.event === '$pageleave' ? null : event)}
>
```

- `beforeSend` also takes an array of functions, run in order. The first to return `null` drops the event, and a function that throws drops it too.
- `beforeSend` is read on every event, so an inline function or a changed array takes effect without re-creating the client.
- Changing `maskPersonalDataProperties` or `customPersonalDataProperties` re-creates the client.
