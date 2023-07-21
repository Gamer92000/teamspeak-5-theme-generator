import { useState, useRef } from "react";
import './drag_n_drop.css';
import JSZip from "jszip";
import { useComponents } from "../App";

const DragNDrop = () => {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);
  
  const components = useComponents(state => state.componentList);
  const setComponentValues = useComponents(state => state.setComponentValues);

  const handleFiles = async (files) => {
    // check that only one file is uploaded
    if (files.length !== 1) {
      alert("Please only select one file.");
      return;
    }
    // check that the file is a zip file
    if (files[0].type !== "application/x-zip-compressed") {
      alert("Please select a zip file.");
      return;
    }
    // read the zip file
    const zip = await JSZip.loadAsync(files[0]);
    // find first folder in zip file
    let folder = Object.values(zip.files).find(file => file.dir);
    // check that the zip file contains a folder
    if (!folder) {
      alert("The zip file seems to be invalid.");
      return;
    }
    folder = await zip.folder(folder.name);

    // check that the folder contains an internal.txt file
    if (!folder.file("internal.txt")) {
      alert("The zip file seems to be invalid.");
      return;
    }

    // read the internal.txt file
    const internal = await folder.file("internal.txt").async("string");
    
    console.log(internal);

    const selection = internal.split('-');
    // eslint-disable-next-line no-sequences
    const values = components.reduce((acc, curr) => (acc[curr.id] = false, acc), {});
    selection.forEach(id => {
      values[parseInt(id)] = true;
    });
    
    setComponentValues(values);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('selection', selection.join('-'));
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  }

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  
  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
        <div>
          <p>Drag and drop a theme here or</p>
          <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
          <p>to edit it.</p>
        </div> 
      </label>
      { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
    </form>
  );
}

export default DragNDrop;