'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';

const AboutAPE = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
        <div className="relative text-center mb-md">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterABX before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caretABX after:bg-black dark:after:bg-neutral-200"
          >
            APE Testing
          </h1>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <h1 className="relative text-sm md:text-lg font-semibold">
            APE (Audio Perceptual Evaluation) Testing is a method designed to
            evaluate the perceptual quality of audio through structured and
            systematic listening tests. It helps in determining how different
            audio processing techniques or codecs affect the listening
            experience.
          </h1>
          <h2 className="relative text-xl md:text-3xl font-bold mt-6">
            What is APE Testing?
          </h2>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            APE Testing involves a series of controlled experiments where
            participants listen to various audio samples and provide feedback on
            specific perceptual attributes such as clarity, distortion, depth
            and overall quality. This method is particularly useful for
            understanding subjective audio quality and identifying areas for
            improvement in audio processing algorithms.
          </h3>
          <h4 className="relative text-xl md:text-3xl font-bold mt-6">
            Advantages of APE Testing
          </h4>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Comprehensive Evaluation:{' '}
              </a>
              APE Testing provides a detailed understanding of how different
              processing techniques impact various perceptual attributes.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Subjective Feedback:{' '}
              </a>
              It captures subjective user experiences, which are crucial for
              evaluating the real-world performance of audio technologies.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Improvement Insights:{' '}
              </a>
              The feedback gathered helps developers identify areas for
              improvement in audio processing algorithms.
            </li>
          </ol>
          <h5 className="relative text-xl md:text-3xl font-bold mt-6">
            Applications in Audio Testing
          </h5>
          <h5 className="relative text-sm md:text-lg font-semibold mt-2">
            APE Testing is widely used in:
          </h5>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Audio Codec Development:{' '}
              </a>
              Evaluating the perceptual impact of different audio codecs.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Audio Enhancement Algorithms:{' '}
              </a>
              Assessing the effectiveness of noise reduction, echo cancellation
              and other audio enhancement techniques.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Consumer Electronics:{' '}
              </a>
              Testing the audio quality of headphones, speakers and other audio
              devices to ensure high user satisfaction.
            </li>
          </ol>
          <h6 className="relative text-sm md:text-lg font-semibold mt-4">
            APE Testing is an essential method for evaluating the perceptual
            quality of audio. It provides valuable insights into how different
            audio processing techniques affect the listening experience, guiding
            improvements and innovations in audio technology. The PQToolkit
            makes conducting APE Testing accessible and efficient, enabling
            researchers and developers to gather detailed, subjective feedback
            to enhance audio quality.
          </h6>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AboutAPE;
