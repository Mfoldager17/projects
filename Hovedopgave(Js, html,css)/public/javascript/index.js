
//----------SVG---------------------------------
// initialize
const svg = document.getElementById('mysvg')
const svgProfileOnly = document.getElementById('mysvgProfileOnly')
const svgDrawProfile = document.getElementById('mysvgDrawProfile')

const NS = svg.getAttribute('xmlns')

let btnProfil = document.getElementById('btnIndlæsknap')
let btnUseDrawProfile = document.getElementById('btnUseDrawProfile')
let btnDrawFromCoordinatsProfile = document.getElementById('convertTo2DArray')
let btnSimuler = document.getElementById('btnSimuler')

let rute1 = document.getElementById("rute1");
let rute2 = document.getElementById("rute2");
let RouteHeadlineRight = document.getElementById("RouteHeadlineRight")

let btnBack1 = document.getElementById("btnBack1")
let btnNext1 = document.getElementById("btnNext1")
let btnBackAll = document.getElementById("btnBackAll")
let btnNextAll = document.getElementById("btnNextAll")

let btnBeginDraw = document.getElementById('btnBeginDraw')
let btnEndDraw = document.getElementById('btnEndDraw')
let btnErase = document.getElementById('btnErase')
let btnSave = document.getElementById('btnSave')
let btnEraseAll = document.getElementById('btnEraseAll')

let svgX = document.getElementById("svgX");
let svgY = document.getElementById("svgY");

let svgXDrawProfile = document.getElementById("svgXDrawProfile");
let svgYDrawProfile = document.getElementById("svgYDrawProfile");

var ruteArray = [];
ruteArray.push(rute1)
ruteArray.push(rute2)


// events
svgDrawProfile.addEventListener('pointerdown', drawPointInProfile)
btnErase.addEventListener('click', removeLastPoint)
btnBeginDraw.addEventListener('click', beginDraw)
btnEndDraw.addEventListener('click', endDraw)
btnEraseAll.addEventListener('click', clearAllSvgViewbox)

svgProfileOnly.addEventListener('pointermove', getCoordinates)
svgDrawProfile.addEventListener('pointermove', getCoordinatesDrawProfile)

btnProfil.addEventListener('click', chooseProfile)
btnUseDrawProfile.addEventListener('click', chooseProfile)
btnDrawFromCoordinatsProfile.addEventListener('click', chooseProfile)
btnSimuler.addEventListener('click', chooseRoute)

btnNext1.addEventListener('click', displayNextSideprofile)
btnBack1.addEventListener('click', displaypreviousSideprofile)
btnBackAll.addEventListener('click', displayFirstSideprofile)
btnNextAll.addEventListener('click', displayLastSideprofile)



//profils
let opretProfilVogn = []
let opretProfilVognForSvg = []
let draw = false
let isProfileCreated = false

let displayProfile = []
let displayProfileShadow = []
let displayProfileFullspeed = []

sideprofiler = []
sideprofilerSvg = []
sideprofilIndex = 0;

const profilVogn = [
  [1000, 1600], [1300, 1600],
  [1300, 1300], [1400, 1300],
  [1400, 1200], [1300, 1200],
  [1300, 1000], [1000, 1000]
]

const sideprofil1 = [
  [570, 1780], [570, 570],
  [810, 570], [930, 650],
  [970, 690], [970, 770],
  [930, 890], [570, 930]
]

const sideprofil2 = [
  [400, 1200], [520, 1200],
  [520, 1080], [280, 1080],
  [280, 960], [400, 960],
  [400, 400],
  [640, 400], [760, 480],
  [800, 520], [800, 600],
  [760, 720], [400, 720],
  [400, 1600]
]

const sideprofil3 = [
  [400, 1680], [400, 1000],
  [520, 800], [720, 720],
  [1280, 720], [1480, 800],
  [1600, 1000], [1600, 1680]
]

sideprofilRute1 = [sideprofil1, sideprofil2, sideprofil3]
sideprofilRute2 = [sideprofil3, sideprofil2, sideprofil1]

//-------------------------------------------------
//----------Event and Functions-------------------- 

