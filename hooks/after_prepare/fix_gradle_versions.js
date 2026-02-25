#!/usr/bin/env node
/**
 * after_prepare hook – two fixes:
 *
 * 1) Pins appcompat to 1.6.1 (avoids AAPT2 resource compilation bug with 1.7.0)
 *    and upgrades AGP to 8.9.2 in cdv-gradle-config.json (Cordova regenerates
 *    this file on every prepare, so the edit must live here).
 *
 * 2) Fixes any "0xAARRGGBB" colour strings in Android XML resource files –
 *    AAPT2 only accepts #RRGGBB / #AARRGGBB; a numeric 0x… literal causes a
 *    resource-compilation failure at mergeDebugResources.
 */

const fs   = require('fs');
const path = require('path');

module.exports = function (context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms', 'android');

    // ── 1. Patch cdv-gradle-config.json ──────────────────────────────────────
    const gradleCfgPath = path.join(platformRoot, 'cdv-gradle-config.json');
    if (fs.existsSync(gradleCfgPath)) {
        const cfg = JSON.parse(fs.readFileSync(gradleCfgPath, 'utf8'));
        cfg.ANDROIDX_APP_COMPAT_VERSION = '1.6.1';
        cfg.AGP_VERSION = '8.9.2';
        fs.writeFileSync(gradleCfgPath, JSON.stringify(cfg, null, 2));
        console.log('[after_prepare] Pinned appcompat→1.6.1, AGP→8.9.2 in cdv-gradle-config.json');
    }

    // ── 2. Fix 0xAARRGGBB color literals in Android XML resource files ───────
    const resDir = path.join(platformRoot, 'app', 'src', 'main', 'res');
    if (!fs.existsSync(resDir)) return;

    function walkAndFix(dir) {
        fs.readdirSync(dir).forEach(function (name) {
            const full = path.join(dir, name);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                walkAndFix(full);
            } else if (name.endsWith('.xml')) {
                let src = fs.readFileSync(full, 'utf8');
                // Replace >0xAARRGGBB< with >#AARRGGBB< inside XML tags
                const fixed = src.replace(/>0x([0-9a-fA-F]{6,8})</g, function (_, hex) {
                    return '>#' + hex + '<';
                });
                if (fixed !== src) {
                    fs.writeFileSync(full, fixed, 'utf8');
                    console.log('[after_prepare] Fixed 0x colour literals in: ' + full);
                }
            }
        });
    }

    walkAndFix(resDir);
};
