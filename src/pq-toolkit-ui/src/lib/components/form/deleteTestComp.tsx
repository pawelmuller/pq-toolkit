import React, { useState } from 'react';
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

interface DeleteTestCompProps {
  index: number
  experimentName: string
  setExperimentDetails: React.Dispatch<React.SetStateAction<any>> // Zmienna do aktualizacji stanu eksperymentu
  experimentDetails: any // Przechowuje szczegóły eksperymentu, w tym listę testów
}

const DeleteTestComp = (props: DeleteTestCompProps): JSX.Element => {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  // Funkcja do usuwania testu z eksperymentu
  const deleteTest = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/experiments/${props.experimentName}/tests/${props.experimentDetails.tests[props.index].testId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete test`);
      }

      // Aktualizowanie lokalnego stanu, aby usunąć test z UI
      props.setExperimentDetails((prevDetails: any) => ({
        ...prevDetails,
        tests: prevDetails.tests.filter((_: any, i: number) => i !== props.index)
      }));
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  return (
    <div>
      {deleteConfirm ? (
        <div className="flex flex-row mr-1">
          <FaTimes
            aria-label="cancel-delete"
            className="fill-red-500 mr-2 cursor-pointer transform hover:scale-125 duration-300 ease-in-out"
            size={25}
            onClick={() => {
              setDeleteConfirm(false);
            }}
          />
          <FaCheck
            aria-label="confirm-delete"
            className="fill-green-500 cursor-pointer transform hover:scale-125 duration-300 ease-in-out"
            size={24}
            onClick={() => {
              setDeleteConfirm(false);
              deleteTest();
            }}
          />
        </div>
      ) : (
        <FaTrash
          aria-label="delete-icon"
          className="fill-red-500 cursor-pointer mr-0 sm:mr-2 transform hover:scale-125 duration-300 ease-in-out"
          size={25}
          onClick={() => {
            setDeleteConfirm(true);
          }}
        />
      )}
    </div>
  );
};

export default DeleteTestComp;
