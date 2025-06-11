// tests/example.spec.ts
import { test, expect } from "@playwright/test";
import { credential } from "./env";

const baseURL = "http://localhost:5173/";
const authorization = credential || "credential not set";

test("1. Ver Articulo", async ({ page }) => {
    // 1. Ir a tu app local
    await page.goto(baseURL);

    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();

    // 3. Hacer clic en un enlace a un artículo
    await page.click("text=España");

    // 4. Verificar que cargó la vista del artículo
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("España")).toBeVisible();
});

test("2. Buscar Articulo", async ({ page }) => {
    // 1. Ir a tu app local
    await page.goto(baseURL);

    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();

    // 3. Buscar un artículo
    await page.fill('input[placeholder="Search for articles..."]', "España");
    await page.press('input[placeholder="Search for articles..."]', "Enter");

    // 4. Clicar en el primer resultado de búsqueda
    // data-testid="result-item"
    await page.click('li[data-testid="result-item"] >> text=España');

    // 4. Verificar que cargó la vista del artículo
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("España")).toBeVisible();
});

test("3. Ver Perfil", async ({ page, context }) => {
    // 3. Simular autenticación
    await context.addCookies([
        {
            name: "credential", // o el nombre real que use tu backend
            value: authorization,
            domain: "localhost", // usa el dominio de tu backend si es diferente
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
        },
    ]);
    await page.route("**/*", async (route) => {
        const headers = {
            ...route.request().headers(),
            authorization: "Bearer " + authorization,
        };
        route.continue({ headers });
    });

    // 1. Ir a tu app local
    await page.goto(baseURL);

    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();

    // 3. Hacer clic en el enlace de perfil
    await page.click('a[href="/account"]');

    // 4. Verificar que cargó la vista del perfil
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-title")).toBeVisible();
});

test("4. Crear Articulo", async ({ page, context }) => {
    // 3. Simular autenticación
    await context.addCookies([
        {
            name: "credential", // o el nombre real que use tu backend
            value: authorization,
            domain: "localhost", // usa el dominio de tu backend si es diferente
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
        },
    ]);
    await page.route("**/*", async (route) => {
        const headers = {
            ...route.request().headers(),
            authorization: "Bearer " + authorization,
        };
        route.continue({ headers });
    });

    // 1. Ir a tu app local
    await page.goto(baseURL);
    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();

    // 3. Hacer clic en el enlace de perfil
    await page.click('a[href="/account"]');

    // 4. Verificar que cargó la vista del perfil
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-title")).toBeVisible();

    // 5. Hacer clic en el botón "Create new article"
    await page.click('a[href="/wiki/new"]');

    // 6. Verificar que cargó la vista de creación de artículo
    await expect(page).toHaveURL(/\/wiki\/new/);

    // 7. Completar el formulario de creación de artículo
    // title-textarea
    await page.fill("#title-textarea", "Test Article");
    // subtitle-textarea
    await page.fill("#subtitle-textarea", "This is a test article.");
    // contents-textarea
    await page.fill(
        "#contents-textarea",
        "This is the content of the test article."
    );

    // leaflet map interaction
    // clic on data-testid="leaflet-random-map"
    await page.click('button[data-testid="random-cells-button"]');

    // 8. Hacer clic en el botón "Save"
    await page.click('button:has-text("Publish")');

    // Are you sure you want to create this new article?
    await page.click('button:has-text("Yes")');

    // 9. Verificar que se redirige a la vista del artículo creado
    await expect(page.getByText("edit page")).toBeVisible();
    await expect(page).toHaveURL(/\/wiki\/.+/);

    // 
    await expect(page.getByText("Test Article", {exact: true})).toBeVisible();
    await expect(page.getByText("This is a test article.", {exact: true})).toBeVisible();
    await expect(
        page.getByText("This is the content of the test article.", {exact: true})
    ).toBeVisible();
});

