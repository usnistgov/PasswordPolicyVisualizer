/***
 * @file This file declares all global variables and constants and parses our CSV
 * file of our tree structure.  Basically, this script initializes everything.
 * It is our driver.
 * Script also includes functions important when parsing the treeDataStructure.csv
 * @requires d3.js
 * @requires drawingFunctions.js
 * @author Elijah Peake <elijah.peake@gmail.com>
 */

/** Start of global and constant declarations */
// width of visual
const width = 2000;

// height of visual
const height = 2000;
const focalSquareHeight = height * 3.5;
const focalSquareWidth = width * 3.5;

// for when in multi layer view
const multiMasterTreeWidths = [width, width, width * 2.8, width * 2.8];
const multiMasterTreeHeights = [height, height * 2.8, height, height * 2.8];
const menuHeight = 59;
const menuBoxWidth = 140;

// dropdown
const menuOptionWidth = 230;
const menuOptionHeight = 50;

// vertical spacing between text
const menuOptionTextY = 88;

// text indentation
const menuTextConstant = 20;

// for outer rings
const drawArc = d3.arc()
  .innerRadius(1400)
  .outerRadius(1400);
const menuBar = {
  leftSide: ["Stats", "Verb", "Rule Category"],

  // need to get rid of verb tab for the multi layer view
  leftSideMulti: ["Stats", "Rule Category"],
  rightSide: ["Key", "Add Paths", "Change Modes"],
  verbOptions: ["Must", "Must Not", "Should", "Should Not", "***Toggle All***"],
  ruleCategoryOptions: ["***See All***", "Create", "Communicate", "Change", "Store", "Failure"],
  addPathsOptions: ["Add File", "Add File", "***Clear All***"],
  modeOptions: ["Layered Trees", "Seperated Trees"]
};

// for verb dropdown
const verbOptions = ["Must", "Must Not", "Should", "Should Not"];

// variables for the object storing data filtered on each of the verbs
const verbIDConnect = ["must", "mustNot", "should", "shouldNot"];
const treeCategories = ["Create Passwords", "Communicate Passwords", "Change Passwords", "Store Passwords", "Fail to authenticate"];
const statVals = ["Rule Count", "Percent Require", "Percent Recommend", "Ambiguous Count", "Unique Count", "Overlap Count"];

// file 1, file 2, overlap
const colorsUsed = ["#009FC2", "#F0A000", "#1AD133"];

let i,
  j,
  reader,

  // we need different tree functions for each of our rule categores, which we sore here
  trees = [],

  // how much to seperate each tree in **see all** view
  seperation = [],

  // data for each rule category
  nestedSubtreeData = [],

  // we want to keep these in memory because will remove them when chooing a new file
  linkIDs1 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  },
  linkIDs2 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  },

  // same but for multi layer picture, keep both ids so we can switch between two layouts
  linkMultiIDs1 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  },
  linkMultiIDs2 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  },

  // which files are chosen :
  file1Text = "=  No File Chosen",
  file2Text = "=  No File Chosen",

  // all start active
  activeVerbs = [1, 1, 1, 1],

  // what rule category are we looking at:
  ruleCategoryIndex = 0,

  // what mode are we looking at:
  modeIndex = 0,

  // one zero for each file and one array for each Rule Category layouts
  statistics = {
    rules: [[], []],
    ruleCount: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    percRequire: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    percRecommend: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    ambigCount: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  },
  jointStatistics = {
    matchCount: [0, 0, 0, 0, 0, 0],
    uniqueCount: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  };

// the last class of our link before we highlighted it on mouse over
// lastLinkClass = "";

/** End of  global and constant declarations */


/**
 * this contains all groups for the visualizaiton.
 * this includes our tree, the menu, and our stats/key panels.
 * we use viewBox to scale on window resize.
 * we disable double click zoom so when we click on our dropdowns it doesn't zoom in
 * FIXME: make it so that we cannot control zoom while mouse is over the menu
 */
