/**
 * @file This section is comprised of functions that related to loading and parsing
 * policy files.  The below functions highlight paths and find the
 * statistics of additional files.
 * @requires d3.js
 * @author Elijah Peake <elijah.peake@gmail.com>
 */


/**
* loads file and sends to parse
* @param {int} id - id of input button
* @param {int} ruleCategoryFilter
*/
function loadFile(id, ruleCategoryFilter=0) {
  // inside function so does not call reader multiple times when choosing new file
  reader = new FileReader();
  let files = document.querySelector("#" + id).files;

  if (files) {
    for (i = 0; i < files.length; i++) {
      reader.readAsText(files[i]);
    }
  }

  reader.addEventListener("load", function(){
      parseFile(id, ruleCategoryFilter);
    }
  );
}

/**
* parses file into csv format and sends to process as long as formatted correctly
* @param {int} id - id of input button
* @param {int} ruleCategoryFilter
*/
function parseFile(id, ruleCategoryFilter) {
  let doesColumnExist = false,
    data;

  // parse and see if correctly formated
  data = d3.csvParse(reader.result, function(d) {
    doesColumnExist = d.hasOwnProperty("child5");
    return d;
  });

  // incorrectly formatted
  if (!doesColumnExist) {
    alert("Data incorrectly formatted and could not be uploaded.");
    data = null;
  }

  if (data) {
    processFile(id, data);

    // need to update our paths and stats once our data is parsed
    updatePaths();

    // redraw the stats panel if it is already shown
    if (!d3.select(".stats-dropdown--shown").empty()) redrawStats();

    // show all verbs if in the layered mode, otherwise, these verbs not in key
    if (modeIndex === 0 && !d3.select(".key-dropdown--shown").empty()) keyVerbsShown();
  }
}

/**
* removes past links, splits data on verbs, and sends data to get stats
* @param {int} id - id of input button
* @param {parsed csv object} data
*/
function processFile(id, data) {
  let linkClass,
    keyTextID,
    linkIDs,
    linkBigIDs,
    nestedData = [];

  /**
   * we need to take into account which input the data is linked two, so we
   * have two seperate cases, one for each input button.
   *
   * we have different colors for wach of these files, thus two link classes
   */
  if (id == "upload1") {
    linkClass = "g-link-1";
    keyTextID = "#file1";
    linkIDs = linkIDs1;
    linkBigIDs = linkMultiIDs1;
  } else {
    linkClass = "g-link-2";
    keyTextID = "#file2";
    linkIDs = linkIDs2;
    linkBigIDs = linkMultiIDs2;
  }

  // we want to make all the verb fields active again
  activeVerbs = [1, 1, 1, 1];

  // remove all past paths
  if (modeIndex === 0) {
    removePastLinks(linkIDs, linkClass);
    removePastLinks(linkIDs, linkClass + "--faded");
  } else removePastLinks(linkBigIDs, linkClass);

  // empty past id's now that we have already cleared our past links
  linkIDs = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };
  linkBigIDs = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };

  // replace the key
  if (id == "upload1") {
    file1Text = "=  " + document.getElementById(id).value.replace(/C:\\fakepath\\/i, '').replace(/\.csv/i, '');
    d3.select(keyTextID).text(file1Text);
  } else {
    file2Text = "=  " + document.getElementById(id).value.replace(/C:\\fakepath\\/i, '').replace(/\.csv/i, '');
    d3.select(keyTextID).text(file2Text);
  }

  /**
   * we need to parse the data the same way our tree was first parsed, so that
   * we can match link ids
   */
  verbIDConnect.forEach(function(connector) {
    if (filterOnVerb(data, connector).length !== 0) {
      nestedData.push(d3.hierarchy(buildNest(filterOnVerb(data, connector))));
    }
  });

  let newLinks = (function() { // finds new ids
    let linksArray = [];
    for (i = 0; i < nestedData.length; i++) {
      // doesn't matter what tree we use, just need the links
      linksArray.push(trees[0](nestedData[i]).links());
    }

    return linksArray;
  }());

  for (i = 0; i < newLinks.length; i++) {
    let connector = verbIDConnect[i];
    newLinks[i].forEach(function(d) {
      // ids mimic those made before
      linkIDs[connector].push((d.source.data.name + "," + d.target.data.name).replace(/[\/\+\(\)]/g, ""));
      linkBigIDs[connector].push((d.source.data.name + "," + d.target.data.name).replace(/[\/\+\(\)]/g, "") + connector);
    });
  }

  // add classes to add colors
  if (modeIndex === 0) {
    for (i = 0; i < verbIDConnect.length; i++) {
      if (activeVerbs[i] === 1) {
        linkIDs[verbIDConnect[i]].forEach(function(id) {
          document.getElementById(id).classList.add(linkClass);
        });
      }
    }
  } else {
    for (i = 0; i < verbIDConnect.length; i++) {
      linkBigIDs[verbIDConnect[i]].forEach(function(id) {
        document.getElementById(id).classList.add(linkClass); // our colors
      });
    }
  }

  /**
   * Send data off to get parsed and reassign our ids depending on our file
   *
   * FIXME: Why are these deep copies???   Shouldn't have to reassign vars...
   */
  if (id == "upload1") {
    linkIDs1 = linkIDs;
    linkMultiIDs1 = linkBigIDs;
    calculateStats(data, 0);
  } else {
    linkIDs2 = linkIDs;
    linkMultiIDs2 = linkBigIDs;
    calculateStats(data, 1);
  }
}