function clearAllSvgViewbox() {
  opretProfilVogn = []
  opretProfilVognForSvg = []
  while (svgDrawProfile.childElementCount > 2) {
    svgDrawProfile.removeChild(svgDrawProfile.lastChild)
  }

  while (svg.childElementCount > 3 || svgProfileOnly.childElementCount > 3) {
    svgProfileOnly.removeChild(svgProfileOnly.lastChild)
    svg.removeChild(svg.lastChild)
  }
}

function drawTheCoordinateProfileOnDrawSvg(coordinateProfile) {
  opretProfilVogn = coordinateProfile

  finaleProfile = convertProfilToSvgFormat(opretProfilVogn);
  lineOfProfil = document.createElementNS(NS, 'polyline')
  lineOfProfil.setAttribute("points", finaleProfile);
  lineOfProfil.setAttribute("stroke", "black");
  lineOfProfil.setAttribute("fill", "none");
  lineOfProfil.setAttribute('id', "testID")
  svgDrawProfile.appendChild(lineOfProfil);
}

function beginDraw() {
  draw = true;
}

function endDraw() {
  draw = false;
  if (svgDrawProfile.childElementCount == 3) { // 3 lines (children) in viewbox. The 4th element would be the profile line. 
    svgDrawProfile.removeChild(svgDrawProfile.lastChild)
    opretProfilVogn.push([0, opretProfilVogn[opretProfilVogn.length - 1][1]]) //Ending the profile by adding the coordinates as the last coordinates. 
    opretProfilVognForSvg.push([0 / 2 + 1000, opretProfilVogn[opretProfilVogn.length - 1][1]])
    console.log(opretProfilVogn)
    console.log(opretProfilVognForSvg)
    finaleProfile = convertProfilToSvgFormat(opretProfilVogn);
    lineOfProfil = document.createElementNS(NS, 'polyline')
    lineOfProfil.setAttribute("points", finaleProfile);
    lineOfProfil.setAttribute("stroke", "black");
    lineOfProfil.setAttribute("fill", "none");
    lineOfProfil.setAttribute('id', "testID")
    svgDrawProfile.appendChild(lineOfProfil);
  }
}

function removeLastPoint() {
  if (svgDrawProfile.childElementCount > 2) { // 2 lines (children) in viewbox. The 4th element would be the profile line. 
    svgDrawProfile.removeChild(svgDrawProfile.lastChild)
    opretProfilVogn.pop()
    opretProfilVognForSvg.pop()
    finaleProfile = convertProfilToSvgFormat(opretProfilVogn);
    lineOfProfil1 = document.createElementNS(NS, 'polyline')
    lineOfProfil1.setAttribute("points", finaleProfile);
    lineOfProfil1.setAttribute("stroke", "black");
    lineOfProfil1.setAttribute("fill", "none");
    lineOfProfil1.setAttribute('id', "testID")
    svgDrawProfile.appendChild(lineOfProfil1);
  }
}

function drawPointInProfile(event) {
  if (draw) {


    const target = event.target.closest('g') || event.target.ownerSVGElement || event.target //Target er det element man trykker på. Her er det vores svg element. 

    //clientX & Y er eventets koordinater. Dette er et pointer down, så det er der, hvor der klikkes. Det i forhold til screen width and height
    svgP = svgPoint(target, event.clientX, event.clientY)
    cX = Math.round(svgP.x)
    cY = Math.round(svgP.y)


    if (svgDrawProfile.childElementCount > 2) { // 2 lines (children) in viewbox. The 3th element would be the profile line.
      svgDrawProfile.removeChild(svgDrawProfile.lastChild)
    }

    if (opretProfilVogn.length == 0) {
      lineOfProfil = document.createElementNS(NS, 'polyline')
      opretProfilVogn.push([0, cY])
      opretProfilVognForSvg.push([0 / 2 + 1000, cY])
    }

    opretProfilVogn.push([cX, cY])
    opretProfilVognForSvg.push([cX / 2 + 1000, cY])

    finaleProfile = convertProfilToSvgFormat(opretProfilVogn);

    lineOfProfil.setAttribute("points", finaleProfile);
    lineOfProfil.setAttribute("stroke", "black");
    lineOfProfil.setAttribute("fill", "none");
    lineOfProfil.setAttribute('id', "testID")

    svgDrawProfile.appendChild(lineOfProfil);
  }
}

