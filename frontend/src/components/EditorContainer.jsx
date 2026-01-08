import { useEffect } from "react"
import Editor from "./Editor"
import { fileStore, saveFileToDB } from "../stores/fileStore"
import { useNavigate, useParams } from "react-router-dom";
import instance from "./../config/axiosConfig"
import authStore from "../stores/authStore";
import { flushAutoSave } from "../controllers/autoSaveControllers";

const EditorContainer = () => {
    const addExistingFile = fileStore((state) => state.addExistingFile);
    const user = authStore((state) => state.user);
    const updateFileDelta = fileStore((state) => state.updateFileDelta);
    const currentPage = fileStore((state) => state.currentPage);

    const fileId = useParams().id;

    const navigate = useNavigate();


    // TODO: Handle page switch auto-save
    // const pageSwitchHandler = async (quillRef, nextPage) => {
    //     const contents = quillRef.current.getContents();
    //     const snapshot = updateFileDelta(currentPage, contents);

    //     await flushAutoSave(() => {
    //         saveFileToDB(snapshot);
    //     });

    // }


    useEffect(() => {
        const fetchFile = async () => {
            instance.get(`/documents/${fileId}`).then((res) => {
                const fileToStore = {
                    fileId: res.data.document._id,
                    fileTitle: res.data.document.title,
                    pages: res.data.document.pages.length > 0 ? res.data.document.pages : [{ pageNumber: 1, delta: null }],
                    currentPage: 1,
                    createdAt: res.data.document.createdAt,
                    updatedAt: res.data.document.updatedAt,
                }

                console.log("Storing fetched document to store:", fileToStore);
                addExistingFile(fileToStore);
            }).catch((err) => {
                console.error("Error fetching document:", err);
            }).finally(() => {

            })
        }

        fetchFile();
    }, [fileId, addExistingFile]);

    return (
        <div className="editor-container row-start-2 row-span-1 col-span-1">
            <Editor />
        </div>
    )
}

export default EditorContainer