/**
* filters input data on a provided verb
* @param {parsed csv object} data
* @param {string} filter - verb to filter on
* @returns {parsed csv object}
*/
function filterOnVerb(data, filter) {
  let filteredData = [];

  data.forEach(function(d) {
    if (d.verb == filter) {
      filteredData.push(d);
    }
  });

  return filteredData;
}

/**
* gets rid of any past links for a given upload slot
* @param {array of strings} linkIDs
* @param {string} linkClass - class to remove
*/
function removePastLinks(linkIDs, linkClass) {
  for (let key in linkIDs) {
    linkIDs[key].forEach(function(id) {
      if (document.getElementById(id)) {
        document.getElementById(id).classList.remove(linkClass);
        if (document.getElementById(id + "2")) {
          // we need to check all the ids for subtrees too, same but with 2 on end
          document.getElementById(id + "2").classList.remove(linkClass);
        }
      }
    });
  }
}

// recolors paths based on linkIDs 1 and 2
function updatePaths() {
  if (modeIndex === 0) {
    let pathAndLinkname = [
      [linkIDs1, "g-link-1--faded", "g-link-1"],
      [linkIDs2, "g-link-2--faded", "g-link-2"]
    ];

    // needed to get rid of overlap when only one verb selected:
    removePastLinks(linkIDs1, "g-link-1");
    removePastLinks(linkIDs1, "g-link-1--faded");
    removePastLinks(linkIDs2, "g-link-2");
    removePastLinks(linkIDs2, "g-link-2--faded");

    // changes classes, thus changing colors
    for (i = 0; i < pathAndLinkname.length; i++) {
      for (j = 0; j < verbIDConnect.length; j++) {
        if (activeVerbs[j] === 0) {
          pathAndLinkname[i][0][verbIDConnect[j]].forEach(function(id) {
            if (document.getElementById(id)) {
              document.getElementById(id).classList.add(pathAndLinkname[i][1]);

              // now update subtrees
              let subID = id + "2";
              if (document.getElementById(subID))
                document.getElementById(subID).classList.add(pathAndLinkname[i][1]);
            }
          });
        }
      }
    }

    /**
     * we need to make sure we dont get rid of any links that souldn't be
     * so first we remove all links then add in the ones we still need
     */
    for (i = 0; i < pathAndLinkname.length; i++) {
      for (j = 0; j < verbIDConnect.length; j++) {
        if (activeVerbs[j] == 1) {
          pathAndLinkname[i][0][verbIDConnect[j]].forEach(function(id) {
            if (document.getElementById(id)) {
              document.getElementById(id).classList.remove(pathAndLinkname[i][1]);
              document.getElementById(id).classList.add(pathAndLinkname[i][2]);

              // now update subtrees
              let subID = id + "2";
              if (document.getElementById(subID)) {
                document.getElementById(subID).classList.remove(pathAndLinkname[i][1]);
                document.getElementById(subID).classList.add(pathAndLinkname[i][2]);
              }
            }
          });
        }
      }
    }
  }

  // this is our seperated layer view
  else {
    let pathAndLinkname = [
      [linkMultiIDs1, "g-link-1"],
      [linkMultiIDs2, "g-link-2"]
    ];

    removePastLinks(linkMultiIDs1, "g-link-1");
    removePastLinks(linkMultiIDs2, "g-link-2");

    // changes classes, thus changing colors
    for (i = 0; i < pathAndLinkname.length; i++) {
      for (j = 0; j < verbIDConnect.length; j++) {
        pathAndLinkname[i][0][verbIDConnect[j]].forEach(function(id) {
          if (document.getElementById(id)) {
            document.getElementById(id).classList.add(pathAndLinkname[i][1]);

            // now update subtrees
            let subID = id + "2";
            if (document.getElementById(subID))
              document.getElementById(subID).classList.add(pathAndLinkname[i][1]);
          }
        });
      }
    }
  }
}

