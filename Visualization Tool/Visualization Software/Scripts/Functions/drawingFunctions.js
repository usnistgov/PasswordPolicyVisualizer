/**
 * @file This section is comprised of functions required for building our initial
 * visualization on startup.  Also includes the key and stats dropdowns
 * @requires d3.js
 * @requires fileHandling.js
 * @requires menuFunctions.js
 * @author Elijah Peake <elijah.peake@gmail.com>
 */


/**
 * redraws the menu, not including dropdowns or buttons on the right because
 * these do not change with mode changes.
 * only reason we make this a function is because we need to get rid of our verb
 * option when we change modes
 */
function redrawMenu(){
  // whether or not to include our verb option
  let leftData = (modeIndex === 0) ? "leftSide": "leftSideMulti",
      toggleLayoutID = (modeIndex === 0) ? "#menubutton2": "#menubutton1";

  // the whole bar
  menuContainer.append("rect")
    .attr("height", menuHeight)
    .attr("width", width)
    .attr("fill", "#424949");

  // center text
  menuContainer.append("text")
    .attr("class", "menubar")
    .attr("x", width/2)
    .attr("y", 39)
    .text("Visualizing Password Policies");

  let leftBoxes = menuContainer.selectAll()
      .data(menuBar[leftData])
    .enter().append("g")
      .attr("class", "menubutton")
      .attr("id", function(d, i){ return "menubutton" + i; });

  leftBoxes.append("rect")
    .attr("class", "boxes")
    .attr("x", function(d, i){ return i * menuBoxWidth; })
    .attr("y", 0)
    .attr("height", menuHeight)
    .attr("width", menuBoxWidth)
    .attr("fill", "#424949");

  leftBoxes.append("text")
    .attr("class", "boxes-text")
    .text(function(d){ return d; })
    .attr("x", function(d, i){ return (i !== 0) ? 70 + (i * menuBoxWidth): 40; })
    .attr("y", 35);

  let statsButton = d3.select("#menubutton0");

  statsButton.append("rect")
    .attr("class", "shown-square--down")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(100, 15) rotate(45)")
    .attr("fill", "white")
    .attr("pointer-events", "none");

  statsButton.append("rect")
    .attr("class", "hidden-square")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(100,10) rotate(45)")
    .attr("fill", "#424949")
    .attr("pointer-events", "none");

  statsButton.on("click", toggleArrow);

  let rightBoxes = menuContainer.selectAll()
      .data(menuBar.rightSide)
    .enter().append("g")
      .attr("class", "menubutton")
      .attr("id", function(d, i){ return "menubutton" + (i + 3); });

  rightBoxes.append("rect")
    .attr("class", "boxes")
    .attr("x", function(d, i){ return width - ((i + 1) * menuBoxWidth); })
    .attr("y", 0)
    .attr("height", menuHeight)
    .attr("width", menuBoxWidth)
    .attr("fill", "#424949");

  rightBoxes.append("text")
    .attr("class", "boxes-text")
    .text(function(d){ return d; })
    .attr("x", function(d, i){ return (i !== 0) ? 70 + width - ((i + 1) * menuBoxWidth) : width - 40; })
    .attr("y", 35);

  let keyButton = d3.select("#menubutton3");

  keyButton.append("rect")
    .attr("class", "shown-square--down")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(" + (width - 100) + ", 15) rotate(45)")
    .attr("fill", "white")
    .attr("pointer-events", "none");

  keyButton.append("rect")
    .attr("class", "hidden-square")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(" + (width - 100) + ", 10) rotate(45)")
    .attr("fill", "#424949")
    .attr("pointer-events", "none");

  keyButton.on("click", toggleArrow);

  // verb option
  if (modeIndex === 0) {
    d3.select("#menubutton1")
      .on("mouseenter", toggleVerbDropdown)
      .on("mouseleave", toggleVerbDropdown);
  }

  d3.select(toggleLayoutID)
    .on("mouseenter", toggleRuleCategoryDropdown)
    .on("mouseleave", toggleRuleCategoryDropdown);

  d3.select("#menubutton4")
    .on("mouseenter", toggleAddPathsDropdown)
    .on("mouseleave", toggleAddPathsDropdown);

  d3.select("#menubutton5")
    .on("mouseenter", toggleModesDropdown)
    .on("mouseleave", toggleModesDropdown);

}

