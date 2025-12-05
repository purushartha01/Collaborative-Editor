import { useEffect, useState } from "react";


const NewFile = ({closePortal}) => {

    const [fileName, setFileName] = useState("");
    const [collaborators, setCollaborators] = useState([]);

    const validateFileName = () => {
        return fileName.trim().length > 0;
    }

    const handleCreateFile = (e) => {
        e.preventDefault();
        if (!validateFileName()) {
            console.error("Please enter a valid file name.");
            return;
        }
        closePortal();
    }

    // useEffect(() => {
    //     return () => {
    //         setFileName("");
    //         setCollaborators([]);
    //     }
    // }, []);  

    return (
        <div className="h-full w-full grid grid-rows-8 gap-2 py-4 items-center  ">
            <h1 className="text-3xl grid row-start-1 row-span-1">Create New File</h1>
            <div className="row-start-2 row-span-2 grid grid-rows-5 gap-1 ">
                <label className="font-semibold mb-1 row-start-3 row-span-1">File Name</label>
                <input type="text" className="w-full p-2 border row-start-4 row-span-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter file name" />
            </div>
            <div className="row-start-4 row-span-3">
                <label className="font-semibold mb-1">Invite Collaborators</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter usernames" />
            </div>
            <button
                className="row-start-8 row-span-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
                onClick={handleCreateFile}
            >
                Create File
            </button>
        </div>
    )
}


export default NewFile