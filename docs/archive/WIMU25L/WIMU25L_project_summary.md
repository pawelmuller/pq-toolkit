# Project Summary

The following section summarizes the main development work and improvements completed in the 25L semester.

## Core Functionality Improvements
- Support for submitting samples using **Enter** key (not only the "+" button).
- Improved **experiment creation flow** – now step-by-step, clean, and clear.
- Added **audio player integration** for listening to samples before selection.
- Introduced **validation limits**.

## Experiments & Results
- Introduced **Experiment Review tab**:
  - Displays **bar charts** with test results.
  - Added **downloadable results** in:
     - `.csv` format – readable & compatible with spreadsheets
     - `.pdf` format – stylized, printable summary with per-user test pages
- Fixed past errors with feedback handling.

## DevOps & Repo Management
- Implemented **CI/CD workflow**
- Performed **code refactoring**
- Organized project structure and simplified developer onboarding

##  Documentation & Guidance
- Created a full **Admin Guide tab**:
- Published documentation via **MkDocs**.
- Cleaned up and **reduced clutter in README**.

## UI Enhancements
- Overhauled **Sample Upload Component**:
  - Dual-column layout (Uploaded vs Available)
  - Better spacing, better drag & drop
  - Sample preview with real-time selection
- Implemented **toast messages** (success/warning/error).
- Fixed **dark mode styling** past error.

## Additional Features
- Added **Experiment Management tab**:
  - Allows preview of experiment structure without edit mode
  - Includes option to delete entire experiments
- Added **Sample Ranking tab**:
  - Users can rate samples 1–5 stars
  - Sort samples by best/worst
  - Admins can also upload/remove samples from this view