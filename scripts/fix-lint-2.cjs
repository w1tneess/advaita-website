const fs = require('fs');

function replaceFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
}

replaceFile('scripts/prerender.js', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/components/admin/AdminAuth.jsx', /import\s*\{\s*useNavigate\s*\}\s*from\s*'react-router-dom'\n?/, '');
replaceFile('src/components/admin/AdminAuth.jsx', /,\s*toast/g, ''); // Fix exhaustive-deps
replaceFile('src/components/admin/AdminAuth.jsx', /catch\s*\(\s*(error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');

replaceFile('src/components/admin/AdminSidebar.jsx', /import\s*\{\s*(Database|Home|Milestone|Tags|User|Wrench)[^}]*\}\s*from\s*'lucide-react'\n?/, '');

replaceFile('src/components/admin/feedback/UnsavedChangesDialog.jsx', /const\s+dialogProps\s*=\s*\{[^}]*\}\n/, '');
replaceFile('src/components/admin/feedback/UnsavedChangesDialog.jsx', /const\s+handleNavigation\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\}\n/, '');

replaceFile('src/components/admin/forms/SlugField.jsx', /const\s+validateUnique\s*=\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}\n/, '');

replaceFile('src/config/nav.js', /const\s+publishedPosts\s*=\s*\[\]\n/, '');

replaceFile('src/pages/Contact.jsx', /import\s*\{\s*Send\s*\}\s*from\s*'lucide-react'\n?/, '');

replaceFile('src/pages/Photography.jsx', /const photos = useMemo\(\(\) => \(\{\n\s*\.\.\.staticContent\.photography,\n\s*photos: photographyData\n\s*\}\), \[staticContent\.photography, photographyData\]\)\n/, '');
replaceFile('src/pages/Photography.jsx', /const\s+photos\s*=\s*photography\.photos\s*\|\|\s*\[\]/, 'const photos = photography.photos || []'); // It's exhaustive deps, actually wait

replaceFile('src/pages/admin/NoteEditor.jsx', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/pages/admin/NotesList.jsx', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/pages/admin/PhotographyEditor.jsx', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/pages/admin/ProjectEditor.jsx', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/pages/admin/ProjectEditor.jsx', /const\s+statusHint\s*=\s*[^]+?;\n/, '');
replaceFile('src/pages/admin/ProjectsList.jsx', /catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
replaceFile('src/pages/admin/ProjectsList.jsx', /const\s*_sourceId\s*=\s*[^]+?\n/, '');