// draws our key dropdown
function redrawKey() {
  // get rid of our previous key
  d3.selectAll(".key-dropdown--shown").remove();
  d3.selectAll(".key-dropdown").remove();

  let key = dropdownContainer.append("g")
    .attr("class", "key-dropdown--shown")
    .attr("id", "key-dropdown");

  // the whole panel
  key.append("rect")
    .attr("height", function(){ return (modeIndex === 0) ? 300: 190; })
    .attr("width", 330)
    .attr("x", width - 350)
    .attr("y", 80)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("fill", "#424949");

  // adding those bubble rectangles
  key.selectAll()
      .data(colorsUsed)
    .enter().append("rect")
      .attr("height", 20)
      .attr("width", 40)
      .attr("x", width - 310)
      .attr("y", function(d,i) { return 110 + (i * 50); })
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", function(d,i) { return colorsUsed[i]; });

  // text changes depending on what files are input
  key.append("text")
    .attr("id", "file1")
    .attr("class", "key-text")
    .text(file1Text)
    .attr("x", width - 250)
    .attr("y", 125);

  key.append("text")
    .attr("id", "file2")
    .attr("class", "key-text")
    .text(file2Text)
    .attr("x", width - 250)
    .attr("y", 175);

  key.append("text")
    .attr("class", "key-text")
    .text("=  File Overlap")
    .attr("x", width - 250)
    .attr("y", 225);

  // if in stacked layer view, we include shown verbs in our key
  if (modeIndex === 0){
    key.append("text")
      .attr("class", "key-text")
      .text("Verbs: ")
      .attr("x", width - 310)
      .attr("y", 295);

    key.selectAll()
      .data(verbOptions)
    .enter().append("text")
      .attr("class", "key-text-verb--shown")
      .text(function(d) { return d; })
      .attr("id", function(d,i) { return "key-text-verb" + i; })
      .attr("x", function(d,i) { return (i<2)? (width - 230 + (i*80)):(width - 230 + ((i-2)*80)); })
      .attr("y", function(d,i) { return (i<2)? 295:320; });
  }
}

// draws our stats dropdown
function redrawStats() {
  let stats = dropdownContainer.append("g")
    .attr("class", "stats-dropdown--shown")
    .attr("id", "stats-dropdown");

  // the whole panel
  stats.append("rect")
    .attr("height", 700)
    .attr("width", 330)
    .attr("x", 20)
    .attr("y", 80)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("fill", "#424949");

  stats.selectAll()
      .data(statVals)
    .enter().append("text")
      .attr("class", "stats-text")
      .text(function(d) { return d; })
      .attr("x", 60)
      .attr("y", function(d, i) { return 125 + (115 * i); });

  // for each of our statistics, we have to fetch stats for each file
  for (i = 0; i < statVals.length-1; i++) {
    stats.append("text")
      .attr("class", "stats-text-small")
      .text(getStat("#file1", i))
      .attr("x", 75)
      .attr("y", 155 + (115 * i));
    stats.append("circle")
      .attr("fill", colorsUsed[0])
      .attr("r", 5)
      .attr("cx", 65)
      .attr("cy", 150 + (115 * i));
    stats.append("text")
      .attr("class", "stats-text-small")
      .text(getStat("#file2", i))
      .attr("x", 75)
      .attr("y", 185 + (115 * i));
    stats.append("circle")
      .attr("fill", colorsUsed[1])
      .attr("r", 5)
      .attr("cx", 65)
      .attr("cy", 180 + (115 * i));
  }

  // need to handle both files as a special case
  stats.append("text")
    .attr("class", "stats-text-small")
    .text(getStat("", 5))
    .attr("x", 75)
    .attr("y", 155 + (115 * 5));
   stats.append("circle")
    .attr("fill", colorsUsed[2])
    .attr("r", 5)
    .attr("cx", 65)
    .attr("cy", 150 + (115 * 5));
}

/**
 * Redraws our "Master Tree," this is our **See All** tree.
 * When we switch between modes, we must redraw this master tree, but when
 * we switch between layers we hide, not redraw, the master tree for simplicity
 */
