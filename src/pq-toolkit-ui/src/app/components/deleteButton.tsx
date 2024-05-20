import { useCallback, useEffect, useState } from "react"
import Header from "@/lib/components/basic/header"
import { FaCheck, FaTrash } from 'react-icons/fa'
import { FaXmark } from "react-icons/fa6";
const DeleteButton = (props: any): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    return <div
        className='mr-4'
    >
        {deleteConfirm ?
            <div className="flex flex-row">
                <FaXmark className="fill-red-500 mr-2 cursor-pointer" onClick={() => setDeleteConfirm(false)} />
                <FaCheck className="fill-green-500 cursor-pointer" onClick={() => {
                    props.deleteExperiment(props.name)
                    setDeleteConfirm(false)
                    if (props.selectedExperiment === props.name) {
                        props.setSelectedExperiment(undefined)
                    }
                }} />
            </div>
            :
            <FaTrash className="fill-red-500 cursor-pointer" onClick={() => setDeleteConfirm(true)} />}
    </div>

}

export default DeleteButton