test("5. Like Articulo", async ({ page, context }) => {
    // 3. Simular autenticación
    await context.addCookies([
        {
            name: "credential", // o el nombre real que use tu backend
            value: authorization,
            domain: "localhost", // usa el dominio de tu backend si es diferente
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
        },
    ]);
    await page.route("**/*", async (route) => {
        const headers = {
            ...route.request().headers(),
            authorization: "Bearer " + authorization,
        };
        route.continue({ headers });
    });
    // 1. Ir a tu app local
    await page.goto(baseURL);
    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();
    // 3. Hacer clic en un enlace a un artículo
    await page.click("text=España");
    // 4. Verificar que cargó la vista del artículo
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("España")).toBeVisible();
    // 5. Verificar que el contador de likes es visible
    const heartCounter = page.getByTestId("heart-counter");
    await expect(heartCounter).toBeVisible();
    // 6. Hacer clic en el botón de like
    await heartCounter.click();
    // 7. Verificar que el contador de likes se incrementa
    const likesCount = await heartCounter.textContent();
    expect(Number(likesCount)).toBeGreaterThan(0);
    // 9. Recargar la página
    await page.reload();
    // 10. Verificar que el contador de likes se mantiene
    const newLikesCount = await heartCounter.textContent();
    expect(Number(newLikesCount)).toBeGreaterThan(0);
    // 12. Hacer clic en el botón de like nuevamente
    await heartCounter.click();
    // 13. Verificar que el contador de likes se decrementa
    const updatedLikesCount = await heartCounter.textContent();
    expect(Number(updatedLikesCount)).toBeLessThan(Number(likesCount));
    // 15. Recargar la página
    await page.reload();
    // 16. Verificar que el contador de likes se mantiene
    const finalLikesCount = await heartCounter.textContent();
    expect(Number(finalLikesCount)).toBeLessThan(Number(newLikesCount));
});

test("6. Editar Articulo", async ({ page, context }) => {
    // 3. Simular autenticación
    await context.addCookies([
        {
            name: "credential", // o el nombre real que use tu backend
            value: authorization,
            domain: "localhost", // usa el dominio de tu backend si es diferente
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
        },
    ]);

    await page.route("**/*", async (route) => {
        const headers = {
            ...route.request().headers(),
            authorization: "Bearer " + authorization,
        };
        route.continue({ headers });
    });

    // 1. Ir a tu app local
    await page.goto(baseURL);
    // 2. Verificar que estamos en la home
    await expect(page.getByText("Popular")).toBeVisible();
    // 3. Hacer clic en un enlace a un artículo
    await page.click("text=España");
    // 4. Verificar que cargó la vista del artículo
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("España")).toBeVisible();
    // 5. Hacer clic en el botón de editar
    await page.click('button:has-text("edit page")');

    // 7. Completar el formulario de edición del artículo
    // title-textarea
    await page.fill("#title-textarea", "Test Article Edited");
    // subtitle-textarea
    await page.fill("#subtitle-textarea", "This is a test article edited.");
    // contents-textarea
    await page.fill(
        "#contents-textarea",
        "This is the content of the test article edited."
    );

    // save changes
    await page.click('button:has-text("Save changes")');
    // Are you sure you want to save these changes?
    await page.click('button:has-text("Yes")');

    // 8. Verificar que se redirige a la vista del artículo editado
    await expect(page.getByText("edit page")).toBeVisible();
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("Test Article Edited", {exact: true})).toBeVisible();
    await expect(
        page.getByText("This is a test article edited.", {exact: true})
    ).toBeVisible();
    await expect(
        page.getByText("This is the content of the test article edited.", {exact: true})
    ).toBeVisible();

    // 9. Verificar que el botón de editar está visible
    const editButton = page.getByRole("button", { name: "edit page" });
    await expect(editButton).toBeVisible();

    // vlver a poner como estaba
    await page.click('button:has-text("edit page")');
    // 11. Completar el formulario de edición del artículo
    // title-textarea
    await page.fill("#title-textarea", "España");
    // subtitle-textarea
    await page.fill("#subtitle-textarea", "Capital de España.");
    // contents-textarea
    await page.fill(
        "#contents-textarea",
        "España es un país de Europa."
    );
    // save changes
    await page.click('button:has-text("Save changes")');
    // Are you sure you want to save these changes?
    await page.click('button:has-text("Yes")');
    // 12. Verificar que se redirige a la vista del artículo editado
    await expect(page.getByText("edit page")).toBeVisible();
    await expect(page).toHaveURL(/\/wiki\/.+/);
    await expect(page.getByText("España", {exact: true})).toBeVisible();
    await expect(page.getByText("Capital de España.", {exact: true})).toBeVisible();
    await expect(page.getByText("España es un país de Europa.", {exact: true})).toBeVisible();
    // 13. Verificar que el botón de editar está visible
    const editButtonAfter = page.getByRole("button", { name: "edit page" });
    await expect(editButtonAfter).toBeVisible();
});