import fs from 'fs/promises';
import path from 'path';

// Base directory for file operations (for security, restrict to a specific directory)
const BASE_DIR = path.join(process.cwd(), 'data');

// Ensure the base directory exists
async function ensureBaseDir() {
    try {
        await fs.mkdir(BASE_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating base directory:', error);
    }
}

// Initialize the base directory
ensureBaseDir();

// Function to list files in a directory
export async function listFiles(dirPath = '') {
    try {
        const targetPath = path.join(BASE_DIR, dirPath);
        
        // Check if the path is within the base directory (security check)
        if (!targetPath.startsWith(BASE_DIR)) {
            throw new Error('Access denied: Cannot access directories outside the base directory');
        }
        
        const files = await fs.readdir(targetPath, { withFileTypes: true });
        
        const fileList = files.map(file => {
            return {
                name: file.name,
                isDirectory: file.isDirectory(),
                path: path.join(dirPath, file.name)
            };
        });
        
        return {
            content: [
                {
                    type: "text",
                    text: `Files in ${dirPath || 'root directory'}:\n\n${fileList.map(file => 
                        `${file.isDirectory ? '📁' : '📄'} ${file.name}`).join('\n')}`
                }
            ]
        };
    } catch (error) {
        console.error('Error listing files:', error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error listing files: ${error.message}`
                }
            ]
        };
    }
}

// Function to read a file
export async function readFile(filePath) {
    try {
        const targetPath = path.join(BASE_DIR, filePath);
        
        // Check if the path is within the base directory (security check)
        if (!targetPath.startsWith(BASE_DIR)) {
            throw new Error('Access denied: Cannot access files outside the base directory');
        }
        
        const content = await fs.readFile(targetPath, 'utf8');
        
        return {
            content: [
                {
                    type: "text",
                    text: `Content of ${filePath}:\n\n${content}`
                }
            ]
        };
    } catch (error) {
        console.error('Error reading file:', error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error reading file: ${error.message}`
                }
            ]
        };
    }
}

// Function to write to a file
export async function writeFile(filePath, content) {
    try {
        const targetPath = path.join(BASE_DIR, filePath);
        
        // Check if the path is within the base directory (security check)
        if (!targetPath.startsWith(BASE_DIR)) {
            throw new Error('Access denied: Cannot write to files outside the base directory');
        }
        
        // Ensure the directory exists
        const dirPath = path.dirname(targetPath);
        await fs.mkdir(dirPath, { recursive: true });
        
        // Write the file
        await fs.writeFile(targetPath, content);
        
        return {
            content: [
                {
                    type: "text",
                    text: `Successfully wrote to ${filePath}`
                }
            ]
        };
    } catch (error) {
        console.error('Error writing file:', error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error writing file: ${error.message}`
                }
            ]
        };
    }
}