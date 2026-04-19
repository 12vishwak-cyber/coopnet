

The user has shared the **CoopNet vision document** describing the entire platform philosophy. They're on `/customer` right now. Reading this as context-setting, I should audit the current customer interface against the stated principles and propose targeted refinements that bring it closer to the "Zepto-quality, cooperative-underneath" goal.

Let me check the current state of key customer screens to identify gaps.
<lov-tool-use id="toolu_vrtx_01HL96vL9fdc9XSf6ubekN6g" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerOrders.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01CekcFZ4bSd4NpYTi2oQYtD" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerNetwork.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01RqH1wtWEZeiYYeK8uMLvtk" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerExplore.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_011Suj9gDXBn3fRqPP8oCC4g" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerOrders.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01HgAcfjgXnKEJQT9uRyN936" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerNetwork.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_017LGidNahUZs8Ni5yi7JKd9" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerExplore.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01BQZVtt3R75T4frDHq1gGKY" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/customer/CustomerProfile.tsx\"}">
</lov-tool-use>
<lov-plan>

## Goal
Tighten the customer-facing experience so it reads as a polished Zepto/Blinkit-style quick commerce app — pushing cooperative/governance UI deeper, sharpening the shopping flow, and removing dashboard-y elements from primary screens.

## Current gaps vs the brief
1. **Orders page** uses emoji thumbnails, looks static. No live ETA progress bar on active order.
2. **Impact tab (CustomerNetwork)** is full of governance metrics, rule tables, and proposals upfront — feels like a dashboard.
3. **Profile** leads with Node ID, fund stats, governance progress — system-first, not user-first.
4. **Explore** search input is non-functional; no "results" feedback.
5. **Home** could use stronger urgency cues (timer on offers, "selling fast" microcopy) and a "Recommended for you" behavioral row.
6. No global discoverability of active promo codes (mentioned previously but not surfaced).

## Proposed changes

### A. Orders (`CustomerOrders.tsx`)
- Replace emoji with real product/store images.
- Active order: large card with animated progress bar, ETA countdown ("Arriving in 8 mins"), 3-step mini-status (Packed → Out → Delivered).
- Past orders: compact rows with "Reorder" button (re-adds items to cart via context).

### B. Impact / Community (`CustomerNetwork.tsx`)
- Rename header to **"Your Impact"**, drop "Network rules" table from default view.
- Default view = emotional hero card: "You supported 4 local sellers ❤️" + 3 friendly stat cards (workers earned, fund contributed, orders).
- Move proposals + rules into a single "Cooperative" sub-tab (de-emphasized, smaller text).
- Activity feed simplified to user-relevant events only (their orders, their fund contributions).

### C. Profile (`CustomerProfile.tsx`)
- Lead with avatar + name + friendly greeting, hide Node ID into a small chip.
- Stat row stays (Orders / Saved / Rating) but rename "Fund" → "Saved".
- Move governance progress into a collapsible "Membership" card lower on the page.
- Keep Support + Settings tabs; surface Logout more clearly.

### D. Explore (`CustomerExplore.tsx`)
- Make search input controlled; filter `products` live by name/seller.
- Add empty state when no matches.
- Add "X results" microcopy.

### E. Home (`CustomerHome.tsx`)
- Add small "selling fast 🔥" / "only X left" microcopy on 1–2 trending cards (static, for vibe).
- Add a thin promo-code banner above categories: "Use WELCOME10 for 10% off →" linking to cart.
- Add a "Recommended for you" row (reuses PRODUCTS, shuffled subset) for behavioral depth.

### F. Layout polish (`CustomerLayout.tsx`)
- No structural changes; minor: ensure header location is tappable to a simple address sheet (out of scope unless trivial — will skip if it grows).

## Files to edit
- `src/pages/customer/CustomerOrders.tsx` — visual rewrite + reorder action
- `src/pages/customer/CustomerNetwork.tsx` — emotional-first restructure
- `src/pages/customer/CustomerProfile.tsx` — soften system framing
- `src/pages/customer/CustomerExplore.tsx` — working search + empty state
- `src/pages/customer/CustomerHome.tsx` — promo banner row + recommended section + urgency microcopy
- `src/contexts/CartContext.tsx` — add `addItems(items[])` helper for Reorder (small addition)

## Out of scope
- Real maps (kept as SVG in tracking page)
- Backend integration / auth changes
- Seller, Worker, Network admin screens (untouched)

