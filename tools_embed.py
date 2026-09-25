from pathlib import Path
import base64, mimetypes, re

root = Path(__file__).resolve().parent
html = (root/'index.html').read_text(encoding='utf-8')
css = (root/'styles.css').read_text(encoding='utf-8')
js = (root/'app.js').read_text(encoding='utf-8')

html = re.sub(r'<link rel="manifest"[^>]*>\s*', '', html)
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n'+css+'\n</style>')
html = html.replace('<script src="app.js" defer></script>', '<script>\n'+js+'\n</script>')

paths = sorted({m.group(1) for m in re.finditer(r'((?:assets)/[A-Za-z0-9_./-]+\.(?:png|webp|jpg|jpeg|ico))', html)}, key=len, reverse=True)
for rel in paths:
    p = root/rel
    if not p.exists():
        print('WARNING missing', rel)
        continue
    mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    data = base64.b64encode(p.read_bytes()).decode('ascii')
    html = html.replace(rel, f'data:{mime};base64,{data}')

out = root/'DIVAR_Web_Paciente_Standalone.html'
out.write_text(html, encoding='utf-8')
print(out, out.stat().st_size)