function redrawMasterTree(){
  // get rid of all visualizaitons because changing modes
  d3.selectAll(".visualization").selectAll("*").remove();

  // this is basically just repeating what happens in our treeJS.js file
  if (modeIndex === 0) {
    let treeContents = visualizationContainer.append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-2000 -630 " + width*3 + " " + height*3)
      .attr("class", "contents-svg")
      .append("g")
        .attr("class", "zoom");

    let masterTree = treeContents.append("g")
      .attr("class", "master-tree");

    // our tree branches, transform to make sure our origin shifts to the center of the screen
    let gTree = masterTree.append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    // to hold the outer rings
    let gSectors = masterTree.append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    // small center circle
    masterTree.append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
      .append("circle").attr("r", 100)
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "5px");

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
        .attr("d", drawArc({startAngle: (seperation[i] + 0.1), endAngle:(seperation[i + 1] - 0.1) }));
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
  }

  // this is our seperated trees mode
  else {
    // we need a new viewbox because the visual is a lot more zoomed out
    let treeContents = visualizationContainer.append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", (-width * 2.5) + " -1000 " + width * 9 + " " + height * 9)
      .attr("class", "contents-svg")
      .append("g")
        .attr("class", "zoom");

    let masterTree = treeContents.append("g")
      .attr("class", "master-tree");

    // 4 seperate trees
    for (i = 0; i < verbIDConnect.length; i++){
      let submasterTree = masterTree.append("g")
        .attr("class", function() { return "master-tree" + verbIDConnect[i]; });

      // our tree branches, transform to make sure our origin shifts to the center of the screen
      let gTree = submasterTree.append("g")
        .attr("transform", "translate(" + multiMasterTreeWidths[i] + "," + multiMasterTreeHeights[i] + ")");

      // to hold the outer rings
      let gSectors = submasterTree.append("g")
        .attr("transform", "translate(" + multiMasterTreeWidths[i] + "," + multiMasterTreeHeights[i] + ")");

      // center circle
      submasterTree.append("g")
        .attr("transform", "translate(" + multiMasterTreeWidths[i] + "," + multiMasterTreeHeights[i] + ")")
        .append("circle").attr("r", 100)
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "5px");

      for (j = 0; j < nestedSubtreeData.length; j++) {
           drawTree(gTree, nestedSubtreeData, seperation, j, verbIDConnect[i]);
      }

      // draw our sectors
      seperation.push(2 * Math.PI);
      for (j = 0; j < nestedSubtreeData.length; j++) {
        gSectors.append("path")
          .attr("fill", "none")
          .attr("stroke-width", 20)
          .attr("stroke", "#ccc")
          .attr("d", drawArc({startAngle: (seperation[j] + 0.1), endAngle:(seperation[j + 1] - 0.1) }));
      }

      gTree.append("text")
        .text("Users")
        .attr("font-size", "28px")
        .attr("x", "-28px")
        .attr("y", "-28px")
        .attr("pointer-events", "none");
    }

    // the squares that surround the visual
    drawFocalBoxes(treeContents);

    // our key and stats panels
    d3.select("#key-button").append("div").attr("class", "downarrow-key");
    redrawKey();
    d3.select("#stats-button").append("div").attr("class", "downarrow-stats");
    redrawStats();
  }
}

/**
* used to draw each of our tree branches in our **See All** view
* @param {d3 selection} treeGroup
* @param {array of nested data objects} nestedSubtreeData
* @param {array of floats} seperationArray - array of our tree seperation values
* @param {int} i - our current iteration
* @param {string} verb - are we filtering on a verb
*/
function drawTree(treeGroup, nestedSubtreeData, seperationArray, i, verb="") {
  let subTree = treeGroup.append("g")
    .attr("class", "subtree-" + treeCategories[i])
    .attr("transform", "rotate(" + seperationArray[i] * (180 / Math.PI) + ")");

  let nodes = nestedSubtreeData[i].descendants(),
      links = trees[i](nestedSubtreeData[i]).links();

  subTree.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "g-link")
      .attr("x1", function(d) { return radialPoint(d.source.x,d.source.y)[0]; })
      .attr("y1", function(d) { return radialPoint(d.source.x,d.source.y)[1]; })
      .attr("x2", function(d) { return radialPoint(d.target.x,d.target.y)[0]; })
      .attr("y2", function(d) { return radialPoint(d.target.x,d.target.y)[1]; })
      .attr("id", function(d) {
        return (d.source.data.name + "," + d.target.data.name).replace(/[\/\+\(\)]/g, "") + verb;   // because ids don't like /+()
      });
      // .on("mouseenter", expandLink)
      // .on("mouseleave", retractLink)
      // .on("click", clickLink);

  let node = subTree.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", function(d) { return (d.data.name.match("/") ? "node-menu" : "node"); })
      .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

  node.append("circle")
    .attr("r", 8);

  let nodeMenu = subTree.selectAll(".node-menu")
    .append("circle")
      .attr("class", "node-menu-circle")
      .attr("r", 5);

  /**
   * we need to handle words on left and right differently
   * we also need to transform text so it rotates around the circle
   */
  let text = node.append("text")
    .attr("class", "g-text")
    .attr("dy", "5px")
    .attr("x", function(d) { return (i===0) ? 15 : -15; })
    .attr("text-anchor", function(d) { return (i===0)  ? "start" : "end"; })
    .attr("transform", function(d) {
      return "rotate(" + ((i===0) ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")";
    })
    .text(function(d) { return d.data.name != "Users" ? d.data.name : ""; });

  // this funciton included below breaks up lines that are too long
  wrap(text, 20);
}

