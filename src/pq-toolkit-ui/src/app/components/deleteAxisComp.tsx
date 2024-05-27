import { useState } from "react";
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import {
    type ABTest, type ABXTest, type FullABXTest, type MUSHRATest, type APETest, type BaseTest,
    type Question
} from '@/lib/schemas/experimentSetup'

interface DeleteAxisCompProps {
    index: number
    setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
    currentTest: ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest
}

const DeleteAxisComp = (props: DeleteAxisCompProps): JSX.Element => {
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

    return (
        <div>
            {deleteConfirm ? (
                <div className="flex flex-row mr-1">
                    <FaTimes className="fill-red-500 mr-2 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={25} onClick={() => { setDeleteConfirm(false) }} />
                    <FaCheck className="fill-green-500 cursor-pointer transform hover:scale-125 duration-300 ease-in-out" size={24} onClick={() => {
                        setDeleteConfirm(false)
                        props.setCurrentTest((oldTest) => {
                            if ('axis' in oldTest) {
                                return {
                                    ...oldTest,
                                    axis: oldTest.axis.filter((_: Question, i: number) => i !== props.index)
                                }
                            } else {
                                return {
                                    ...oldTest
                                }
                            }
                        })
                    }} />
                </div>
            ) : (
                <FaTrash className="fill-red-500 cursor-pointer mr-0 sm:mr-2 transform hover:scale-125 duration-300 ease-in-out" size={25} onClick={() => { setDeleteConfirm(true) }} />
            )}
        </div>
    );
};

export default DeleteAxisComp
