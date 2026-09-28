# CoopNet Seller and Driver Mobile Experience

## Goal
Add purpose-built mobile interfaces for sellers and delivery drivers without removing, simplifying, or visually redesigning the existing desktop dashboards. Mobile and desktop will use the same routes, data, order state, inventory actions, earnings, chat, and backend operations.

## Responsive structure
- Keep the current desktop sidebar, header, page layouts, tables, analytics, and controls at desktop widths.
- Add a mobile application shell for `/seller/*` and `/worker/*` with a compact role-aware header and fixed bottom navigation.
- Seller mobile navigation: **Home, Orders, Products, Earnings, Profile**.
- Driver mobile navigation: **Home, Orders, Earnings, Profile**.
- Tablet layouts will remain responsive versions of the desktop screens; phone layouts will use dedicated operational views rather than compressed tables.
- Hide mobile navigation during driver Drive Mode so the map and essential delivery controls own the screen.

## Seller mobile experience

### Home
- Create a glanceable shop-operations view with store status, today’s sales and order count, orders needing action, low-stock alerts, and quick actions.
- Reuse current seller order and product data so actions remain synchronized with desktop.

### Orders
- Replace the table on mobile with concise order cards showing order number, customer, item count, value, preparation deadline, and status.
- Add an order-detail sheet/view with full items and progressive actions for accept/reject, prepare, ready for pickup, driver pickup, and completion according to allowed backend states.
- Keep customer chat directly accessible from the mobile order detail.
- Preserve the current desktop table unchanged.

### Products
- Replace the inventory table on mobile with searchable/filterable product rows containing image, name, price, stock, status, and availability control.
- Provide mobile actions for edit, stock update, price update, list upload, and add product.
- Retain the existing guided Add Product flow and market price recommendation, adapting its layout and controls for phone use without changing seller control over final pricing.

### Earnings and profile
- Present today/week/order/AOV summaries as compact mobile cards, with transaction and fee details available on tap.
- Link Profile to the existing profile/settings/support capabilities and preserve role identity and Node ID in the mobile header/profile.

## Delivery driver mobile experience

### Home / work mode
- Create an action-focused overview with online status, today’s earnings, completed deliveries, distance, working time, and the next available order.
- Show the full payout before acceptance: base pay, distance pay, route distance, ETA, and waiting-compensation rule.
- Wire accept/reject and active-delivery transitions to the existing order APIs/context rather than static task rows.

### Orders
- Replace the task table on mobile with available, active, and completed order cards.
- Open a focused order detail before acceptance and route accepted work into the active delivery flow.
- Preserve desktop task management and analytics.

### Drive Mode
- Expand the existing driver map into a true full-screen state, using the current real map implementation and live order coordinates where available.
- Support five clear stages: going to pickup, at pickup, going to customer, arrived, and completed.
- Show only destination, large ETA/distance, current position/route, and safe bottom controls: Navigation, Call, Order Details, plus the single stage-appropriate primary action.
- Use large touch targets, high contrast, minimal text, restrained motion, and no dashboard analytics or bottom navigation while driving.
- Show delivery earnings and a Next Order action after completion.

### Earnings and profile
- Convert summaries and history into mobile cards with drill-down details while keeping the desktop analytics table.
- Reuse the existing profile, support, governance, and settings flows through mobile-friendly navigation.

## Shared implementation details
- Add focused mobile shell/navigation components and small seller/driver mobile view components; desktop page markup remains available in parallel.
- Use semantic design tokens and existing Button, Sheet/Drawer, Switch, Badge, and other design-system components.
- Reuse `useIsMobile`, order hooks/context, `coopnet-api`, `LiveMap`, seller chat, pricing suggestions, and existing backend mutations. Eliminate synthetic driver data from actionable mobile states when live data exists; provide a clear empty state when it does not.
- Keep controls at least 44px high, prevent horizontal overflow, reserve bottom-safe-area space, and preserve dark mode.
- Record the dual-presentation architecture in `AGENTS.md` because it becomes a project-wide structural rule.

## Verification
- Test seller and driver routes at mobile, tablet, and desktop widths.
- Verify desktop sidebar dashboards and tables remain intact.
- Verify seller order actions, chat, inventory/add-product, market pricing, earnings, profile, and support on mobile.
- Verify driver availability, payout disclosure, accept/reject, pickup, Drive Mode stages, calls/navigation links, completion, and earnings.
- Check no horizontal scrolling, overlaps, tiny controls, duplicated actions, or mobile navigation over Drive Mode.
- Check the latest build/runtime diagnostics and run focused interaction tests in the live preview.
