import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock del DOM mínimo ──────────────────────────────────────────────────────

beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
});

// ─── router ───────────────────────────────────────────────────────────────────

describe("router", () => {
    it("renderiza la vista home en '/'", async () => {
        window.history.pushState({}, "", "/");
        const { router } = await import("../src/router.js");
        router();
        expect(document.querySelector("#app").innerHTML).toContain("Chatea con Walter White");
    });

    it("renderiza la vista about en '/about'", async () => {
        window.history.pushState({}, "", "/about");
        const { router } = await import("../src/router.js");
        router();
        expect(document.querySelector("#app").innerHTML).toContain("Sobre este proyecto");
    });

    it("renderiza 404 en rutas desconocidas", async () => {
        window.history.pushState({}, "", "/ruta-inexistente");
        const { router } = await import("../src/router.js");
        router();
        expect(document.querySelector("#app").innerHTML).toContain("404");
    });
});

// ─── navigateTo ───────────────────────────────────────────────────────────────

describe("navigateTo", () => {
    it("cambia la URL sin recargar la página", async () => {
        const { navigateTo } = await import("../src/navigation.js");
        navigateTo("/about");
        expect(window.location.pathname).toBe("/about");
    });

    it("llama al router después de cambiar la URL", async () => {
        const routerModule = await import("../src/router.js");
        const routerSpy = vi.spyOn(routerModule, "router");

        const { navigateTo } = await import("../src/navigation.js");
        navigateTo("/");

        expect(routerSpy).toHaveBeenCalled();
    });
});