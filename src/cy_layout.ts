/* eslint-disable @typescript-eslint/no-inferrable-types */
import type { EdgeSingular, BaseLayoutOptions, AnimatedLayoutOptions, CollectionArgument, LayoutPositionOptions, Position, NodeSingular, Css, LayoutEventObject } from "cytoscape";
import { Layout, LayoutOptions, TreeData } from "./alg/layout.js";

export interface TidytreeLayoutOptions extends Partial<CyLayoutOptions> {
    name: "tidytree"
}

interface CyLayoutOptions extends LayoutOptions, BaseLayoutOptions, AnimatedLayoutOptions {
    eles: CollectionArgument

    dataOnly: boolean | undefined

    customYs: Record<string, number> //| ((id: string) => (number | undefined))
    extraVerticalSpacings: Record<string, number>
    edgeComparator: ((edgeA: EdgeSingular, edgeB: EdgeSingular) => number) | undefined
    sizeGetter: ((node: NodeSingular) => { w?: number, h?: number })

    fit: boolean | undefined;
    padding: number | undefined;

    pan: Position | undefined;
    zoom: number | undefined;

    nodeDimensionsIncludeLabels: boolean | undefined;
}

interface CyLayoutOptionsWithEles extends TidytreeLayoutOptions {
    eles: CollectionArgument
}
class DefaultOptions implements TidytreeLayoutOptions {

    //** Needed to for the layout to be called from cytoscape */
    name: "tidytree" = "tidytree" as const;

    /**
     * Specific layout options
     */

    dataOnly: boolean = false;       // when enabled, nodes' positions aren't set
    horizontalSpacing: number = 20;  // the width of the space between nodes in cytoscape units
    verticalSpacing: number = 40;    // the height of the space between parent and child in cytoscape units

    // a map from node's id to how much space should be added between it and its parent
    extraVerticalSpacings: Record<string, number> = {};

    // a map from node's id to how much space should be added for the node to have this y position
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

// no purpose other than for debugging, the id is not read
interface TreeDataWithId extends TreeData {
    id: unknown
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
declare type CyLayout = {
    options: CyLayoutOptions
    createTreeData(): TreeData
    run(): void
};

// using ES5 function "class" instead of ES6 class because of cytoscape calling CyLayout.call(this) internally
export function CyLayout(this: CyLayout, options: CyLayoutOptionsWithEles) {
    this.options = {
        ...new DefaultOptions(),
        ...options,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
CyLayout.prototype.createTreeData = function (this: CyLayout): TreeData {
    const includeLabels = this.options.nodeDimensionsIncludeLabels ?? true;
    const eles = this.options.eles;
    const ys = this.options.customYs;
    const vertSpaces = this.options.extraVerticalSpacings;

    const roots = new Set<TreeData>();

    for (const node of eles.nodes()) {
        const dims = {
            ...node.layoutDimensions({ nodeDimensionsIncludeLabels: includeLabels }),
            ...this.options.sizeGetter(node)
        };
        const data: TreeDataWithId = {
            id: node.id(),
            w: dims.w,
            h: dims.h,
            children: [],
            extraVerticalSpacing: vertSpaces[node.id()],
            customY: ys[node.id()] === undefined ? undefined : ys[node.id()] - dims.h / 2,
        };
        node.scratch("tidytree", data);
        roots.add(data);
    }

    const comp = this.options.edgeComparator;
    const edges = comp === undefined ? eles.edges() : eles.edges().sort(comp);
    for (const edge of edges) {
        const sourceData = edge.source().scratch("tidytree") as TreeData;
        const targetData = edge.target().scratch("tidytree") as TreeData;
        sourceData.children.push(targetData);
        roots.delete(targetData);
    }

    const newRoot: TreeData = {
        w: 0,
        h: 0,
        children: Array.from(roots),
        customY: Math.min(-this.options.verticalSpacing, -(this.options.layerHeight ?? 0))
    };
    return newRoot;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
CyLayout.prototype.run = function (this: CyLayout) {
    const treeData = this.createTreeData();
    const tree = new Layout(this.options).run(treeData);

    const nodes = this.options.eles.nodes();
    if (!this.options.dataOnly) {
        // casts because of wrong types in @types/cytoscape
        // - first argument should be the layout object, not string
        // - LayoutPositionOptions' "ready" and "stop" properties should be callback functions, not undefined
        nodes.layoutPositions(this as unknown as string, this.options as unknown as LayoutPositionOptions, (node) => {
            const data = node.scratch("tidytree") as TreeData;
            return { x: data.x! + data.w / 2, y: data.y! + data.h / 2 };
        });
    }
    return { treeData: treeData, tree: tree };
};