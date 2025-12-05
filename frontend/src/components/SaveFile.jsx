import { useState } from "react";

const SaveFile = () => {
  // TODO: ensure that in case the file already exists, its title is shown in input and prompt the user for confirmation before overwriting
  const [fileName, setFileName] = useState('untitled.txt');

  const handleFileSave = (e) => {
    e.preventDefault();
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
        className="button max-w-max px-4 py-2"
        onClick={handleFileSave}
      >
        Save
      </button>
      <div className="">

      </div>
    </div>
  )
}

export default SaveFile