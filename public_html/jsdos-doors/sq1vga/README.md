# Space Quest I: The Sarien Encounter (VGA, 1991) JS-DOS Door

This directory contains the **JS-DOS Door** configuration for **Space Quest I: The Sarien Encounter (VGA Remake)** by Sierra On-Line.

## Setup

Place the extracted Space Quest I (VGA) game files directly into:

`public_html/jsdos-doors/sq1vga/assets/`

Do not place the files in a nested subdirectory under `assets/`; the manifest expects the game files to exist directly in that folder.

For gameplay, the assets directory should contain:

- `SCIDHUV.EXE` (Sierra SCI interpreter)
- `RESOURCE.*` and `*.DRV` driver files
- `INSTALL.EXE` (Hardware configuration utility)

## Modes

- **Play Mode**: Launches `SCIDHUV.EXE` in VGA mode with Sound Blaster audio. Saves are persisted per user (`SQ1SG.*`, `RESOURCE.CFG`).
- **Admin Setup Mode**: Launches `INSTALL.EXE` allowing the sysop to adjust audio/video drivers and save a shared `RESOURCE.CFG` for all players.

## Source

Available on the Internet Archive:
<https://archive.org/details/msdos_Space_Quest_I_-_The_Sarien_Encounter_VGA_1991>
