const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace Shadcn and Layout imports
    content = content.replace(/\/app\/components/g, '/components');
    
    // Replace pages imports
    content = content.replace(/\/app\/pages/g, '/pages');
    
    // Replace api imports (src/lib/api -> src/services/api.client)
    // Careful: might be ../../lib/api or ../lib/api
    content = content.replace(/\/lib\/api/g, '/services/api.client');
    
    // Check specific hooks
    content = content.replace(/\/features\/monitoring\/hooks\/useFullscreen/g, '/hooks/useFullscreen');
    content = content.replace(/\/features\/monitoring\/hooks\/usePageVisibility/g, '/hooks/usePageVisibility');
    content = content.replace(/\/features\/monitoring\/hooks\/useMediaDevices/g, '/hooks/useMediaDevices');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated imports in: ' + filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else {
            replaceInFile(fullPath);
        }
    }
}

traverse('src');
