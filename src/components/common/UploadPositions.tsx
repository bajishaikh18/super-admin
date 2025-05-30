import { usePapaParse } from "react-papaparse";
import styles from "./Common.module.scss";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";


const CSVColumns = ["Position", "Experience", "Salary"];

export const UploadPositions = ({handleUploadProcessed}:{handleUploadProcessed:(data: any)=>void}) => {
  const { readString } = usePapaParse();
  const [selectedFile,setSelectedFile] = useState<File|null>(null);
  const [error,setError] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (!file) {
        return;
      }
      setSelectedFile(file)
    const fileContent = await file.text();
    readString(fileContent, {
        worker: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        complete: (results) => {
           
            const isValid = CSVColumns.every((x) =>
              results.meta.fields?.includes(x)
            );
            if(!isValid){
              setError(true)
            }else{
              setError(false)
            }
            if (results.meta.fields?.length) {
              handleUploadProcessed(results.data)
          }
        }})
  }, []);

  const { getRootProps, getInputProps, isDragActive, open, fileRejections } =
    useDropzone({
        accept: {
            'text/csv': [],
            },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
      onDrop,
    });
  return (
    <div className={styles.uploadSection} {...getRootProps()}>
      <input accept=".docx,.pdf" {...getInputProps()} />
      <div className={styles.uploadHeader}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 8H14C14.1326 8 14.2598 8.05268 14.3536 8.14645C14.4473 8.24021 14.5 8.36739 14.5 8.5V12.5C14.5 12.6326 14.4473 12.7598 14.3536 12.8536C14.2598 12.9473 14.1326 13 14 13H2C1.86739 13 1.74021 12.9473 1.64645 12.8536C1.55268 12.7598 1.5 12.6326 1.5 12.5V8.5C1.5 8.36739 1.55268 8.24021 1.64645 8.14645C1.74021 8.05268 1.86739 8 2 8H5"
            stroke="#0045E6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 8V1.5"
            stroke="#0045E6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 4.5L8 1.5L11 4.5"
            stroke="#0045E6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11.75 11.25C12.1642 11.25 12.5 10.9142 12.5 10.5C12.5 10.0858 12.1642 9.75 11.75 9.75C11.3358 9.75 11 10.0858 11 10.5C11 10.9142 11.3358 11.25 11.75 11.25Z"
            fill="#0045E6"
          />
        </svg>
        {isDragActive ? <p>Drop the files here ...</p> : <p>Upload job positions</p>}
      </div>
      <p
        className={`${styles.fileInfo} ${
          fileRejections.length > 0 ? styles.error : ""
        }`}
      >
        .csv is allowed. File size should not exceed 5 MB
      </p>
      {
        error &&   <p className={`${styles.fileInfo} ${styles.error}`}>
          Looks like csv is invalid. check if it contains following columns {CSVColumns.join(", ")}
      </p>
      }
     
      <div className={styles.userUploadActions}>
      {selectedFile ? (
          <p className={styles.selectedFileName}>
            Selected file: {selectedFile.name}
          </p>
        ) :   <Button className={`outlined bg-white ${styles.outlinedButton}`}  onClick={open}>
        Browse Files
      </Button>}
      </div>
    </div>
  );
};