let svgContainer = d3.select("body").append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("class", "contents-svg").call(
    d3.zoom()
    .scaleExtent([0.5, 15])
    .on("zoom", function() {
      visualizationContainer.attr("transform", d3.event.transform);
    })
  )
  .on("dblclick.zoom", null);

let visualizationContainer = svgContainer.append("g")
  .attr("class", "visualization");

let dropdownContainer = svgContainer.append("g");

let menuContainer = svgContainer.append("g")
  .attr("class", "menu");

let treeContents = visualizationContainer.append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-2000 -630 " + width * 3 + " " + height * 3)
    .attr("class", "contents-svg")
    .append("g")
      .attr("class", "zoom");

// required group for zooming
let masterTree = treeContents.append("g")
  .attr("class", "master-tree");

// our tree branches, transform to make sure our origin shifts to the center of the screen
let gTree = masterTree.append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// to hold the outer rings
let gSectors = masterTree.append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// small center circle
masterTree.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .append("circle")
      .attr("r", 100)
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "5px");

/** @async first parse, then handle */
d3.csv("./treeDataStructure.csv").then(function(tempTreeData) {
  let angles = [];

  // add each of our filtered subtrees to nestedSubtreeData
  for (i = 0; i < treeCategories.length; i++) {
    nestedSubtreeData.push(filterTrees(tempTreeData, treeCategories[i]));
  }

  // get length of each nest to calculate tree angles
  for (i = 0; i < nestedSubtreeData.length; i++) {
    angles.push(nestedSubtreeData[i].length);
  }

  // calculate and store seperate tree functions
  for (i = 0; i < angles.length; i++) {
    angles[i] = (angles[i] / tempTreeData.length) * (2 * Math.PI);
    trees.push(d3.tree()
      .separation(function(a, b) {
        // max seperation
        return 10 / a.depth;
      })
      .size([angles[i], width / 2]));
  }

  // can't use i because used in buildNest, so we use j
  for (j = 0; j < nestedSubtreeData.length; j++) {
    nestedSubtreeData[j] = d3.hierarchy(buildNest(nestedSubtreeData[j]));
  }

  //calculating the ammount we need to roatate each tree so that there is no overlap
  seperation = getSeperation(angles);

  for (i = 0; i < nestedSubtreeData.length; i++) {
    drawTree(gTree, nestedSubtreeData, seperation, i);
  }

  // draw our sectors
  seperation.push(2 * Math.PI);
  for (i = 0; i < nestedSubtreeData.length; i++) {
    gSectors.append("path")
      .attr("fill", "none")
      .attr("stroke-width", 20)
      .attr("stroke", "#ccc")
      .attr("d", drawArc({
        startAngle: (seperation[i] + 0.1),
        endAngle: (seperation[i + 1] - 0.1)
      }));
  }

  // just appending center text to say "Users"
  gTree.append("text")
    .text("Users")
    .attr("font-size", "28px")
    .attr("x", "-28px")
    .attr("y", "-28px")
    .attr("pointer-events", "none");

  // our key and stats panels
  d3.select("#key-button").append("div").attr("class", "downarrow-key");
  redrawKey();
  d3.select("#stats-button").append("div").attr("class", "downarrow-stats");
  redrawStats();
});

// add our menu
redrawMenu();



/**
 * Unfortunately the d3.nest function assumes a uniform depth, so we need to make
 * our own nest from our csv file. O(n^2)
 * @param {parsed csv object} data
 * @returns {nested data object}
 * FIXME: Make cleaner
 */
