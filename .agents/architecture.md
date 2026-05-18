# Arsitektur paling masuk akal v1

```text
Browser (PWA)
    ↓
Cloud Run API
    ↓
Postgres
```

Realtime:

```text
SSE/WebSocket
```

DONE.

---

# Stack yang gw pilih

## Frontend

* Next.js
* PWA enabled
* Tailwind
* Zustand

---

# Backend

## Bun 

Framework:

* Hono

# Database

## Postgres

Schema sederhana:

```sql
shops
queues
tickets
events
```
---

# Realtime terbaik buat kasus ini

## SSE > WebSocket

Karena:

* infra lebih simpel
* cocok one-way update
* lebih stabil di mobile Indo
* reconnect gampang
* Cloud Run lebih happy

Use case:

* nomor berubah
* broadcast update

itu perfect buat SSE.

WebSocket baru kepake kalau:

* chat
* bidirectional realtime
* multiplayer-level interaction

---

# Event architecture

Simple append-only event log.

Contoh:

```text
QUEUE_CREATED
TICKET_CREATED
TICKET_CALLED
TICKET_SKIPPED
QUEUE_RESET
```

Store semua event.

Lalu derive current state.

Tapi jangan full event sourcing purist.

Hybrid aja:

* current_state table
* event_log table

---

# Multi-device sync

Admin:

* buka dashboard

TV display:

* subscribe SSE

Customer:

* polling ringan / SSE

---

# Offline strategy

Ini penting banget.

## PWA + IndexedDB

Flow:

* cache last queue
* queue action locally
* sync saat online balik

Jangan bikin full offline distributed sync dulu.
Neraka.

---

# Deployment

## Cloud Run

Perfect buat ini.

Karena:

* scale to zero
* murah
* gampang CI/CD
* websocket/SSE supported

Container:

```dockerfile
FROM oven/bun
```

---

# Yang sering dilupakan

## Idempotency

Misal admin spam:

```text
NEXT NEXT NEXT
```

Harus aman.

Pakai:

* action id
* optimistic locking
* version column

---

# Data model simpel

```sql
shops
- id
- name

queues
- id
- shop_id
- current_number

tickets
- id
- queue_id
- number
- status

events
- id
- queue_id
- type
- payload
- created_at
```

---

# Fitur yang gw prioritaskan

## v1

* ambil antrean
* panggil berikutnya
* display publik
* QR join
* reset harian

## v2

* estimasi waktu
* notif WA
* multi counter

## v3

* booking
* analytics
* customer history

---


## Native app

PWA lebih cocok:

* no install
* share gampang
* low friction

---

# Tech stack final kalau gw pribadi

Frontend:

* React Next.js
* Tailwind
* Zustand

Backend:

* Bun
* Hono

DB:

* Postgres

Realtime:

* SSE

Infra:

* Cloud Run
* Cloud Build
* Artifact Registry
