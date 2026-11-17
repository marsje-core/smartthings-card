# Copilot instructions

## Project architecture

- This is a standalone Home Assistant Lovelace custom card. The shipped code is `smartthings-laundry-card.js`; there is no compile or bundle step. It registers the dashboard card and its companion dialog as custom elements.
- The card resolves the configured appliance, then `readAppliance()` builds a normalized snapshot of its entities and derived status. Entity IDs vary by installation, so matching is based on the configured device ID, supported integration platform (`smartthings` or `localthings`), and entity `translation_key`.
- The tile and dialog render from that snapshot. The dialog maps user actions to Home Assistant services: SmartThings operating-state selection, LocalThings buttons, and the relevant select/number/switch services for options.
- `dev/harness.html` supplies mocked Home Assistant state, entity, device, and service APIs for washer, dryer, and LocalThings examples. Keep these fixtures representative when changing entity discovery, rendering, or service behavior.
- `README.md` is the source for installation, configuration, integration limitations, and release workflow details. The release workflow calculates versions from `main` history and substitutes the version in the published JavaScript asset.

## Build, test, and lint

- There are no local build, lint, or automated test scripts configured.
- The GitHub Actions **Validate** workflow runs `hacs/action@main` to validate HACS plugin metadata on pushes, pull requests, scheduled runs, and manual dispatch. This is not a JavaScript test suite.
- For a focused manual UI check, serve the repository root and open the harness:

  ```sh
  python3 -m http.server 8765 --bind 127.0.0.1
  # Open http://127.0.0.1:8765/dev/harness.html
  ```

  On Windows, `py -m http.server 8765 --bind 127.0.0.1` can be used if `python3` is unavailable. Check an individual path by interacting with its harness card: `w` for a SmartThings washer, `d` for a SmartThings dryer, or `w2` for LocalThings. Service calls and the simulated remote-control failure are logged in the browser console.

## Repository-specific conventions

- Keep entity discovery independent of entity IDs. Add SmartThings role mappings to `ROLES`; preserve the integration/platform filter in `readAppliance()`. LocalThings cycle entities have variant translation keys and are recognized separately there.
- Keep presentation labels in all three `I18N` dictionaries (`en`, `it`, `nl`); language selection falls back to English. Washer and dryer option availability is driven by their separate `OPTION_TILES` lists and by which entities the device actually exposes.
- Keep appliance state interpretation and phase mappings centralized in `readAppliance()` and `PHASES`, rather than deriving status separately in the tile and dialog. Normalize integration-specific states before changing the UI.
- Service calls should use the entity’s actual domain and ID. Operation controls support either the SmartThings `select.operating_state` entity or LocalThings start/pause/stop buttons; option controls use Home Assistant select, number, or switch services.
- Dynamic text is interpolated into shadow-DOM HTML templates; pass names, states, labels, and option values through `esc()` before inserting them into markup.
