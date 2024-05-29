# pq-toolkit-ui

Perceptual qualities toolkit UI.

UI for conducting audio quality tests using selected methodologies
(AB, ABX, APE, MUSHRA).

## Development server:

```bash
npm install
npm run dev
```

## Deployment

### Requirements

- Docker
- Make

```
make build-<env>
make start-<env>
```

Available environments:

- dev
- stage
- prod

Remember to create .env file for used environment.
Sample .env files are provided as `.env.<name>.sample`

## Available scripts

All scripts are available via `npm run <name>` command.

- `dev` - runs development server
- `build` - builds for deployment
- `start` - runs deployment server
- `lint` - runs linter
- `lint:fix` - runs linter and fixes all autofixable problems
- `test` - runs test suite
- `test:watch` - runs test suite and watches for changes
- `build-docs` - build typedoc docs

## Technology stack

This project utilizes Typescript for full type safety, there are no .js files, all type definitions
are provided in place.

[Next.js](https://nextjs.org/) is used as primary framework for frontend routing and
backend API routes. [SWR](https://swr.vercel.app/) manages state of data collected from API,
one of components uses [axios](https://axios-http.com/) for upload progress handling.

API data validation is handled by [zod](https://github.com/colinhacks/zod) schemas.

[TailwindCSS](https://tailwindcss.com/) CSS framework.

[MUI Material](https://mui.com/) component library is used for base components.

[Holwer.js](https://howlerjs.com/) handles audio playback.

Other used dependencies:

- [sweetalert2](https://sweetalert2.github.io/) - confirmation modal
- [react-icons](https://react-icons.github.io/react-icons/) - icons

## Project structure

This project has modular structure allowing for easy expansion with additional test types or modification
of existing tests.

Basic structure:

- `deployments` - docker compose files used for deployment
- `doc` - generated documentation for schemas, must be generated first using `npm run build-docs`
- `public` - static assets
- `src`
  - `app` - app router, contains all routes (api and frontend)
    - `api` - api routes for backend functionality
    - other - frontend routes
  - `core` - core functionality, e.g. api handlers, global components
  - `lib` - all components, schemas used in app
  - `styles` - base style definitions in .css files (mainly typography)

## Examples

There is example configuration for experiment in `public/examples` folder with 2 configurations
and samples required to start it. It can be used after uploading via admin panel.

## Testing

This project uses Jest for testing, to run test suite use `npm run test` command
or `npm run test:watch` to run tests and watch for changes (useful when debugging test).

All tests are created in place inside `__tests__` directory.

Code coverage is available in `coverage` directory after running test suite.

Note that test coverage is lacking due to no test harness for Howler.js and
inability to test audio in Jest (and handling audio is main scope of this project).

## TypeDoc

There is TypeDoc documentation available for experiment schemas.
It has to be build by running `npm run build-docs`, then it's available
in `doc` directory.

Documentation describes all types needed to setup experiment and save results.
Tooltip hints are also available in compatible IDEs.

## SwaggerUI

For API endpoints documentation start the service and visit the `/api/v1/api-docs` endpoint.

## Development guide

This is reference of components and flows used to access experiments for future developers.

Good entry point is Next.js documentation, where app router is described.
Then starting point of user flow is `app/page.tsx` file, where list of all experiments is shown.
If user selects one of the experiments, then he is redirected to `app/[name]/page.tsx` where
experiment start page is displayed. All pages starting from this are wrapped in `app/[name]/layout.tsx` component
which handles fetching experiment setup, preparing it, storing all result values and distributing
it via Provider.

Main steps taken in `app/[name]/layout.tsx` are:

- fetching data using hook that fetches and validates data
- filling all randomizable experiment data (or loading state from session storage to ensure
  that refreshing page won't change shuffles)
- initializing or loading save results state (again to preserve for refreshing)
- creating methods for updating results and saving them in API

All the types are available at `lib/schemas` and are created using zod schemas to allow
for easy validation.

To add new experiment type most important steps are:

- add setup and state schemas that extend base schemas
- create test page components at `lib/components/experiments` using provided components or
  adding new ones
- register new component as test type handler at `app/[name]/[step]/page.tsx`
- add randomizing function to `app/[name]/utils.ts` if needed
- fill missing types in `app/[name]/layout.tsx`

Based on the Tailwind CSS classes extracted from the provided files, here is the updated documentation section for colors used in the UI:

## Colors Used in UI

The UI design incorporates a consistent color scheme to enhance user experience and maintain visual coherence. Here are the main colors used across different elements of the interface, differentiated by light and dark modes:

### Light Mode
- **Background Colors:**
  - `bg-gray-200`
- **Primary Buttons:**
  - `bg-blue-400`
- **Secondary Buttons:**
  - `bg-gray-300`
- **Text Colors:**
  - `text-black`
  - `text-gray-300`
  - `text-gray-400`
  - `text-blue-500`
  - `text-pink-500`
  - `text-white`
- **Borders:**
  - `border-gray-500`
  - `border-gray-600`
- **Hover States:**
  - `hover:bg-gray-200`
  - `hover:bg-pink-500`
  - `hover:scale-105`
  - `hover:scale-110`
  - `hover:scale-125`
  - `hover:text-pink-500`
- **Disabled States:**
  - `disabled:bg-gray-700`
  - `disabled:text-gray-400`

### Dark Mode
- **Background Colors:**
  - `dark:bg-blue-500`
  - `dark:bg-gray-300`
  - `dark:bg-gray-600`
  - `dark:bg-gray-700`
  - `dark:bg-stone-800`
  - `dark:bg-stone-900`
- **Primary Buttons:**
  - `dark:bg-blue-500`
- **Secondary Buttons:**
  - `dark:bg-gray-600`
  - `dark:bg-gray-700`
- **Text Colors:**
  - `dark:text-black`
  - `dark:text-blue-500`
  - `dark:text-gray-300`
  - `dark:text-gray-400`
  - `dark:text-pink-600`
  - `dark:text-white`
- **Borders:**
  - `dark:border-gray-500`
  - `dark:border-gray-600`
- **Hover States:**
  - `dark:hover:bg-bray-800`
  - `dark:hover:bg-gray-600`
  - `dark:hover:bg-pink-600`
  - `dark:hover:border-gray-500`
  - `dark:hover:text-pink-600`
- **Disabled States:**
  - `dark:disabled:bg-gray-700`
  - `dark:disabled:text-gray-400`

These colors are defined using TailwindCSS classes and are applied consistently across the application to ensure a cohesive and user-friendly interface.