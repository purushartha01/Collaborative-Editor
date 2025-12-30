import { useEffect, useState } from "react";
import { BarSpinner, SearchIcon } from "./Icons"
import instance from './../config/axiosConfig';
import useDebounce from "../hooks/useDebounce";
import { fileStore } from "../stores/fileStore";
import { useNavigate } from 'react-router-dom';


const RecentFileList = ({ handleOpenFile }) => {
    const [resultFiles, setResultFiles] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        const fetchRecentFiles = async () => {
            instance.get('/documents/').then((res) => {
                console.log("Fetched recent files:", res.data.documents);
                setResultFiles(res.data.documents?.collaborations);
            }).catch((err) => {
                console.error("Error fetching recent files:", err);
            }).finally(() => {
                setLoading(false);
            });
        }
        fetchRecentFiles();
    }, []);

    return <>
        {
            loading ?
                <BarSpinner className="place-self-center h-6 aspect-square text-black" /> :
                (
                    resultFiles.length === 0 ?
                        (
                            <div className="w-full h-full flex flex-col justify-center items-center text-gray-500">
                                <SearchIcon className="w-16 h-16 mb-4" />
                                <h2 className="text-xl">No files found</h2>
                                <p className="text-center px-4">Try creating a new document.</p>
                            </div>
                        )
                        :
                        resultFiles.map((file, index) => (
                            <button key={file._id} className="p-2 w-full border-b border-gray-300 hover:bg-gray-100 cursor-pointer flex justify-between items-center px-2" onClick={(e) => handleOpenFile(e, file._id)}>
                                <h2 className="text-lg font-medium">{file.title}</h2>
                                <span className="text-sm text-gray-500">Last updated: {new Date(file.updatedAt).toLocaleString()}</span>
                            </button>
                        ))
                )
        }
    </>

}



const OpenFile = ({ closePortal }) => {
    const [searchResults, setSearchResults] = useState([]);
    const { value, setValue, debouncedValue, makeApiCall, cancelApiCall } = useDebounce("", 500);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();


    const handleSearch = (e) => {
        setValue(e.target.value);
    }

    const handleOpenFile = (e, fileId) => {
        e.preventDefault();
        console.log("Opening file with ID:", fileId);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        hashParams.delete('openPortal');
        const newHash = hashParams.toString();
        window.location.hash = newHash ? `#${newHash}` : '';
        navigate(`document/${fileId}`)
    }

    useEffect(() => {
        if (debouncedValue.trim().length < 3) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        console.log("Searching for files with term:", debouncedValue);
        setIsSearching(true);
        setShowDropdown(true);
        makeApiCall({
            method: 'GET',
            url: `/documents/?fileTitle=${encodeURIComponent(debouncedValue)}`,
            timeout: 5000
        }).then((result) => {
            console.log("Search API call result:", result);
            if (result.success) {
                setSearchResults(result.data.documents || []);
                // console.log("Search results updated:", result.data.files);
            } else if (result.cancelled) {
                // console.log("Search API call was cancelled.");
            }
        }).catch((err) => {
            console.error("Error searching files:", err);
        }).finally(() => {
            // console.log("Search API call completed.");
            setIsSearching(false);
        });
    }, [debouncedValue, makeApiCall]);

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
                        value={value}
                        onChange={handleSearch}
                    />
                    <button
                        className="w-20 aspect-9/4 absolute right-1 top-1/2 -translate-y-1/2 bg-(--background) cursor-pointer border text-white rounded-sm hover:bg-gray-500 active:scale-95"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {
                        showDropdown &&
                        <div className="absolute top-[105%] h-fit w-full left-0 bg-gray-200 text-white p-2 rounded shadow-md text-sm z-10">
                            {isSearching ? <BarSpinner className="place-self-center h-6 aspect-square text-black" /> : null}
                            {!isSearching && (searchResults.length === 0 ? <div className="text-gray-700 place-self-center">No files found.</div> :
                                searchResults.map((file, index) => {
                                    return (
                                        <button key={index} className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer flex w-full justify-between items-center px-2" onClick={(e) => handleOpenFile(e, file._id)}>
                                            <h2 className="text-lg text-black font-medium">{file.title}</h2>
                                            <span className="text-sm text-black">Last updated: {new Date(file.updatedAt).toLocaleString()}</span>
                                        </button>
                                    )
                                }))
                            }
                        </div>
                    }
                </div>
            </div>
            <h1 className="text-xl pt-1 pl-2 w-full border-b border-gray-800">Recent Files:</h1>
            <div className="w-full h-full overflow-y-auto styled-scrollbar">
                <RecentFileList handleOpenFile={handleOpenFile} />
            </div>

        </div>
    )
}



export default OpenFile