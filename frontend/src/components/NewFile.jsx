import { useEffect, useState } from "react";
import authStore from '../stores/authStore';
import { toast } from 'sonner';
import { BarSpinner } from "./Icons";
import instance from "./../config/axiosConfig"

const NewFile = ({ closePortal }) => {

    const [fileName, setFileName] = useState("");
    const [collaborators, setCollaborators] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const validateFileName = () => {
        return fileName.trim().length > 0;
    }

    const handleCreateFile = (e) => {
        e.preventDefault();
        if (!validateFileName()) {
            toast.error("File name cannot be empty");
            return;
        }
        setIsCreating(true);
        console.log("File Created:", { fileName, collaborators });

        instance.post('/documents/', {
            title: fileName,
            collaborators: collaborators,
        })
            .then((res) => {
                toast.success("File created successfully");
                // Optionally, you can redirect to the new document or update the state
                console.log("Created Document:", res.data);
            })
            .catch((err) => {
                console.error("Error creating document:", err);
                toast.error("Error creating file: " + (err.response?.data?.message || err.message));
            })
            .finally(() => {
                setIsCreating(false);
                // closePortal();
            })


    }

    return (
        <div className="h-full w-full grid grid-rows-12 gap-2 py-4 items-center  ">
            <h1 className="text-3xl grid row-start-1 row-span-1">Create New File</h1>
            <div className="row-start-2 row-span-4 grid grid-rows-5 gap-0 ">
                <label className="font-semibold mb-1 row-start-3 row-span-1">File Name</label>
                <input
                    type="text"
                    className="w-full p-2 border row-start-4 row-span-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => { setFileName(e.target.value) }}
                />
            </div>
            <div className="row-start-6 row-span-3 grid gap-1">
                <label className="font-semibold mb-1">Invite Collaborators</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter usernames" />
            </div>
            <button
                className={`row-start-12 row-span-1 button button--fluid text-white font-semibold py-2 rounded-md transition-all 
                    ${isCreating ? "button--disabled" : "hover:scale-[0.96]"}`}
                onClick={handleCreateFile}
                disabled={isCreating}
            >
                {
                    isCreating ? <BarSpinner className="inline-block h-8 aspect-square" /> : "Create File"
                }
            </button>
        </div >
    )
}


export default NewFile