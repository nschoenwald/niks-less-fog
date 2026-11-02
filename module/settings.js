import { MODULE_ID } from './lib.js';
import { applyFogOpacity } from './fog.js';

export const settings = {};

/**
 * Re-evaluate token vision after GM Vision changes, mirroring how core reacts to a Scene's tokenVision changing.
 * Token vision sources must be rebuilt so a controlled token stops (or starts) restricting what the GM sees.
 */
function refreshTokenVision() {
    if (!canvas.ready || !game.user.isGM) return;
    canvas.perception.initialize();
    for (const token of canvas.tokens.placeables) token.initializeVisionSource();
}
export const registerSettings = function () {
    /**
     * Option to set fog opacity for the GM.
     */
    game.settings.register(MODULE_ID, "fog_opacity", {
        name: "niks-less-fog.settings.fogOpacity.name",
        hint: "niks-less-fog.settings.fogOpacity.hint",
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
        name: "niks-less-fog.settings.revealTokens.name",
        hint: "niks-less-fog.settings.revealTokens.hint",
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
        name: "niks-less-fog.settings.affectAll.name",
        hint: "niks-less-fog.settings.affectAll.hint",
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
        name: "niks-less-fog.settings.gmVisionButton.name",
        hint: "niks-less-fog.settings.gmVisionButton.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: value => {
            settings.gmVisionButton = value;
            ui.controls?.render({ reset: true });
            refreshTokenVision();
        }
    });
    /**
     * Hidden option used by GM vision button
     */
    game.settings.register(MODULE_ID, "showAllToGM", {
        name: "niks-less-fog.settings.showAllToGM.name",
        scope: "client",
        config: false,
        default: false,
        type: Boolean,
        onChange: value => {
            settings.showAllToGM = value;
            refreshTokenVision();
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
