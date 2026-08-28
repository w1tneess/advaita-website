const fs = require('fs');

function replace(file, find, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(find, replace);
  fs.writeFileSync(file, content);
}

// Fix AdminSidebar.jsx (removed unused icons properly)
replace('src/components/admin/AdminSidebar.jsx', 
  /import\s*\{\s*[^}]*\s*\}\s*from\s*'lucide-react'\s*\n?/, 
  "import { LayoutDashboard, FolderGit2, FileText, Link2, Settings, X, ExternalLink } from 'lucide-react'\n");

// Fix AdminAuth.jsx
replace('src/components/admin/AdminAuth.jsx', 'const navigate = useNavigate()', '');
replace('src/components/admin/AdminAuth.jsx', 'catch (error) {', 'catch (error) { console.error(error);');
replace('src/components/admin/AdminAuth.jsx', 'catch (error) {', 'catch (error) { console.error(error);'); // doing twice for both catches

// Fix UnsavedChangesDialog.jsx
replace('src/components/admin/feedback/UnsavedChangesDialog.jsx', /const dialogProps = \{[^}]*\}/s, '');
replace('src/components/admin/feedback/UnsavedChangesDialog.jsx', /const handleNavigation = \([^)]*\) => \{[^}]*\}/s, '');

// Fix SlugField.jsx
replace('src/components/admin/forms/SlugField.jsx', /const validateUnique = async \([^)]*\) => \{[^}]*\}/s, '');

// Fix nav.js
replace('src/config/nav.js', 'const publishedPosts = []', '');

// Fix Contact.jsx
replace('src/pages/Contact.jsx', "import { Send } from 'lucide-react'", '');

// Fix Photography.jsx
replace('src/pages/Photography.jsx', 'const photos = photography.photos || []', '');
replace('src/pages/Photography.jsx', 'const photos = useMemo(() => ({\n    ...staticContent.photography,\n    photos: photographyData\n  }), [staticContent.photography, photographyData])', 'const photos = photography.photos || []');

// Fix the catch empty blocks
const filesWithCatchE = [
  'scripts/prerender.js',
  'src/pages/admin/NoteEditor.jsx',
  'src/pages/admin/NotesList.jsx',
  'src/pages/admin/PhotographyEditor.jsx',
  'src/pages/admin/ProjectEditor.jsx',
  'src/pages/admin/ProjectsList.jsx'
];
filesWithCatchE.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1); }');
  fs.writeFileSync(f, content);
});

// Fix ProjectsList and ProjectEditor unused vars
replace('src/pages/admin/ProjectsList.jsx', /const _sourceId = [^\n]*\n/, '');
replace('src/pages/admin/ProjectEditor.jsx', /const statusHint = [^\n]*\n/, '');
