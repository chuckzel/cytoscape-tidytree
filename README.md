# cytoscape-tidytree
A [Cytoscape.js](https://js.cytoscape.org/) layout extension for tree layouts which allows for variable sizes of nodes while using a non-layered tree layout and moving nodes further down than its siblings. Uses van der Ploeg's extension of the Reingold-Tilford algorithm from the paper [Drawing Non-layered Tidy Trees in Linear Time](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=d45f66231e053590c64c9d901fb7b028dbc5c923).

## Download
Both bundled and unbundled files are available:
- `./dist` for files bundled by esbuild
- `./lib` for unbundled files compiled by tsc as ES module
### npm
```
npm install cytoscape-tidytree
```
### Direct download
[Releases](https://github.com/chuckzel/cytoscape-tidytree/releases)

## Import 

### Browser
```html
<script src="./cytoscape.min.js"></script>
<script type="module" src="./cytoscape-tidytree.js"></script>
```
The extension is automatically registered into Cytoscape.js

### Node
```js
import cytoscape from "cytoscape";
import tidytree from "cytoscape-tidytree";
cytoscape.use(tidytree);
```

## Usage
Call the [`layout`](https://js.cytoscape.org/#cy.layout) method and [`run`](https://js.cytoscape.org/#layout.run) on the returned layout object:
```js
cy.layout({ name: "tidytree" }).run()
```
You can also run the layout only for some nodes and edges:
```js
// collection of nodes and edges with the "tree" class
const elesToLayout = cy.$(".tree")

// run the layout as if elesToLayout were the only elements in the graph
elesToLayout.layout({ name: "tidytree" }).run()
```

### Options
```js
options = {
    name: "tidytree",
    horizontalSpacing: 20,
    verticalSpacing: 40,
}

// run layout with the options specified
cy.layout(options).run()
```

Following options are currently available:
```ts
class DefaultOptions implements TidytreeLayoutOptions {

    //** Needed to for the layout to be called from cytoscape */
    name: "tidytree" = "tidytree" as const;

    /**
     * Specific layout options
     */

    dataOnly: boolean = false;       // when enabled, nodes' positions aren't set, only data is calculated
    horizontalSpacing: number = 20;  // the width of the space between nodes in cytoscape units
    verticalSpacing: number = 40;    // the height of the space between parent and child in cytoscape units

    // an object from node's id to how much space should be added between it and its parent
    extraVerticalSpacings: Record<string, number> = {};

    // an object from node's id to how much space should be added for the node to have this y position
    // overrides extraVerticalSpacings if both are set for a particular node
    // if the y position would result in the child not being below the parent, the setting is ignored and a warning is printed
    customYs: Record<string, number> = {};

    // the width of the space left after a node is moved down
    lineWidth: number = 5;

    // forces nodes to be positioned on multiples of this value if set
    layerHeight: number | undefined = undefined;

    // a sorting function for the children array of the tree representation
    // if undefined, the order is based on the order of the collection the layout was called on
    edgeComparator: ((edgeA: EdgeSingular, edgeB: EdgeSingular) => number) | undefined = undefined;

    // when not changed, the width and height of each node is read directly from the node
    // this parameter allows to supply your own sizes
    // if the h or w property is missing from the returned object, it is taken from the node
    sizeGetter: ((node: NodeSingular) => { w?: number, h?: number }) = () => ({});

    /**
     * Layout options passed to nodes.layoutPositions()
     * https://js.cytoscape.org/#nodes.layoutPositions
     */

    fit: boolean = true;   // if true, fits the viewport to the graph
    padding: number = 30;  // the padding between the viewport and the graph on fit
    pan: Position | undefined = undefined;  // pan to a specified position, ignored if fit is enabled
    zoom: number | undefined = undefined;   // how much to zoom the viewport, ignored if fit is enabled

    // a positive value which adjusts spacing between nodes (>1 means greater than usual spacing)
    spacingFactor: number = 1;

    // allows to transform a given node's position before it is applied
    transform: (node: NodeSingular, position: Position) => Position = (n, p) => p;


    animate: boolean = false;         // animate the layout`s changes
    animationDuration: number = 500;  // duration of the animation in ms
    animationEasing: Css.TransitionTimingFunction | undefined = undefined;  // easing of animation

    // returns true for nodes that should be animated, or false when the position should be set immediately
    animateFilter: (node: NodeSingular, index: number) => boolean = () => true;
    ready: ((e: LayoutEventObject) => void) | undefined = undefined;  // callback for the start of the layout
    stop: ((e: LayoutEventObject) => void) | undefined = undefined;   // callback for the layout`s finish

    /**
     * Layout options passed to nodes.node.layoutDimensions()
     * https://js.cytoscape.org/#node.layoutDimensions
     */
    nodeDimensionsIncludeLabels: boolean = true;  // if overflowing labels shoud count in the width or height of the node
}
```

## See also
- [Paper](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=d45f66231e053590c64c9d901fb7b028dbc5c923) with the details of the algorithm and the [original implementation](https://github.com/cwi-swat/non-layered-tidy-trees)
>PLOEG, Atze van der. Drawing non-layered tidy trees in linear time. Software: Practice and Experience. 2014, vol. 44, no. 12, pp. 1467–1484. Available from doi: 10.1002/spe.2213.
- [d3-flextree](https://github.com/Klortho/d3-flextree) A D3.js plugin using the same algorithm
- [AEON Client]([d3-flextree](https://github.com/Klortho/d3-flextree)) An example of advanced usage and the project for which this library was developed