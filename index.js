const colorTable = {
  "unique": "#f4b8b8",
  "same": "#b8c7f4",
  "antioxidants": "#dac1ef",
  "emollient": "#fce7a5",
  "ferments": "#daf4e3",
  "humectants": "#805067",
  "plant": "#79a9b4",
  "soothing": "#ffe4d6"
}

const categoryTable = {
  "antioxidants": ['coenzyme q10', 'tocopheryl acetate', 'tocopherol', 'retinyl palmitate', 'retinaldehyde', 'retinol', 'dipotassium glycyrrhizate', 'niacinamide', 'ferulic acid', 'l-ascorbic acid', 'ascorbyl tetraisopalmitate ', 'tetrahexyldecyl ascorbate', 'panthenol', 'adenosine', 'arbutin', 'biotin', 'ascorbic acid', 'glutathione', 'ascorbyl glucoside'],
 
  "emollient": ['caprylyl glycol', 'texture ', 'butylene glycol', 'dimethicone', 'cetyl esters', 'hydrogenated polyisobutene', 'caprylic/capric triglyceride', 'linoleic acid', 'caprylyl glycol', 'sodium lactate', 'coconut alkanes', 'dicaprylyl carbonate', 'glycine soja sterols', 'snail secretion filtrate', 'butyrospermum parkii (shea) butter'],
  
  "ferments": ['lactococcus ferment lysate', 'lactobacillus ferment', 'centella asiatica meristem cell culture', 'natto gum', 'glycolic acid', 'salicylic acid', 'lactic acid', 'kojic acid ', 'malic acid ', 'azelaic acid', 'mandelic acid', 'pyruvic acid', 'beta hydroxybutanoic acid', 'tropic acid', 'trethocanic acid'],
  
  "humectants": ['glycerin', 'sodium hyaluronate', 'sodium hyaluronate crosspolymer', 'sodium pca', 'trehalose'],
  
  "plant": ['centella asiatica leaf water', 'melaleuca alternifolia (tea tree) leaf water', 'rosa damascena flower water', 'aloe barbadensis leaf water', 'licorice root extract', 'glycyrrhiza glabra (licorice) rhizome/root'],
  
  "soothing": ['ceramide np', 'ceramide eop', 'ceramide ap', 'ceramide as', 'ceramide ns', 'palmitoyl oligopeptide', 'palmitoyl tetrapeptide-7', 'allantoin', 'urea', 'glycine', 'alanine', 'serine', 'valine', 'isoleucine', 'proline', 'threonine', 'histidine', 'phenylalanine', 'arginine', 'aspartic acid']
}


function has_item(list, item) {
  for (let elem of list) {
    let elemL = elem.toLowerCase();
    let itemL = item.toLowerCase();
    // basic check
    if (elemL.trim() === itemL.trim()) {
      return true;
    }
    // water check
    let waterList = ["aqua (deionized water)", "water/eau", "water/aqua/eau", "aqua", "water", "water / eau", "water / aqua / eau"]
    if (waterList.includes(elemL) && waterList.includes(itemL)){
      return true;
    }
    // without bracketed content
    if (elemL.replace(/ *\([^)]*\) */g, "") === itemL.replace(/ *\([^)]*\) */g, "")) {
      return true;
    }
  }
  return false;
}

function compare(oneList, twoList) {
  let uniqueOneList = []
  let uniqueTwoList = []
  let sameList = []

  for (let item of oneList) {
    if (has_item(twoList, item)) {
      sameList.push(item)
    } else {
      uniqueOneList.push(item)
    }
  }
  
  for (let item of twoList) {
    if (!has_item(sameList, item)) {
      uniqueTwoList.push(item)
    }
  }
  
  return [uniqueOneList, uniqueTwoList, sameList]
}

function is_oil_or_extract(item) {
  let itemSplit = item.split(' ');
  let oil_or_extract = ['Oil', 'oil', 'Extract', 'extract']
  for (let oil of oil_or_extract) {
    if (itemSplit.includes(oil))
    return true;
  }
  return false;
}

function format_item(item, uniqueList, categoryBool) {
  let compareClassName = "same";
  let categoryClassName = "";
  
  if (uniqueList.includes(item)) {
    compareClassName = "unique";
    change_color(compareClassName)
  }
  
  // check with category list
  for (const [category, categoryList] of Object.entries(categoryTable)) {
    if (has_item(categoryList, item.toLowerCase())) {
      categoryClassName = category
      change_color(categoryClassName);
    }
  }
  
  // check oil and extract to put in plant
  if (is_oil_or_extract(item)) {
    categoryClassName = 'plant'
    change_color(categoryClassName);
  }
  
  
  if (categoryClassName === "" || !categoryBool) {
    return `<span class='${compareClassName} compareHighlight'>${item}</span>`
  } else {
    return `<span class='${compareClassName} compareHighlight'><span class='${categoryClassName} typeHighlight'>${item}</span></span>`
  }
}

// color stuff
function change_color(className) {
  let color = document.getElementById(className).value
  let elementList =  document.getElementsByClassName(className)
  for (let element of elementList) {
    element.style.backgroundColor = color
  }
}

function change_all_color() {
  for (const [id, color] of Object.entries(colorTable)) {
    change_color(id);
  }
}

function reset_color() {
  for (const [id, color] of Object.entries(colorTable)) {
    console.log(id + color)
    if (id == null) {
      return
    }
    document.getElementById(id).value = color
  }
  change_all_color();
}

function compare_frontend() {
  let categoryBool = document.getElementById("categroriesCheckbox").checked
  let one = document.getElementById("oneT").value
  let two = document.getElementById("twoT").value
  let oneList = one.split(', ')
  let twoList = two.split(', ')
  
  if (one === "" && two === "") {
    return
  } else if (one === ""){
    oneList = []
  } else if (two === "") {
    twoList = []
  }
  
  let [uniqueOneList, uniqueTwoList, sameList] = compare(oneList, twoList)
  
  let displayOneList = []
  let displayTwoList = []
  // apply highlight
  for (let item of oneList) {
    displayOneList.push(format_item(item, uniqueOneList, categoryBool))
  }
  for (let item of twoList) {
    displayTwoList.push(format_item(item, uniqueTwoList, categoryBool))
  }
  
  let oneText = ""
  for (let word of displayOneList) {
    oneText += word
  }
  let twoText = ""
  for (let word of displayTwoList) {
    twoText += word
  }
  
  document.getElementById("oneP").innerHTML = oneText
  document.getElementById("twoP").innerHTML = twoText
  
  change_all_color();

}
document.onload = reset_color()