import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

export default function FileUpload({ name, onFileChange }) {
    const [files, setFiles] = useState([]);

    return (
        <FilePond
            files={files}
            onupdatefiles={(fileItems) => {
                setFiles(fileItems);
                if (onFileChange) {
                    onFileChange({
                        target: {
                            name: name,
                            value: fileItems.length > 0 ? fileItems[0].file : null
                        }
                    });
                }
            }}
            allowMultiple={false}
            maxFiles={1}
            name={name}
            labelIdle={`Drag & Drop your ${name || 'file'} or <span class="filepond--label-action">Browse</span>`}
        />
    );
}