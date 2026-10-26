'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';

const AboutAB = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
        <div className="relative text-center mb-md">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterAB before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caretAB after:bg-black dark:after:bg-neutral-200"
          >
            AB Testing
          </h1>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <h1 className="relative text-sm md:text-lg font-semibold">
            AB Testing, also known as split testing or bucket testing, is a
            method of comparing two versions of a variable to determine which
            one performs better. This type of testing is widely used in various
            fields such as marketing, web development, and user experience
            design, but it also plays a crucial role in assessing perceptual
            qualities in audio experiments.
          </h1>
          <h2 className="relative text-xl md:text-3xl font-bold mt-6">
            What is AB Testing?
          </h2>
          <h3 className="relative text-sm md:text-lg font-semibold mt-2">
            In its simplest form, AB Testing involves comparing two versions of
            a single variable (A and B). For instance, in a website context,
            this could mean comparing two versions of a webpage to see which one
            yields higher conversion rates. In audio experiments, AB Testing
            compares two audio samples to determine which one is preferred by
            listeners.
          </h3>
          <h4 className="relative text-xl md:text-3xl font-bold mt-6">
            Advantages of AB Testing
          </h4>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">Simplicity: </a>AB
              Testing is straightforward to set up and analyze, making it
              accessible even for those with minimal technical expertise.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Direct Comparison:{' '}
              </a>
              It allows for a direct comparison between two variables, making it
              easy to see which one performs better.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Data-Driven Decisions:{' '}
              </a>
              The results from AB Testing provide concrete data that can guide
              decision-making processes.
            </li>
          </ol>
          <h5 className="relative text-xl md:text-3xl font-bold mt-6">
            Applications in Audio Testing
          </h5>
          <h5 className="relative text-sm md:text-lg font-semibold mt-2">
            In the realm of audio testing, AB Testing is particularly valuable
            for:
          </h5>
          <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold mt-2">
            <li className="pl-4">
              <a className="font-extrabold dark:font-black">
                Codec Evaluation:{' '}
              </a>
              Comparing different audio codecs to determine which provides
              better sound quality.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                Effectiveness of Audio Processing:{' '}
              </a>
              Assessing different audio processing techniques to find the one
              that enhances audio quality the most.
            </li>
            <li className="pl-4 mt-2">
              <a className="font-extrabold dark:font-black">
                User Preference Studies:{' '}
              </a>
              Understanding user preferences for different audio settings or
              enhancements.
            </li>
          </ol>
          <h6 className="relative text-sm md:text-lg font-semibold mt-4">
            AB Testing is a powerful method for evaluating and comparing
            different variables. In audio testing, it provides valuable insights
            into user preferences and audio quality, guiding the development of
            better audio technologies. With tools like the PQToolkit, conducting
            AB Testing becomes more accessible and efficient, enabling
            researchers and developers to make informed decisions based on solid
            data.
          </h6>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AboutAB;
