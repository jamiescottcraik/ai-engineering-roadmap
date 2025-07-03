module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/apps/web/src/lib/theme.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Cognitive Theme Provider - Learning Psychology-Informed Theme System
 *
 * Implements:
 * - Semantic color tokens for learning states
 * - Dark/light/high-contrast accessibility modes
 * - Type-safe theme context with strict TypeScript
 * - Runtime theme switching without object literals in JSX
 */ __turbopack_context__.s({
    "CognitiveThemeProvider": (()=>CognitiveThemeProvider),
    "getCognitiveColorValue": (()=>getCognitiveColorValue),
    "useCognitiveTheme": (()=>useCognitiveTheme),
    "useLearningStateStyles": (()=>useLearningStateStyles)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
// Theme Configurations
const lightTheme = {
    mastered: '#22c55e',
    progress: '#eab308',
    review: '#ef4444',
    focus: '#3b82f6',
    background: '#ffffff',
    foreground: '#171717',
    neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        500: '#6b7280',
        800: '#1f2937',
        900: '#111827'
    }
};
const darkTheme = {
    mastered: '#34d399',
    progress: '#fbbf24',
    review: '#f87171',
    focus: '#60a5fa',
    background: '#0a0a0a',
    foreground: '#ededed',
    neutral: {
        50: '#111827',
        100: '#1f2937',
        200: '#374151',
        500: '#9ca3af',
        800: '#e5e7eb',
        900: '#f9fafb'
    }
};
const highContrastTheme = {
    mastered: '#16a34a',
    progress: '#ca8a04',
    review: '#dc2626',
    focus: '#1d4ed8',
    background: '#ffffff',
    foreground: '#000000',
    neutral: {
        50: '#ffffff',
        100: '#f3f4f6',
        200: '#d1d5db',
        500: '#000000',
        800: '#000000',
        900: '#000000'
    }
};
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useCognitiveTheme() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useCognitiveTheme must be used within a CognitiveThemeProvider');
    }
    return context;
}
function CognitiveThemeProvider({ children, defaultTheme = 'system', defaultAccessibility = 'default' }) {
    const [themeMode, setThemeMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultTheme);
    const [accessibilityMode, setAccessibilityMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultAccessibility);
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Determine effective theme based on mode and system preference
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = ()=>{
            if (themeMode === 'system') {
                setIsDark(mediaQuery.matches);
            } else {
                setIsDark(themeMode === 'dark');
            }
        };
        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);
        return ()=>mediaQuery.removeEventListener('change', updateTheme);
    }, [
        themeMode
    ]);
    // Apply theme classes to document
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const root = document.documentElement;
        // Remove existing theme classes
        root.classList.remove('light', 'dark', 'high-contrast', 'reduced-motion');
        // Apply current theme classes
        root.classList.add(isDark ? 'dark' : 'light');
        if (accessibilityMode === 'high-contrast') {
            root.classList.add('high-contrast');
        }
        if (accessibilityMode === 'reduced-motion') {
            root.classList.add('reduced-motion');
        }
    }, [
        isDark,
        accessibilityMode
    ]);
    // Get colors based on current theme and accessibility settings
    const getCurrentColors = ()=>{
        if (accessibilityMode === 'high-contrast') {
            return highContrastTheme;
        }
        return isDark ? darkTheme : lightTheme;
    };
    // Get color for specific learning state - returns string, never object
    const getLearningStateColor = (state)=>{
        const colors = getCurrentColors();
        return colors[state];
    };
    const toggleTheme = ()=>{
        setThemeMode((prevMode)=>{
            if (prevMode === 'light') return 'dark';
            if (prevMode === 'dark') return 'system';
            return 'light';
        });
    };
    const theme = {
        mode: themeMode,
        accessibilityMode,
        colors: getCurrentColors(),
        isDark
    };
    const contextValue = {
        theme,
        setThemeMode,
        setAccessibilityMode,
        getLearningStateColor,
        toggleTheme
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/lib/theme.tsx",
        lineNumber: 207,
        columnNumber: 10
    }, this);
}
function useLearningStateStyles() {
    const { getLearningStateColor } = useCognitiveTheme();
    return {
        getMasteredStyle: ()=>({
                backgroundColor: getLearningStateColor('mastered'),
                color: '#ffffff'
            }),
        getProgressStyle: ()=>({
                backgroundColor: getLearningStateColor('progress'),
                color: '#000000'
            }),
        getReviewStyle: ()=>({
                backgroundColor: getLearningStateColor('review'),
                color: '#ffffff'
            }),
        getFocusStyle: ()=>({
                backgroundColor: getLearningStateColor('focus'),
                color: '#ffffff'
            })
    };
}
function getCognitiveColorValue(state, theme) {
    return theme.colors[state];
}
}}),
"[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else {
                "TURBOPACK unreachable";
            }
        } else {
            "TURBOPACK unreachable";
        }
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__94d32270._.js.map