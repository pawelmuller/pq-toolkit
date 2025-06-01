'use client';
import Header from '@/lib/components/basic/header';
import ScrollToTopButton from '@/lib/components/basic/scrollToTopButton';
import type { UserData } from '@/lib/schemas/apiResults';
import { userFetch } from '@/lib/utils/fetchers';
import Loading from '@/app/loading';
import useSWR from 'swr';
import LoginPage from '@/lib/components/login/login-page';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Guide = (): JSX.Element => {
  const router = useRouter();
  const { data: userData, isLoading } = useSWR<UserData>('/api/v1/auth/user', userFetch);
  const isLoggedIn = !!userData?.is_active;

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) return <Loading />;
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900 text-black dark:text-neutral-200">
      <Header />
      <div className="relative flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-14">
        <div className="relative text-center mb-sm">
          <h1
            className="relative text-4xl md:text-6xl font-bold mt-1 md:mt-6 pb-1.5 pt-1.5 before:absolute before:inset-0 before:animate-typewriter before:bg-gray-100
            dark:before:bg-stone-900 after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-black dark:after:bg-neutral-200"
          >
            Administrator Guide
          </h1>
        </div>
        <div className="relative mb-md ml-7 md:ml-20 mr-7 md:mr-20 p-1 md:p-8 mt-1 md:mt-2">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              This guide provides detailed instructions for experiment management, specifically designed for new users.
            </h2>
          </div>

          <h3 className="text-lg font-semibold mt-6">Adding an Experiment</h3>
          <p>
            To add a new experiment, enter a name in the field next to the 
            <span 
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold mx-2 leading-none">
              +
            </span> 
            button, then confirm by clicking the button or pressing the Enter key.
          </p>

          <p>
            At this point, a tile with the name of the newly created experiment
            will appear in the Experiments list. Clicking this tile opens the
            test editor, where tests comprising the experiment can be
            configured.
          </p>

          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Add-exp.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-0 italic text-gray-500 dark:text-gray-400">
              Figure 1: The interface for adding new experiments.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-6">Uploading Samples</h3>
          <p>
            The first step in creating an experiment is submitting samples that will be used in the experiment. As a user, there are two options available:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Submit a new sample.</li>
            <li>Use an already submitted sample.</li>
          </ul>
          <p>
            To begin, click the 
            <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-blue-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Add samples
            </span>
            button. A window will appear, allowing you to manage your sample selection.
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Add-sample.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 2: The interface for submitting samples.
            </p>
          </div>
          <p className="mt-4">
            If the audio material required for the experiment is not already in
            the database, upload it by selecting a file from your computer (using
            <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-blue-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Browse Audio Files
            </span>
            button).
          </p>
          <p className="mt-2"> 
            Files that have already been successfully sumbitted are located in the right-hand column of the window
            under <em>Available Samples</em> section. To include available samples in the experiment, click the
            <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-blue-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Select
            </span>
            button next to each desired track. 
          </p>
          <p className="mt-2"> 
            All samples can be previewed using the built-in player. 
          </p>
          <p className="mt-2">
              Remember to <strong className="font-bold">ALWAYS</strong> finish process (no matter if you add new samples or use existing ones)
              by clicking
              <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-blue-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Sumbit Samples
            </span>
            button. Only then samples are associated with the experiment that is being created.
          </p> 

          <h3 className="text-lg font-semibold mt-6">Constructing the Tests</h3>
          <p>
            To add the tests in your experiment, you can:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Create every test manually.</li>
            <li>Upload a <em>.json</em> config file, containing the definitions of all tests.</li>
          </ul>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Add-test.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 3: The interface for tests construction.
            </p>
          </div>
          <p className="mt-2">
            If you choose manual approach, click the 
            <span 
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold mx-2 leading-none">
              +
            </span> 
            button, inside the <em>CREATE TESTS</em> section. A tile
            will appear below, and clicking it opens a configuration window for
            the test, where four test types are available: <em>MUSHRA, AB, ABX</em> and
            <em> APE.</em>
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Add-test-config.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 4: The interface for test configuration.
            </p>
          </div>
          <p className="mt-2">
              Remember to <strong className="font-bold">ALWAYS</strong> finish process of test creation by clicking
              <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-blue-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Save
            </span>
            button.
          </p> 
          <p className="mt-2">
            If you prefer not to create tests manually every time you setup new experiment, you may prepare a config file and upload
            directly, also in <em>CREATE TESTS</em> section. We provide an example file here:{" "}
            <a
              href="https://github.com/RadekGod/pq-toolkit/blob/main/src/pq-toolkit-ui/public/examples/demo-1/setup.json"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              example .json config file
            </a>. 
          </p>
          <p className="mt-2">
            If you wish to understand how each of the available tests work, please refer to:{" "}
            <a
              href="https://radekgod.github.io/pq-toolkit/getting-started/test-types-overview/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              test types overview
            </a>. 
          </p>

          <h3 className="text-lg font-semibold mt-6">Optional steps</h3>
          <p>
            There is a possibility of adding opening and end credits for each experiment.
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Add-optional.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 5: The interface for credits section.
            </p>
          </div>
          <p className="mt-2"> 
            This step is 100% optional, leaving both fields blank will not cause any error. 
          </p>

          <h3 className="text-lg font-semibold mt-6">Saving the Experiment</h3>
          <p>
            After you have finished your experiment setup, remember to <strong className="font-bold">ALWAYS </strong> 
            finish process by clicking <em>Floppy Disk</em> (save) icon and then <em>Cross</em> (window exit) icon.
            Both icons are available in the top-right corner of the configuration
            window. Only then experiment is fully available to the users.
          </p>

          <h3 className="text-lg font-semibold mt-6">System limitations</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Maximum number of experiments:</strong> 15</li>
            <li><strong>Maximum number of tests per experiment:</strong> 10</li>
            <li><strong>Maximum file upload size:</strong> 6 MB</li>
            <li>
              <strong>Maximum string lengths:</strong>
              <ul className="list-disc list-inside ml-6">
                <li>Experiment name: 50 characters</li>
                <li>Experiment Description: 200 characters</li>
                <li>End credits: 100 characters</li>
              </ul>
            </li>
            <li><strong>Maximum number of stored samples:</strong> 200</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">
            Experiment Results
          </h3>
          <p>
            To access the results of conducted experiments, go to <em>Experiment review </em>
            tab (accessible via the dropdown menu in the top-right corner).
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Download-All.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 6: The interface for accessing experiment results.
            </p>
          </div>
          <p>
            Clicking the 
            <span 
              className="inline-flex items-center justify-center px-2 py-[0.1rem] bg-violet-500 text-white rounded-md font-semibold ml-1 mr-1 text-sm leading-tight align-middle">
              Download results
            </span>
            button allows you to retrieve the results of the entire experiment, 
            including all associated tests. Both <em>csv</em> and <em>pdf </em> 
            formats are available.

            If you wish to preview the results of individual tests within an experiment, open the corresponding experiment tile. 
            Inside, you'll find charts presenting statistics for each test, along with the option to download a <em>csv </em> 
            file containing results specific to that test.
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Download-Mushra.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 7: Interface for reviewing individual test results.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-6">
            Experiment Management
          </h3>
          <p>
            The <em>Experiment Management</em> tab allows you to preview an experiment's 
            setup without entering the modification menu. From this view, it is also possible to permanently delete the experiment.
          </p>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Manage-All.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 8: Interface for experiment management.
            </p>
          </div>
          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Manage-In.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 9: Interface for previewing experiment configuration and test list.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-6">Rating Audio Samples</h3>
          <p>
           Each user has access to the <em>Sample Ranking</em> section. From this view, users can rate each sample uploaded by the administrator on a scale from 1 to 5. 
           The results can also be sorted by highest or lowest ratings. 
           
           For administrators, this section additionally allows uploading new samples and removing currently stored ones.
          </p>

          <div className="flex flex-col items-center my-1">
            <img
              src="/guide_photos/Ranking.png"
              alt="Adding an experiment"
              className="my-1 rounded-md shadow-lg"
            />
            <p className="text-sm text-center mt-1 italic text-gray-500 dark:text-gray-400">
              Figure 10: Interface for samples rating.
            </p>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Guide;