/**
* redraws tree depending on tree category
* @param {int} index - index of our rule category button
*/
function redrawSubTree(index) {
  let subtreeLayout = d3.tree()
    .separation(function(a, b) {
      return 10 / a.depth;
    })
    .size([height, width]);

  // index - 1 because 0 is reserved for see all
  let nodes = nestedSubtreeData[index - 1].descendants(),
      links = subtreeLayout(nestedSubtreeData[index  - 1]).links();

  // remove old subtree to view and hide the master tree
  d3.selectAll(".contents-svg .zoom .sub-tree").remove();
  d3.selectAll(".contents-svg .zoom .master-tree").attr("visibility", "hidden");

  // our new tree
  let subTree = d3.selectAll(".contents-svg .zoom")
    .append("g")
      .attr("class", "sub-tree");

  if (modeIndex === 0) {
    /** our id names for our smaller trees' links are the same as for the
     *  larger tree but with a 2 at the end so that we can handle them
     *  seperately
    */
    let link = subTree.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "g-link")
        .attr("d", d3.linkHorizontal()
        .x(function(d) { return d.y; })
        .y(function(d) { return d.x; }))
        .attr("id", function(d) {
          return (d.source.data.name + "," + d.target.data.name + "2").replace(/[\/\+\(\)]/g, "");   // because ids don't like /+()
        });
      // .on("mouseenter", expandLink)
      // .on("mouseleave", retractLink)
      // .on("click", clickLink);


    let node = subTree.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", function(d) { return (d.data.name.match("/") ? "node-menu" : "node"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    node.append("circle")
      .attr("r", function() { return (index === 1) ? 8: 10; });

    let nodeMenu = subTree.selectAll(".node-menu")
      .append("circle")
        .attr("class", "node-menu-circle")
        .attr("r", 5);

    // for the create view, we need smaller text
    let text = node.append("text")
      .attr("class", function() { return (index === 1) ? "g-text": "g-text--big"; })
      .text(function(d) { return d.data.name; })
      .attr("dy", "5px")
      .attr("x", "15")
      .attr("text-anchor", "start");

    // we only need to wrap text with the "fail" rule category
    if (index == 5) {
      wrap(text, 40);
    }
  }

  // in this case, draw 4 trees
  else {
    let widths = [width - 1250, width - 1250, width * 2.8 - 1250, width * 2.8 - 1250],
        heights = [height - 1000, height * 2.8 - 1000, height - 1000, height * 2.8 - 1000];

    for (i = 0; i < verbIDConnect.length; i++){

      // our new tree
      let subsubTree = subTree.append("g")
        .attr("id", function() { return "sub-tree" + verbIDConnect[i]; })
        .attr("transform", "translate(" + widths[i] + "," + heights[i] + ")");

      /** our id names for our smaller trees' links are the same as for the
       *  larger tree but with a 2 at the end so that we can handle them
       *  seperately
      */
      let link = subsubTree.selectAll(".link")
          .data(links)
        .enter().append("path")
          .attr("class", "g-link")
          .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }))
          .attr("id", function(d) {
            return (d.source.data.name + "," + d.target.data.name + verbIDConnect[i] + "2").replace(/[\/\+\(\)]/g, "");   // because ids don't like /+()
          });
        // .on("mouseenter", expandLink)
        // .on("mouseleave", retractLink)
        // .on("click", clickLink);

      let node = subsubTree.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", function(d) { return (d.data.name.match("/") ? "node-menu" : "node"); })
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      node.append("circle")
        .attr("r", function() { return (index === 1) ? 8: 10; });

      let nodeMenu = subsubTree.selectAll(".node-menu")
        .append("circle")
          .attr("class", "node-menu-circle")
          .attr("r", 5);

      let text = node.append("text")
        .attr("class", function() { return (index === 1) ? "g-text": "g-text--big"; })
        .text(function(d) { return d.data.name; })
        .attr("dy", "5px")
        .attr("x", "15")
        .attr("text-anchor", "start");

      // we only need to wrap the fail orientation
      if (index == 5) {
        wrap(text, 40);
      }
    }
  }

  /**
   * This function is included in fileHandleing.js, but we need to hilight
   * paths of these new smaller trees with the paths of the input files
  */
  updatePaths();
}

