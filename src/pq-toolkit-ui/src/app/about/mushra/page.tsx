'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';

const AboutMushra = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
        <div className="relative text-center mb-md">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterMUSHRA before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caretMUSHRA after:bg-black dark:after:bg-neutral-200"
          >
            MUSHRA Testing
          </h1>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <h1 className="relative text-sm md:text-lg font-semibold">
            MUSHRA (MUltiple Stimuli with Hidden Reference and Anchor) Testing
            is a robust and detailed method for evaluating the perceptual
            quality of audio. It is designed to provide a comprehensive
            assessment by comparing multiple audio samples, including a known
            reference and an anchor with significantly lower quality.
          </h1>
          <h2 className="relative text-xl md:text-3xl font-bold mt-6">
            What is MUSHRA Testing?
          </h2>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            MUSHRA Testing involves presenting participants with multiple audio
            samples of the same content but processed differently. Among these
            samples are a hidden reference (the original, unprocessed audio) and
            an anchor (a deliberately degraded version). Participants rate the
            quality of each sample relative to the reference.
          </h3>
          <h4 className="relative text-xl md:text-3xl font-bold mt-6">
            Advantages of MUSHRA Testing
          </h4>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Detailed Quality Assessment:{' '}
              </a>
              MUSHRA provides detailed insights into the perceptual differences
              between audio samples.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Relative Comparisons:{' '}
              </a>
              By including a hidden reference and anchor, it allows for relative
              comparisons, enhancing the reliability of the results.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Comprehensive Evaluation:{' '}
              </a>
              It can assess a wide range of audio qualities and is suitable for
              high-quality audio codec evaluations.
            </li>
          </ol>
          <h5 className="relative text-xl md:text-3xl font-bold mt-6">
            Applications in Audio Testing
          </h5>
          <h5 className="relative text-sm md:text-lg font-semibold mt-2">
            MUSHRA Testing is particularly useful in:
          </h5>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Audio Codec Evaluation:{' '}
              </a>
              Assessing the perceptual quality of different audio codecs under
              various conditions.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Audio Processing:{' '}
              </a>
              Evaluating the effectiveness of different audio processing
              algorithms, such as compression and noise reduction.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Product Development:{' '}
              </a>
              Testing audio equipment like headphones and speakers to ensure
              high fidelity and user satisfaction.
            </li>
          </ol>
          <h6 className="relative text-sm md:text-lg font-semibold mt-4">
            MUSHRA Testing is a powerful method for evaluating the perceptual
            quality of audio. It provides detailed, reliable data on how
            different processing techniques and codecs affect audio quality.
            With the PQToolkit, conducting MUSHRA tests becomes efficient and
            straightforward, enabling researchers and developers to gather
            valuable insights for improving audio technologies.
          </h6>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AboutMushra;
