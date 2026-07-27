# Avatar GLB

Coloca aquí tu archivo GLB con el nombre `avatar.glb`.

## Opciones para obtener el GLB

### Opción A — Sketchfab (inmediato, gratis)
1. Ve a https://sketchfab.com
2. Busca "cartoon character" o "stylized character"
3. Filtra por: **Free** + **Downloadable**
4. Descarga → elige formato **GLB/GLTF**
5. Renombra el archivo a `avatar.glb` y ponlo aquí

### Opción B — Streamoji (alta calidad, lip sync nativo)
1. Ve a https://avatars.streamoji.com
2. Crea tu avatar personalizado
3. Descarga/copia la URL del GLB
4. En `src/avatars/Avatar3D.jsx`, descomenta `STREAMOJI_GLB` y actualiza la URL
5. Cambia `AVATAR_URL = STREAMOJI_GLB`

## Lip sync automático
El componente detecta automáticamente:
- **Morph targets ARKit** (`viseme_aa`, `jawOpen`, etc.) — Streamoji, avatars modernos
- **Jaw bone** (`jaw`, `Jaw`, `chin`, etc.) — fallback para cualquier personaje rigged
