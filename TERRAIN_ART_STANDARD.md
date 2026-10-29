# Wubby's World: vaste methodiek voor geïllustreerde ONDERGRONDEN

**Status: VASTGELEGD / GOEDGEKEURD DOOR GEBRUIKER (29 oktober 2026).**

## Bindende afspraak
Voor **alle** nieuwe ondergrondsoorten (gras, bosgrond, zand, rotsgrond, enzovoort) is de **goedgekeurde grastegel-proef** de technische en artistieke standaard. **Niet opnieuw een andere textuur- of tegelmethode bedenken.** Alleen de afbeelding en het materiaal wisselen.

### Goedgekeurde referentie
- Werkende proef: `grass-individual-tiles.html`
- Live: https://genuine-studios.github.io/Wubbys-World/grass-individual-tiles.html
- **Goedgekeurde stand:** `Per tegel` AAN en `Verschillende uitsneden` AAN.
- De gebruiker beoordeelde dit als: “That works perfectly and looks good.”

## VERPLICHTE BRONAFBEELDING: dezelfde vorm als de grastegel
- De bronillustratie moet **eerst** worden gemaakt als **één losse isometrische ruit**, zoals de originele, goedgekeurde grasillustratie. De referentie is de door de gebruiker getoonde grastegel: **1758 × 895 pixels, RGBA met transparantie buiten de ruit**, zonder meegetekende dikte, platform of achtergrond. 
- **Exact dezelfde isometrische kijkhoek, afmeting, verhoudingen, zachte schilderstijl en detailschaal.** Alleen het materiaal verandert (gras wordt mos/bosstrooisel, later zand/rots, enz.).
- **GEEN** top-down vierkante graphic als het artistieke bronbeeld. **GEEN** atlascollage of zestien losse voorbeeldruitjes als bron. Dit is herhaaldelijk expliciet afgewezen.
- Het goedgekeurde raster **knipt vervolgens uitsneden uit het geschilderde binnenvlak van die ruit**. Eventuele technische voorbereiding naar een gevuld textuurbeeld is uitsluitend een omzetting van datzelfde nieuwe bronbeeld en **geen andere renderer of andere uitsnedeformule**.
- De renderer blijft letterlijk de goedgekeurde `grass-individual-tiles.html`-methode, ook voor bosgrond en latere ondergronden.
- Nieuwe bosgrondbron volgens die afspraak: de nieuw geïllustreerde mos-/blad-/naaldruittegel van 29 oktober 2026. Playable vergelijking: `forest-ground-tile-test.html`.

## Werkwijze (exact als grastegels)
1. Maak **één verse, aantrekkelijke, gedetailleerde geschilderde ondergrondafbeelding** met voldoende kleine details die op werkelijke spelgrootte passen. Gebruik het **goedgekeurde grasbeeld als visuele en productie-referentie**: isometrisch passend, geen UI, collage, grid of atlas. Bij de terreinlaag is het **de textuur binnen de bron** die wordt hergebruikt, **niet de geschilderde buitenrand van de bronruit**.
2. **Iedere kaartpositie krijgt zijn eigen uitsnede van datzelfde materiaalbeeld.** Gebruik het **bestaande 112 × 57 raster** en de bestaande `tileCrop` en `drawIndividualTile`-aanpak. Leg geen doorlopende wereldwijde materiaalafbeelding onder alle verschillende terreinen.
3. **Ruitvorm/uitlijning komt uitsluitend van de spelcode**, niet van een afgebeelde eilandrand, schaduw, ondertegel of 3D-platform. De afbeelding wordt **per vak** getekend en exact geknipt aan het diamantmasker.
4. Varieer de uitsnede **deterministisch per (r,c)**, zodat vlakjes onderling verschillen maar niet verspringen. Gebruik geen willekeurig verspringende/roterende/hertekende details per render.
5. Behoud de **visuele detailschaal van de goedgekeurde grasmethode**. De officiële proef neemt per 112 × 57 tegel een uitsnede van **620 bronpixels breed en circa 315.5 bronpixels hoog**, indien de bronbreedte dit toelaat (`sw=Math.min(iw,620)`, `sh=sw*57/112`). Kleine bladeren, naalden en mos mogen **niet enorm uitvergroot** worden om een tegel te vullen.
6. Materialen hebben elk **hun eigen afbeelding**, en een kaartvak bezit steeds één basismateriaal (gras of bosgrond of zand ...). **Geen universele graslaag** onder andere materialen; geometrie blijft gemeenschappelijk.
7. Test **eerst** de verse afbeelding in **dezelfde werkende individuele grastegel-renderer**, met het originele gras ernaast, zichtbare en onzichtbare gridlijnen, en telefoonformaat. Verander de rendertechniek, geometrie of cropformule **niet zonder expliciete toestemming**.
8. Bovenliggende objecten (bomen, huizen, struiken) komen **apart als echte afbeeldingsassets**. Geen gecodeerde grafische objecten als definitieve art; code mag wel clippen, plaatsen, schalen en debuggen.

## Niet doen
- Geen nieuwe polygonale of procedurele terreingraphics als eindoplossing.
- Geen overbodige nieuwe atlas-, micro-patch-, fragment-stitching-, world-stretch- of collage-systemen; die experimenten zijn expliciet niet de goedgekeurde methode.
- Geen bomen, huisjes, grote bladeren of andere objecten uit complete scènes knippen om ondergrond te reconstrueren.
- Geen geverfde tegelrand, los eiland of tweede bodemlaag toevoegen.
- Geen aanpassing van de live game of saves zonder dat het afzonderlijke prototype wordt goedgekeurd.

## Relevante code uit de originele, goedgekeurde proef

```js
const W=112,H=57;
function center(r,c){return {x:(c-r)*W/2,y:(c+r)*H/2}}
function diamond(x,y){
 ctx.moveTo(x,y-H/2);
 ctx.lineTo(x+W/2,y);
 ctx.lineTo(x,y+H/2);
 ctx.lineTo(x-W/2,y);
 ctx.closePath();
}
function tileCrop(r,c){
 const iw=tex.naturalWidth,ih=tex.naturalHeight;
 const sw=Math.min(iw,620),sh=sw*H/W;
 const hash=v=>{const z=Math.sin(v*127.125+13.61)*43758.5453;return z-Math.floor(z)};
 const sx=hash((r+13)*31+c*7)*Math.max(0,iw-sw);
 const sy=hash((c+11)*53+r*19)*Math.max(0,ih-sh);
 return {sx,sy,sw,sh};
}
function drawIndividualTile(r,c){
 const {x,y}=center(r,c);
 ctx.save();ctx.beginPath();diamond(x,y);ctx.clip();
 const q=tileCrop(r,c);
 ctx.drawImage(tex,q.sx,q.sy,q.sw,q.sh,x-W/2,y-H/2,W,H);
 ctx.restore();
}
```

**Voortaan telkens deze methode toepassen op alle ondergronden. Voorbeelden of experimenten met andere werkwijzen veranderen deze standaard niet.**
