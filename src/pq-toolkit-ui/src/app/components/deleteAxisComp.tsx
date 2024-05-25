import { useState } from "react";
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

interface DeleteAxisCompProps {
    index: number
    setCurrentTest: Function
    currentTest: any
}

const DeleteAxisComp = (props: DeleteAxisCompProps): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    return (
        <div>
            {deleteConfirm ? (
                <div className="flex flex-row mr-1">
                    <FaTimes className="fill-red-500 mr-2 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={25} onClick={() => setDeleteConfirm(false)} />
                    <FaCheck className="fill-green-500 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={24} onClick={() => {
                        setDeleteConfirm(false)
                        props.setCurrentTest({
                            ...props.currentTest,
                            axis: props.currentTest.axis!.filter((_: any, i: number) => i !== props.index)
                        })
                    }} />
                </div>
            ) : (
                <FaTrash className="fill-red-500 cursor-pointer mr-0 sm:mr-2 transform hover:scale-125 duration-300 ease-in-out" size={25} onClick={() => setDeleteConfirm(true)} />
            )}
        </div>
    );
};

export default DeleteAxisComp
