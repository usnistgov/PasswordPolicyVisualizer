/**
 * @file This section is comprised of functions required for menubar functionality,
 * including hiding and showing dropdowns and Rule Category layouts and verb clicks.
 * This does not include file handleing
 * @requires d3.js
 * @author Elijah Peake <elijah.peake@gmail.com>
 */

/**
* toggles the arrow on the stats and key button on click
* @this statsButton/keyButton
*/
function toggleArrow() {
  let button = d3.select(this),
    isKey = this.id == "menubutton3",
    translationConstant = isKey ? (width - 100) : 100;

  if (button.select(".shown-square--down").data().length !== 0) {
    button.select(".shown-square--down")
      .attr("class", "shown-square--up")
      .attr("transform", function() {
        return ("translate(" + translationConstant + ", 20) rotate(45)");
      });

    button.select(".hidden-square")
      .attr("transform", function() {
        return ("translate(" + translationConstant + ", 25) rotate(45)");
      });

    // we wait a little before we remove the file so that we have a fade out
    if (isKey) {
      svgContainer.selectAll(".key-dropdown--shown")
        .attr("class", "key-dropdown");

      setTimeout(function() {
        d3.selectAll("#key-dropdown").remove();
      }, 300);
    } else {
      svgContainer.selectAll(".stats-dropdown--shown")
        .attr("class", "stats-dropdown");

      setTimeout(function() {
        d3.selectAll("#stats-dropdown").remove();
      }, 300);
    }
  } else {
    button.select(".shown-square--up")
      .attr("class", "shown-square--down")
      .attr("transform", "translate(" + translationConstant + ", 15) rotate(45)");

    button.select(".hidden-square")
      .attr("transform", "translate(" + translationConstant + ", 10) rotate(45)");

    // redraw the respective panel
    if (isKey) {
      redrawKey();
    } else {
      redrawStats();
    }
  }
}

// handles our dropdown when the mouse is over the verb tab
function toggleVerbDropdown() {
  if (d3.event.type == "mouseenter") {
    let verbDropdown = d3.select("#menubutton1")
      .append("g")
        .selectAll()
        .data(menuBar.verbOptions)
        .enter();

    verbDropdown.append("rect")
      .attr("class", "option")
      .attr("id", function(d, i) {
        return "verbkey" + i;
      })
      .attr("x", menuBoxWidth)
      .attr("y", function(d, i) {
        return menuHeight + 2 + (i * menuOptionHeight);
      })
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", "#424949")
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", function() {
        verbClick(this.id)
      });

    verbDropdown.append("text")
      .attr("class", "option-text")
      .attr("x", menuBoxWidth + menuTextConstant)
      .attr("y", function(d, i) {
        return menuOptionTextY + (i * menuOptionHeight);
      })
      .text(function(d) {
        return d;
      });
  }

  // when we leave the dropdown
  else {
    // selecting .dropdown--shown
    d3.selectAll("#menubutton1 g")
      .attr("class", "dropdown");

    // waiting before we remove so there is a fade out transition
    setTimeout(function() {
      d3.selectAll(".dropdown").remove();
    }, 300);
  }
}

// handles our dropdown when the mouse is over the rule category tab
function toggleRuleCategoryDropdown() {
  // handle differently depending on mode because rule category tab has a different position
  let toggleID = (modeIndex === 0) ? "#menubutton2" : "#menubutton1",
    xSpaceRect = (modeIndex === 0) ? menuBoxWidth * 2 : menuBoxWidth,
    xSpaceText = (modeIndex === 0) ? (menuBoxWidth * 2) + menuTextConstant : menuBoxWidth + menuTextConstant;

  if (d3.event.type == "mouseenter") {
    let ruleCategoryDropdown = d3.select(toggleID)
      .append("g")
        .selectAll()
        .data(menuBar.ruleCategoryOptions)
        .enter();

    ruleCategoryDropdown.append("rect")
      .attr("class", "option")
      .attr("id", function(d, i) {
        return "ruleCategoryKey" + i;
      })
      .attr("x", xSpaceRect)
      .attr("y", function(d, i) {
        return menuHeight + 2 + (i * menuOptionHeight);
      })
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", "#424949")
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", function() {
        ruleCategoryClick(this.id)
      });

    ruleCategoryDropdown.append("text")
      .attr("class", "option-text")
      .attr("x", xSpaceText)
      .attr("y", function(d, i) {
        return menuOptionTextY + (i * menuOptionHeight);
      })
      .text(function(d) {
        return d;
      });
  }

  // when we leave the dropdown
  else {
    // selecting .dropdown--shown
    d3.selectAll(toggleID + " g")
      .attr("class", "dropdown");

    // waiting before we remove so there is a fade out transition
    setTimeout(function() {
      d3.selectAll(".dropdown").remove();
    }, 300);
  }
}

// handles our dropdown when the mouse is over the modes tab
function toggleModesDropdown() {
  if (d3.event.type == "mouseenter") {
    let modesDropdown = d3.select("#menubutton5")
      .append("g")
      .selectAll()
      .data(menuBar.modeOptions)
      .enter();

    modesDropdown.append("rect")
      .attr("class", "option")
      .attr("id", function(d, i) {
        return "modekey" + i;
      })
      .attr("x", width - 510)
      .attr("y", function(d, i) {
        return menuHeight + 2 + (i * menuOptionHeight);
      })
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", "#424949")
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", function() {
        modeClick(this.id)
      });

    modesDropdown.append("text")
      .attr("class", "option-text")
      .attr("x", width - 490)
      .attr("y", function(d, i) {
        return menuOptionTextY + (i * menuOptionHeight);
      })
      .text(function(d) {
        return d;
      });
  }

  // when we leave the dropdown
  else {
    // selecting .dropdown--shown
    d3.selectAll("#menubutton5 g")
      .attr("class", "dropdown");

    // waiting before we remove so there is a fade out transition
    setTimeout(function() {
      d3.selectAll(".dropdown").remove();
    }, 300);
  }
}

