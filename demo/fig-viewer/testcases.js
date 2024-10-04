const figs = [
    {
        desc: "example-unlayered",
        data: [40, 40, [40, 40, [40, 40, [40, 40]], [40, 120, [40, 40]]], [40, 120, [40, 40, [40, 40]], [40, 120, [40, 40]]]],
    },
    {
        desc: "example-layered",
        get data() { return figs[0].data; },
        opts: { layerHeight: 160 },
        other: (cy) => { cy.getElementById(0).position("y", 100); }
    },
    {
        desc: "bboxes",
        data: [102, 76, [57, 150, [119, 61], [81, 99, [112, 40]], [50, 184]], [80, 30, [40, 60], [30, 50]], [78, 138, [145, 98], [41, 162]], [71, 63]]
    },
    {
        desc: "extra-node-example",
        data: [40, 40, [40, 40, [40, 40, [40, 40]], [80, 40], [80, 40]], [40, 40, [80, 40], [80, 40], [80, 40]]],
    },
    {
        desc: "extra-node",
        get data() { return figs[3].data; },
        opts: { extraVerticalSpacings: { 6: 80 } },
    },
    {
        desc: "layered-forest-bad",
        data: [
            [116, 188, [91, 162, [88, 87]], [64, 142, [137, 196, [74, 163]], [116, 106], [124, 108], [53, 77]], [110, 124]],
            [57, 97, [54, 96, [148, 41, [121, 41]], [133, 97]], [46, 54, [132, 46]], [137, 42], [49, 153, [89, 65]]],
            [140, 121, [128, 149, [117, 108]], [115, 59, [98, 175, [114, 65]], [46, 138], [94, 57]], [78, 124], [92, 54]],
        ],
        opts: { layerHeight: 250 },
    },
    {
        desc: "layered-forest",
        data: [
            [68, 69, [74, 71], [61, 92, [51, 74, [97, 46]]], [58, 76], [58, 41]],
            [92, 91, [94, 79, [55, 52], [97, 87], [50, 77]], [76, 76, [43, 41]]],
            [71, 90, [99, 71, [63, 75], [98, 58]], [93, 79], [43, 64, [55, 86]]],
            [85, 67, [81, 72], [95, 56]],
            [95, 61, [58, 73], [62, 59]],
        ],
        opts: {
            layerHeight: 140, extraVerticalSpacings: {
                7: 140 * 3,
                21: 140 * 3,
                6: 140,
                17: 140,
                26: 140,
            }
        },
        showRoot: true,
    },
    {
        desc: "extranode-parentmove-before",
        data: [40, 40, [240, 40, [240, 40]], [240, 40]],
    },
    {
        desc: "extranode-parentmove-after",
        get data() { return figs[7].data; },
        opts: {
            extraVerticalSpacings: {
                3: 80,
            }
        }
    },
    {
        desc: "bug-child-too-left",
        data: [40, 40, [40, 40], [64, 52, [45, 97, [86, 88]], [68, 60, [63, 78], [84, 65]], [99, 67], [66, 72], [90, 43, [40, 83]]]]
    },
    {
        desc: 'horizlayout-before',
        data: [198, 69, [251, 74], [95, 91, [395, 50]], [243, 75], [332, 77, [367, 93]], [193, 86], [278, 83, [155, 95]]],
    },
    {
        desc: "horizlayout-after",
        get data() { return figs[10].data; },
        opts: {
            sizeGetter: (n) => {
                const dims = n.layoutDimensions();
                return { w: dims.h, h: dims.w };
            },
            transform: (n, pos) => ({ x: pos.y, y: pos.x })
        },
        other: (cy) => {
            cy.style().selector("edge").style({
                "taxi-direction": "rightward"
            }).update();
        }
    },
    {
        desc: "future-extrachild-before",
        data: [40, 40, [40, 40, [40, 40], [40, 40, [40, 40, [40, 40], [40, 40], [40, 40]]], [40, 40]], [40, 40, [40, 40, [40, 40], [40, 40, [40, 40]], [40, 40]]]],
    },
    {
        desc: "future-extrachild-after",
        get data() {
            const d = [...figs[12].data];
            d.splice(3, 0, [125, 5]);
            return d;
        },
        other: (cy) => {
            cy.$("#9, edge[target = 9]").remove();
            const bb = cy.$("#bb9");
            bb.data().height = 5;
            bb.position("y", cy.$("#bb0").data().height + 5 / 2);
        }
    },
    {
        desc: "alg-terms",
        data: [64, 51, [95, 52, [89, 44], [81, 61, [68, 76]], [66, 69], [61, 85]], [76, 99, [46, 70, [50, 95]], [96, 57], [57, 97]], [40, 71]],
        opts: {
            extraVerticalSpacings: {
                6: 167,
            }
        },
        other: (cy) => {
            cy.$("#0, #1, #2, #3, #4, #6").addClass("lcon");
            cy.$("#0, #12, #7, #11, #9").addClass("rcon");
            const threads = [[2, 3], [4, 6], [12, 7], [11, 9]];

            cy.$("#6, #9").addClass("extreme");

            cy.add(threads.map(t => ({
                group: "edges",
                data: { source: t[0].toString(), target: t[1].toString() },
                classes: ["thread", t[0] < t[1] ? "lcon" : "rcon"],
            })));
        }
    },
    {
        desc: "alg-contours",
        data: [
            [57, 81, [80, 49], [56, 82, [65, 48, [64, 71]]]],
            [44, 91, [58, 57, [65, 97], [44, 70]], [95, 76, [68, 83], [63, 95]]],
            [98, 61, [85, 84, [71, 61, [48, 70], [74, 47, [91, 45], [53, 95]]]]],
        ],
        other: (cy) => {
            cy.$("#12, #13, #14, #15, #17, #18").addClass("lcon");
            cy.$("#5, #9, #11, #4").addClass("rcon");
            cy.$("node[id>11]").addClass("curr");
            cy.$("node[id<12]").addClass("prev");
            const contourPairs = [[12, 5], [13, 5], [13, 9], [14, 9], [14, 11], [15, 11], [15, 4], [17, 4], [18, 4]];
            cy.add(contourPairs.map(t => ({
                group: "edges",
                data: { source: t[0].toString(), target: t[1].toString() },
                classes: ["pair", "thread"],
            })));

            cy.style().selector(".pair").style({
                "curve-type": "haystack",
                "line-color": "green",
                "target-arrow-color": "green"
            }).update();

            cy.$(".curr").shift("x", 60);
        }
    },
    {
        desc: "alg-overlap",
        get data() { return figs[15].data; },
        other: (cy) => {
            cy.$("node[id>11]").addClass("curr");
            cy.$("node[id<12]").addClass("prev");

            cy.style().selector("node").style({
                opacity: 0.70
            });

            cy.$(".curr").shift("x", -350);
        }
    },
    {
        desc: "alg-firstiter",
        get data() { return figs[15].data; },
        other: (cy) => {
            cy.$("node[id>11]").addClass("curr");
            cy.$("node[id<12]").addClass("prev");

            cy.style().selector("node").style({
                opacity: 0.70
            });

            cy.$(".curr").shift("x", -188.75 + 20);
        }
    },
    {
        desc: "alg-end",
        get data() { return figs[15].data; },
        other: (cy) => {
            cy.$("node").addClass("prev");
        }
    },
    {
        desc: "alg-distribute-before",
        data: [
            [5, 5, [20, 40], [40, 40, [300, 40]], [20, 40], [20, 40], [20, 40]],
            [5, 5, [40, 40, [300, 40]]]
        ],
        other: (cy) => {
            cy.$("#0, #7, edge[source = 0], edge[source = 7]").remove();
            cy.$("node[id>7]").addClass("curr");
            cy.$("node[id<8]").addClass("prev");
        }
    },
    {
        desc: "alg-distribute-after",
        data: [
            [20, 40],
            [40, 40, [300, 40]], [20, 40], [20, 40], [20, 40],
            [40, 40, [300, 40]]
        ],
        other: (cy) => {
            cy.$("node").addClass("prev");
        }
    },
];

