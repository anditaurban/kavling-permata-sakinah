# UI GUIDELINE — Permata Sakinah

## 1. Design Direction
Brand: Permata Sakinah
Visual personality:
- Modern property sales.
- Trustworthy.
- Clean.
- Warm but premium.
- Magenta sebagai brand accent.
- Hindari visual “AI-generated dashboard”: terlalu banyak gradient, glassmorphism, neon glow, floating cards, dan dekorasi tanpa fungsi.

## 2. Color System
Gunakan semantic tokens:
- Primary: Magenta brand.
- Primary-hover: darker magenta.
- Background: neutral warm/white.
- Surface: white.
- Text-primary: deep neutral.
- Text-secondary: muted neutral.
- Border: soft neutral.
- Success: green.
- Warning: amber.
- Danger: red.
- Info: blue.

Magenta harus menjadi accent utama, bukan memenuhi seluruh halaman.

## 3. Typography
- Gunakan font sans modern yang mudah dibaca.
- Heading: kuat, ringkas.
- Body: 14–16px.
- Caption/meta: 12–13px.
- Hindari terlalu banyak font weight.

## 4. Layout
Landing:
- Max width konsisten.
- Strong hero visual.
- Section spacing lega.
- CTA utama jelas.
- Card secukupnya.

Dashboard:
- Sidebar.
- Topbar.
- Content area.
- KPI cards maksimal seperlunya.
- Tables untuk data operasional.
- Drawer/modal hanya untuk task pendek.

POS:
- Dua area utama: inventory/project/kavling dan order summary.
- CTA confirm selalu mudah ditemukan.
- Gunakan sticky summary pada desktop jika membantu.

## 5. Components
Minimal reusable components:
- Button
- Input
- Select
- Search
- Badge
- Card
- Modal
- Drawer
- Table
- Pagination
- Tabs
- Dropdown
- Toast
- EmptyState
- LoadingState
- ErrorState
- ConfirmDialog
- StatusBadge
- PriceDisplay

## 6. Site-plan UI
Site-plan tidak perlu menjadi GIS.
Gunakan visual grid/vector-like sederhana:
- kavling tersedia: selectable.
- booked: warning/secondary.
- sold: muted/disabled.
- selected: magenta highlight.
Setiap kavling memiliki kode yang mudah dibaca.

## 7. Tables
- Sticky header bila diperlukan.
- Search/filter di atas.
- Jangan menampilkan terlalu banyak kolom.
- Mobile gunakan responsive card/list transformation.

## 8. Forms
- Label selalu terlihat.
- Helper/error text jelas.
- Validasi client-side dasar.
- Hindari multi-step form jika tidak diperlukan.

## 9. Responsive
Breakpoints mengikuti Tailwind defaults.
Prioritas:
1. Mobile landing.
2. Tablet.
3. Desktop.
Dashboard/POS:
- desktop optimized,
- tablet usable,
- mobile fallback yang tetap usable.

## 10. Accessibility
- Semantic HTML.
- Keyboard focus.
- Contrast memadai.
- Button bukan div.
- Form label terhubung.
- Status tidak hanya dibedakan oleh warna.

## 11. Anti AI-Slop Rules
Jangan gunakan:
- gradient berlebihan,
- glassmorphism sebagai default,
- glowing borders,
- huge rounded cards,
- excessive icons,
- fake analytics,
- meaningless charts,
- lorem ipsum,
- decorative 3D objects,
- excessive animations.

Gunakan hierarchy, whitespace, typography, dan data nyata sebagai visual utama.

## 12. Motion
- Subtle hover.
- Fast transitions.
- No constant floating animations.
- Motion harus mendukung feedback/navigasi.

## 13. Content
Gunakan Bahasa Indonesia untuk UI utama.
Gunakan nominal Rupiah yang realistis pada mock data.
Hindari lorem ipsum.
