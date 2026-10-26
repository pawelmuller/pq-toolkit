"use client";

import React, {useState, useEffect, useCallback} from 'react';
import useSWR from 'swr';
import {fetchSamples} from '@/lib/utils/fetchers';
import AudioPlayer from '@/lib/components/player/audioplayer';
import { FaCloudUploadAlt, FaMusic } from 'react-icons/fa';
import { useToast, ToastType } from '@/lib/contexts/ToastContext';

interface SampleData {
    sampleId: number;
    name: string;
    assetPath: string;
    rating: number | null;
}

interface SampleUploadWidgetProps {
    experimentName: string;
    onClose: () => void;
    onSamplesSubmitted: (newSamples: { name: string; assetPath: string }[]) => void;
}

const MAX_SAMPLES = 100;

const SampleUploadWidget = ({experimentName, onClose, onSamplesSubmitted}: SampleUploadWidgetProps): JSX.Element => {
    const {data: apiData, error, isLoading} = useSWR('/api/v1/samples', fetchSamples);
    const [sortedSamples, setSortedSamples] = useState<SampleData[]>([]);
    const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
    const [uploadedSamples, setUploadedSamples] = useState<{ name: string; assetPath: string | File }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const { addToast } = useToast();

    const handleSubmitSamples = async (): Promise<void> => {
        const totalSamplesCount = uploadedSamples.length + selectedSamples.length + sortedSamples.length;
        if (totalSamplesCount > MAX_SAMPLES) {
            addToast(
                `You cannot have more than ${MAX_SAMPLES} samples in total, including already uploaded samples.`,
                ToastType.WARNING
            );
            return;
        }

        try {
            const formData = new FormData();

            uploadedSamples.forEach((sample) => {
                const file = sample.assetPath instanceof File ? sample.assetPath : new File([], sample.name);
                formData.append('files', file);
                formData.append('titles', sample.name);
            });

            selectedSamples.forEach((id) => {
                formData.append('sample_ids', id.toString());
            });

            const response = await fetch(`/api/v1/experiments/${experimentName}/samples/v2`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to submit samples: ${response.statusText}`);
            }

            const result = await response.json();

            const newSamples = result.asset_path.map((path: string) => ({
                name: path.split('/').pop() || path,
                assetPath: path,
            }));

            addToast('Samples uploaded successfully!', ToastType.SUCCESS);
            onSamplesSubmitted(newSamples);
            onClose();
        } catch (error) {
            console.error('Error submitting samples:', error);
            addToast(error instanceof Error ? error.message : 'Failed to upload samples', ToastType.ERROR);
        }
    };

    useEffect(() => {
        if (apiData?.samples) {
            setSortedSamples(
                apiData.samples.map((sample: any) => ({
                    ...sample,
                    sampleId: parseInt(sample.sampleId, 10),
                }))
            );
        }
    }, [apiData]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                handleSubmitSamples();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSubmitSamples]);

    const handleSampleToggle = (sampleId: number): void => {
        setSelectedSamples((prev) =>
            prev.includes(sampleId)
                ? prev.filter((id) => id !== sampleId)
                : [...prev, sampleId]
        );
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const totalSamplesCount = uploadedSamples.length + sortedSamples.length + files.length;

        if (totalSamplesCount > MAX_SAMPLES) {
            addToast(
                `You cannot have more than ${MAX_SAMPLES} samples in total, including already uploaded samples.`,
                ToastType.WARNING
            );
            return;
        }

        const audioFiles = files.filter(file => file.type.startsWith('audio/'));

        const validFiles = audioFiles.filter((file) => {
            const fileName = file.name.toLowerCase();
            if (file.size > 6 * 1024 * 1024) {
                addToast(`File "${file.name}" exceeds the maximum size of 6MB.`, ToastType.WARNING);
                return false;
            }

            if (uploadedSamples.some((sample) => sample.name.toLowerCase() === fileName) ||
                sortedSamples.some((sample) => sample.name.toLowerCase() === experimentName + '/' + fileName) ||
                sortedSamples.some((sample) => sample.name.toLowerCase() === fileName)) {
                addToast(`Sample "${file.name}" already exists.`, ToastType.WARNING);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            const newSamples = validFiles.map((file) => ({
                name: file.name,
                assetPath: file,
            }));
            setUploadedSamples((prev) => [...prev, ...newSamples]);
            addToast(`Successfully added ${validFiles.length} audio file(s)`, ToastType.SUCCESS);
        }
    }, [addToast, uploadedSamples, sortedSamples]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files) {
            const totalSamplesCount = uploadedSamples.length + sortedSamples.length + Array.from(files).length;
            if (totalSamplesCount > MAX_SAMPLES) {
                addToast(
                    `You cannot have more than ${MAX_SAMPLES} samples in total, including already uploaded samples.`,
                    ToastType.WARNING
                );
                return;
            }

            const validFiles = Array.from(files).filter((file) => {
                const fileName = file.name.toLowerCase();
                if (file.size > 6 * 1024 * 1024) {
                    addToast(`File "${file.name}" exceeds the maximum size of 6MB.`, ToastType.WARNING);
                    return false;
                }
                if (uploadedSamples.some((sample) => sample.name.toLowerCase() === fileName) ||
                    sortedSamples.some((sample) => sample.name.toLowerCase() === experimentName + '/' + fileName) ||
                    sortedSamples.some((sample) => sample.name.toLowerCase() === fileName)) {
                    addToast(`Sample "${file.name}" already exists.`, ToastType.WARNING);
                    return false;
                }
                return true;
            });

            const newSamples = validFiles.map((file) => ({
                name: file.name,
                assetPath: file,
            }));

            setUploadedSamples((prev) => [...prev, ...newSamples]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                className="bg-white dark:bg-black/70 p-6 rounded-lg shadow-lg w-[60rem] border-4 border-gray-300 dark:border-gray-700 relative flex flex-col space-y-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Dwukolumnowy układ */}
                <div className="flex space-x-4">
                    {/* Upload Samples Section */}
                    <div className="flex-1 flex flex-col space-y-4">
                        <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
                            Upload Samples
                        </h3>

                        {/* Displaying Uploaded Samples */}
                        <div className="space-y-4 overflow-y-auto max-h-80 p-2">
                            {uploadedSamples.length > 0 ? (
                                uploadedSamples.map((sample, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-200 dark:bg-gray-700 shadow"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {sample.name}
                                            </span>
                                            <audio controls className="mt-1 w-full">
                                                <source
                                                    src={typeof sample.assetPath === 'string' ? sample.assetPath : URL.createObjectURL(sample.assetPath)}
                                                    type="audio/mpeg"
                                                />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    No uploaded samples yet.
                                </p>
                            )}
                        </div>

                        <div
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ${
                                isDragging
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <FaCloudUploadAlt className={`w-12 h-12 mb-4 ${
                                isDragging ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <p className="text-lg font-medium text-center mb-2 dark:text-white">
                                {isDragging ? 'Drop audio files here' : 'Drag & drop audio files here'}
                            </p>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <span className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                                    <FaMusic className="mr-2" />
                                    Browse Audio Files
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Available Samples Section */}
                    <div className="flex-1 flex flex-col space-y-4">
                        <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
                            Available Samples
                        </h3>
                        <div className="space-y-4 overflow-y-auto max-h-80 p-2">
                            {sortedSamples.length === 0 ? (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    No samples available.
                                </p>
                            ) : (
                                sortedSamples.map((sample) => (
                                    <div
                                        key={sample.sampleId}
                                        className={`flex flex-col p-3 rounded-lg shadow ${
                                            selectedSamples.includes(sample.sampleId)
                                                ? 'bg-blue-100 dark:bg-blue-900'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white mb-1">
                                            {sample.name.split('/').pop()}
                                        </span>
                                        <div className="flex items-center space-x-4">
                                            <AudioPlayer assetPath={sample.assetPath} />
                                            <button
                                                onClick={() => {handleSampleToggle(sample.sampleId);}}
                                                className={`px-4 py-2 rounded ${
                                                    selectedSamples.includes(sample.sampleId)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                }`}
                                            >
                                                {selectedSamples.includes(sample.sampleId) ? 'Deselect' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Central Submit Button */}
                <button
                    onClick={handleSubmitSamples}
                    className="py-3 px-6 w-full bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-400 transition-colors shadow-sm"
                >
                    Submit Samples
                </button>
            </div>
        </div>
    );
};

export default SampleUploadWidget;

