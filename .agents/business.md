Build a simple, ultra-clear web-based queue management PWA for small Indonesian businesses such as barbershops, chicken vendors, clinics, laundries, and workshops.

The design philosophy:
- dead simple
- large readable UI
- low-tech friendly
- optimized for cheap Android phones
- usable by older users
- fast and minimal
- almost “digital signage” aesthetic
- clarity over beauty

STYLE:
- modern but extremely minimal
- high contrast
- large typography
- rounded corners
- soft neutral colors
- no gradients
- no glassmorphism
- no crypto/startup aesthetic
- avoid clutter
- touch-friendly
- kiosk-friendly
- responsive mobile-first

Use:
- Tailwind-style spacing
- Inter font
- large buttons
- card-based layout
- subtle shadows only

Create these pages/screens:

==================================================
1. PUBLIC DISPLAY SCREEN (TV/KIOSK MODE)
==================================================

Purpose:
Displayed on TV/tablet visible to customers.

Layout:
- business name at top
- huge current queue number centered
- small “Now Serving” label
- waiting count
- large QR code area for taking queue
- estimated waiting time
- bottom status ticker/info text

Example content:
NOW SERVING
A-12

Waiting:
8 people

Scan QR to take queue

Design requirements:
- queue number must dominate screen
- readable from distance
- fullscreen friendly
- landscape optimized
- auto-refresh feel

==================================================
2. CUSTOMER TAKE QUEUE SCREEN
==================================================

Purpose:
Customer scans QR and takes number.

Layout:
- business name
- current queue status
- one huge primary button:
  “Take Queue Number”
- after click:
  show generated queue number large
- estimated wait time
- optional browser notification toggle

Important:
- maximum 1 action per screen
- extremely easy for non-tech users

==================================================
3. ADMIN SCREEN
==================================================

Purpose:
Used by barber/vendor/cashier.

Layout:
- current queue number card
- large primary button:
  “Next Queue”
- secondary buttons:
  Skip
  Recall
  Reset Today

Below:
- simple waiting list
- compact stats today

Design requirements:
- usable with one hand
- big buttons
- fast interaction
- no complex dashboard

==================================================
4. MOBILE PWA EXPERIENCE
==================================================

Requirements:
- bottom sticky action buttons
- installable PWA feel
- offline-friendly indicators
- simple loading states
- skeleton loaders
- responsive for low-end Android devices

==================================================
5. DESIGN SYSTEM
==================================================

Include:
- color palette
- typography scale
- spacing system
- button variants
- queue status colors
- card components
- notification/toast examples

Status colors:
- green = active/current
- yellow = waiting
- red = skipped/missed
- gray = completed

==================================================
UX PRINCIPLES
==================================================

- no login screen
- no complicated forms
- no analytics-heavy UI
- no unnecessary animations
- no tiny text
- no hidden actions
- every important action visible immediately
- must feel instant and lightweight

Target users:
- Indonesian MSMEs
- street food vendors
- barbershops
- clinics
- workshops
- traditional businesses transitioning to digital

The result should feel practical, reliable, and extremely easy to operate in real-world Indonesian environments.
