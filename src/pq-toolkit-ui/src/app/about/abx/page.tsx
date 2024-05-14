'use client'
import Header from '@/lib/components/basic/header'

const About = (): JSX.Element => {
  return (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-10">
      <div className="relative text-center mb-md">
        <h1 className="relative text-3xl md:text-6xl font-bold text-black mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriterABX before:bg-gray-100
            after:absolute after:inset-0 after:w-[0.125em] after:animate-caretABX after:bg-black">ABX Testing</h1>
      </div>
      <div className="relative mb-md ml-20 mr-20 p-8 mt-2">
        <h1 className="relative text-sm md:text-lg font-semibold text-black">
        ABX Testing is a specialized form of comparative testing used to determine perceptual differences between two stimuli. It is widely used in fields such as audio 
        engineering, psychology, and product testing to evaluate the perceptual qualities of various elements.
        </h1>
        <h2 className='relative text-xl md:text-3xl font-bold text-black mt-6'>What is ABX Testing?</h2>
        <h3 className="relative text-sm md:text-lg font-semibold text-black mt-2">
        ABX Testing involves three samples: A, B, and X. Samples A and B are different from each other, and X is either identical to A or B. The participant’s task is to 
        identify whether X matches A or B. This method helps determine if the differences between A and B are perceptible to the human ear.
        </h3>
        <h4 className='relative text-xl md:text-3xl font-bold text-black mt-6'>Advantages of ABX Testing</h4>
        <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold text-black mt-2">
            <li className='pl-4'>High Sensitivity: ABX testing is highly sensitive to small differences between samples, making it effective for subtle perceptual studies.
            </li>
            <li className='pl-4 mt-2'>Reduced Bias: The random assignment of X helps reduce biases that might influence participants decisions.
            </li>
            <li className='pl-4 mt-2'>Objective Assessment: The method provides objective data on perceptual differences, aiding in precise evaluations.
            </li>
        </ol>
        <h5 className='relative text-xl md:text-3xl font-bold text-black mt-6'>Applications in Audio Testing</h5>
        <h5 className="relative text-sm md:text-lg font-semibold text-black mt-2">
          In audio testing, ABX testing is invaluable for:
        </h5>
        <ol className="list-disc list-inside relative text-sm md:text-lg font-semibold text-black mt-2">
            <li className='pl-4'>Codec Evaluation: Comparing different audio codecs to determine which provides better sound quality.
            </li>
            <li className='pl-4 mt-2'>Effectiveness of Audio Processing: Assessing different audio processing techniques to find the one that enhances audio quality the most.
            </li>
            <li className='pl-4 mt-2'>User Preference Studies: Understanding user preferences for different audio settings or enhancements.
            </li>
        </ol>
        <h6 className="relative text-sm md:text-lg font-semibold text-black mt-4">
        AB Testing is a powerful method for evaluating and comparing different variables. In audio testing, it provides valuable insights into user preferences and audio quality, 
        guiding the development of better audio technologies. With tools like the PQ-Toolkit, conducting AB Testing becomes more accessible and efficient, enabling researchers and 
        developers to make informed decisions based on solid data.
        </h6>
      </div>
    </div>
  </div>
  )
}

export default About
