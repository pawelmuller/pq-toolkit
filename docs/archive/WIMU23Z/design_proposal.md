# Design proposal
## Perceptual qualities Python toolkit

The aim of this project is to create Python toolkit that helps with creating and conducting 
experiments that asses perceptual quality of audio.

### Functionality
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

### Technology stack
- Python interface:
  - Python
  - MkDocs
- Frontend experiment application:
  - Typescript
  - npm
  - React.js
  - Next.js
  - xmlbuilder2
  - Jest
- Frontend data collection:
  - Node.js
  - data storage as json/xml files

### Testing
- Unit tests
- End-to-end test cases including creation of various tests, deployment of test application and
  collection of data

### Project roadmap
- 23-29.10 - Project initialization and configuration
- 30.10-5.11 - Prototype web interface for some experiment types
- 6-12.11 - Prototype experiment configuration saving/loading
- 13-19.11 - Prototype experiment data collection and storage, initial end-to-end tests
- 20-26.11 - Analyzing prototype, fixing issues
- 27.11-3.12 - Data structures, data collection finalization
- 4-10.12 - Parsing of collected data, more experiment types
- 11-17.12 - Complete experiment types
- 18.12-26.01 - Finishing, bug fixes, delay buffer

### References
[1] Method for the subjective assessment of intermediate quality level of coding systems. Recommendation ITU-R BS.1534-1, 2003. [[pdf]](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1534-1-200301-S!!PDF-E.pdf)

[2]	B. De Man and J. Reiss, ‘APE: Audio Perceptual Evaluation toolbox for MATLAB’, 04 2014.
[[pdf]](https://www.researchgate.net/publication/273574027_APE_Audio_Perceptual_Evaluation_toolbox_for_MATLAB)

[3] N. Jillings, D. Moffat, B. De Man, and J. D. Reiss, “Web Audio Evaluation Tool: A browser-based listening test environment,” Jul. 2015. [[pdf]](https://www.researchgate.net/publication/282328219_Web_Audio_Evaluation_Tool_A_Browser-Based_Listening_Test_Environment)[[GitHub]](https://github.com/BrechtDeMan/WebAudioEvaluationTool)
