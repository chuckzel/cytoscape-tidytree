import type cyFunc from 'cytoscape';
import { CyLayout } from './cy_layout.js';

export default function register(cytoscape: typeof cyFunc) {
    cytoscape("layout", "tidytree", CyLayout);
}

if (typeof window.cytoscape !== "undefined") {
    register(window.cytoscape);
}

export type { TidytreeLayoutOptions } from './cy_layout.js';