function getCoordinates(event) {
  const svgP = svgPoint(svgProfileOnly, event.clientX, event.clientY);
  svgX.value = svgP.x;
  svgY.value = svgP.y;

  svgXTextContent = isNaN(svgX.value) ? svgX.value : Math.round(svgX.value);
  svgYTextContent = isNaN(svgY.value) ? svgY.value : Math.round(svgY.value);

  svgY.textContent = "Y: " + svgYTextContent
  svgX.textContent = "X: " + svgXTextContent
}

function getCoordinatesDrawProfile(event) {
  const svgP = svgPoint(svgDrawProfile, event.clientX, event.clientY);
  svgX.value = svgP.x;
  svgY.value = svgP.y;

  svgXTextContent = isNaN(svgX.value) ? svgX.value : Math.round(svgX.value);
  svgYTextContent = isNaN(svgY.value) ? svgY.value : Math.round(svgY.value);

  svgYDrawProfile.textContent = "Y: " + svgYTextContent
  svgXDrawProfile.textContent = "X: " + svgXTextContent
}

function fullSpeed(profil) {
  profileBothSides = convertToSymmetricProfile(profil) //getting both sides of profile
  newProfile = []
  for (i = 0; i < profileBothSides.length; i++) {

    profileXAndY = convertFromSvgToProfileCoordinates(profileBothSides[i][0], profileBothSides[i][1])

    y = profileXAndY[1] //Using height (Y) in the formel
    calcX = ((y - 850) / 2000 * 25) + (y * 15 / 1500) + (10 / 2) * 1.5 + 30 + 2.5 //The calculated x

    if (profileBothSides[i][0] - 1000 < 0) {
      addedX = profileBothSides[i][0] - 15 - ((1435 - 1410) / 2) - calcX //Add the extra width to original x
      newProfile.push([addedX, profileBothSides[i][1]]) //The new profile width at full speed
    }
    else {
      addedX = profileBothSides[i][0] + 15 + ((1435 - 1410) / 2) + calcX //Add the extra width to original x
      newProfile.push([addedX, profileBothSides[i][1]]) //The new profile width at full speed
    }

  }
  return newProfile;
}

// Hvis tid kan der bygges videre på denne funktion. 
function convertFromSvgToProfileCoordinates(x, y) {
  var box = svg.viewBox.baseVal
  newY = Math.abs(y - box.height)
  newX = x - box.height / 2

  return [newX, newY]
}


// translate page to SVG co-ordinate
function svgPoint(element, x, y) {

  var pt = svg.createSVGPoint(); //Det repræsenterer et 2D eller 3D point i SVG koordinat systemet. Det er lavet på svg elementet. 
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse()); //Fra svg units til screen coordinater. X&Y egenskaber som giver koordinater på svg viewbox.
}

function chooseProfile() {
  if (this.id == "btnIndlæsknap") {
    displayProfil(profilVogn, this.id)
  }
  if (this.id == "btnUseDrawProfile") {
    if (opretProfilVognForSvg.length == 0) {
      getSnackbar("Ingen tegnet profil")
    }
    else {
      displayProfil(opretProfilVognForSvg, this.id)
      convert2DArrayToXAndYArray(opretProfilVogn)
    }
  }
  if (this.id == "convertTo2DArray") {
    coordinateProfile = getProfileCoordinates()
    coordinateProfileSvg = getProfileCoordinatesSvg(coordinateProfile)
    displayProfil(coordinateProfileSvg, "btnUseDrawProfile")
    //coordinateProfileSvg[0][0] = 0
    //coordinateProfileSvg[coordinateProfileSvg.length -1][0] = 0
    drawTheCoordinateProfileOnDrawSvg(coordinateProfile)
  }
}

