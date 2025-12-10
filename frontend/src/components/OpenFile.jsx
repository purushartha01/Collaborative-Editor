import { useEffect, useState } from "react";
import { SearchIcon } from "./Icons"
import instance from './../config/axiosConfig';


const OpenFile = ({ closePortal }) => {

    const [fileName, setFileName] = useState("");

    const handleSearch = () => {
        // console.log("Searching for file:", fileName);
    }

    return (
        <div className="h-full w-full grid grid-rows-[2fr_0.5fr_5fr] gap-2 items-center">
            <div className="w-full">
                <h1 className="text-2xl pl-2">Open File</h1>
                <div className="relative w-full flex items-center mt-2">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 ml-2">
                        <SearchIcon className="w-5 h-5 text-gray-500" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search file name..."
                        className="pl-8 pr-24 py-1 border rounded w-full text-lg"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                    <button
                        className="w-20 aspect-9/4 absolute right-1 top-1/2 -translate-y-1/2 bg-(--background) cursor-pointer border text-white rounded-sm hover:bg-gray-500 active:scale-95"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
            <h1 className="text-xl pt-1 pl-2 w-full border-b border-gray-800">Recent Files:</h1>
            <div className="w-full h-full overflow-y-auto styled-scrollbar">
                <RecentFileList />
            </div>

        </div>
    )
}

const RecentFileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Fetch recent files from backend or local storage

        const fetchRecentFiles = async () => {
            await instance.get("/").then((res) => {
                if (res.status.toString().startsWith(200)) {
                    // console.log("Recent files fetched successfully:", res.data.recentFiles);
                }
                // setFiles(res.data.recentFiles);

            }).catch((err) => {
                console.error("Error fetching recent files:", err);
            }).finally(() => {

            });

        }

        // console.log("Fetching recent files...");
        // fetchRecentFiles();
        setFiles([
            { name: "Project_Plan.docx", lastOpened: "2024-10-01" },
            { name: "Meeting_Notes.txt", lastOpened: "2024-09-28" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
            { name: "Budget.xlsx", lastOpened: "2024-09-25" },
        ]);
    }, []);

    return <>
        {
            files.map((file, index) => (
                <div key={index} className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer flex justify-between items-center px-2">
                    <h2 className="text-lg font-medium">{file.name}</h2>
                    <span className="text-sm text-gray-500">Last opened: {file.lastOpened}</span>
                </div>
            ))
        }
    </>
}


export default OpenFile