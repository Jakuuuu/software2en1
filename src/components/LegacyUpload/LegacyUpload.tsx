
"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Partida } from '@/types';

interface UploadResult {
    file: string;
    count: number;
    status: 'success' | 'error';
    message?: string;
}

interface LegacyUploadProps {
    onUploadComplete?: (partidas: Partida[]) => void;
}

export default function LegacyUpload({ onUploadComplete }: LegacyUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<UploadResult[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);
        const newResults: UploadResult[] = [];

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload-legacy', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    newResults.push({
                        file: file.name,
                        count: data.count,
                        status: 'success'
                    });

                    if (onUploadComplete && data.data) {
                        onUploadComplete(data.data);
                    }
                } else {
                    newResults.push({
                        file: file.name,
                        count: 0,
                        status: 'error',
                        message: data.message || 'Error desconocido'
                    });
                }
            } catch (error) {
                newResults.push({
                    file: file.name,
                    count: 0,
                    status: 'error',
                    message: 'Error de red o servidor'
                });
            }
        }

        setResults(prev => [...prev, ...newResults]);
        setUploading(false);
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.dbf': ['.dbf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        }
    });

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Carga de Datos Legados</h2>
            <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">
                    Arrastra tus archivos aquí (Lulowin .DBF o DataLaing Excel).
                </p>
            </div>

            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                ) : (
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                )}
                {isDragActive ? (
                    <p className="text-blue-600 font-medium">Suelta los archivos aquí...</p>
                ) : (
                    <p className="text-gray-500">
                        {uploading ? 'Procesando...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
                    </p>
                )}
            </div>

            {results.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Resultados Recientes</h3>
                    <div className="space-y-3">
                        {results.map((res, idx) => (
                            <div key={idx} className={`flex items-center p-3 rounded-md border ${res.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="mr-3">
                                    {res.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{res.file}</p>
                                    {res.status === 'success' ? (
                                        <p className="text-xs text-green-700">Importados {res.count} registros exitosamente</p>
                                    ) : (
                                        <p className="text-xs text-red-700">Error: {res.message}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
