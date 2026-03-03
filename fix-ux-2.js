import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (dirFile.endsWith('.tsx')) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
};

const pagesPath = path.join(__dirname, 'src/app/pages');
const allPages = walkSync(pagesPath);

allPages.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // fix alignment
    content = content.replace('className="flex flex-col lg:flex-row gap-4"', 'className="flex flex-col lg:flex-row gap-4 items-end"');

    // Insert toast inside handleSubmit
    // We look for setIsModalOpen(false); and if missing toast, add it.
    content = content.replace(/setIsModalOpen\(false\);\n\s*(fetch[A-Za-z]+\(\);)/g, (match, p1) => {
        return `toast.success('Saved successfully');\n      setIsModalOpen(false);\n      ${p1}`;
    });

    // Insert toast inside handleDelete
    content = content.replace(/await apiFetch\(`([^`]+)`, \{ method: "DELETE" \}\);\n\s*(fetch[A-Za-z]+\(\);)/g, (match, p1, p2) => {
        return `await apiFetch(\`${p1}\`, { method: "DELETE" });\n        toast.success('Deleted successfully');\n        ${p2}`;
    });

    if (content !== original) {
        if (!content.includes('sonner')) {
            const firstImportIndex = content.indexOf('import ');
            if (firstImportIndex !== -1) {
                content = content.slice(0, firstImportIndex) + 'import { toast } from "sonner";\n' + content.slice(firstImportIndex);
            } else {
                content = 'import { toast } from "sonner";\n' + content;
            }
        }
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

console.log('Script completed.');