// clears all colored paths and removes all data
function clearAllPaths() {
  if (modeIndex === 0) {
    let pathAndLinkname = [
      [linkIDs1, "g-link-1--faded", "g-link-1"],
      [linkIDs2, "g-link-2--faded", "g-link-2"]
    ];

    // get rid of all input fields
    document.getElementById("upload1").value = null;
    document.getElementById("upload2").value = null;
    file1Text = "=  No File Chosen";
    file2Text = "=  No File Chosen";

    // replace key file names if key is shown
    if (!d3.select(".key-dropdown--shown").empty()) {
      document.getElementById("file1").innerHTML = file1Text;
      document.getElementById("file2").innerHTML = file2Text;
    }

    // reset paths
    for (i = 0; i < pathAndLinkname.length; i++) {
      for (let key in linkIDs1) {
        pathAndLinkname[i][0][key].forEach(function(id) {
          document.getElementById(id).classList.remove(pathAndLinkname[i][2]);
          document.getElementById(id).classList.remove(pathAndLinkname[i][1]);

          let subID = id + "2";
          if (document.getElementById(subID)) {
            document.getElementById(subID).classList.remove(pathAndLinkname[i][2]);
            document.getElementById(subID).classList.remove(pathAndLinkname[i][1]);
          }
        });
      }
    }
  }

  // this is our seperated layer view
  else {
    let pathAndLinkname = [
      [linkMultiIDs1, "g-link-1"],
      [linkMultiIDs2, "g-link-2"]
    ];

    // get rid of all input fields
    document.getElementById("upload1").value = null;
    document.getElementById("upload2").value = null;
    file1Text = "=  No File Chosen";
    file2Text = "=  No File Chosen";

    // replace key file names if key is shown
    if (!d3.select(".key-dropdown--shown").empty()) {
      document.getElementById("file1").innerHTML = file1Text;
      document.getElementById("file2").innerHTML = file2Text;
    }

    // reset paths
    for (i = 0; i < pathAndLinkname.length; i++) {
      for (let key in linkIDs1) {
        pathAndLinkname[i][0][key].forEach(function(id) {
          document.getElementById(id).classList.remove(pathAndLinkname[i][1]);

          let subID = id + "2";
          if (document.getElementById(subID)) {
            document.getElementById(subID).classList.remove(pathAndLinkname[i][1]);
          }
        });
      }
    }
  }

  // clear all data related values
  linkIDs1 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };
  linkIDs2 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };
  linkMultiIDs1 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };
  linkMultiIDs2 = {
    must: [],
    mustNot: [],
    should: [],
    shouldNot: []
  };
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

  // make the verbs all shown again for consistancy
  if (modeIndex === 0 && !d3.select(".key-dropdown--shown").empty()) keyVerbsShown();

  // redraw the stats panel if it is already shown
  if (!d3.select(".stats-dropdown--shown").empty()) redrawStats();
}

