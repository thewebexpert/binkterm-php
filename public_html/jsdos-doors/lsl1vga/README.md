# Leisure Suit Larry in the Land of the Lounge Lizards (VGA, 1991) JS-DOS Door

This directory contains the **JS-DOS Door** configuration for **Leisure Suit Larry in the Land of the Lounge Lizards (VGA Remake)** by Sierra On-Line.

## Setup

Place the extracted Leisure Suit Larry 1 (VGA) game files directly into:

`public_html/jsdos-doors/lsl1vga/assets/`

Do not place the files in a nested subdirectory under `assets/`; the manifest expects the game files to exist directly in that folder.

For gameplay, the assets directory should contain:

- `SCIDHUV.EXE` (Sierra SCI interpreter)
- `RESOURCE.*` and `*.DRV` driver files
- `INSTALL.EXE` (Hardware configuration utility)

## Modes

- **Play Mode**: Launches `SCIDHUV.EXE` in VGA mode with Sound Blaster / AdLib audio. Saves are persisted per user (`LSL1SG.*`, `*.SAV`, `RESOURCE.CFG`).
- **Admin Setup Mode**: Launches `INSTALL.EXE` allowing the sysop to adjust audio/video drivers and save a shared `RESOURCE.CFG` for all players.

## Source

Available on the Internet Archive:
<https://archive.org/details/msdos_Leisure_Suit_Larry_1_-_Land_of_the_Lounge_Lizards_VGA_1991>
