import { useState, useCallback } from 'react';

export interface UploadProgress {
    isUploading: boolean;
    progress: number;
    currentFile: string | null;
    totalFiles: number;
    completedFiles: number;
    error: string | null;
}

export interface UploadFile {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export const useUploadProgress = () => {
    const [uploadState, setUploadState] = useState<UploadProgress>({
        isUploading: false,
        progress: 0,
        currentFile: null,
        totalFiles: 0,
        completedFiles: 0,
        error: null,
    });

    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

    const startUpload = useCallback((files: File[]) => {
        const fileStates: UploadFile[] = files.map(file => ({
            file,
            progress: 0,
            status: 'pending',
        }));

        setUploadFiles(fileStates);
        setUploadState({
            isUploading: true,
            progress: 0,
            currentFile: files[0]?.name || null,
            totalFiles: files.length,
            completedFiles: 0,
            error: null,
        });
    }, []);

    const updateFileProgress = useCallback((fileIndex: number, progress: number) => {
        setUploadFiles(prev =>
            prev.map((file, index) =>
                index === fileIndex
                    ? { ...file, progress, status: 'uploading' as const }
                    : file
            )
        );

        setUploadState(prev => ({
            ...prev,
            progress: Math.round(progress),
            currentFile: uploadFiles[fileIndex]?.file.name || null,
        }));
    }, [uploadFiles]);

    const completeFile = useCallback((fileIndex: number) => {
        setUploadFiles(prev =>
            prev.map((file, index) =>
                index === fileIndex
                    ? { ...file, progress: 100, status: 'completed' as const }
                    : file
            )
        );

        setUploadState(prev => ({
            ...prev,
            completedFiles: prev.completedFiles + 1,
            currentFile: uploadFiles[fileIndex + 1]?.file.name || null,
        }));
    }, [uploadFiles]);

    const setFileError = useCallback((fileIndex: number, error: string) => {
        setUploadFiles(prev =>
            prev.map((file, index) =>
                index === fileIndex
                    ? { ...file, status: 'error' as const, error }
                    : file
            )
        );

        setUploadState(prev => ({
            ...prev,
            error: `Failed to upload ${uploadFiles[fileIndex]?.file.name}: ${error}`,
        }));
    }, [uploadFiles]);

    const completeUpload = useCallback(() => {
        setUploadState(prev => ({
            ...prev,
            isUploading: false,
            progress: 100,
            currentFile: null,
        }));
    }, []);

    const resetUpload = useCallback(() => {
        setUploadState({
            isUploading: false,
            progress: 0,
            currentFile: null,
            totalFiles: 0,
            completedFiles: 0,
            error: null,
        });
        setUploadFiles([]);
    }, []);

    return {
        uploadState,
        uploadFiles,
        startUpload,
        updateFileProgress,
        completeFile,
        setFileError,
        completeUpload,
        resetUpload,
    };
};
