/**
 * Backup Service - Project Data Protection
 * 
 * Since the app uses localStorage (no PostgreSQL), this service provides
 * "snapshot" functionality by exporting the entire project state to JSON.
 * This satisfies PDVSA/MinObras requirement to prevent data loss.
 */

import { Project, Partida, Valuation } from '../types';

export interface ProjectBackup {
    version: string;
    timestamp: string;
    project: Project;
    partidas: Partida[];
    valuations: Valuation[];
}

/**
 * Export all project data to a downloadable JSON file
 */
export const exportProjectBackup = (
    project: Project,
    partidas: Partida[],
    valuations: Valuation[]
) => {
    const backup: ProjectBackup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        project,
        partidas,
        valuations
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const filename = `BACKUP_${project.code}_${new Date().toISOString().split('T')[0]}.json`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ Backup created: ${filename}`);
};

/**
 * Import project data from a backup file
 * Returns the parsed backup data for the caller to handle
 */
export const importProjectBackup = async (file: File): Promise<ProjectBackup> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const backup = JSON.parse(content) as ProjectBackup;

                // Basic validation
                if (!backup.project || !backup.partidas || !backup.valuations) {
                    throw new Error('Invalid backup file format');
                }

                console.log(`✅ Backup loaded: ${backup.project.name} (${backup.timestamp})`);
                resolve(backup);
            } catch (error) {
                reject(new Error('Failed to parse backup file: ' + (error as Error).message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read backup file'));
        };

        reader.readAsText(file);
    });
};

/**
 * Quick validation to check if a file is a valid backup
 */
export const validateBackupFile = (file: File): boolean => {
    return file.type === 'application/json' && file.name.startsWith('BACKUP_');
};