// handles our dropdown when the mouse is over the add paths tab
function toggleAddPathsDropdown() {
  if (d3.event.type == "mouseenter") {
    let addPathsDropdown = d3.select("#menubutton4")
      .append("g");

    // we link these rectangles to the inputs in the html with simulateClick
    addPathsDropdown.append("rect")
      .attr("class", "colored-option--1")
      .attr("x", width - 370)
      .attr("y", menuHeight + 2)
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", colorsUsed[0])
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", function() {
        simulateClick("upload1");
      });

    addPathsDropdown.append("rect")
      .attr("class", "colored-option--2")
      .attr("x", width - 370)
      .attr("y", menuHeight + 2 + menuOptionHeight)
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", colorsUsed[1])
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", function() {
        simulateClick("upload2");
      });

    addPathsDropdown.append("rect")
      .attr("class", "option")
      .attr("x", width - 370)
      .attr("y", menuHeight + 2 + (menuOptionHeight * 2))
      .attr("height", menuOptionHeight)
      .attr("width", menuOptionWidth)
      .attr("fill", "#424949")
      .attr("stroke-width", 2)
      .attr("stroke", "white")
      .on("click", clearAllPaths);

    addPathsDropdown.selectAll()
        .data(menuBar.addPathsOptions)
      .enter().append("text")
        .attr("class", function(d, i) {
          return (i == 2) ? "option-text" : "colored-option-text";
        })
        .attr("x", width - 350)
        .attr("y", function(d, i) {
          return menuOptionTextY + (i * menuOptionHeight);
        })
        .text(function(d) {
          return d;
        });
  }

  // when we leave the dropdown
  else {
    // selecting .dropdown--shown
    d3.selectAll("#menubutton4 g")
      .attr("class", "dropdown");

    // waiting before we remove so there is a fade out transition
    setTimeout(function() {
      d3.selectAll(".dropdown").remove();
    }, 300);
  }
}

/**
 * simulates a click on another element
 * this is how we link our inputs to our svgs with our add paths tab
 * @param {string} id - id of object to be clicked on
 */
function simulateClick(id) {
  let clicker = new MouseEvent("click");
  document.getElementById(id).dispatchEvent(clicker);
}

/**
 * toggles active verbs and updates paths when a dropdown option is clicked
 * @param {string} eventID - id of object we clicked on
 */
function verbClick(eventID) {
  // find which verb they clicked on
  let clickIndex = parseInt(eventID.replace("verbkey", ""));

  // clicking **toggle all**
  if (clickIndex == 4) {
    // if we have at least one currently active verb, then deactivate all
    if (activeVerbs.reduce((a, b) => a + b, 0) !== 0) {
      activeVerbs = [0, 0, 0, 0];
      d3.selectAll(".key-text-verb--shown").attr("class", "key-text-verb");
      updatePaths();
    }

    // otherwise reactivate all
    else {
      activeVerbs = [1, 1, 1, 1];
      d3.selectAll(".key-text-verb").attr("class", "key-text-verb--shown");
      updatePaths();
    }
  }

  // not **toggle all**
  else {
    let keyVerbSelect = d3.selectAll("#key-text-verb" + clickIndex);

    if (keyVerbSelect.attr("class") == "key-text-verb") {
      keyVerbSelect.attr("class", "key-text-verb--shown");
      activeVerbs[clickIndex] = 1;
      updatePaths();
    } else {
      keyVerbSelect.attr("class", "key-text-verb");
      activeVerbs[clickIndex] = 0;
      updatePaths();
    }
  }
}

/**
 * toggles tree view and updates stats panel when a dropdown option is clicked
 * @param {string} eventID - id of object we clicked on
 */
function ruleCategoryClick(eventID) {
  // find which rule category they clicked on
  let tempLayoutIndex = parseInt(eventID.replace("ruleCategoryKey", ""));

  if (tempLayoutIndex !== ruleCategoryIndex) {
    ruleCategoryIndex = tempLayoutIndex;

    let statsDown = d3.selectAll("#stats-dropdown");

    // we don't want to redraw stats if they are hidden
    if (!statsDown.empty()) {
      d3.selectAll("#stats-dropdown").remove();
      redrawStats();
    }

    // make a new Rule Category layouts and hide the big one
    if (ruleCategoryIndex !== 0) {
      redrawSubTree(ruleCategoryIndex);
    } else {
      // out with the old, in with the new
      d3.selectAll(".contents-svg .zoom .sub-tree").remove();
      d3.selectAll(".contents-svg .zoom .master-tree").attr("visibility", "visible");
    }
  }
}

/**
 * toggles mode when a dropdown option is clicked
 * @param {string} eventID - id of object we clicked on
 */
function modeClick(eventID) {
  // find which mode they clicked on
  let tempModeIndex = parseInt(eventID.replace("modekey", ""));

  // if choosing a different mode, redraw everything but stats
  if (tempModeIndex !== modeIndex) {
    modeIndex = tempModeIndex;
    d3.selectAll(".menu").selectAll("*").remove();
    redrawMenu();
    redrawKey();
    redrawMasterTree();
    updatePaths();

    // make new rule category trees
    if (ruleCategoryIndex !== 0) {
      redrawSubTree(ruleCategoryIndex);
    }

    // reshow our hidden tree and remove subtrees
    else {
      d3.selectAll(".contents-svg .zoom .sub-tree").remove();
      d3.selectAll(".contents-svg .zoom .master-tree").attr("visibility", "visible");
    }
  }

}
