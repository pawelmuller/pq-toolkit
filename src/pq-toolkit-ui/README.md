# pq-toolkit-ui

Perceptual qualities toolkit UI.

UI for conducting audio quality tests using selected methodologies
(AB, ABX, APE, MUSHRA).

## Development server:

To deploy development server go to `pq-toolkit-ui` and run

```bash
npm install
npm run dev
```

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
  - `app` - app router, contains all routes
    - `about` - pages with information about experiments
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
It has to be built by running `npm run build-docs`, then it's available
in `doc` directory.

Documentation describes all types needed to set up experiment and save results.
Tooltip hints are also available in compatible IDEs.

## Development guide

This is reference of components and flows used to access experiments for future developers. 
## pq-toolkit-ui/src/app


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

File `app\[name]\[step]\page.tsx` is responsible for:
  - page conatining experiment components, handling buttons: Next, Previous, Finish as well as saving results.

File `app\[name]\finish\page.tsx` is responsible for:
  - page apearing after test is finished with custom thank you note and go back to home page button.

File `app\invalid-configuration-error.tsx` is responsible for:
  - page apearing after error with the configuration of an experiment occured.

File `app\error.tsx` is responsible for:
  - page apearing after any other error occured.

File `app\loading.tsx` is responsible for:
  - page apearing, when moving to a page, that is not loaded yet.

Folder `app\about` holds files responsible for pages holding information about different types of exeperiments:
 - `app\about\ab\page.tsx`
 - `app\about\abx\page.tsx`
 - `app\about\ape\page.tsx`
 - `app\about\mushra\page.tsx`

File `app\admin\page.tsx` is responsible for admin panel containing:
  - list of configured experiments
  - option to add new experiments
  - option to remove experiment

</details>

## pq-toolkit-ui/src/core

Files responsible for some of the core functionalities:
- `pq-toolkit-ui/src/core/apiHandlers` - functions around API
- `pq-toolkit-ui/src/core/hooks/useStorage.ts` - Hook for safely using localStorage and sessionStorage in Next.js


## pq-toolkit-ui/src/lib

### pq-toolkit-ui/src/lib/components

#### pq-toolkit-ui/src/lib/components/basic

To edit commonly used components such as:
- `pq-toolkit-ui/src/lib/components/basic/blobs.tsx` - responsible for background animations
- `pq-toolkit-ui/src/lib/components/basic/deleteButton.tsx`
- `pq-toolkit-ui/src/lib/components/basic/header.tsx` - responsible for left top corner icon
- `pq-toolkit-ui/src/lib/components/basic/scrollToTopButton.tsx`
- `pq-toolkit-ui/src/lib/components/basic/themeSwitch.tsx` - responsible for changing between dark and light theme

#### pq-toolkit-ui/src/lib/components/editors

To edit page responsible for configurating individual experiments:

- `lib\components\editors\AbEditor.tsx`
- `lib\components\editors\AbxEditor.tsx`
- `lib\components\editors\ApeEditor.tsx`
- `lib\components\editors\MushraEditor.tsx`

#### pq-toolkit-ui/src/lib/components/experiments

Most important files responsible for editing the design of the experiments:  

- To edit test page layout and components used:
  - `lib\components\experiments\ABTestComponent.tsx`
  - `lib\components\experiments\ABXTestComponent.tsx`
  - `lib\components\experiments\APETestComponent.tsx`
  - `lib\components\experiments\MUSHRATestComponent.tsx`

- To edit individual components edit files below:
  - `lib\components\experiments\common\VerticalMultislider.tsx` - to edit VerticalMultislider 
  - `lib\components\experiments\common\VerticaSlider.tsx` - to edit Vertical Slider 
  - `lib\components\experiments\common\SingleSelectQuestion.tsx` - to edit single select buttons between two options



#### pq-toolkit-ui/src/lib/components/login

  - `lib\components\experiments\player\login-page.tsx` - to edit login page

#### pq-toolkit-ui/src/lib/components/player

  - `lib\components\experiments\player\MultiPlayer.tsx` - to edit player handling multiple samples
  - `lib\components\experiments\player\SinglePlayer.tsx` - to edit player handling one sample

## pq-toolkit-ui/src/styles

Holding css files responsible for look style:

- `pq-toolkit-ui\src\styles\base.css`
- `pq-toolkit-ui\src\styles\globals.css`
- `pq-toolkit-ui\src\styles\typography.css`

## Adding new experiment


All the types are available at `lib/schemas` and are created using zod schemas to allow
for easy validation.

To add new experiment type most important steps are:

- add setup and state schemas that extend base schemas
- create test page components at `lib/components/experiments` using provided components or
  adding new ones
- register new component as test type handler at `app/[name]/[step]/page.tsx`
- add randomizing function to `app/[name]/utils.ts` if needed
- fill missing types in `app/[name]/layout.tsx`


## Colors Used in UI

The UI design incorporates a consistent color scheme to enhance user experience and maintain visual coherence. Here are the main colors used across different elements of the interface, differentiated by light and dark modes:

### Light Mode
- **Background Colors:**
  - `bg-gray-200` ![#E5E7EB](https://via.placeholder.com/15/E5E7EB/000000?text=+)
- **Primary Buttons:**
  - `bg-blue-400` ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+)