function buildNest(data) {
  let nest = {
    name: data[0].child0,
    children: []
  };

  data.forEach(function(row) {
    let child1Index, child2Index, child3Index, child4Index, child5Index;

    //child 1
    if (row.child1 !== "") {
      child1Index = findNameIndex(nest.children, row.child1);
      if (child1Index == -1) {
        nest.children.push({
          "name": row.child1
        });
      }
    }

    // child 2
    if (row.child2 !== "") {
      child1Index = findNameIndex(nest.children, row.child1);
      if (nest.children[child1Index].children === undefined) {
        nest.children[child1Index].children = [];
      }

      child2Index = findNameIndex(nest.children[child1Index].children, row.child2);
      if (child2Index == -1) {
        nest.children[child1Index].children.push({
          "name": row.child2
        });
      }
    }

    // child 3
    if (row.child3 !== "") {
      child2Index = findNameIndex(nest.children[child1Index].children, row.child2);
      if (nest.children[child1Index].children[child2Index].children === undefined) {
        nest.children[child1Index].children[child2Index].children = [];
      }

      child3Index = findNameIndex(nest.children[child1Index].children[child2Index].children, row.child3);
      if (child3Index == -1) {
        nest.children[child1Index].children[child2Index].children.push({
          "name": row.child3
        });
      }
    }

    // child 4
    if (row.child4 !== "") {
      child3Index = findNameIndex(nest.children[child1Index].children[child2Index].children, row.child3);
      if (nest.children[child1Index].children[child2Index].children[child3Index].children === undefined) {
        nest.children[child1Index].children[child2Index].children[child3Index].children = [];
      }

      child4Index = findNameIndex(nest.children[child1Index].children[child2Index].children[child3Index].children, row.child4);
      if (child4Index == -1) {
        nest.children[child1Index].children[child2Index].children[child3Index].children.push({
          "name": row.child4
        });
      }
    }

    //child 5
    if (row.child5 !== "") {
      child4Index = findNameIndex(nest.children[child1Index].children[child2Index].children[child3Index].children, row.child4);
      if (nest.children[child1Index].children[child2Index].children[child3Index].children[child4Index].children === undefined) {
        nest.children[child1Index].children[child2Index].children[child3Index].children[child4Index].children = [];
      }

      child5Index = findNameIndex(nest.children[child1Index].children[child2Index].children[child3Index].children[child4Index].children, row.child5);
      if (child5Index == -1) {
        nest.children[child1Index].children[child2Index].children[child3Index].children[child4Index].children.push({
          "name": row.child5
        });
      }
    }
  });

  return nest;
}

/**
* helper function for buildNest
* @param {array of nest object's children} childrenArray
* @param {string} nameToSearch
* @returns {int} index if found, else -1
*/
function findNameIndex(childrenArray, nameToSearch) {
  for (i = 0; i < childrenArray.length; i++) {
    if (childrenArray[i].name == nameToSearch) {
      return i;
    }
  }

  return -1;
}

/**
* breaks up all data into subtrees, used for filtering on rule category
* @param {parsed csv object} data
* @param {string} filter - rule category to filter on
* @returns {parsed csv object} object containing "filter" as child 1
*/
function filterTrees(data, filter) {
  let filteredData = [];
  data.forEach(function(d) {
    if (d.child1 == filter) {
      filteredData.push(d);
    }
  });

  return filteredData;
}



/**
 * TODO: Possible future functions
 */

// change color of link on hover
// function expandLink() {
//   let link = d3.select(this);
//   if (link.attr("class") != "g-link" && ruleCategoryIndex !== 0) {
//     lastLinkClass = link.attr("class");
//     link.attr("class", "expanded-link");
//   }
// }

// return to previous color on leave
// function retractLink() {
//   let link = d3.select(this);
//   if (link.attr("class") != "g-link" && ruleCategoryIndex !== 0) {
//     link.attr("class", lastLinkClass);
//   }
// }

// ////////BROKEN////////////
// function clickLink() {
//   let link = d3.select(this),
//       xClick = this.clientX,
//       yClick = this.clientY,
//       scale = this.getScreenCTM(),
//       countBoxWidth = 800,
//       countBoxHeight = 500;

//   console.log(scale)
//   console.log(scale.inverse())
//   if (link.attr("class") == "expanded-link") {
//     d3.select(".zoom").append("rect")
//       .attr("class", "link-key")
//       .attr("x", xClick - countBoxWidth)
//       .attr("y", yClick - countBoxHeight)
//       .attr("width", countBoxWidth)
//       .attr("height", countBoxHeight)
//       .attr("fill", "black");
//   }
// // p = p.matrixTransform(m.inverse());
// }
