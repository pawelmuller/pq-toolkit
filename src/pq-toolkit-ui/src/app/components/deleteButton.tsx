import { useState } from "react"
import { FaCheck, FaTrash } from 'react-icons/fa'
import { FaXmark } from "react-icons/fa6";
const DeleteButton = (props: any): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    return <div
        className='mr-4'
    >
        {deleteConfirm ?
            <div className="flex flex-row">
                <FaXmark size={26} className="fill-red-500 mr-2 cursor-pointer" onClick={() => setDeleteConfirm(false)} />
                <FaCheck size={23} className="fill-green-500 cursor-pointer" onClick={() => props.deleteExperiment(props.name)} />
            </div>
            :
            <FaTrash size={25} className="fill-red-500 cursor-pointer" onClick={() => setDeleteConfirm(true)} />}


    </div>

}

export default DeleteButton
