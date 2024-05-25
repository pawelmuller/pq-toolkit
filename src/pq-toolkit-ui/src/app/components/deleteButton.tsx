import { useState } from "react"
import { FaCheck, FaTrash } from 'react-icons/fa'
import { FaXmark } from "react-icons/fa6";
const DeleteButton = (props: any): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    return <div
        className='mr-4'
    >
        {deleteConfirm ?
            <div className="flex flex-row -mr-4">
                <FaXmark className="fill-red-500 mr-2 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={26} onClick={() => { setDeleteConfirm(false) }} />
                <FaCheck className="fill-green-500 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={24} onClick={() => {
                    props.deleteExperiment(props.name)
                    setDeleteConfirm(false)
                    if (props.selectedExperiment === props.name) {
                        props.setSelectedExperiment(undefined)
                    }
                }} />
            </div>
            :
            <FaTrash className="fill-red-500 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={27} onClick={() => { setDeleteConfirm(true) }} />}
    </div>

}

export default DeleteButton
