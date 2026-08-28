const fs = require('fs');
const path = require('path');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix empty catch blocks
      content = content.replace(/catch\s*\(\s*(e|err|error)\s*\)\s*\{\s*\}/g, 'catch ($1) { console.error($1) }');
      
      // Fix specific known unused variables
      if (file === 'Contact.jsx') {
        content = content.replace(/import\s*\{\s*Send\s*\}\s*from\s*'lucide-react'\n?/, '');
      }
      
      if (file === 'NoteEditor.jsx') {
        content = content.replace(/import\s*Card\s*from\s*'@\/components\/ui\/Card\.jsx'\s*\n?/, '');
        content = content.replace(/NOTE_STATUSES,\s*/, '');
      }

      if (file === 'PhotographyList.jsx') {
        content = content.replace(/import\s*\{\s*useMemo,\s*useState\s*\}\s*from\s*'react'/, "import { useState } from 'react'");
        content = content.replace(/import\s*\{\s*useState\s*\}\s*from\s*'react'/, "");
      }

      if (file === 'ProjectEditor.jsx') {
        content = content.replace(/import\s*Card\s*from\s*'@\/components\/ui\/Card\.jsx'\s*\n?/, '');
        if (!content.includes('const isNew = !id')) {
           content = content.replace(/const\s+existing\s*=\s*/, 'const isNew = !id\n  const existing = ');
        }
        content = content.replace(/const\s+statusHint\s*=\s*[^]+?;\n/, '');
      }

      if (file === 'ProjectsList.jsx') {
         content = content.replace(/const\s*_sourceId\s*=\s*[^]+?\n/, '');
      }

      if (file === 'content.jsx') {
        content = content.replace(/async\s*\(event,\s*session\)\s*=>/, 'async () =>');
        
        // Wrap useMemo for philosophy
        if (!content.includes('useMemo(() => ({ ...staticContent.philosophy')) {
          content = content.replace(/const philosophy = \{\s*\.\.\.staticContent\.philosophy,\s*notes: previewDrafts \? notesData : publicNotes\s*\}/, 
          'const philosophy = useMemo(() => ({\n    ...staticContent.philosophy,\n    notes: previewDrafts ? notesData : publicNotes\n  }), [staticContent.philosophy, previewDrafts, notesData, publicNotes])');
        }
        // Wrap useMemo for photography
        if (!content.includes('useMemo(() => ({ ...staticContent.photography')) {
          content = content.replace(/const photography = \{\s*\.\.\.staticContent\.photography,\s*photos: photographyData\s*\}/,
          'const photography = useMemo(() => ({\n    ...staticContent.photography,\n    photos: photographyData\n  }), [staticContent.photography, photographyData])');
        }
      }

      fs.writeFileSync(fullPath, content);
    }
  }
}
processDir('d:/Website/advaita-website/src');
