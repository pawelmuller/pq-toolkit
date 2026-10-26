# Design proposal
---

## Perceptual qualities Python toolkit - project expansion
---

The aim of this project is to improve Python toolkit that helps with creating and conducting experiments that asses perceptual quality of audio.

As part of the project expansion, we will undertake the improvement of the UI, including the addition of feedback fields, the addition of an authorization system to the admin panel and the creation of a database that would collect results of perceptual tests.

# Functionalities
- Python interface for configuration and preparation of experiments (export of configuration json file, preparation
  of required audio files)
- Automated building of web application for conducting experiments
  - All configuration done via python interface/graphical interface
  - Dockerized web application and data collection service
  - Multiple test types in single session
  - Downloadable results (exporting results in structured file form)
- Python interface for experiment data downloading and parsing
- Multiple test types
  - simple question/rating
  - AB
  - ABX
  - MUSHRA - Multiple Stimuli with Hidden Reference and Anchor
  - APE - Audio Perceptual Evaluation

### Development of functionalities compared to the previous implementation
- Authorization for admin panel
- UI improvements
  - Better style of the page for better usability and aesthetics
- Feedback fields in tests
- Database for test results
  - Separate backend for data handling
  - Dockerized backend and database

# Technology Stack 

### Python interface
- Python
- MkDocs
### Frontend experiment application
- Typescript
- npm
- React.js
- Next.js
- Jest
- zod
### Backend
- Node.js
- Express.js
- Jest
- npm
### Database
- MongoDB

# Testing
- Unit tests

# Project roadmap

### 11.03 - 17.03

- **Introduction:** Thorough familiarization with the existing code and project architecture.

- **Adding authorization system:** Beginning work on implementing an authorization system for the admin panel, including researching best practices and selecting appropriate libraries.

### 18.03 - 24.03

- **Starting UI work:** Focusing on analyzing the current state of the user interface, identifying areas needing improvement, and designing UI solutions with the integration of feedback fields in tests in mind.

- **Adding feedback fields:** Implementing and integrating fields for collecting user feedback, ensuring they are intuitive and do not disrupt the natural flow of use.

### 25.03 - 31.03

- **Continuing UI improvement:** Implementing the designed solutions, including changing the page style for better usability and aesthetics.

- **UI and feedback fields testing:** Conducting usability and functional tests for the changes introduced in the interface and feedback fields.

### 01.04 - 07.04

- **Setting up MongoDB database:** Configuring and launching the MongoDB database, designing the data schema.

- **Backend code changes:** Developing the backend to integrate with the new database, preliminary testing of connections and functionalities.

### 08.04 - 14.04

- **Developing API for the frontend:** Designing and implementing an API for communication between the frontend and backend, including endpoints for handling user feedback.

- **Database integration tests:** Checking the performance, security, and correctness of the database operation in the context of the application.

### 15.04 - 21.04

- **Further work on the API:** Finalizing and optimizing the API, ensuring scalability and security of connections.

- **Detailed backend and database tests:** Unit and integration tests to ensure that all system components operate flawlessly.

### 22.04 - 28.04

- **Integrating the frontend with the backend:** Connecting new UI elements and functions with the backend and database, functional testing of the entire system.

### 29.04 - 05.05

- **Project review and optimization:** Code quality review, performance improvements, and bug fixing, ensuring compliance with best practices.

- **Technical documentation:** Updating project documentation, including a detailed description of the API, database schema, and a guide to changes in the UI.

### 06.05 - 12.05

- **Project conclusion:** Final project review.

- **Time buffer:** Using this time as a buffer for any unforeseen delays.

# References
[1] Method for the subjective assessment of intermediate quality level of coding systems. Recommendation ITU-R BS.1534-1, 2003. [[pdf]](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1534-1-200301-S!!PDF-E.pdf)

[2]	B. De Man and J. Reiss, ‘APE: Audio Perceptual Evaluation toolbox for MATLAB’, 04 2014.
[[pdf]](https://www.researchgate.net/publication/273574027_APE_Audio_Perceptual_Evaluation_toolbox_for_MATLAB)

[3] N. Jillings, D. Moffat, B. De Man, and J. D. Reiss, “Web Audio Evaluation Tool: A browser-based listening test environment,” Jul. 2015. [[pdf]](https://www.researchgate.net/publication/282328219_Web_Audio_Evaluation_Tool_A_Browser-Based_Listening_Test_Environment)[[GitHub]](https://github.com/BrechtDeMan/WebAudioEvaluationTool)

[4] A. Vinay and A. Lerch, “Evaluating generative audio systems and their metrics”, 2022. [[pdf]](https://arxiv.org/pdf/2209.00130.pdf)