/**
* calculates all the statistics from a parsed file
* @param {parsed csv object} data
* @param {int} uploadIndex - which input button do the stats correspond to
*/
function calculateStats(data, uploadIndex) {
  // reset all stats and store rule data for file
  for (let stat in statistics) {
    if (stat != "rules") {
      for (i = 0; i < statistics[stat].length; i++) {
        statistics[stat][i][uploadIndex] = 0;
      }
    } else {
      statistics.rules[uploadIndex] = data;
    }
  }

  // All rules
  statistics.ruleCount[0][uploadIndex] = data.length;

  /**
   * first we get the counts then we divide by total counts to get percents
   * ambiguous count is calculated by (unspec) count
   *
   * add 1 to branchIndex because 0 is reserved for our total
   */
  statistics.rules[uploadIndex].forEach(function(rule) {
    let branchIndex = treeCategories.indexOf(rule.child1) + 1;
    statistics.ruleCount[branchIndex][uploadIndex] += 1;

    if (rule.child4.indexOf("(unspec)") != -1 || rule.child5.indexOf("(unspec)") != -1) {
      statistics.ambigCount[0][uploadIndex] += 1;
      statistics.ambigCount[branchIndex][uploadIndex] += 1;
    }

    if (rule.verb == "must" || rule.verb == "mustNot") {
      statistics.percRequire[0][uploadIndex] += 1;
      statistics.percRequire[branchIndex][uploadIndex] += 1;
    } else {
      statistics.percRecommend[branchIndex][uploadIndex] += 1;
    }
  });

  statistics.percRecommend[0][uploadIndex] = statistics.ruleCount[0][uploadIndex] - statistics.percRequire[0][uploadIndex];

  for (i = 0; i < treeCategories.length; i++) {
    statistics.percRequire[i][uploadIndex] = statistics.percRequire[i][uploadIndex] / statistics.ruleCount[i][uploadIndex];
    statistics.percRecommend[i][uploadIndex] = statistics.percRecommend[i][uploadIndex] / statistics.ruleCount[i][uploadIndex];
  }

  // first check to see if we need to calculate joint stats
  if (statistics.rules[0].length !== 0 && statistics.rules[1].length !== 0) {
    jointStatistics = {
      matchCount: [0, 0, 0, 0, 0, 0],
      uniqueCount: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    };

    // if rules are equal, increment overlap count
    for (i = 0; i < statistics.rules[0].length; i++) {
      let r1 = statistics.rules[0][i].verb + statistics.rules[0][i].child0 + statistics.rules[0][i].child1 + statistics.rules[0][i].child2 + statistics.rules[0][i].child3 + statistics.rules[0][i].child4 + statistics.rules[0][i].child5;
      for (j = 0; j < statistics.rules[1].length; j++) {
        let r2 = statistics.rules[1][j].verb + statistics.rules[1][j].child0 + statistics.rules[1][j].child1 + statistics.rules[1][j].child2 + statistics.rules[1][j].child3 + statistics.rules[1][j].child4 + statistics.rules[1][j].child5;

        if (r1 == r2) {
          let rule = statistics.rules[1][j];
          let branchIndex = treeCategories.indexOf(rule.child1) + 1;

          jointStatistics.matchCount[0] += 1;
          jointStatistics.matchCount[branchIndex] += 1;

          break;
        }
      }
    }

    // unique = total - overalp for every verb and each file
    for (i = 0; i < statistics.rules.length; i++) {
      for (j = 0; j < statistics.ruleCount.length; j++) {
        jointStatistics.uniqueCount[j][i] = statistics.ruleCount[j][i] - jointStatistics.matchCount[j];
      }
    }
  }

  // when there aren't two files
  else {
    jointStatistics = {
      matchCount: [0, 0, 0, 0, 0, 0],
      uniqueCount: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    };

    jointStatistics.uniqueCount = statistics.ruleCount;
  }
}

/**
* gets the statistics used in the redraw stats file and returns our new file name
* @param {string} id - which input button do the stats correspond to
* @param {int} iteration
* @returns {string} - file name
*/
function getStat(id, iteration) {
  let keys = ["ruleCount", "percRequire", "percRecommend", "ambigCount", "uniqueCount", "matchCount"],
    currentStat = 0,
    filenum = 0;

  if (id == "#file2") filenum = 1;

  // not joint statistics
  if (iteration < 4) {
    currentStat = statistics[keys[iteration]][ruleCategoryIndex][filenum];
  }

  // joint statistics
  else if (iteration == 4) {
    currentStat = jointStatistics[keys[iteration]][ruleCategoryIndex][filenum];
  }

  // need to handle both files as a special case
  else if (iteration == 5) {
    return " Both Files = " + jointStatistics[keys[iteration]][ruleCategoryIndex];
  }

  // need to handle case when we divide by 0
  if (isNaN(currentStat)) {
    currentStat = 0;
  }

  // add % for require and recommend
  if (iteration > 0 && iteration < 3) {
    currentStat = Math.round(currentStat * 100) + "%";
  }

  // replace
  return (filenum) ? file2Text.replace("= ", "") + " = " + currentStat : file1Text.replace("= ", "") + " = " + currentStat;
}
