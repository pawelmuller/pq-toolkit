import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import { FaCheckCircle, FaFile, FaFileExport } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import axios from 'axios';

enum UploadStatus {
  Created = 'created',
  Uploading = 'uploading',
  Uploaded = 'uploaded',
  Error = 'error'
}

interface BaseFileUploaderProps {
  url: string
  onFileUploaded: (success: boolean) => void | Promise<void>
  filetypes?: string
  className?: string
  multi?: boolean
  dataKey?: string
}

interface FileUploaderSingleProps extends BaseFileUploaderProps {
  multi?: false
}

interface FileUploaderMultiProps extends BaseFileUploaderProps {
  multi: true
}

interface FileRecordProps {
  url: string
  file: File
  completeCallback: (success: boolean) => Promise<void>
}

/**
 * File uploader component that uploads files to the server and returns the asset paths
 * WARNING: Accepted filetypes are ignored when dropping files into the component
 * @param url url to upload endpoint
 * @param onFileUploaded callback for completed upload
 * @param filetypes accepted filetypes in IANA format, separated by comma e.g. "application/pdf, image/*" @link https://www.iana.org/assignments/media-types/media-types.xhtml @defaultValue any filetype
 * @param className additional class name
 * @param multi if true, allows uploading multiple files at once
 * @param dataKey key for the component, must be set if there are multiple file uploaders on the same page
 * @returns File uploader component
 */
const FileUploader = ({
  url,
  filetypes, // accepted filetypes in IANA format, separated by comma e.g. "application/pdf, image/*" https://www.iana.org/assignments/media-types/media-types.xhtml
  className,
  multi,
  onFileUploaded,
  dataKey
}: FileUploaderSingleProps | FileUploaderMultiProps): JSX.Element => {
  if (filetypes == null) {
    filetypes = '*/*';
  }

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [shouldHighlight, setShouldHighlight] = useState(false);

  const preventDefaultHandler = (e: React.DragEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const selectFilesHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const fileList = event.target.files;
    if (fileList != null) {
      const files: File[] | null = new Array<File>();
      for (let i = 0; i < fileList.length; i++) {
        if (fileList.item(i) != null) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          files[i] = fileList.item(i)!;
        }
      }
      setUploadCounter((prev) => prev + 1);
      setFileList(files);
    }
  };

  const dropFilesHandler = (e: React.DragEvent<HTMLElement>): void => {
    preventDefaultHandler(e);
    let files;
    if (multi === true) files = Array.from(e.dataTransfer.files);
    else files = [e.dataTransfer.files[0]];
    setUploadCounter((prev) => prev + 1);
    setFileList(files);
    setShouldHighlight(false);
  };

  return (
    <div className={`flex w-full z-20 ${className ?? ''}`}>
      <label
        htmlFor={`upload-button${dataKey}`}
        className={`bg-transparent border ${
          shouldHighlight
            ? 'border-primary-500'
            : 'border-gray-100 hover:border-primary-500 border-dashed'
        } rounded-sm w-full flex text-white cursor-pointer`}
        onDragOver={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(true);
        }}
        onDragEnter={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(true);
        }}
        onDragLeave={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(false);
        }}
        onDrop={dropFilesHandler}
      >
        {fileList == null || fileList.length === 0 ? (
          <div className="mx-auto my-sm flex flex-col items-center justify-center">
            <FaFileExport className="stroke-white fill-white w-[45px] h-[45px] rounded-full p-[8px]" />
            <h3 className="font-bold mt-xs">
              Upload file{multi === true ? 's' : ''}
            </h3>
          </div>
        ) : (
          <div className="p-sm flex flex-col gap-xs w-full">
            {fileList.map((file, index) => (
              <FileRecord
                key={`${index}${file.name}${file.size}${uploadCounter}`}
                url={url}
                file={file}
                completeCallback={async (success: boolean) => {
                  await onFileUploaded(success);
                }}
              />
            ))}
          </div>
        )}
        <input
          id={`upload-button${dataKey}`}
          type="file"
          accept={filetypes}
          onChange={selectFilesHandler}
          hidden
          multiple={multi ?? false}
        />
      </label>
    </div>
  );
};

const FileRecord = ({
  url,
  file,
  completeCallback
}: FileRecordProps): JSX.Element => {
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.Created);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    function upload(): void {
      setStatus(UploadStatus.Uploading);
      const formData = new FormData();
      formData.append('file', file);

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (event) => {
            setProgress(Math.round((100 * event.loaded) / (event.total ?? 1)));
          }
        })
        .then(async (response) => {
          setProgress(100);
          setStatus(UploadStatus.Uploaded);
          await completeCallback(true);
        })
        .catch(async (error) => {
          setStatus(UploadStatus.Error);
          await completeCallback(false);
          console.error(error);
        });
    }

    if (status === UploadStatus.Created) {
      upload();
    }
  }, [completeCallback, file, status, url]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="flex subtitle border-gray-50 rounded-sm w-full items-center p-[5px]">
      <div className="flex items-center basis-1/2">
        <FaFile className="stroke-gray-500 mr-xs h-[30px] w-[30px]" />
        {file.name} ({formatSize(file.size)})
      </div>
      <div className="flex items-center basis-1/2">
        {status === UploadStatus.Uploading ? (
          <LinearProgress
            variant="determinate"
            value={progress}
            className="w-full rounded-full"
          />
        ) : null}
        {status === UploadStatus.Uploaded ? (
          <FaCheckCircle className="stroke-primary fill-primary ml-auto" />
        ) : null}
        {status === UploadStatus.Error ? (
          <div className="ml-auto flex items-center gap-xs">
            Error
            <IoMdCloseCircle className="stroke-red-500 fill-red-500 h-sm w-sm" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FileUploader;
