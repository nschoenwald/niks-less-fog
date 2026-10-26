import { MODULE_ID } from './lib.js';
import { applyFogOpacity } from './fog.js';

export const settings = {};
export const registerSettings = function () {
    /**
     * Option to set fog opacity for the GM.
     */
    game.settings.register(MODULE_ID, "fog_opacity", {
        name: "Fog Opacity",
        hint: "Opacity of fog layer. By default only for GMs (0 to 1 where 0 is fully transparent and 1 is fully opaque). Less Fog module default is 0.75. Value without this module is 1.0.",
        scope: "world",
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.75,
        config: true,
        onChange: s => {
            settings.fog_opacity = s;
            applyFogOpacity();
        }
    });
    /**
     * Option to reveal tokens to the GM.
     */
    game.settings.register(MODULE_ID, "reveal_tokens", {
        name: "Reveal Tokens",
        hint: "Reveal all tokens on the canvas to the GM at all times.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => {
            settings.reveal_tokens = s;
            canvas.perception.update({ refreshVision: true });
        }
    });
    /**
     * Option to affect all players
     */
    game.settings.register(MODULE_ID, "affect_all", {
        name: "Reveal to All Players",
        hint: "Reveal Unexplored areas and tokens to all players (useful if you just want to know about line of sight).",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {
            settings.affect_all = s;
            applyFogOpacity();
            canvas.perception.update({ refreshVision: true });
        }
    });
    /**
     * Option to show the GM Vision button in the Token controls
     */
    game.settings.register(MODULE_ID, "gmVisionButton", {
        name: "GM Vision Button",
        hint: "Add a button to the Token controls that lets the GM toggle the fog of war on and off. Not available in the PF2e system, which provides its own button.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: value => {
            settings.gmVisionButton = value;
            ui.controls?.render({ reset: true });
            canvas.perception.update({ initializeVision: true });
        }
    });
    /**
     * Hidden option used by GM vision button
     */
    game.settings.register(MODULE_ID, "showAllToGM", {
        name: "Show All to GM",
        scope: "client",
        config: false,
        default: false,
        type: Boolean,
        onChange: value => {
            settings.showAllToGM = value;
            canvas.perception.update({ initializeVision: true });
        }
    });
}
export const loadSettings = function () {
    settings.fog_opacity = game.settings.get(MODULE_ID, "fog_opacity");
    settings.reveal_tokens = game.settings.get(MODULE_ID, "reveal_tokens");
    settings.affect_all = game.settings.get(MODULE_ID, "affect_all");
    settings.gmVisionButton = game.settings.get(MODULE_ID, "gmVisionButton");
    settings.showAllToGM = game.settings.get(MODULE_ID, "showAllToGM");
}
