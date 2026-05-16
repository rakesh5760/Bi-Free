const fs = require('fs');
const path = require('path');

function moveFolderContents(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    if (!fs.existsSync(src)) return;
    
    const items = fs.readdirSync(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        fs.renameSync(srcPath, destPath);
    }
    fs.rmdirSync(src); // remove the now empty source folder
}

function moveFile(src, dest) {
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
    }
}

// 1. Move components
moveFolderContents('src/app/components', 'src/components');

// 2. Move layouts (we specifically need dashboard-layout.tsx)
if (!fs.existsSync('src/layouts')) fs.mkdirSync('src/layouts');
moveFile('src/components/dashboard-layout.tsx', 'src/layouts/DashboardLayout.tsx');

// 3. Move pages
moveFolderContents('src/app/pages', 'src/pages');

// 4. Clean up empty app dir (App.tsx is still there)
// App.tsx and main.tsx will stay in their respective places for now, or we can move App.tsx if needed.

// 5. Move hooks
moveFolderContents('src/features/monitoring/hooks', 'src/hooks');

// 6. Move services
if (!fs.existsSync('src/services')) fs.mkdirSync('src/services');
moveFile('src/lib/api.ts', 'src/services/api.client.ts');

console.log('Migration completed safely.');
