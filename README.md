# Samsung laundry card

Lovelace card for Samsung washers and dryers exposed by the Home Assistant SmartThings or LocalThings integration, including the `DA_WM_TP1_21_COMMON` washer. The dashboard shows a tile. A tap opens a more-info style dialog with the essential controls:

- remaining time, end time and cycle phases
- start, pause, resume and stop
- cycle selection
- the options of the selected cycle: temperature, spin, rinses, dry level, drying time, delay end, Bubble Soak, wrinkle prevent, Auto Cycle Link, dispense amounts
- detergent and softener levels

The card finds the entities of the device by `translation_key`, so it does not depend on entity IDs. LocalThings cycle actions use its start, pause, and stop buttons; options are limited to entities exposed by the appliance. The accent color is the theme `--primary-color`.

If the same appliance is registered through both integrations, choose the LocalThings device in the card configuration to see its locally exposed options. Selecting the SmartThings device only shows its SmartThings entities.

![Washer and dryer tiles](https://raw.githubusercontent.com/CappyT/smartthings-card/main/images/tiles.png)

![Washer dialog](https://raw.githubusercontent.com/CappyT/smartthings-card/main/images/dialog.png)

## Install

### HACS

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=CappyT&repository=smartthings-card&category=plugin)

1. Open the link above, or search "SmartThings laundry card" in HACS. If HACS does not find it, add `https://github.com/CappyT/smartthings-card` as a custom repository of type Dashboard.
2. Download the card. HACS adds the dashboard resource.

### Manual

1. Copy `smartthings-laundry-card.js` to `/config/www/smartthings-laundry-card/`.
2. Add a dashboard resource: URL `/local/smartthings-laundry-card/smartthings-laundry-card.js?v=<n>`, type JavaScript module. Increase `v` after each update to bypass the frontend cache.

## Configuration

```yaml
type: custom:smartthings-laundry-card
device_id: <device id of the washer or dryer>
name: Washer # optional
```

`entity: <any entity of the appliance>` can replace `device_id`.

## Development

`dev/harness.html` renders the card with a mocked `hass` object:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/dev/harness.html
```

## License

GNU Lesser General Public License v3.0 or later. See `COPYING.LESSER` and `COPYING`.
