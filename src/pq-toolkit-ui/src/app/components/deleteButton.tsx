import { useCallback, useEffect, useState } from "react"
import Header from "@/lib/components/basic/header"
import { FaCheck, FaTrash } from 'react-icons/fa'
const DeleteButton = (props: any): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    return <button
        className='mr-4'
        onClick={() => {
            if (deleteConfirm) {
                props.deleteExperiment(props.name)
            }
            else {
                setDeleteConfirm(true)
            }
        }}
    >
        {deleteConfirm ? <FaCheck className="fill-green-500" /> : <FaTrash className="fill-red-500" />}


    </button>

}

export default DeleteButton
