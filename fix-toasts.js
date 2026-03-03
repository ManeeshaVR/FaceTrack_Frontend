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

const pagesPath = path.join(__dirname, 'src/app/pages/admin');
const allPages = walkSync(pagesPath);

allPages.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Regex to match the if-else block for editing with toast at the bottom
    // e.g.
    // if (editingSomething) {
    //   await apiFetch(...)
    // } else {
    //   await apiFetch(...)
    // }
    // toast.success('Saved successfully');
    // setIsModalOpen(false);

    // It's easier to just look for `toast.success('Saved successfully');` right before `setIsModalOpen(false);` 
    const replacePattern = /if\s*\(editing([A-Za-z0-9_]+)\)\s*\{([\s\S]*?)await apiFetch([\s\S]*?)\}\s*else\s*\{([\s\S]*?)await apiFetch([\s\S]*?)\}\s*toast\.success\('Saved successfully'\);\s*setIsModalOpen\(false\);/g;

    content = content.replace(replacePattern, (match, p1, p2, p3, p4, p5) => {
        return `if (editing${p1}) {${p2}await apiFetch${p3}  toast.success('Updated successfully');\n      } else {${p4}await apiFetch${p5}  toast.success('Saved successfully');\n      }\n      setIsModalOpen(false);`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated toast logic in ${file}`);
    }
});

console.log('Script completed.');
