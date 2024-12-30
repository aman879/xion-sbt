import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MintProps {
    uploadToPinata: (file: File, name: string, description: string) => Promise<string>;
    mintNFT: (uri: string) => void;
    isMinting: boolean;
}

interface FileWithPreview extends File {
    preview: string;
}

const Mint: React.FC<MintProps> = ({ uploadToPinata, mintNFT, isMinting }) => {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5 MB limit");
                setFile(null);
            } else {
                setError(null);
                const previewFile = Object.assign(selectedFile, {
                    preview: URL.createObjectURL(selectedFile),
                }) as FileWithPreview;
                setFile(previewFile);
            }
        },
    });

    const clearImage = () => {
        setFile(null);
    };

    const handleMint = async () => {
        if (!file || !name || !description) {
            toast.error("Please complete all the field", {
                position: "top-right",
            })
            return;
        }

        setIsLoading(true);

        try {
            const IpfsHash = await uploadToPinata(file, name, description);
            mintNFT(IpfsHash);
            clearImage();
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white pt-10">
            <h2 className="text-3xl font-bold mb-6">Mint Your SBT</h2>
            <div 
                {...getRootProps({ 
                    className: `rounded-lg text-center cursor-pointer ${
                        file ? 'pb-3' : 'border-2 border-dashed border-purple-500 p-6 m-4 '
                    }`
                })}
            >
                <input {...getInputProps()} />
                {file ? (
                    <div>
                        <img
                            src={file.preview}
                            alt="Selected"
                            className="max-h-[30vh] rounded-lg"
                        />
                    </div>
                ) : (
                    <p className="text-purple-500">Drag & drop an image file, or click to select one <br/><span className='text-sm text-red-600 font-bold'>Max size only 2 MB</span></p>
                )}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {file && (
                <button
                    onClick={clearImage}
                    className="bg-red-500 text-white rounded-lg px-4 py-2 mb-4"
                >
                    Clear
                </button>
            )}

            <div className="w-full max-w-md mb-4">
                <label className="block mb-2">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter SBT Name"
                    className="w-full p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>

            <div className="w-full max-w-md mb-4">
                <label className="block mb-2">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter SBT Description"
                    className="w-full p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>
            <button
                onClick={handleMint}
                disabled={isLoading || isMinting || !!error}
                className={`bg-purple-500 text-white rounded-lg px-4 py-2 ${isLoading || isMinting ? 'cursor-not-allowed' : 'hover:bg-purple-600'}`}
            >
                {isLoading || isMinting ? 'Minting...' : 'Mint SBT'}
            </button>
        </div>
    );
};

export default Mint;
