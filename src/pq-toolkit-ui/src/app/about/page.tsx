'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';

const About = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-14">
        <div className="relative text-center mb-sm">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriter before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-black dark:after:bg-neutral-200"
          >
            About PQToolkit
          </h1>
        </div>
        <div className="relative text-center mb-md">
          <h2 className="relative text-base md:text-xl font-semibold">
            About page of experiment UI for Perceptual Qualities Python Toolkit
          </h2>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <h1 className="relative text-sm md:text-lg font-semibold ">
            Welcome to the PQToolkit Project, a dynamic and innovative platform
            designed to enhance the perceptual qualities of audio through
            rigorous experimentation and evaluation. This toolkit is the
            brainchild of dedicated developers aiming to bridge the gap between
            theoretical audio quality assessments and practical, user-centric
            feedback.
          </h1>
          <h2 className="relative text-xl md:text-3xl font-bold mt-6">
            Our Mission
          </h2>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            The PQToolkit is dedicated to improving how we understand and
            evaluate audio quality in various environments and applications. By
            providing tools for conducting experiments and collecting user
            feedback, this project aids researchers and developers in refining
            audio technologies to meet real-world demands.
          </h3>
          <h4 className="relative text-xl md:text-3xl font-bold mt-6">
            Project Overview
          </h4>
          <h5 className="relative text-sm md:text-lg font-semibold mt-2">
            The toolkit consists of two main components:
          </h5>
          <ol className="list-decimal list-inside relative text-sm md:text-lg font-semibold mt-1">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Python Plugin for Test Creation:{' '}
              </a>
              A robust backend built with Python that allows users to set up and
              configure audio tests efficiently. It supports a range of test
              types such as simple question/rating,
              <a
                className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline transform hover:scale-105 duration-300 ease-in-out"
                href="/about/ab"
              >
                {' '}
                AB
              </a>
              ,
              <a
                className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline transform hover:scale-105 duration-300 ease-in-out"
                href="/about/abx"
              >
                {' '}
                ABX
              </a>
              ,
              <a
                className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline transform hover:scale-105 duration-300 ease-in-out"
                href="/about/ape"
              >
                {' '}
                APE{' '}
              </a>{' '}
              and
              <a
                className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline transform hover:scale-105 duration-300 ease-in-out"
                href="/about/mushra"
              >
                {' '}
                MUSHRA
              </a>
              , catering to different research needs and scenarios.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Web Application for Experimentation:{' '}
              </a>
              A user-friendly frontend developed using modern technologies like
              TypeScript and React.js, facilitating the real-time conducting of
              experiments. The application is designed for easy deployment and
              scalability, ensuring a smooth experience for both administrators
              and test participants.
            </li>
          </ol>
          <h6 className="relative text-xl md:text-3xl font-bold mt-6">
            Key Features
          </h6>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Automated Experiment Setup:{' '}
              </a>
              Quickly configure and deploy audio tests using the Python
              interface or through the graphical user interface.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Real-Time Data Collection:{' '}
              </a>
              Utilize a Dockerized web application that collects and stores
              experiment results efficiently, ensuring data integrity and
              accessibility.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Enhanced User Interaction:{' '}
              </a>
              The toolkit includes an admin panel with enhanced security
              features and feedback mechanisms to gather comprehensive user
              insights.
            </li>
          </ol>
          <h6 className="relative text-xl md:text-3xl font-bold mt-6">
            Future Directions
          </h6>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            We are committed to continuous improvement and are actively working
            on expanding the toolkit&apos;s capabilities. Future updates include
            more refined UI designs, additional test configuration options, and
            backend enhancements for better data management and security.
          </h3>
          <h6 className="relative text-xl md:text-3xl font-bold mt-6">
            Get Involved
          </h6>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            The PQToolkit is an open-source project, and we welcome
            contributions from the community. Whether you&apos;re a developer, a
            researcher, or an audio enthusiast, your insights and contributions
            can help shape the future of audio quality assessment.
          </h3>
          <h3 className="relative text-sm md:text-lg font-semibold mt-4">
            Explore more about PQToolkit and how you can contribute to this
            innovative project on{' '}
            <a
              className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 hover:text-underline transform hover:scale-105 duration-300 ease-in-out"
              href="https://github.com/pawelmuller/pq-toolkit"
            >
              GitHub
            </a>
            .
          </h3>
          <h3 className="relative text-sm md:text-lg font-semibold mt-4">
            Thank you for your interest in the PQToolkit. Together, we can push
            the boundaries of audio quality research and development!
          </h3>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default About;
