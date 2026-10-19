---
title: 'TrueNAS'
description: ''
date: 2024-09-16
updated: 2026-06-05
section: homelab
category: storage
tags: [homelab, truenas, zfs]
icon: i-simple-icons-truenas
order: 2
---

Puddle is my NAS, running **TrueNAS SCALE** on a **45HomeLab HL15** with 256 GB
of RAM. It serves ZFS-backed NFS to the Kubernetes cluster (`puddle.outsideour.casa`).

## Pools

```sh
💾 Puddle                          # TrueNAS SCALE · 45HomeLab HL15 · 256 GB RAM
📦 boot-pool                       # single
└── 💿 1 TB Kingston NV3 NVMe
📦 puddle
├── 🗄️ data (raidz2-0)            # 6-wide RAIDZ2
│   ├── 💿 4 × 12 TB Seagate IronWolf
│   └── 💿 2 × 12 TB Seagate Exos 7E8
├── ⚡ cache (L2ARC)
│   └── 💿 2 × 1.92 TB Samsung PM9A3 NVMe
└── 🔁 spare
    └── 💿 1 × 12 TB Seagate IronWolf
🧊 unassigned
└── 💿 750 GB Intel Optane NVMe    # future SLOG
```

::note
The 750 GB Intel Optane drive is installed but currently unassigned — earmarked
for a future SLOG / special vdev.
::
