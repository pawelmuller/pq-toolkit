'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';

const AboutABX = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
        <div className="relative text-center mb-md">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterABX before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caretABX after:bg-black dark:after:bg-neutral-200"
          >
            ABX Testing
          </h1>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <h1 className="relative text-sm md:text-lg font-semibold">
            ABX Testing is a specialized form of comparative testing used to
            determine perceptual differences between two stimuli. It is widely
            used in fields such as audio engineering, psychology, and product
            testing to evaluate the perceptual qualities of various elements.
          </h1>
          <h2 className="relative text-xl md:text-3xl font-bold mt-6">
            What is ABX Testing?
          </h2>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            ABX Testing involves three samples: A, B, and X. Samples A and B are
            different from each other, and X is either identical to A or B. The
            participant’s task is to identify whether X matches A or B. This
            method helps determine if the differences between A and B are
            perceptible to the human ear.
          </h3>
          <h4 className="relative text-xl md:text-3xl font-bold mt-6">
            Advantages of ABX Testing
          </h4>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                High Sensitivity:{' '}
              </a>
              ABX testing is highly sensitive to small differences between
              samples, making it effective for subtle perceptual studies.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">Reduced Bias: </a>
              The random assignment of X helps reduce biases that might
              influence participants decisions.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Objective Assessment:{' '}
              </a>
              The method provides objective data on perceptual differences,
              aiding in precise evaluations.
            </li>
          </ol>
          <h5 className="relative text-xl md:text-3xl font-bold mt-6">
            Applications in Audio Testing
          </h5>
          <h5 className="relative text-sm md:text-lg font-semibold mt-2">
            In audio testing, ABX testing is invaluable for:
          </h5>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Codec Comparison:{' '}
              </a>
              Evaluating whether listeners can perceive differences between
              various audio codecs.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Audio Processing:{' '}
              </a>
              Determining the perceptual impact of different audio processing
              techniques.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Product Testing:{' '}
              </a>
              Comparing the sound quality of different audio devices or
              software.
            </li>
          </ol>
          <h6 className="relative text-sm md:text-lg font-semibold mt-4">
            ABX testing is a rigorous and objective method for evaluating
            perceptual differences between samples. In audio testing, it
            provides critical insights into how different processing techniques,
            codecs, or devices are perceived by listeners. The PQToolkit makes
            conducting ABX tests straightforward and efficient, enabling
            researchers and developers to gather precise, reliable data for
            improving audio quality.
          </h6>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AboutABX;
