# Wubby's World · Graphics Production Standard

**Status:** APPROVED / LOCKED  
**Established:** 29 October 2026  
**Scope:** All new terrain, vegetation, props, structures, and other illustrated game graphics.

> **Core rule:** Terrain is built from approved modular ground tiles. Objects are independent, genuinely transparent image sprites. Never change a working rendering method merely to accommodate a new illustration.

## 1. Terrain: preserve the approved system

- Follow [TERRAIN_ART_STANDARD.md](TERRAIN_ART_STANDARD.md), the authoritative specification for ground materials.
- Keep the **112 × 57 isometric diamond grid**, game-owned tile shape, individual per-tile clipping, and deterministic per-coordinate crop.
- Create each new material in the approved **isometric diamond source-art format**. Ground images provide texture, **not** a painted platform, rim, or separate island.
- Keep the established detail scale (normally **620 source pixels across one 112-pixel tile**). Only the material image changes; do not replace the terrain renderer.
- Keep different base materials as separate types (grass, forest floor, sand, etc.). Preserve approved pond connections and shoreline geometry unless a change is specifically requested.

## 2. Objects: independent transparent sprites

- Trees, bushes, rocks, buildings, characters, and props must be **standalone illustrations** separate from the terrain.
- Create the art specifically as a transparent object; do not generate a complete scenery illustration and then cut objects out of it.
- Require **real RGBA transparency**, not a painted solid background, a faux checkerboard, or a colour-keyed cutout. A request for transparency is **not proof** the file has it.
- Examine the actual alpha channel and semi-transparent edge pixels. Reject images with white/grey halos, rectangular remnants, unwanted ground patches, or amputated foliage and roots.
- Keep source PNGs (or an equivalent lossless master); packing verified sprites into a transparent atlas for efficient loading is allowed **after** validation.
- Place, scale, and layer sprites with game code. Code-drawn shapes are permissible for temporary prototypes, **not** final illustrated assets.

## 3. Required validation and approval

1. **Classify** the asset as terrain or object before making it.
2. **Produce** one strong representative illustration, then a small set of consistent variations when needed.
3. **Verify source pixels**: check real transparency for objects and the correct source-tile geometry for terrain.
4. **Inspect on contrasting backgrounds**, including light, dark, and the actual in-game ground. Zoom in on foliage, roots, and all edges.
5. **Test in a separate playable study** at real game scale, both mobile and desktop; check crop, readability, overlap, density, and tile joins.
6. **Review with the user**. A good isolated picture is not automatically an approved in-game asset.
7. **Promote only approved art** into the main game, preserving existing mechanics, rendering, and saves. Keep the previous approved version available for rollback.

## 4. Approved working references

- **Terrain implementation:** `grass-individual-tiles.html` and [TERRAIN_ART_STANDARD.md](TERRAIN_ART_STANDARD.md).
- **Modular forest study:** `forest-modular-study.html`. Pines and birches use separate tile types; tree numbers vary (2–3 sparse, 3–5 medium, 5–7 dense). The source art uses verified alpha transparency.
- **Pond study:** `pond-modular-grass-v2.html`. Preserve the approved modular water and bank behavior.

**Do not redo approved methods from scratch.** For every future graphic, identify its category, reuse the corresponding working pipeline, validate the result, and only then integrate it.
