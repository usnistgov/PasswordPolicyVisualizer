# Software for Visualizing Password Policies

The software allows researchers and policy makers to upload policies translated into [the formal
password language previously developed at NIST](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) and immediately be presented
with several key statistics and an updated, interactive visualization.
Researchers can use this tool to explore how policies differ on an individual
basis or even on much larger scales, such as how policies generally differ
between major industry sectors. Policy makers can use the tool to explore the rule coverage of their policies, and even compare current policies with past policies to examine their evolution.

---
## Explanation of the Visualization
According to [the formal password language](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) policy writers can instruct users to interact with passwords in 4 different ways.  Policy writers can instruct users that they 'must' perform a certain action or that they 'must not,' 'should,' or 'should not' perform a certain action.  For example, if policy makers wish to address how long users can make their passwords, they can say that users 'must' create passwords with a length greater than or equal to 8, or they could say that users 'should' create passwords with a length greater than or equal to 8. In the layered tree view, we are actually looking at 4 trees layered on top of each other, one tree for each of these modal verbs.  This is because any rule can be written in 4 separate ways, as explained before, depending on how policy makers wish users to interact with their passwords.  Thus, when we toggle verbs, in this layer view we are toggling the visibility of these layers.  A single layer of this tree represents all possible rules that a policy maker can write, using the formal password language and not including variables or our modal verbs.   In the separated tree view, these layers are separated into individual quadrants.  Lastly, when we click on rule categories, we are looking at segments of the entire tree, layered or separated, depending on our view.

## Prerequisites
**Firefox** - *Only to run locally without a web server*

If running on a web server, visualization has been tested on the following:
  * **Chrome 68**
  * **Firefox 61**
  * **Safari 11**
  * **Edge 42**

## File Contents


### Visualization Software Directory Structure

```
Visualization Software 
|── index.html
|── treeStyle.css
|── treeDataStructure.csv
└── Scripts
    |── tree.js
    └── Functions
        |── drawingFunctions.js
        |── fileHandling.js
        └── menuFunctions.js
```

### File Descriptions (in no particular order)
#### treeDataStructure.csv
  * Parsed in tree.js to create our initial, non-highlighted tree structures.  This file is comprised of all possible policy rules, not including modal verbs (Must, Must Not, Should, Should Not).  Pairs of children are used to make the IDs of our tree structures.  When in the separate layer mode, we also use our modal verbs at the start of our IDs and when in our separate rule category mode we append a "2" onto our IDs included as the links of our large tree unfiltered on rule categories.  The reasoning behind this is when we switch between rule categories, we create additional subtrees, but keep our overall master tree but toggle its visibility.  This is important because we need to have a unique ID for every link.  For this reason, one may also notice we have spaces added onto the children in the csv file which appear more than once; that way, every child pair is unique.  These IDs are important because it is how we link our uploaded files to our initialized tree. This way, we can search for IDs and change their classes to highlight paths.
#### tree.js
  * Initializes our visualization, drawing the key and statistics panels, the menu, and parses treeDataStructure.csv to draw our center tree.  Sets all necessary global variables and contains `buildNest(data)`, which is a function necessary for structuring our csv files into the format required for making trees with D3.js.   
#### drawingFunctions.js
  * Includes all functions required to draw or redraw trees (including both modes), menu bar and buttons (not including dropdowns), and stats and key panels.  Important to note, our tree is actually comprised of 5 separate trees all rooted at the node in the center circle.  Thus, we have to calculate the rule category's sector's angle and its starting and stopping positions.  The angles are calculated when out csv file is first parsed in the tree.js file, but separation amounts are calculated in this drawingFunctions.js file. Since the "See All" tree view is also a circular tree, we must transform the tree's original Cartesian coordinates into polar coordinates.  Also, since many nodes of the tree have long strings of text that sometimes overlap with other text, we have to wrap these longs strings so that they are broken into two lines instead of one, this function, `wrap(text, dySpacing)`, is included in this file.
#### fileHandling.js
  * This file houses all the functions required for reading and processing files input by one of the add paths' buttons.  This includes highlighting paths, removing paths, and calculating statistics.  To map our imported files to the original tree, we get our link IDs from our imported file and find it's corresponding ID on the original tree.  To get corresponding IDs, we process our imported files in the same way we processed our original treeDataStructure.csv file in tree.js.
#### menuFunctions.js
  * Contains all functions related to menu bar functionality.  This is mainly focused on calling the correct functions on each button click event such as toggling panels, switching subtrees, toggling verbs, changing modes, and opening the file upload prompt.  On clicks, we are often updating global variables included in the tree.js file that keep track of the visualization's state (what verbs are active, what are view is, etc.).  Important to note, since HTML input buttons don't like to be styled, we have their visibility hidden in our index.html file and create SVG objects that simulate clicks to our hidden input elements when the SVGs are clicked.
#### index.html
  * Our bones.  Includes our two input elements, but that is about it.
#### treeStyle.css
  * Style guide

## Known Issues
Zooming and panning can be called even when the mouse is highlighted over the menu.  This makes it so that if the user accidently drags on a menu option instead of performing a stationary click, the visualization will drag and the originally hovered over button will not be clicked.

## Built with
* [**D3.js**](https://d3js.org/) - It follows that the following were used:
  * **JavaScript**
  * **HTML**
  * **CSS**
  * **SVG**

## Additional information
No current installation instructions

## Developer Contact Information
 - Elijah Peake - <elijah.peake@gmail.com>
