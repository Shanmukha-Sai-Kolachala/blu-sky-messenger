# blu sky release guide

This workspace contains a professional front-end/PWA preview for `blu sky` version `0.1.0`.

## What is built now

- Immediate chat simulation with business conversations.
- Photo, video, and document sharing previews using browser file APIs.
- Video-call surface using `getUserMedia` for local camera preview.
- Business tools: smart replies, broadcast, secure vault, agent handoff, release checklist.
- PWA files: `manifest.webmanifest`, `sw.js`, and app icon.
- Local Node server in `server.js`.

## Important production note

An app with WhatsApp-like scale and "unlimited people" cannot be achieved with only front-end code. For a real business launch you need:

- Backend API: Node/NestJS, Go, Java, or Elixir.
- Realtime messaging: WebSocket, MQTT, or managed services such as Firebase, Supabase Realtime, Ably, or AWS AppSync.
- Database: PostgreSQL for business data plus Redis for presence and queues.
- Media storage: Cloudflare R2, Firebase Storage, Supabase Storage, AWS S3, or Google Cloud Storage.
- Video calling: WebRTC with an SFU such as LiveKit, mediasoup, Twilio, Agora, or Daily.
- Security: authentication, abuse prevention, encryption strategy, moderation, audit logs, backups, and privacy policies.
- Infrastructure: autoscaling, CDN, observability, incident response, rate limits, and legal compliance.

## Run locally

```powershell
node server.js
```

Open:

```text
http://localhost:4173
```

## Free deployment options

For the current static preview, use one of these free or free-tier hosts:

- GitHub Pages: good for a public marketing/demo preview.
- Netlify: easy drag-and-drop or Git-based static deploy.
- Vercel: good Git-based frontend deployments.
- Firebase Hosting: good if you later use Firebase Auth, Firestore, Storage, and Cloud Messaging.
- Cloudflare Pages: strong CDN and generous static hosting.

Recommended first deployment for this version: Netlify or Cloudflare Pages. Upload the project folder or connect a Git repository. Build command is empty. Publish directory is the project root.

## Android version path

Fastest route for this PWA preview:

1. Deploy the web app to HTTPS.
2. Use Bubblewrap or PWABuilder to create a Trusted Web Activity Android project.
3. Generate a signed Android App Bundle (`.aab`).
4. Upload the `.aab` in Google Play Console.

More native route:

1. Build a React Native or Flutter app.
2. Connect it to the same production backend.
3. Use Firebase Cloud Messaging for push notifications.
4. Use WebRTC SDKs for calls.
5. Upload the signed Android App Bundle to Google Play.

## Desktop version path

Fastest route:

1. Package this web app with Electron or Tauri.
2. Add native notifications, tray icon, auto-update, and deep links.
3. Build installers for Windows, macOS, and Linux.

Production business route:

1. Use Tauri for smaller installers or Electron for broader ecosystem support.
2. Share a common API contract with Android and Web.
3. Add enterprise SSO, device management, encrypted local storage, and update channels.

## Google Play Store release checklist

1. Create a Google Play Developer account.
2. Reserve the package name, for example `com.blusky.messenger`.
3. Prepare app icon, feature graphic, screenshots, privacy policy URL, and support email.
4. Complete Data Safety accurately: messages, contacts, media, device identifiers, diagnostics, and account data.
5. Add Terms of Service and Privacy Policy before public release.
6. Build and sign an Android App Bundle (`.aab`).
7. Create internal testing release first.
8. Fix Play Console warnings and policy issues.
9. Promote to closed testing, open testing, then production.
10. Monitor crash reports, reviews, retention, abuse, spam, and server costs.

## Monetization ideas

- Business subscriptions by seats and message volume.
- Paid verified business profiles.
- Premium broadcast/campaign tools.
- Secure storage add-ons.
- Contact center features for support teams.
- API access for enterprise integrations.
