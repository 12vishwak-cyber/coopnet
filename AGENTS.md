# Architecture Decisions

- Seller and delivery-driver routes use one shared data and action layer, with desktop management views and dedicated phone operational views selected responsively; this preserves desktop capability while making mobile task-focused.
- Mobile Home network shortcuts reuse the sidebar's network navigation list in both operational and full-controls views; this keeps every system destination consistent across entry points.