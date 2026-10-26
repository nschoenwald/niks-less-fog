import { settings } from './settings.js';

/** The alpha filter currently applied to the visibility group, if any */
let fogFilter = null;

/**
 * Add, update or remove the alpha filter that makes the fog of war partially transparent.
 * Safe to call at any time; does nothing until the visibility group has been drawn.
 * @param {CanvasVisibility} [layer]    The visibility canvas group.
 */
export function applyFogOpacity(layer = canvas?.visibility) {
    if (!layer?.filters) return;
    const opacity = (game.user.isGM || settings.affect_all) ? settings.fog_opacity : 1;
    const attached = !!fogFilter && layer.filters.includes(fogFilter);

    // Fully opaque fog needs no filter
    if (opacity >= 1) {
        if (attached) layer.filters = layer.filters.filter(f => f !== fogFilter);
        fogFilter?.destroy();
        fogFilter = null;
        return;
    }

    // The visibility group resets its filters on every redraw, so re-attach when needed
    if (!attached) {
        fogFilter?.destroy();
        fogFilter = new PIXI.AlphaFilter(opacity);
        layer.filters = [...layer.filters, fogFilter];
    }
    fogFilter.alpha = opacity;
}
