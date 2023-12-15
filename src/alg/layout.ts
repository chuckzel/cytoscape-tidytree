import { Tree } from "./tree.js"

export interface TreeData {
    w: number
    h: number
    children: TreeData[]
    extraVerticalSpacing?: number | undefined // extra space between node and parent, has no effect when customY is set
    customY?: number | undefined // specified y position

    // set by the layout
    x?: number | undefined
    y?: number | undefined
}

export interface LayoutOptions {
    horizontalSpacing: number,
    verticalSpacing: number,
    lineWidth: number,
    layerHeight: number | undefined
}

export class Layout {
    options: LayoutOptions

    constructor(options: Partial<LayoutOptions>) {
        this.options = {
            horizontalSpacing: 10,
            verticalSpacing: 20,
            lineWidth: 3,
            layerHeight: undefined,
            ...options
        };
    }

    run(data: TreeData): Tree {
        const tree = this.makeTree(data, data.customY);
        tree.layout();
        this.setLayoutResult(data, tree);
        return tree;
    }

    makeTree(data: TreeData, root_y = 0): Tree {
        const outerWidth = data.w + this.options.horizontalSpacing;
        let outerHeight = data.h + this.options.verticalSpacing;
        let extraSpacing = data.extraVerticalSpacing ?? 0;

        const layerHeight = this.options.layerHeight;
        if (layerHeight !== undefined) {
            outerHeight = Math.ceil(outerHeight / layerHeight) * layerHeight;
            extraSpacing = Math.round(extraSpacing / layerHeight) * layerHeight;
        }

        if (data.customY !== undefined) { 
            extraSpacing = data.customY - root_y;
            data.y = root_y + extraSpacing;
        }

        data.y = root_y + extraSpacing;

        const vertex = new Tree(outerWidth, outerHeight, data.y,
            data.children.map((child) => this.makeTree(child, data.y! + outerHeight)));

        if (extraSpacing < 0) {
            console.warn("Node has negative extra space, ignoring", data)
        }
        if (extraSpacing > 0) {
            return new Tree(this.options.lineWidth, extraSpacing, root_y, [vertex], true);
        }
        return vertex;
    }

    setLayoutResult(data: TreeData, tree: Tree): void {
        if (tree.isExtra) {
            tree = tree.c[0];
        }
        data.x = tree.x! + this.options.horizontalSpacing / 2;
        data.children.forEach((child, i) => this.setLayoutResult(child, tree.c[i]));
    }
}