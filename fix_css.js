const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const replacements = [
    { regex: /background:\s*#FFFBF0/gi, replace: 'background: var(--bg-surface-3)' },
    { regex: /background:\s*#FFFBEB/gi, replace: 'background: var(--bg-surface-3)' },
    { regex: /background:\s*#FAFAFA/gi, replace: 'background: var(--bg-page)' },
    { regex: /background:\s*#F8FAFC/gi, replace: 'background: var(--bg-page)' },
    { regex: /background:\s*var\(--white\)/gi, replace: 'background: var(--bg-sheet)' },
    { regex: /background:\s*#fff(fff)?;/gi, replace: 'background: var(--bg-sheet);' },
    { regex: /background:\s*white;/gi, replace: 'background: var(--bg-sheet);' },
    { regex: /background-color:\s*#fff(fff)?;/gi, replace: 'background-color: var(--bg-sheet);' },
    { regex: /background-color:\s*white;/gi, replace: 'background-color: var(--bg-sheet);' },

    // Also fix some blatant text colors if they are hardcoded dark
    { regex: /color:\s*#0F172A;/gi, replace: 'color: var(--text-primary);' },
    { regex: /color:\s*#64748B;/gi, replace: 'color: var(--text-secondary);' },
    { regex: /color:\s*var\(--text-dark\);/gi, replace: 'color: var(--text-primary);' },
    { regex: /color:\s*var\(--text-medium\);/gi, replace: 'color: var(--text-secondary);' }
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    let changedFiles = 0;

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.module.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            replacements.forEach(({ regex, replace }) => {
                content = content.replace(regex, replace);
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${file}`);
                changedFiles++;
            }
        }
    });

    return changedFiles;
}

const total = processDirectory(pagesDir);
console.log(`Total files updated: ${total}`);