- **Secondary Buttons:**
  - `bg-gray-300` ![#D1D5DB](https://via.placeholder.com/15/D1D5DB/000000?text=+)
- **Text Colors:**
  - `text-black` ![#000000](https://via.placeholder.com/15/000000/FFFFFF?text=+)
  - `text-gray-300` ![#D1D5DB](https://via.placeholder.com/15/D1D5DB/000000?text=+)
  - `text-gray-400` ![#9CA3AF](https://via.placeholder.com/15/9CA3AF/000000?text=+)
  - `text-blue-500` ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+)
  - `text-pink-500` ![#EC4899](https://via.placeholder.com/15/EC4899/000000?text=+)
  - `text-white` ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+)
- **Borders:**
  - `border-gray-500` ![#6B7280](https://via.placeholder.com/15/6B7280/000000?text=+)
  - `border-gray-600` ![#4B5563](https://via.placeholder.com/15/4B5563/000000?text=+)
- **Hover States:**
  - `hover:bg-gray-200` ![#E5E7EB](https://via.placeholder.com/15/E5E7EB/000000?text=+)
  - `hover:bg-pink-500` ![#EC4899](https://via.placeholder.com/15/EC4899/000000?text=+)
  - `hover:text-pink-500` ![#EC4899](https://via.placeholder.com/15/EC4899/000000?text=+)
- **Disabled States:**
  - `disabled:bg-gray-700` ![#374151](https://via.placeholder.com/15/374151/FFFFFF?text=+)
  - `disabled:text-gray-400` ![#9CA3AF](https://via.placeholder.com/15/9CA3AF/000000?text=+)

### Dark Mode
- **Background Colors:**
  - `dark:bg-blue-500` ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+)
  - `dark:bg-gray-300` ![#D1D5DB](https://via.placeholder.com/15/D1D5DB/000000?text=+)
  - `dark:bg-gray-600` ![#4B5563](https://via.placeholder.com/15/4B5563/000000?text=+)
  - `dark:bg-gray-700` ![#374151](https://via.placeholder.com/15/374151/FFFFFF?text=+)
  - `dark:bg-stone-800` ![#1C1917](https://via.placeholder.com/15/1C1917/FFFFFF?text=+)
  - `dark:bg-stone-900` ![#111827](https://via.placeholder.com/15/111827/FFFFFF?text=+)
- **Primary Buttons:**
  - `dark:bg-blue-500` ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+)
- **Secondary Buttons:**
  - `dark:bg-gray-600` ![#4B5563](https://via.placeholder.com/15/4B5563/000000?text=+)
  - `dark:bg-gray-700` ![#374151](https://via.placeholder.com/15/374151/FFFFFF?text=+)
- **Text Colors:**
  - `dark:text-black` ![#000000](https://via.placeholder.com/15/000000/FFFFFF?text=+)
  - `dark:text-blue-500` ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+)
  - `dark:text-gray-300` ![#D1D5DB](https://via.placeholder.com/15/D1D5DB/000000?text=+)
  - `dark:text-gray-400` ![#9CA3AF](https://via.placeholder.com/15/9CA3AF/000000?text=+)
  - `dark:text-pink-600` ![#DB2777](https://via.placeholder.com/15/DB2777/000000?text=+)
  - `dark:text-white` ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+)
- **Borders:**
  - `dark:border-gray-500` ![#6B7280](https://via.placeholder.com/15/6B7280/000000?text=+)
  - `dark:border-gray-600` ![#4B5563](https://via.placeholder.com/15/4B5563/000000?text=+)
- **Hover States:**
  - `dark:hover:bg-bray-800` ![#1F2937](https://via.placeholder.com/15/1F2937/FFFFFF?text=+)
  - `dark:hover:bg-gray-600` ![#4B5563](https://via.placeholder.com/15/4B5563/000000?text=+)
  - `dark:hover:bg-pink-600` ![#DB2777](https://via.placeholder.com/15/DB2777/000000?text=+)
  - `dark:hover:border-gray-500` ![#6B7280](https://via.placeholder.com/15/6B7280/000000?text=+)
  - `dark:hover:text-pink-600` ![#DB2777](https://via.placeholder.com/15/DB2777/000000?text=+)
- **Disabled States:**
  - `dark:disabled:bg-gray-700` ![#374151](https://via.placeholder.com/15/374151/FFFFFF?text=+)
  - `dark:disabled:text-gray-400` ![#9CA3AF](https://via.placeholder.com/15/9CA3AF/000000?text=+)

### Gradients
- **Light Mode:**
  - `bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500` 
  - `bg-gradient-to-r from-indigo-500 to-cyan-600` 
  - `bg-gradient-to-r from-cyan-600 to-pink-500` 
  - `bg-gradient-to-r from-pink-500 to-violet-500` 
  - `bg-gradient-to-r from-pink-500 to-pink-700` 
  - `bg-gradient-to-r from-cyan-600 via-pink-700 to-violet-600` 
- **Dark Mode:**
  - `dark:from-indigo-500 dark:to-cyan-600` 
  - `dark:from-pink-500 dark:via-pink-600 dark:to-violet-500`

These colors are defined using TailwindCSS classes and are applied consistently across the application to ensure a cohesive and user-friendly interface.
