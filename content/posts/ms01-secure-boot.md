---
title: 'Allowing Custom Secure Boot Keys on the Minisforum MS-01'
description: ''
sidebarTitle: 'MS-01 Secure Boot'
date: 2024-09-17
section: guides
category: guides
tags: [hardware, secure-boot]
icon: i-ph-key
order: 4
---

Product Link: https://store.minisforum.com/products/minisforum-ms-01

::warning
This requires a unreleased version (v1.23) of the Minisforum MS-01 Bios.
::

## Requirements
- A **32GB or Smaller** USB
- You'll need to disable secure boot in order to flash the bios.

## Steps
::steps
### Disable Secure Boot

Before flashing the bios, Minisforum requires us to disable Secure Boot. This can be accomplished by entering the bios and entering the Secure Boot tab.

- Change `Secure Boot Mode` to `Custom`.
- Change `Secure Boot` to `Disabled`.
- Save and Exit.

### Create Your USB

We need to flash a FAT32 filesystem to your USB drive.

**You will lose all the data on that USB drive**, so don't use one you care about.

After formatting your USB, copy the contents of the v1.25 bios update.

### Boot Your USB

*Kash got tired of writing this guide & he forgot the rest of the steps and is retracing his steps... Sorry!*
::