const tests = [
    {
        desc: "sizeGetter",
        data: [40, 200, [20, 200]],
        opts: { sizeGetter: () => ({ h: 20 }) },
    },
    {
        desc: "horizlayout-transform",
        data: [198, 69, [251, 74], [95, 91, [395, 50]], [243, 75], [332, 77, [367, 93]], [193, 86], [278, 83, [155, 95]]],
        opts: {
            sizeGetter: (n) => {
                const dims = n.layoutDimensions();
                return { w: dims.h, h: dims.w };
            },
            transform: (n, pos) => ({ x: pos.y, y: pos.x })
        },
        other: (cy) => {
            cy.style().selector("edge").style({
                "taxi-direction": "rightward"
            }).update();
        }
    },
    {
        desc: "option_direction_lr",
        data: [198, 69, [251, 74], [95, 91, [395, 50]], [243, 75], [332, 77, [367, 93]], [193, 86], [278, 83, [155, 95]]],
        opts: {
            direction: "LR",
        },
        other: (cy) => {
            cy.style().selector("edge").style({
                "taxi-direction": "rightward"
            }).update();
        }
    },
    {
        desc: "option_direction_bt",
        data: [198, 69, [251, 74], [95, 91, [395, 50]], [243, 75], [332, 77, [367, 93]], [193, 86], [278, 83, [155, 95]]],
        opts: {
            direction: "BT",
        },
        other: (cy) => {
            cy.style().selector("edge").style({
                "taxi-direction": "upward"
            }).update();
        }
    },
    {
        desc: "option_direction_rl",
        data: [198, 69, [251, 74], [95, 91, [395, 50]], [243, 75], [332, 77, [367, 93]], [193, 86], [278, 83, [155, 95]]],
        opts: {
            direction: "RL",
        },
        other: (cy) => {
            cy.style().selector("edge").style({
                "taxi-direction": "leftward"
            }).update();
        }
    },
    {
        desc: "nontree",
        data: [10, 40, [20, 40], [30, 40]],
        otherBefore: (cy) => {
            cy.add({ group: "edges", data: { source: "2", target: "1" } });
        }
    },
    {
        desc: "nontree-noroot",
        data: [10, 40, [20, 40], [30, 40]],
        otherBefore: (cy) => {
            cy.add({ group: "edges", data: { source: "2", target: "0" } });
        }
    },
    // TAKEN FROM
    // https://github.com/Klortho/d3-flextree/blob/af196220927218bbe7ac6cad8e059f56430befb6/src/test/test-trees.js
    {
        desc: 'simplest possible tree',
        data: [
            100, 100,
        ],
        expected: [
            0, 0,
        ],
        customSpacing: [
            0, 0,
        ],
    },
    {
        desc: 'simple tree',
        data: [
            30, 50,
            [40, 70,
                [50, 60],
                [50, 100],
            ],
            [20, 140,
                [50, 60],
                [50, 60],
            ],
            [50, 60,
                [50, 60],
                [50, 60],
            ],
        ],
        expected: [
            0, 0,
            [-82.5, 50,
            [-107.5, 120],
            [-57.5, 120],
            ],
            [17.5, 50,
                [-7.5, 190],
                [42.5, 190],
            ],
            [77.5, 50,
                [52.5, 110],
                [102.5, 110],
            ],
        ],
        customSpacing: [
            0, 0,
            [-109.5, 50,
            [-140.5, 120],
            [-78.5, 120],
            ],
            [22.5, 50,
                [-8.5, 190],
                [53.5, 190],
            ],
            [104.5, 50,
                [73.5, 110],
                [135.5, 110],
            ],
        ],
    },
    {
        desc: 'another simple tree',
        data: [
            40, 40,
            [40, 40],
            [40, 40,
                [50, 40],
                [50, 40],
                [40, 40],
                [40, 40],
                [40, 40],
            ],
            [40, 40],
        ],
        expected: [
            0, 0,
            [-40, 40],
            [0, 40,
                [-85, 80],
                [-35, 80],
                [10, 80],
                [50, 80],
                [90, 80],
            ],
            [40, 40],
        ],
        customSpacing: [
            0, 0,
            [-64, 40],
            [0, 40,
                [-133, 80],
                [-59, 80],
                [10, 80],
                [74, 80],
                [138, 80],
            ],
            [64, 40],
        ],
    },
    {
        desc: 'layout bug, simple case',
        data: [
            40, 40,
            [40, 40],
            [40, 40,
                [100, 40],
                [200, 40],
            ],
        ],
        expected: [
            0, 0,
            [-20, 40],
            [20, 40,
                [-80, 80],
                [70, 80],
            ],
        ],
        customSpacing: [
            0, 0,
            [-32, 40],
            [32, 40,
                [-80, 80],
                [94, 80],
            ],
        ],
    },
    {
        desc: 'layout bug, redux',
        data: [
            40, 40,
            [40, 40],
            [40, 40,
                [40, 40,
                    [100, 40],
                    [200, 40],
                ],
            ],
        ],
        expected: [
            0, 0,
            [-20, 40],
            [20, 40,
                [20, 80,
                    [-80, 120],
                    [70, 120],
                ],
            ],
        ],
        customSpacing: [
            0, 0,
            [-32, 40],
            [32, 40,
                [32, 80,
                    [-80, 120],
                    [94, 120],
                ],
            ],
        ],
    },
    {
        desc: 'layout bug, third sibling',
        data: [
            40, 40,
            [40, 40],
            [40, 40],
            [40, 40,
                [40, 40,
                    [100, 40],
                    [200, 40],
                ],
            ],
        ],
        expected:
            [0, 0,
                [-40, 40],
                [0, 40],
                [40, 40,
                    [40, 80,
                        [-60, 120],
                        [90, 120],
                    ],
                ],
            ],
        customSpacing: [
            0, 0,
            [-64, 40],
            [0, 40],
            [64, 40,
                [64, 80,
                    [-48, 120],
                    [126, 120],
                ],
            ],
        ],
    },
    // My first, naive attempt to fix the layout bug caused this tree's
    // layout to break:
    {
        desc: 'narrower child',
        data: [
            20, 20,
            [20, 40],
            [20, 20,
                [10, 20],
            ],
        ],
        expected: [
            0, 0,
            [-10, 20],
            [10, 20,
                [10, 40],
            ],
        ],
        customSpacing: [
            0, 0,
            [-13, 20],
            [13, 20,
                [13, 40],
            ],
        ],
    },
    {
        desc: 'redistributed middle sibling - 0',
        data: [
            40, 40,
            [40, 40,
                [200, 200],
            ],
            [40, 40],
            [40, 40,
                [200, 200],
            ],
        ],
        expected: [
            0, 0,
            [-100, 40,
            [-100, 80],
            ],
            [0, 40],
            [100, 40,
                [100, 80],
            ],
        ],
        customSpacing: [
            0, 0,
            [-120, 40,
            [-120, 80],
            ],
            [0, 40],
            [120, 40,
                [120, 80],
            ],
        ],
    },
    {
        desc: 'redistributed middle siblings - 1',
        data: [
            40, 40,
            [40, 40,
                [40, 40,
                    [40, 40,
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                        [40, 40],
                    ],
                ],
            ],
            [40, 40],
            [40, 40],
            [40, 40],
            [40, 40,
                [40, 40,
                    [200, 200],
                ],
            ],
        ],
        expected: [
            0, 0,
            [-140, 40,
            [-140, 80,
            [-140, 120,
            [-300, 160],
            [-260, 160],
            [-220, 160],
            [-180, 160],
            [-140, 160],
            [-100, 160],
            [-60, 160],
            [-20, 160],
            [20, 160],
            ],
            ],
            ],
            [-70, 40],
            [0, 40],
            [70, 40],
            [140, 40,
                [140, 80,
                    [140, 120],
                ],
            ],
        ],
        customSpacing: [
            0, 0,
            [-220, 40,
            [-220, 80,
            [-220, 120,
            [-476, 160],
            [-412, 160],
            [-348, 160],
            [-284, 160],
            [-220, 160],
            [-156, 160],
            [-92, 160],
            [-28, 160],
            [36, 160],
            ],
            ],
            ],
            [-110, 40],
            [0, 40],
            [110, 40],
            [220, 40,
                [220, 80,
                    [220, 120],
                ],
            ],
        ],
    },
    {
        desc: 'test extreme data',
        data: [
            40, 40,
            [40, 40,
                [40, 100,
                    [200, 40],
                ],
            ],
            [40, 40,
                [40, 40],
                [40, 200],
                [40, 40],
            ],
            [40, 40,
                [40, 100,
                    [200, 40],
                ],
            ],
        ],
        expected: [
            0, 0,
            [-120, 40,
            [-120, 80,
            [-120, 180],
            ],
            ],
            [0, 40,
                [-40, 80],
                [0, 80],
                [40, 80],
            ],
            [120, 40,
                [120, 80,
                    [120, 180],
                ],
            ],
        ],
        customSpacing: [
            0, 0,
            [-168, 40,
            [-168, 80,
            [-168, 180],
            ],
            ],
            [0, 40,
                [-64, 80],
                [0, 80],
                [64, 80],
            ],
            [168, 40,
                [168, 80,
                    [168, 180],
                ],
            ],
        ],
    },
    {
        desc: 'test redistributing children, from van der Ploeg figure 6',
        data: [
            10, 10,
            [10, 15,
                [50, 10],
                [50, 10,
                    [50, 10],
                    [50, 10],
                ],
            ],
            [10, 10],
            [10, 10],
            [10, 20],
            [10, 10],
            [10, 30,
                [50, 10],
            ],
        ],
        expected: [
            0, 0,
            [-50, 10,
            [-75, 25],
            [-25, 25,
            [-50, 35],
            [0, 35],
            ],
            ],
            [-(26 + 2 / 3), 10],
            [-(3 + 1 / 3), 10],
            [20, 10],
            [35, 10],
            [50, 10,
                [50, 40],
            ],
        ],
        customSpacing: [
            0, 0,
            [-59, 10,
            [-87, 25],
            [-31, 25,
            [-59, 35],
            [-3, 35],
            ],
            ],
            [-33, 10],
            [-7, 10],
            [19, 10],
            [39, 10],
            [59, 10,
                [59, 40],
            ],
        ],
    },
    {
        desc: 'modified figure 6 tree',
        data: [
            10, 10,
            [10, 15,
                [50, 10],
                [50, 10,
                    [50, 10],
                    [50, 10],
                ],
            ],
            [10, 10],
            [10, 10],
            [10, 20],
            [10, 10],
        ],
        expected: [
            0, 0,
            [-32.5, 10,
            [-57.5, 25],
            [-7.5, 25,
            [-32.5, 35],
            [17.5, 35],
            ],
            ],
            [-(14 + 1 / 6), 10],
            [4 + 1 / 6, 10],
            [22.5, 10],
            [32.5, 10],
        ],
        customSpacing: [
            0, 0,
            [-41, 10,
            [-69, 25],
            [-13, 25,
            [-41, 35],
            [15, 35],
            ],
            ],
            [-19, 10],
            [3, 10],
            [25, 10],
            [41, 10],
        ],
    },
    {
        desc: 'mirror image of figure 6 tree',
        data: [
            10, 10,
            [10, 30,
                [50, 10],
            ],
            [10, 10],
            [10, 20],
            [10, 10],
            [10, 10],
            [10, 15,
                [50, 12,
                    [50, 10],
                    [50, 8],
                ],
                [50, 10],
            ],
        ],
        expected: [
            0, 0,
            [-50, 10,
            [-50, 40],
            ],
            [-35, 10],
            [-20, 10],
            [3 + 1 / 3, 10],
            [26 + 2 / 3, 10],
            [50, 10,
                [25, 25,
                    [0, 37],
                    [50, 37],
                ],
                [75, 25],
            ],
        ],
        customSpacing: [
            0, 0,
            [-59, 10,
            [-59, 40],
            ],
            [-39, 10],
            [-19, 10],
            [7, 10],
            [33, 10],
            [59, 10,
                [31, 25,
                    [3, 37],
                    [59, 37],
                ],
                [87, 25],
            ],
        ],
    },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var cases = figs.map(c => ({ ...c, desc: "figs/" + c.desc })).concat(tests.map(c => ({ ...c, desc: "tests/" + c.desc })));
