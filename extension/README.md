# Rusted Warfare Mod Tools

Antigravity IDE / VS Code extension for Rusted Warfare unit `.ini` files.

## Included in 0.1.0

- Syntax highlighting for sections, keys, comments, booleans, numbers, variables, and values.
- Autocomplete for common unit keys and section names.
- Value completion for booleans and `movementType`.
- Snippets: `rw-unit`, `rw-weapon`, `rw-section`, and `rw-note`.
- Hover documentation with a short description and value type for supported keys.
- Expanded completion catalog for core, graphics, attack, movement, turret, projectile, action, effect, animation, transport, resource, and placement keys.
- Suggested values for `builtFrom_*_name`, `shoot_flame`, `shoot_sound`, `drawType`, and other enum-like properties.
- Projectile sprite-sheet previews for `drawType` 0, 1, and 2 in completion/hover documentation.
- Unit image preview on hover for `image`, `image_back`, `image_shadow`, and `image_wreak`, plus image-file autocomplete from the current workspace.
- Hover and completion documentation include examples extracted from the supplied Unit Modding Reference 1.16.
- Definitions are sourced from the PDF's Description column for the full catalog, including context-specific properties.
- Special values such as `AUTO`, `AUTO_ANIMATED`, and `NONE` are offered for the image/shadow keys where the reference allows them.
- The supplied 1.16 workbook is the primary catalog source and contributes approximately 900 documented code entries, descriptions, types, and examples.
- Autocomplete is section-aware: it filters keys by the active section, including named sections such as `[turret_main]`, `[projectile_shell]`, `[action_attack]`, `[effect_smoke]`, and `[animation_move]`.
- Diagnostics warn when a documented key is used under the wrong section. Repeated key names are allowed when the reference defines them in multiple sections.
- Compatibility exceptions include attack overrides inside `[turret_*]`, dynamic animation keys such as `body_0s`, and `turretImageScale` used by some game versions.
- Diagnostics also check required unit keys and basic boolean, integer, float, list-integer, and color value formats.
- Undocumented `turretImageScale` is highlighted with the documented replacement `scaleTurretImagesTo` in `[graphics]`.
- If `[attack] canAttack: false`, the other attack flags are treated as optional. Logic expressions such as `autoTrigger: if customTarget2 == nullUnit` are accepted.
- Reference checks warn when a referenced projectile, animation, or custom effect section is missing.
- `Rusted Warfare: Preview Unit Structure` opens a panel showing all sections and keys in the current unit file.
- Image and audio paths with file extensions are checked against the current mod workspace.

The catalog contains 344 property names extracted from the supplied Unit Modding Reference 1.16. Some properties are context-specific, so the extension labels their type as `see reference` rather than guessing a value type.
- `.ini` files are associated with the Rusted Warfare language mode.

## Install locally

1. Copy this folder to the Antigravity extensions directory, or use the IDE command to install an extension from a folder.
2. Restart Antigravity IDE.
3. Open a Rusted Warfare `.ini` file and choose **Rusted Warfare INI** if the language mode is not selected automatically.

The key list is based on *Rusted Warfare: Unit Modding Reference 1.16*. This is an initial curated set; more keys can be added without changing the extension architecture.
