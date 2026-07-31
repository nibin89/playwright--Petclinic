# Petclinic Playwright Framework

This repository contains a Playwright automation framework for the Bondar Academy Petclinic demo application.
It uses TypeScript, the Playwright test runner, and a Page Object Model (POM) structure to keep UI test flows reusable and maintainable.

## Project Structure

- `pages/` — Page object classes for each screen or flow in the app.
- `tests/` — Playwright test files that exercise UI features.
- `tests/fixtures.ts` — Custom fixtures that provide page objects and API-backed test data.
- `.auth/` — Auth setup for Playwright global setup and storage state.
- `playwright.config.ts` — Playwright configuration for browser, auth, timeout, and reporter settings.
- `test-data/` — Example data files used by tests.
- `playwright-report/` — Generated HTML report output from Playwright.

## Prerequisites

- Node.js 20+ (or compatible runtime)
- npm
- `npx playwright` available via installed dependencies

## Setup

1. Open a terminal in `playwright--Petclinic`.
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers if needed:

```bash
npx playwright install
```

4. Create a `.env` file in the project root.

Example `.env`:

```env
EMAIL='your-bondar-email@example.com'
PASSWORD='YourPassword'
```

5. Confirm the `.env` file is ignored by Git. The project already includes `.env` in `.gitignore`.

## Authentication

The project uses `.auth/auth-setup.ts` as Playwright `globalSetup`. It:

- launches a browser
- navigates to the configured `baseURL`
- logs in with `EMAIL` and `PASSWORD`
- captures storage state to `.auth/user.json`
- extracts `ACCESS_TOKEN` for API authorization headers

If `.auth/user.json` does not exist, the setup script creates it automatically.

## Running Tests

Run the full suite:

```bash
npx playwright test
```

Run a single spec:

```bash
npx playwright test tests/datepicker.spec.ts
```

Run tests by tag or grep:

```bash
npx playwright test --grep @smoke
```

Open the HTML report after a test run:

```bash
npx playwright show-report
```

## Notes on Configuration

Key settings in `playwright.config.ts`:

- `baseURL`: `https://petclinic.bondaracademy.com`
- `globalSetup`: `.auth/auth-setup.ts`
- `storageState`: `.auth/user.json`
- `extraHTTPHeaders.Authorization`: `Bearer ${process.env.ACCESS_TOKEN}`
- browser project: `chromium`

## Page Object Model

The framework uses page object classes under `pages/` to encapsulate UI interactions.
Each class accepts a Playwright `Page` and exposes reusable methods for page actions.

Common page objects include:

- `HomePage`
- `OwnerPage`
- `OwnerInformationPage`
- `AddPetPage`
- `EditPetPage`
- `PetTypesPage`
- `NewPetTypePage`
- `EditPetTypePage`
- `VeterinariansPage`
- `SpecialtiesPage`
- `Datepicker`

## Fixtures

`tests/fixtures.ts` extends Playwright fixtures to provide:

- page object instances
- owner fixture data created via API requests
- cleanup logic after tests

This makes tests easier to write and keeps setup/teardown centralized.

## Recommended Workflow

1. Update `.env` with valid credentials.
2. Run `npm install`.
3. Run smoke or feature tests locally.
4. Inspect `playwright-report/index.html` if failures occur.
5. Modify page objects or tests in `pages/` and `tests/` as needed.

## Troubleshooting

- If auth fails, verify `EMAIL` and `PASSWORD` in `.env`.
- If tests fail on selectors, inspect the application DOM and update the corresponding page object locator.
- Run `npx playwright test --debug` for interactive debugging.

## License

This repository is provided as a framework example for Petclinic automation.
