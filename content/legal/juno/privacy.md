---
title: Juno Privacy Policy
description: What data Juno, a personal Discord bot, collects and how it is used.
updated: 2026-08-01
---

## What data Juno collects

**Presence data:** using the Presence and Server Members privileged Discord intents, Juno receives real-time status and activity updates (online status, activities, Spotify listening status) for one specific Discord user ID configured by the operator. This data is cached in memory only, is never written to disk, and is discarded on restart.

**Guild member events:** Juno receives standard guild member join/update/leave events, as required by the Server Members intent, but does not persist member data beyond what's needed to track the presence-tracked user.

**Voice state events:** Juno receives voice state updates to detect when a member joins the configured "hub" voice channel, so it can create a temporary voice channel and move that member into it.

**Temporary voice channel records:** the Discord channel IDs and empty-since timestamps of channels Juno creates are stored in an embedded SQLite database, so cleanup of empty channels survives restarts. A record is deleted once its channel is deleted.

Juno does not read, store, or process message content.

## How data is used

Presence data is served publicly via a REST endpoint (`GET /api/users/me`) and a WebSocket feed (`GET /api/socket`) — this is by design, as the presence feature is a public status feed rather than private data. Temporary voice channel records are used solely for channel lifecycle management and are not exposed via any API.

## Data sharing

Juno does not sell or share collected data with third parties. Data is only exchanged with Discord's API as necessary to provide the bot's features.

## Data retention & deletion

Presence data is kept in memory only and cleared on restart or when the tracked user's presence changes. Temporary voice channel records are deleted when their corresponding channel is deleted. To request removal of your data — for example, if you were moved into a temporary voice channel — contact us below.

## Changes

This policy may be updated; the "Last updated" date above reflects the most recent revision.

## Contact

[noc@ok8.sh](mailto:noc@ok8.sh)
