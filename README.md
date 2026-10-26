# Perceptual Qualities Python Toolkit

Toolkit for preparing and conducting experiments that asses
perceptual qualities of audio.

Official documentation available here:
[PQ-Toolkit Documentation](https://radekgod.github.io/pq-toolkit/) 

## Project for course WIMU 23Z

Project members:
- Bartłomiej Piktel
- Paweł Müller
- Grzegorz Rusinek

### Contributions
 - ZPRP 24L course members:
   - Igor Matynia
   - Jakub Woźniak
   - Jan Kowalczewski
 - WIMU 24L course members:
   - Mikołaj Olczak
   - Kondracki Wojciech
   - Krzysztof Miśków
- WIMU 25L course members:
   - Kinga Hacaś
   - Radosław Godlewski
   - Aleksander Bujnowski

## Project structure

- `docs` - project documentation
- `src` - source files organised by modules
    - pq-toolkit - Python toolkit interface
    - pq-toolkit-ui - frontend for conducting experiments
    - pq-toolkit-api - backend service with api
    - deployments - docker compose and env files
- `.github/workflows` - CI/CD definition

## 2024L notes

Initially, the project was planned for 3 people, but at the beginning we received information that it would be for 6 people, 3 people each from two different fields and subjects. This caused a slight disruption in the plans, but in order to control the situation as quickly as possible and minimize the number of problems, we decided to divide the work between backend - ZPRP group and fronted WIMU group. This allowed us to complete the project efficiently despite the large number of people involved.

Potential improvements:
 - ~~additional functionality for the admin allowing for easy analysis of test results~~
 - ~~CI/CD implementation~~
 - more options for test configurations (new tests or more helper components)
 - ~~automatic mkdocs deployment~~
 - ~~implementation of sample playback functionality in the experiment configurator~~

 The project progressed on schedule with minor delays while connecting the backend to the frontend. However, in the end, the project was completed only with a delay of a few days. Which is still before the deadline


## WIMU-24L notes

Known issues:
- ~~Error handling~~
- ~~Loading screen improvement (darkmode)~~

## ZPRP-24L notes

Known issues:
- ~~Feedback is not included in test results~~

## WIMU-25L notes
Potential improvements:
- Cross-browser and OS compatibility testing (ensuring the tool works consistently across Chrome, Firefox, Safari, Edge, and on both Windows/macOS/Linux platforms).
- Real-time autosave (with warnings before leaving unsaved pages).
- Result analytics enhancement.
- Multi-language support.