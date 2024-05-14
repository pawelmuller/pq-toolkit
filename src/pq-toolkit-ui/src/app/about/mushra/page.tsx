'use client'
import Header from '@/lib/components/basic/header'

const AboutMushra = (): JSX.Element => {
  return (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
      <div className="relative text-center mb-md">
        <h1 className="relative text-3xl md:text-6xl font-bold text-black mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterMUSHRA before:bg-gray-100
            after:absolute after:inset-0 after:w-[0.125em] after:animate-caretMUSHRA after:bg-black">MUSHRA Testing</h1>
      </div>
      <div className="relative mb-md ml-20 mr-20 p-8 mt-2">
        <h1 className="relative text-sm md:text-lg font-semibold text-black">
        APE (Audio Perceptual Evaluation) Testing is a method designed to evaluate the perceptual quality of audio through structured and systematic listening tests. It helps 
        in determining how different audio processing techniques or codecs affect the listening experience.
        </h1>
        <h2 className='relative text-xl md:text-3xl font-bold text-black mt-6'>What is APE Testing?</h2>
        <h3 className="relative text-sm md:text-lg font-semibold text-black mt-2">
        APE Testing involves a series of controlled experiments where participants listen to various audio samples and provide feedback on specific perceptual attributes such 
        as clarity, distortion, depth and overall quality. This method is particularly useful for understanding subjective audio quality and identifying areas for improvement in audio 
        processing algorithms.
        </h3>
        <h4 className='relative text-xl md:text-3xl font-bold text-black mt-6'>Advantages of APE Testing</h4>
        <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold text-black mt-2">
            <li className='pl-4'><a className="font-extrabold">Comprehensive Evaluation: </a>APE Testing provides a detailed understanding of how different processing techniques impact various perceptual attributes.
            </li>
            <li className='pl-4 mt-2'><a className="font-extrabold">Subjective Feedback: </a>It captures subjective user experiences, which are crucial for evaluating the real-world performance of audio technologies.
            </li>
            <li className='pl-4 mt-2'><a className="font-extrabold">Improvement Insights: </a>The feedback gathered helps developers identify areas for improvement in audio processing algorithms.
            </li>
        </ol>
        <h5 className='relative text-xl md:text-3xl font-bold text-black mt-6'>Applications in Audio Testing</h5>
        <h5 className="relative text-sm md:text-lg font-semibold text-black mt-2">
          APE Testing is widely used in:
        </h5>
        <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold text-black mt-2">
            <li className='pl-4'><a className="font-extrabold">Audio Codec Development: </a>Evaluating the perceptual impact of different audio codecs.
            </li>
            <li className='pl-4 mt-2'><a className="font-extrabold">Audio Enhancement Algorithms: </a>Assessing the effectiveness of noise reduction, echo cancellation and other audio enhancement techniques.
            </li>
            <li className='pl-4 mt-2'><a className="font-extrabold">Consumer Electronics: </a>Testing the audio quality of headphones, speakers and other audio devices to ensure high user satisfaction.
            </li>
        </ol>
        <h6 className="relative text-sm md:text-lg font-semibold text-black mt-4">
          APE Testing is an essential method for evaluating the perceptual quality of audio. It provides valuable insights into how different audio processing techniques affect 
          the listening experience, guiding improvements and innovations in audio technology. The PQToolkit makes conducting APE Testing accessible and efficient, enabling researchers and 
          developers to gather detailed, subjective feedback to enhance audio quality.
        </h6>
      </div>
    </div>
  </div>
  )
}

export default AboutMushra
