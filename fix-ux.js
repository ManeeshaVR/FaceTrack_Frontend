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

    let needsToastImport = false;

    const replaceAlert = (match, p1) => {
        needsToastImport = true;
        if (p1.toLowerCase().includes('fail') || p1.toLowerCase().includes('error') || p1.includes('e.message')) {
            return `toast.error(${p1})`;
        }
        return `toast.success(${p1})`;
    };

    content = content.replace(/alert\((.*?)\)/g, replaceAlert);

    const selectFilterRegex = /<Select\s+value=\{filter([A-Za-z]+)\}/g;
    content = content.replace(selectFilterRegex, (match, p1) => {
        const label = p1; // e.g. "Status" from "filterStatus"
        return `<Select label="${label}" placeholder="All" value={filter${p1}}`;
    });

    if (needsToastImport && !content.includes('sonner')) {
        const firstImportIndex = content.indexOf('import ');
        if (firstImportIndex !== -1) {
            content = content.slice(0, firstImportIndex) + 'import { toast } from "sonner";\n' + content.slice(firstImportIndex);
        } else {
            content = 'import { toast } from "sonner";\n' + content;
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

console.log('Script completed.');
