// A linked list of the indexes of left siblings and their lowest vertical coordinate.
class IYL {
    lowY: number;
    index: number;
    nxt: IYL | undefined;
    constructor(lowY: number, index: number, nxt?: IYL) {
        this.lowY = lowY; this.index = index; this.nxt = nxt;
    }
    static updateIYL(minY: number, i: number, ih?: IYL): IYL {
        // Remove siblings that are hidden by the new subtree.
        while (ih != undefined && minY >= ih.lowY) ih = ih.nxt;
        // Prepend the new subtree.
        return new IYL(minY, i, ih);
    }
}


class Tree {
    isExtra: boolean;

    w: number;
    h: number;
    x: number | undefined;
    y: number;
    c: Tree[];

    private prelim = 0;
    private mod = 0;
    private shift = 0;
    private change = 0;

    private tl: Tree | undefined;
    private tr: Tree | undefined; // Left and right thread.
    private el: Tree | undefined;
    private er: Tree | undefined; // Extreme left and right nodes.
    private msel: number | undefined;
    private mser: number | undefined; // Sum of modifiers at the extreme nodes.

    constructor(w: number, h: number, y: number, c: Tree[], isExtra = false) {
        this.w = w;
        this.h = h;
        this.y = y;
        this.c = c;
        this.isExtra = isExtra;
    }

    layout(): void {
        this.firstWalk();
        this.secondWalk(0);
    }

    firstWalk(): void {
        if (this.c.length == 0) { this.setExtremes(); return; }
        this.c[0].firstWalk();
        // Create siblings in contour minimal vertical coordinate and index list.
        let ih = IYL.updateIYL(this.c[0].el!.bottom(), 0, undefined);
        for (let i = 1; i < this.c.length; i++) {

            this.c[i].firstWalk();
            //Store lowest vertical coordinate while extreme nodes still point in current subtree.
            const minY = this.c[i].er!.bottom();
            this.separate(i, ih);
            ih = IYL.updateIYL(minY, i, ih);
        }
        this.positionRoot();
        this.setExtremes();
    }

    setExtremes(): void {
        if (this.c.length == 0) {
            this.el = this; this.er = this;
            this.msel = this.mser = 0;
        } else {
            this.el = this.c[0].el; this.msel = this.c[0].msel;
            this.er = this.c[this.c.length - 1].er; this.mser = this.c[this.c.length - 1].mser;
        }
    }

    separate(i: number, ih: IYL): void {
        // Right contour node of left siblings and its sum of modfiers.
        let sr: Tree | undefined = this.c[i - 1]; let mssr = sr.mod;
        // Left contour node of current subtree and its sum of modfiers.
        let cl: Tree | undefined = this.c[i]; let mscl = cl.mod;

        // Modification to the algorithm: correctly lay out the first child if it has no children
        let first = true;

        while (sr !== undefined && cl !== undefined) {
            if (sr.bottom() > ih.lowY) ih = ih.nxt!;
            // How far to the left of the right side of sr is the left side of cl?
            const dist = (mssr + sr.prelim + sr.w) - (mscl + cl.prelim);
            if (dist > 0 || (first && dist <= 0)) {
                mscl += dist;
                this.moveSubtree(i, ih.index, dist);
            }
            first = false;
            const sy = sr.bottom(), cy = cl.bottom();
            // Advance highest node(s) and sum(s) of modifiers (Coordinate system increases downwards)
            if (sy <= cy) {
                sr = sr.nextRightContour();
                if (sr !== undefined) mssr += sr.mod;
            }
            if (sy >= cy) {
                cl = cl.nextLeftContour();
                if (cl !== undefined) mscl += cl.mod;
            }
        }
        // Set threads and update extreme nodes.
        // In the first case, the current subtree must be taller than the left siblings.
        if (sr == undefined && cl != undefined) this.setLeftThread(i, cl, mscl);
        // In this case, the left siblings must be taller than the current subtree.
        else if (sr != undefined && cl == undefined) this.setRightThread(i, sr, mssr);
    }

    moveSubtree(i: number, si: number, dist: number): void {
        // Move subtree by changing mod.
        this.c[i].mod += dist; this.c[i].msel! += dist; this.c[i].mser! += dist;
        this.distributeExtra(i, si, dist);
    }


    nextLeftContour(): Tree | undefined { return this.c.length == 0 ? this.tl : this.c[0]; }
    nextRightContour(): Tree | undefined { return this.c.length == 0 ? this.tr : this.c[this.c.length - 1]; }
    bottom(): number { return this.y + this.h; }

    setLeftThread(i: number, cl: Tree, modsumcl: number): void {
        const li = this.c[0].el!;
        li.tl = cl;
        // Change mod so that the sum of modifier after following thread is correct.
        const diff = (modsumcl - cl.mod) - this.c[0].msel!;
        li.mod += diff;
        // Change preliminary x coordinate so that the node does not move.
        li.prelim -= diff;
        // Update extreme node and its sum of modifiers.
        this.c[0].el = this.c[i].el; this.c[0].msel = this.c[i].msel;
    }

    // Symmetrical to setLeftThread.
    setRightThread(i: number, sr: Tree, modsumsr: number): void {
        const ri = this.c[i].er!;
        ri.tr = sr;
        const diff = (modsumsr - sr.mod) - this.c[i].mser!;
        ri.mod += diff;
        ri.prelim -= diff;
        this.c[i].er = this.c[i - 1].er; this.c[i].mser = this.c[i - 1].mser;
    }

    positionRoot(): void {
        // Position root between children, taking into account their mod.
        this.prelim = (this.c[0].prelim + this.c[0].mod + this.c[this.c.length - 1].mod +
            this.c[this.c.length - 1].prelim + this.c[this.c.length - 1].w) / 2 - this.w / 2;
    }

    secondWalk(modsum: number): void {
        modsum += this.mod;
        // Set absolute (non-relative) horizontal coordinate.
        this.x = this.prelim + modsum;
        this.addChildSpacing();
        for (const child of this.c) child.secondWalk(modsum);
    }

    distributeExtra(i: number, si: number, dist: number): void {
        // Are there intermediate children?
        if (si != i - 1) {
            const nr = i - si;
            this.c[si + 1].shift += dist / nr;
            this.c[i].shift -= dist / nr;
            this.c[i].change -= dist - dist / nr;
        }
    }

    // Process change and shift to add intermediate spacing to mod.
    addChildSpacing(): void {
        let d = 0, modsumdelta = 0;
        for (const child of this.c) {
            d += child.shift;
            modsumdelta += d + child.change;
            child.mod += modsumdelta;
        }
    }
}
export { Tree };