/**
* draws those squares and text around our trees in the seperated layout view
* @param {d3 selection} treeContents - what we are appending our boxes to
*/
function drawFocalBoxes(treeContents) {
  let focalBoxes = treeContents
    .append("g")
      .attr("class", "focal-boxes")
      .append("g");

  focalBoxes.append("rect")
    .attr("x", 300)
    .attr("y", 300)
    .attr("width", focalSquareWidth)
    .attr("height", focalSquareHeight)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 10);

  focalBoxes.append("rect")
    .attr("x", 300 + focalSquareWidth/2)
    .attr("y", 300)
    .attr("width", focalSquareWidth/2)
    .attr("height", focalSquareHeight/2)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 10);

  focalBoxes.append("rect")
    .attr("x", 300)
    .attr("y", 300 + focalSquareHeight/2)
    .attr("width", focalSquareWidth/2)
    .attr("height", focalSquareHeight/2)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 10);

  let focalText = focalBoxes.append("g").attr("class", "focal-text");

  for (i = 0; i < verbOptions.length; i++) {
    focalText.append("text")
      .text(verbOptions[i])
      .attr("font-size", 400)
      .attr("x", multiMasterTreeWidths[i])
      .attr("y", function() { return (i%2 === 1) ? multiMasterTreeHeights[i] * 1.4: 0; })
      .attr("text-anchor", "middle")
      .attr("pointer-event", "none");
  }

  for (i = 0; i < verbOptions.length; i++) {
    focalText.append("text")
      .text(verbOptions[i])
      .attr("font-size", 100)
      .attr("x", multiMasterTreeWidths[i])
      .attr("y", function() { return (i % 2 === 1) ? multiMasterTreeHeights[i]  * 0.73: multiMasterTreeHeights[i] * 0.25; })
      .attr("text-anchor", "middle")
      .attr("pointer-event", "none");
  }
}

// brightens all verbs in the key
function keyVerbsShown() {
  for (i = 0; i < verbOptions.length; i++) {
    let keyVerbSelect =  d3.selectAll("#key-text-verb" + i);

    if (keyVerbSelect.attr("class") == "key-text-verb") {
      keyVerbSelect.attr("class", "key-text-verb--shown");
    }
  }
}

/**
* this is what breaks up text lines, so it is cleaner.  One line -> Two lines
* @param {d3 selection} text - all our text
* @param {int} dySpacing - how much y spacing between wrapped text
*/
function wrap(text, dySpacing) {
  text.each(function() {
    let text = d3.select(this),
        d = this.textContent,
        x = text.attr("x"),
        y = text.attr("y"),
        dy = text.attr("dy"),
        breakIndex = -1;

    // this was getting in the way so need to handle it with a special case
    if (d.length > 40 || d == "Otherwise forbidden content" || d == "Otherwise forbidden content ") {
      let tspanTexts = [];
      if (d == "Otherwise forbidden content") {
        tspanTexts.push("Otherwise forbiden");
        tspanTexts.push(" content");
      } else if (d == "Otherwise forbidden content ") {
        tspanTexts.push("Otherwise forbiden");
        tspanTexts.push(" content ");
      }

      // our typical conditions, only want to wrap if a space exists
      else {
        breakIndex = d.substring(24).indexOf(" ");
        if (breakIndex > -1) {
          breakIndex +=  24;
          tspanTexts.push(d.substring(0, breakIndex));
          tspanTexts.push(d.substring(breakIndex));
        }
      }

      text.text(null).selectAll("tspan")
        .data(tspanTexts)
      .enter().append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", function(d, i) { return dySpacing * i + "px"; })
        .text(function(d, i) { return (i === 0) ? tspanTexts[i] + "..." : tspanTexts[i]; });
    }
  });
  }

/**
* transforms points from cartesian to radians to help make a circular tree
* @param {float} x - x coordinate
* @param {float} y - y coordinate
* @returns {list} [x,y] our radial point
*/
function radialPoint(x, y) {
  return [y * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

/**
* converts angles into start and stop points for trees
* @param {array of floats} angles
*/
function getSeperation(angles) {
  for (i = angles.length-1; i >= 1; i--) {
    angles[i] = angles[i-1];
  }

  angles[0] = 0;
  for (i = 1; i < angles.length; i++) {
    angles[i] = angles[i] + angles[i-1];
  }

  return angles;
}
