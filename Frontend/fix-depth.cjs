const fs = require('fs');
const path = require('path');

function fixDepthInPages() {
    const pagesDir = 'src/pages';
    if (!fs.existsSync(pagesDir)) return;
    const files = fs.readdirSync(pagesDir);
    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        const fullPath = path.join(pagesDir, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        
        // In src/pages, relative to src is ../
        // So ../../components -> ../components
        content = content.replace(/\.\.\/\.\.\/components/g, '../components');
        content = content.replace(/\.\.\/\.\.\/layouts/g, '../layouts');
        content = content.replace(/\.\.\/\.\.\/hooks/g, '../hooks');
        content = content.replace(/\.\.\/\.\.\/services/g, '../services');
        content = content.replace(/\.\.\/\.\.\/features/g, '../features');
        content = content.replace(/\.\.\/\.\.\/store/g, '../store');
        
        if (content !== original) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log('Fixed depth in: ' + fullPath);
        }
    }
}

fixDepthInPages();