function displayProfil(profilVogn, id) {

  fullSpeedProfile = fullSpeed(profilVogn)

  displayProfile = profilVogn
  displayeProfileConverted = convertProfilToSvgFormat(profilVogn)
  displayProfileShadow = convertToSymmetricSvg(profilVogn)
  displayProfileFullspeed = convertProfilToSvgFormat(fullSpeedProfile)

  for (i = 0; i < svg.childElementCount; i++) {
    let child = svg.children[i]
    if (child.id == "btnIndlæsknap" || child.id == "btnUseDrawProfile") {

      displayGenerelProfileWithShadow(displayProfileFullspeed, "5km for stærkt", displayProfileShadow, id, svg, svg.children[i], i)

      desplayGenerelProfileNoShadow(displayProfileShadow, id, svgProfileOnly, i)

    }
  }

  if (svg.childElementCount == 3) { //3 lines (children) under viewbox. Add 2 profiles as children. 

    newProfile1 = drawProfile(displayProfileFullspeed, "5km for stærkt")
    newProfile2 = drawShadowProfile(displayProfileShadow, id)

    svg.appendChild(newProfile1)
    svg.appendChild(newProfile2)

    newProfile1 = drawShadowProfile(displayProfileShadow, id)

    svgProfileOnly.appendChild(newProfile1)
  }
}

function displayGenerelProfileWithShadow(fullSpeedProfile, fullSpeedProfileId, shadowProfile, shadowProfileId, svgView, child, i) {
  newProfile1 = drawProfile(fullSpeedProfile, fullSpeedProfileId)
  newProfile2 = drawShadowProfile(shadowProfile, shadowProfileId)

  svgView.appendChild(newProfile1)
  svgView.appendChild(newProfile2)

  svgView.replaceChild(newProfile1, svgView.children[i - 1])
  svgView.replaceChild(newProfile2, child)
}

function desplayGenerelProfileNoShadow(shadowProfile, shadowProfileId, svgView, i) {
  newProfile1 = drawShadowProfile(shadowProfile, shadowProfileId)
  svgView.appendChild(newProfile1)
  svgView.replaceChild(newProfile1, svgView.children[i - 1])
}

function displayNextSideprofile() {
  if (sideprofiler.length > 0) {
    if (sideprofilIndex + 2 <= sideprofiler.length) {
      if (svg.childElementCount > 5) { //3 lines (children) under viewbox and 2 profiles as children = 6 elements.
        svg.removeChild(svg.lastChild)
      }
      sideprofilIndex++;
      checkForCollision(sideprofilIndex)
      newProfile = drawProfile(sideprofiler[sideprofilIndex], "sideprofil")
      svg.appendChild(newProfile)
    }
  }
}

function displaypreviousSideprofile() {
  if (sideprofiler.length > 0) {
    if (sideprofilIndex != 0) {
      if (svg.childElementCount > 5) { //3 lines (children) under viewbox and 2 profiles as children = 6 elements.
        svg.removeChild(svg.lastChild)
      }
      sideprofilIndex--;
      checkForCollision(sideprofilIndex)
      svg.appendChild(drawProfile(sideprofiler[sideprofilIndex], "sideprofil"))
    }
  }
}

function displayFirstSideprofile() {
  if (svg.childElementCount > 5) svg.removeChild(svg.lastChild) //3 lines (children) under viewbox and 2 profiles as children = 6 elements.

  if (sideprofiler.length > 0) {
    sideprofilIndex = 0
    checkForCollision(sideprofilIndex)
    svg.appendChild(drawProfile(sideprofiler[0], "sideprofil"))
  }
}

function displayLastSideprofile() {
  if (svg.childElementCount > 5) { //3 lines (children) under viewbox and 2 profiles as children = 6 elements.
    svg.removeChild(svg.lastChild)
  }

  if (sideprofiler.length > 0) {
    sideprofilIndex = sideprofiler.length - 1;
    newProfile = drawProfile(sideprofilerSvg[sideprofilIndex], "sideprofil")

    checkForCollision(sideprofilIndex)

    svg.appendChild(newProfile)
  }
}

function checkForCollision(sideprofilIndex) {
  document.getElementById('infoAreaStill').textContent = ""
  document.getElementById('infoAreaFullspeed').textContent = ""
  //Se om første sideprofil rammer profil eller dens symmetriske halvside
  halvsideprofil = convertToSymmetricProfile(displayProfile)
  //Der er en lille fejlmargin. Hvis det er på præcis samme koordinat, så registrer den ikke. hvis sideobjekt = 900, så true på 899&901
  if (isCollision(sideprofiler[sideprofilIndex], halvsideprofil)) document.getElementById('infoAreaStill').textContent = "Der er sammenstød"
  //Se om første sideprofil rammer profil med fuld speed 
  if (isCollision(sideprofiler[sideprofilIndex], fullSpeedProfile)) document.getElementById('infoAreaFullspeed').textContent = "Der er sammenstød"
}

