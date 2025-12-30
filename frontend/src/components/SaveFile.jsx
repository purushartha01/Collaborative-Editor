import { useState } from "react";
import { fileStore } from "../stores/fileStore";
import instance from "../config/axiosConfig";
import { toast } from "sonner";
import { BarSpinner } from "./Icons";


const SaveFile = () => {
  // TODO: ensure that in case the file already exists, its title is shown in input and prompt the user for confirmation before overwriting
  const currentFileName = fileStore((state) => state.fileTitle);
  const fileId = fileStore((state) => state.fileId);
  const filePages = fileStore((state) => state.pages);


  const updateFileName = fileStore((state) => state.updateFileName);
  const [fileName, setFileName] = useState(currentFileName ?? "untitled");

  const [isSaving, setIsSaving] = useState(false);

  console.log("SaveFile rendered with currentFileName:", currentFileName);

  const handleFileSave = async (e) => {
    e.preventDefault();
    if (fileName === currentFileName) {
      console.log("File name unchanged, no update needed");
      return;
    }

    if (!fileName.trim()) {
      console.warn("File name cannot be empty");
      return;
    }
    setIsSaving(true);

    await updateFileName(fileName);

    instance.put(`/documents/${fileId}`, { title: fileName, pages: filePages }).then((res) => {
      console.log("File saved successfully:", res.data);
      toast.success(res.data.message || "File saved successfully");
    }).catch((err) => {
      toast.error(err.response?.data?.message || "Error saving file");
      console.error("Error saving file:", err);
    }).finally(() => {
      setIsSaving(false);
    })
  }

  return (
    <div className="h-full w-full grid grid-rows-12 gap-2 p-4">
      <h1 className="text-2xl ">Save File</h1>

      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onFocus={(e) => { e.target.select() }}
        className="border border-gray-300 rounded px-2 py-1"
      />
      <button
        className="button h-10 w-full flex max-w-max px-4 py-2"
        onClick={handleFileSave}
      >
        {isSaving ? <BarSpinner /> : "Save"}
      </button>
      {/* <div className="">

      </div> */}
    </div>
  )
}

export default SaveFile