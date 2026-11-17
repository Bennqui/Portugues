/* Herramienta de Tuca Idiomas.
   node tareas/unidad.js estado                 → cuántas unidades tiene cada idioma y cuál sigue
   node tareas/unidad.js agregar it archivo.json → valida y agrega una unidad (o un arreglo de unidades) al curso
   node tareas/unidad.js revisar                → revisa todas las unidades existentes
   node tareas/unidad.js construir              → genera index.html desde plantilla.html y cursos/*.json */
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..');
const LANGS={pt:{name:'portugués',box:[-74,-34,-34,5.5],who:['Ana','Pedro','Garçom']},it:{name:'italiano',box:[6.5,18.6,36.6,47.1],who:['Giulia','Marco','Cameriere']},fr:{name:'francés',box:[-5,9.6,41.3,51.1],who:['Claire','Lucas','Serveur']},de:{name:'alemán',box:[5.8,15.1,47.2,55.1],who:['Anna','Lukas','Kellner']}};
const META=52;
const temario=JSON.parse(fs.readFileSync(path.join(R,'cursos/temario.json')));
const curso=k=>JSON.parse(fs.readFileSync(path.join(R,'cursos',k+'.json')));
const str=x=>typeof x==='string'&&x.trim().length>0&&!/[<>]/.test(x);
const pair=x=>Array.isArray(x)&&x.length===2&&x.every(str);
function validar(k,u,prev,idx){const e=[],L=LANGS[k];
 const tm=temario[idx];if(!tm)e.push('No hay tema '+(idx+1)+' en el temario');else if(u.t!==tm.t)e.push(`El título debe ser exactamente "${tm.t}" (unidad ${idx+1})`);
 if(!Array.isArray(u.w)||u.w.length!==12)e.push('w debe tener exactamente 12 palabras');
 else{const seen=new Set(prev.flatMap(p=>p.w.map(w=>w[0])));u.w.forEach((w,i)=>{if(!Array.isArray(w)||w.length!==4||!w.every(str))e.push(`w[${i}] debe ser [palabra, significado, pronunciación, emoji]`);else{if(seen.has(w[0]))e.push(`La palabra "${w[0]}" ya existe en otra unidad o se repite`);seen.add(w[0])}})}
 const g=u.g||{};if(!str(g.h))e.push('g.h falta');
 if(!Array.isArray(g.b)||g.b.length<3||g.b.length>6||!g.b.every(str))e.push('g.b: entre 3 y 6 explicaciones');
 if(!Array.isArray(g.e)||g.e.length<3||g.e.length>6||!g.e.every(pair))e.push('g.e: entre 3 y 6 ejemplos [frase, traducción]');
 else if(g.e.filter(x=>x[0].split(' ').length>=2).length<2)e.push('g.e: al menos 2 ejemplos de 2 o más palabras');
 if(!Array.isArray(g.q)||g.q.length!==3)e.push('g.q: exactamente 3 preguntas');
 else g.q.forEach((q,i)=>{if(!Array.isArray(q)||q.length!==3||!str(q[0])||!Array.isArray(q[1])||q[1].length<2||q[1].length>4||!q[1].every(str)||!Number.isInteger(q[2])||q[2]<0||q[2]>=q[1].length)e.push(`g.q[${i}] debe ser [pregunta, [2-4 opciones], índice correcto]`);else if(new Set(q[1]).size!==q[1].length)e.push(`g.q[${i}] tiene opciones repetidas`)});
 if(!Array.isArray(u.s)||u.s.length!==6||!u.s.every(pair))e.push('s: exactamente 6 frases [frase, traducción]');
 else if(u.s.filter(x=>x[0].split(' ').length>=3).length<4)e.push('s: al menos 4 frases de 3 o más palabras');
 if(!Array.isArray(u.d)||u.d.length<4||u.d.length>6||!u.d.every(l=>Array.isArray(l)&&l.length===3&&l.every(str)))e.push('d: entre 4 y 6 líneas [personaje, frase, traducción]');
 else{if(u.d.filter(l=>l[1].split(' ').length>=3).length<3)e.push('d: al menos 3 líneas de 3 o más palabras');const otros=u.d.map(l=>l[0]).filter(w=>!L.who.includes(w));if(otros.length)console.log('Aviso: personajes nuevos (sin avatar propio): '+[...new Set(otros)].join(', '))}
 const c=u.city;if(!Array.isArray(c)||c.length!==6||!str(c[0])||!str(c[1])||typeof c[2]!=='number'||typeof c[3]!=='number'||!str(c[4])||!pair(c[5]))e.push('city debe ser [nombre, emoji, longitud, latitud, dato, [frase, traducción]]');
 else{const b=L.box;if(c[2]<b[0]||c[2]>b[1]||c[3]<b[2]||c[3]>b[3])e.push(`city: las coordenadas (${c[2]}, ${c[3]}) no están dentro del país`);if(prev.some(p=>p.city&&p.city[0]===c[0]))e.push(`city: "${c[0]}" ya se usó en otra unidad`)}
 return e}
const [cmd,k,file]=process.argv.slice(2);
if(cmd==='estado'){for(const x in LANGS){const n=curso(x).units.length;console.log(`${x} (${LANGS[x].name}): ${n} de ${META} unidades`+(n<META?` · sigue la ${n+1}: ${temario[n].t} — gramática: ${temario[n].gram} — vocabulario: ${temario[n].vocab}`:' · COMPLETO'))}}
else if(cmd==='agregar'){if(!LANGS[k]||!file){console.log('Uso: node tareas/unidad.js agregar <pt|it|fr|de> archivo.json');process.exit(1)}
 let nuevas;try{nuevas=JSON.parse(fs.readFileSync(file,'utf8'))}catch(err){console.log('NO VÁLIDO: el archivo no es JSON: '+err.message);process.exit(1)}
 if(!Array.isArray(nuevas))nuevas=[nuevas];const c=curso(k);let ok=true;const tmp=c.units.slice();
 nuevas.forEach((u,i)=>{const e=validar(k,u,tmp,tmp.length);if(e.length){ok=false;console.log(`NO VÁLIDO (unidad ${tmp.length+1}):\n - `+e.join('\n - '))}else tmp.push(u)});
 if(!ok){console.log('No se guardó nada.');process.exit(1)}
 c.units=tmp;fs.writeFileSync(path.join(R,'cursos',k+'.json'),JSON.stringify(c));console.log(`OK: ${k} ahora tiene ${tmp.length} unidades. Recuerda ejecutar: node tareas/unidad.js construir`)}
else if(cmd==='construir'){const t=fs.readFileSync(path.join(R,'plantilla.html'),'utf8');const C={};for(const x in LANGS)C[x]=curso(x);
 if(!t.includes('/*CURSOS*/')){console.log('ERROR: plantilla.html no tiene la marca /*CURSOS*/');process.exit(1)}
 const out=t.replace('/*CURSOS*/','const CURSOS='+JSON.stringify(C)+';');fs.writeFileSync(path.join(R,'index.html'),out);
 console.log('OK: index.html construido · '+Object.keys(C).map(x=>x+' '+C[x].units.length).join(' · '))}
else if(cmd==='revisar'){let bad=0;for(const x in LANGS){const u=curso(x).units;u.forEach((v,i)=>{if(i<10)return;const e=validar(x,v,u.slice(0,i),i);if(e.length){bad++;console.log(`${x} unidad ${i+1}:\n - `+e.join('\n - '))}})}console.log(bad?'HAY ERRORES':'TODO BIEN')}
else console.log('Comandos: estado | agregar <idioma> <archivo.json> | construir');