function isCollision(sideprofil, profil) {
  let isCollision = false
  for (i = 0; i < profil.length; i++) {
    if (i + 2 <= profil.length) {
      for (a = 0; a < sideprofil.length; a++) {
        if (a + 2 <= sideprofil.length) {
          if (isPointInPoly(sideprofil[a][0], sideprofil[a][1], sideprofil[a + 1][0], sideprofil[a + 1][1], profil[i][0], profil[i][1], profil[i + 1][0], profil[i + 1][1])) {
            isCollision = true
          }
        }
      }
    }
  }
  return isCollision
}

function isPointInPoly(a, b, c, d, p, q, r, s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

function chooseRoute() {
  if (svg.childElementCount > 3) { // 3 lines from start under viewbox. Vi need to add profile before we can simulate a route. 
    if (rute1.checked) {
      useRute(sideprofilRute1)
      RouteHeadlineRight.innerHTML = "Rute1"
    } else if (rute2.checked) {
      useRute(sideprofilRute2)
      RouteHeadlineRight.innerHTML = "Rute2"
    } else {
      getSnackbar("Ingen rute valgt")
    }
  }
  else {
    getSnackbar("Mangler at indsætte profil")
  }
}

function useRute(choosenSideprofiles) {
  sideprofiler = choosenSideprofiles

  sideprofilIndex = 0

  checkForCollision(sideprofilIndex)

  for (i in choosenSideprofiles) {
    tal = parseInt(i)
    sideprofilerSvg[i] = convertProfilToSvgFormat(choosenSideprofiles[i])
  }
  if (svg.childElementCount > 5) { //3 lines (children) under viewbox and 2 profiles as children = 5 elements. We need to remove wayside object(element 6) if we change new route
    svg.removeChild(svg.lastChild)
  }
  newProfile = drawProfile(choosenSideprofiles[0], "sideprofil")
  svg.appendChild(newProfile)
}

function convertProfilToSvgFormat(profil) {
  let points = "";
  for (i in profil) {
    points += profil[i] + " "
  }
  return points;
}

function convertToSymmetricSvg(profil) {
  let points = "";
  var box = svg.viewBox.baseVal

  for (i in profil) {
    if (profil[i][0] - box.width / 2 >= 0) {
      let newX = profil[i][0] - (profil[i][0] - box.width / 2) * 2
      points += newX + ", " + profil[i][1] + " "
    }
    else {
      let newY = profil[i][0] + (Math.abs(profil[i][0] - box.width / 2)) * 2
      points += newY + ", " + profil[i][1] + " "
    }
  }

  for (i in profil) {
    points += profil[i] + " "
  }

  return points;
}

function convertToSymmetricProfile(profil) {
  let points = [];
  var box = svg.viewBox.baseVal

  for (i in profil) {
    if (profil[i][0] - box.width / 2 >= 0) {
      let newX = profil[i][0] - (profil[i][0] - box.width / 2) * 2
      points.push([newX, profil[i][1]])
    }
    else {
      let newY = profil[i][0] + (Math.abs(profil[i][0] - box.width / 2)) * 2
      points.push([newY, profil[i][1]])
    }
  }

  for (i in profil) {
    points.push(profil[i])
  }

  return points
}

function drawProfile(convertedProfil, profilID) {
  lineOfProfil = document.createElementNS(NS, 'polyline')

  lineOfProfil.setAttribute("points", convertedProfil);
  lineOfProfil.setAttribute("stroke", "black");
  lineOfProfil.setAttribute('id', profilID)
  lineOfProfil.setAttribute('fill', 'none')

  return lineOfProfil
}

function drawShadowProfile(convertedProfil, profilID) {
  lineOfProfil = document.createElementNS(NS, 'polyline')

  lineOfProfil.setAttribute("points", convertedProfil);
  lineOfProfil.setAttribute("stroke", "black");
  lineOfProfil.setAttribute('id', profilID)
  lineOfProfil.setAttribute('stroke-opacity', '.001')
  lineOfProfil.setAttribute('fill', 'rgb(218, 218, 218)')

  return lineOfProfil
}