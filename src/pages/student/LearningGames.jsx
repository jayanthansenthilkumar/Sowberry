import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

// ════════════════════════════════════════════════════════════════
//  CODE CHALLENGES — each maps to an algorithm game
// ════════════════════════════════════════════════════════════════
const CODE_CHALLENGES = {
  dijkstra: {
    title: 'Implement Dijkstra\'s Algorithm',
    description: 'Given a weighted graph as an adjacency list, find the shortest distance from node 0 to all other nodes.\nReturn an array of shortest distances.',
    boilerplate: `function dijkstra(graph, start) {
  // graph = { 0: [[1,2],[2,4]], 1: [[2,1],[3,7]], ... }
  // Return array of distances from start to each node
  
}`,
    testCases: [
      { input: '{"0":[[1,2],[2,4]],"1":[[2,1],[3,7]],"2":[[3,3]],"3":[]}', expected: '[0,2,3,6]' },
      { input: '{"0":[[1,1]],"1":[[0,1]]}', expected: '[0,1]' },
    ],
    hint: 'Use a priority queue (or scan for min). Initialize distances to Infinity, set dist[start]=0, and relax edges.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        const g1 = { 0: [[1,2],[2,4]], 1: [[2,1],[3,7]], 2: [[3,3]], 3: [] };
        const r1 = fn(g1, 0);
        if (JSON.stringify(r1) !== '[0,2,3,6]') return false;
        const g2 = { 0: [[1,1]], 1: [[0,1]] };
        const r2 = fn(g2, 0);
        if (JSON.stringify(r2) !== '[0,1]') return false;
        return true;
      } catch { return false; }
    }
  },
  sorting: {
    title: 'Implement Bubble Sort',
    description: 'Sort an array of numbers in ascending order using Bubble Sort.\nReturn the sorted array.',
    boilerplate: `function bubbleSort(arr) {
  // Sort arr in ascending order using bubble sort
  
}`,
    testCases: [
      { input: '[5,3,8,4,2]', expected: '[2,3,4,5,8]' },
      { input: '[1]', expected: '[1]' },
    ],
    hint: 'Nested loops: outer for passes, inner for comparing adjacent elements and swapping if out of order.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (JSON.stringify(fn([5,3,8,4,2])) !== '[2,3,4,5,8]') return false;
        if (JSON.stringify(fn([1])) !== '[1]') return false;
        if (JSON.stringify(fn([9,1,5,3])) !== '[1,3,5,9]') return false;
        return true;
      } catch { return false; }
    }
  },
  bfs: {
    title: 'Implement BFS (Breadth-First Search)',
    description: 'Given an adjacency list, return the BFS traversal order starting from node 0.\nReturn an array of visited node IDs.',
    boilerplate: `function bfs(graph, start) {
  // graph = { 0: [1,2], 1: [3], 2: [3], 3: [] }
  // Return array of nodes visited in BFS order
  
}`,
    testCases: [
      { input: '{"0":[1,2],"1":[3],"2":[3],"3":[]}', expected: '[0,1,2,3]' },
    ],
    hint: 'Use a queue. Start by enqueueing the start node. Dequeue, visit neighbors, enqueue unvisited ones.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        const r = fn({ 0: [1,2], 1: [3], 2: [3], 3: [] }, 0);
        if (JSON.stringify(r) !== '[0,1,2,3]') return false;
        return true;
      } catch { return false; }
    }
  },
  binary_search: {
    title: 'Implement Binary Search',
    description: 'Given a sorted array and a target, return the index of the target.\nReturn -1 if not found.',
    boilerplate: `function binarySearch(arr, target) {
  // arr is sorted ascending
  // Return index of target, or -1
  
}`,
    testCases: [
      { input: '[1,3,5,7,9], 5', expected: '2' },
      { input: '[2,4,6,8], 3', expected: '-1' },
    ],
    hint: 'Maintain low and high pointers. Calculate mid, compare with target, adjust low or high.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn([1,3,5,7,9], 5) !== 2) return false;
        if (fn([2,4,6,8], 3) !== -1) return false;
        if (fn([1,2,3,4,5], 1) !== 0) return false;
        return true;
      } catch { return false; }
    }
  },
  stack: {
    title: 'Validate Balanced Brackets',
    description: 'Given a string of brackets ()[]{}. Return true if brackets are balanced, false otherwise.',
    boilerplate: `function isBalanced(str) {
  // Use a stack to check if brackets are balanced
  
}`,
    testCases: [
      { input: '"()[]{}"', expected: 'true' },
      { input: '"([)]"', expected: 'false' },
      { input: '"{[]}"', expected: 'true' },
    ],
    hint: 'Push opening brackets onto a stack. For closing brackets, pop and check if they match.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn('()[]{}') !== true) return false;
        if (fn('([)]') !== false) return false;
        if (fn('{[]}') !== true) return false;
        if (fn('(') !== false) return false;
        return true;
      } catch { return false; }
    }
  },
  recursion: {
    title: 'Tower of Hanoi — Count Moves',
    description: 'Return the minimum number of moves needed to solve Tower of Hanoi for n discs.',
    boilerplate: `function hanoi(n) {
  // Return minimum moves for n discs
  
}`,
    testCases: [
      { input: '3', expected: '7' },
      { input: '4', expected: '15' },
    ],
    hint: 'The recurrence is: hanoi(n) = 2 * hanoi(n-1) + 1, base case hanoi(1) = 1.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn(3) !== 7) return false;
        if (fn(4) !== 15) return false;
        if (fn(1) !== 1) return false;
        return true;
      } catch { return false; }
    }
  },
  greedy: {
    title: 'Greedy Coin Change',
    description: 'Given coin denominations [1,5,10,25] and a target amount, return the minimum number of coins needed.\nUse the greedy approach.',
    boilerplate: `function minCoins(coins, amount) {
  // Return minimum number of coins using greedy
  
}`,
    testCases: [
      { input: '[1,5,10,25], 41', expected: '4' },
      { input: '[1,5,10,25], 30', expected: '2' },
    ],
    hint: 'Sort coins descending. For each coin, use as many as possible, then move to the next smaller coin.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn([1,5,10,25], 41) !== 4) return false;
        if (fn([1,5,10,25], 30) !== 2) return false;
        return true;
      } catch { return false; }
    }
  },
  linkedlist: {
    title: 'Reverse a Linked List',
    description: 'Given a linked list as an array, reverse it and return the reversed array.\n(Simulated linked list using array)',
    boilerplate: `function reverseList(arr) {
  // Reverse the array (simulating linked list reversal)
  // Do it iteratively using prev/current pointers logic
  
}`,
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[10]', expected: '[10]' },
    ],
    hint: 'Iterate through, using a "prev" accumulator. At each step, prepend current to result.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (JSON.stringify(fn([1,2,3,4,5])) !== '[5,4,3,2,1]') return false;
        if (JSON.stringify(fn([10])) !== '[10]') return false;
        return true;
      } catch { return false; }
    }
  },
  hash: {
    title: 'Implement a Hash Function',
    description: 'Given a key (number) and table size, return key % size.\nThen, given an array of keys and size, return an object mapping each bucket index to its keys.',
    boilerplate: `function hashMap(keys, size) {
  // Return object: { bucketIndex: [keys...], ... }
  // Hash function: key % size
  
}`,
    testCases: [
      { input: '[3,10,17,24], 7', expected: '{"3":[3,10,17,24]}' },
      { input: '[1,8,15], 7', expected: '{"1":[1,8,15]}' },
    ],
    hint: 'Loop through keys, compute key % size, group keys by their bucket index.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        const r1 = fn([3,10,17,24], 7);
        if (!r1 || !Array.isArray(r1[3]) || r1[3].length !== 4) return false;
        const r2 = fn([1,8,15], 7);
        if (!r2 || !Array.isArray(r2[1]) || r2[1].length !== 3) return false;
        const r3 = fn([0,7,14], 7);
        if (!r3 || !Array.isArray(r3[0]) || r3[0].length !== 3) return false;
        return true;
      } catch { return false; }
    }
  },
  dp: {
    title: '0/1 Knapsack Problem',
    description: 'Given items [{weight, value}], and a capacity, return the maximum value achievable.\nUse Dynamic Programming.',
    boilerplate: `function knapsack(items, capacity) {
  // items = [{weight:2, value:3}, ...]
  // Return max value within capacity
  
}`,
    testCases: [
      { input: '[{"weight":2,"value":3},{"weight":3,"value":4},{"weight":4,"value":5}], 5', expected: '7' },
    ],
    hint: 'Build a 2D DP table: dp[i][w] = max value using first i items with capacity w.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn([{weight:2,value:3},{weight:3,value:4},{weight:4,value:5}], 5) !== 7) return false;
        if (fn([{weight:1,value:1},{weight:2,value:6},{weight:3,value:10}], 5) !== 16) return false;
        return true;
      } catch { return false; }
    }
  },
  tree: {
    title: 'BST Insertion',
    description: 'Given a sequence of values, build a BST and return the in-order traversal as an array.',
    boilerplate: `function bstInOrder(values) {
  // Insert values into BST, then return in-order traversal
  
}`,
    testCases: [
      { input: '[5,3,7,1,4]', expected: '[1,3,4,5,7]' },
      { input: '[10,5,15]', expected: '[5,10,15]' },
    ],
    hint: 'Create a Node class with val/left/right. Insert by comparing with current node. In-order: left, root, right.',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (JSON.stringify(fn([5,3,7,1,4])) !== '[1,3,4,5,7]') return false;
        if (JSON.stringify(fn([10,5,15])) !== '[5,10,15]') return false;
        return true;
      } catch { return false; }
    }
  },
  graph_coloring: {
    title: 'Graph Coloring Check',
    description: 'Given adjacency edges and a color assignment object, return true if no two adjacent nodes share a color.',
    boilerplate: `function isValidColoring(edges, colors) {
  // edges = [[0,1],[1,2],[0,2]]
  // colors = {0:'red', 1:'blue', 2:'green'}
  // Return true if valid coloring
  
}`,
    testCases: [
      { input: '[[0,1],[1,2],[0,2]], {"0":"red","1":"blue","2":"green"}', expected: 'true' },
      { input: '[[0,1],[1,2],[0,2]], {"0":"red","1":"red","2":"green"}', expected: 'false' },
    ],
    hint: 'Loop through edges. For each edge [a,b], check if colors[a] !== colors[b].',
    validator: (code) => {
      try {
        const fn = new Function('return ' + code)();
        if (fn([[0,1],[1,2],[0,2]], {0:'red',1:'blue',2:'green'}) !== true) return false;
        if (fn([[0,1],[1,2],[0,2]], {0:'red',1:'red',2:'green'}) !== false) return false;
        return true;
      } catch { return false; }
    }
  },
};

// ════════════════════════════════════════════════════════════════
//  GAME DEFINITIONS
// ════════════════════════════════════════════════════════════════
const GAMES = [
  { id: 'dijkstra', title: 'Shortest Path Explorer', description: 'Find the shortest path using Dijkstra\'s algorithm.', icon: 'ri-route-line', color: 'from-blue-500 to-cyan-500', algorithm: 'Dijkstra\'s Algorithm', difficulty: 'Medium' },
  { id: 'sorting', title: 'Sort Visualizer', description: 'Race against time! Manually sort the array.', icon: 'ri-bar-chart-line', color: 'from-violet-500 to-purple-500', algorithm: 'Bubble Sort', difficulty: 'Easy' },
  { id: 'bfs', title: 'Maze Runner (BFS)', description: 'Navigate a maze using BFS strategy.', icon: 'ri-layout-grid-line', color: 'from-green-500 to-emerald-500', algorithm: 'BFS Traversal', difficulty: 'Medium' },
  { id: 'binary_search', title: 'Number Hunter', description: 'Guess the hidden number with Binary Search.', icon: 'ri-search-line', color: 'from-amber-500 to-orange-500', algorithm: 'Binary Search', difficulty: 'Easy' },
  { id: 'stack', title: 'Stack Overflow', description: 'Push/pop brackets to match the valid sequence!', icon: 'ri-stack-line', color: 'from-red-500 to-rose-500', algorithm: 'Stack (LIFO)', difficulty: 'Easy' },
  { id: 'recursion', title: 'Tower of Hanoi', description: 'Move all discs from source to target peg.', icon: 'ri-building-4-line', color: 'from-teal-500 to-cyan-500', algorithm: 'Recursion', difficulty: 'Hard' },
  { id: 'greedy', title: 'Coin Change Challenge', description: 'Make exact change using fewest coins.', icon: 'ri-coin-line', color: 'from-yellow-500 to-amber-500', algorithm: 'Greedy Algorithm', difficulty: 'Easy' },
  { id: 'linkedlist', title: 'Chain Builder', description: 'Build and manipulate a linked list.', icon: 'ri-links-line', color: 'from-indigo-500 to-blue-500', algorithm: 'Linked List', difficulty: 'Medium' },
  { id: 'hash', title: 'Hash Table Quest', description: 'Map keys to buckets — learn hashing!', icon: 'ri-hashtag', color: 'from-pink-500 to-rose-500', algorithm: 'Hash Tables', difficulty: 'Medium' },
  { id: 'dp', title: 'Knapsack Packer', description: 'Maximize value without exceeding weight.', icon: 'ri-briefcase-4-line', color: 'from-emerald-500 to-green-500', algorithm: 'Dynamic Programming', difficulty: 'Hard' },
  { id: 'tree', title: 'BST Explorer', description: 'Build a Binary Search Tree by inserting values.', icon: 'ri-node-tree', color: 'from-orange-500 to-red-500', algorithm: 'Binary Search Tree', difficulty: 'Medium' },
  { id: 'graph_coloring', title: 'Map Coloring', description: 'Color a map so no adjacent regions share a color.', icon: 'ri-palette-line', color: 'from-fuchsia-500 to-pink-500', algorithm: 'Graph Coloring', difficulty: 'Hard' },
];

// ════════════════════════════════════════════════════════════════
//                     MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const LearningGames = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [phase, setPhase] = useState('card'); // 'card' | 'code' | 'game'
  const [unlockedGames, setUnlockedGames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sowberry_unlocked_games') || '[]'); } catch { return []; }
  });

  // Code challenge state
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // ─────── All game states ───────
  const [djGraph, setDjGraph] = useState(null);
  const [djPath, setDjPath] = useState([]);
  const [djCost, setDjCost] = useState(0);
  const [djTarget, setDjTarget] = useState(null);
  const [djWon, setDjWon] = useState(false);
  const [djOptimal, setDjOptimal] = useState(Infinity);

  const [sortArr, setSortArr] = useState([]);
  const [sortSwaps, setSortSwaps] = useState(0);
  const [sortSelected, setSortSelected] = useState(null);
  const [sortSolved, setSortSolved] = useState(false);

  const [maze, setMaze] = useState([]);
  const [mazePos, setMazePos] = useState({ r: 0, c: 0 });
  const [mazeEnd, setMazeEnd] = useState({ r: 0, c: 0 });
  const [mazeMoves, setMazeMoves] = useState(0);
  const [mazeWon, setMazeWon] = useState(false);
  const [mazeVisited, setMazeVisited] = useState(new Set());

  const [bsTarget, setBsTarget] = useState(0);
  const [bsLow, setBsLow] = useState(1);
  const [bsHigh, setBsHigh] = useState(100);
  const [bsGuess, setBsGuess] = useState('');
  const [bsAttempts, setBsAttempts] = useState(0);
  const [bsHint, setBsHint] = useState('');
  const [bsWon, setBsWon] = useState(false);
  const [bsHistory, setBsHistory] = useState([]);

  const [stackItems, setStackItems] = useState([]);
  const [stackSequence, setStackSequence] = useState('');
  const [stackScore, setStackScore] = useState(0);
  const [stackLevel, setStackLevel] = useState(1);

  const [hanoiPegs, setHanoiPegs] = useState([[], [], []]);
  const [hanoiMoves, setHanoiMoves] = useState(0);
  const [hanoiDiscs, setHanoiDiscs] = useState(3);
  const [hanoiSelected, setHanoiSelected] = useState(null);
  const [hanoiWon, setHanoiWon] = useState(false);

  const [coinTarget, setCoinTarget] = useState(0);
  const [coinDenoms, setCoinDenoms] = useState([]);
  const [coinSelected, setCoinSelected] = useState([]);
  const [coinWon, setCoinWon] = useState(false);
  const [coinOptimal, setCoinOptimal] = useState(0);

  const [llNodes, setLlNodes] = useState([]);
  const [llInput, setLlInput] = useState('');
  const [llTarget, setLlTarget] = useState([]);
  const [llWon, setLlWon] = useState(false);

  const [hashBuckets, setHashBuckets] = useState([]);
  const [hashKeys, setHashKeys] = useState([]);
  const [hashCurrent, setHashCurrent] = useState(null);
  const [hashScore, setHashScore] = useState(0);
  const [hashSize, setHashSize] = useState(7);

  const [knapsackItems, setKnapsackItems] = useState([]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(0);
  const [knapsackSelected, setKnapsackSelected] = useState([]);
  const [knapsackWon, setKnapsackWon] = useState(false);
  const [knapsackOptimal, setKnapsackOptimal] = useState(0);

  const [bstRoot, setBstRoot] = useState(null);
  const [bstSequence, setBstSequence] = useState([]);
  const [bstInserted, setBstInserted] = useState(0);

  const [gcNodes, setGcNodes] = useState([]);
  const [gcEdges, setGcEdges] = useState([]);
  const [gcColors, setGcColors] = useState({});
  const [gcCurrentColor, setGcCurrentColor] = useState(0);
  const [gcWon, setGcWon] = useState(false);
  const GC_PALETTE = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

  // Save unlocked games
  useEffect(() => { localStorage.setItem('sowberry_unlocked_games', JSON.stringify(unlockedGames)); }, [unlockedGames]);

  // ════════════════════════════════════════════════════
  //                GAME INITIALIZERS
  // ════════════════════════════════════════════════════
  const initDijkstra = useCallback(() => {
    const nodes = [{ id: 0, x: 50, y: 150, label: 'A' }, { id: 1, x: 180, y: 60, label: 'B' }, { id: 2, x: 180, y: 240, label: 'C' }, { id: 3, x: 320, y: 60, label: 'D' }, { id: 4, x: 320, y: 240, label: 'E' }, { id: 5, x: 450, y: 150, label: 'F' }];
    const edges = [{ from: 0, to: 1, w: 2 + Math.floor(Math.random() * 5) }, { from: 0, to: 2, w: 4 + Math.floor(Math.random() * 4) }, { from: 1, to: 3, w: 1 + Math.floor(Math.random() * 6) }, { from: 1, to: 2, w: 3 + Math.floor(Math.random() * 3) }, { from: 2, to: 4, w: 2 + Math.floor(Math.random() * 5) }, { from: 3, to: 5, w: 3 + Math.floor(Math.random() * 4) }, { from: 4, to: 5, w: 1 + Math.floor(Math.random() * 5) }, { from: 3, to: 4, w: 2 + Math.floor(Math.random() * 3) }];
    const dist = Array(6).fill(Infinity); dist[0] = 0; const visited = new Set();
    for (let i = 0; i < 6; i++) { let u = -1; for (let v = 0; v < 6; v++) { if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) u = v; } visited.add(u); for (const e of edges) { if (e.from === u && dist[u] + e.w < dist[e.to]) dist[e.to] = dist[u] + e.w; if (e.to === u && dist[u] + e.w < dist[e.from]) dist[e.from] = dist[u] + e.w; } }
    setDjGraph({ nodes, edges }); setDjPath([0]); setDjCost(0); setDjTarget(5); setDjWon(false); setDjOptimal(dist[5]);
  }, []);
  const initSorting = useCallback(() => { setSortArr(Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 5)); setSortSwaps(0); setSortSelected(null); setSortSolved(false); }, []);
  const initMaze = useCallback(() => {
    const rows = 8, cols = 8, grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < Math.floor(rows * cols * 0.3); i++) { const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols); if ((r === 0 && c === 0) || (r === rows - 1 && c === cols - 1)) continue; grid[r][c] = 1; }
    const bfs = (g) => { const q = [[0, 0]], vis = new Set(['0,0']); while (q.length) { const [cr, cc] = q.shift(); if (cr === rows - 1 && cc === cols - 1) return true; for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) { const nr = cr + dr, nc = cc + dc; if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !vis.has(`${nr},${nc}`) && g[nr][nc] === 0) { vis.add(`${nr},${nc}`); q.push([nr, nc]); } } } return false; };
    while (!bfs(grid)) { const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols); grid[r][c] = 0; }
    setMaze(grid); setMazePos({ r: 0, c: 0 }); setMazeEnd({ r: rows - 1, c: cols - 1 }); setMazeMoves(0); setMazeWon(false); setMazeVisited(new Set(['0,0']));
  }, []);
  const initBinarySearch = useCallback(() => { setBsTarget(Math.floor(Math.random() * 100) + 1); setBsLow(1); setBsHigh(100); setBsGuess(''); setBsAttempts(0); setBsHint('Guess a number between 1 and 100'); setBsWon(false); setBsHistory([]); }, []);
  const initStack = useCallback(() => { const brackets = ['()', '[]', '{}']; let seq = ''; for (let i = 0; i < 3 + stackLevel; i++) { const b = brackets[Math.floor(Math.random() * brackets.length)]; const pos = Math.floor(Math.random() * (seq.length + 1)); seq = seq.slice(0, pos) + b + seq.slice(pos); } setStackSequence(seq); setStackItems([]); }, [stackLevel]);
  const initHanoi = useCallback(() => { setHanoiPegs([Array.from({ length: hanoiDiscs }, (_, i) => hanoiDiscs - i), [], []]); setHanoiMoves(0); setHanoiSelected(null); setHanoiWon(false); }, [hanoiDiscs]);
  const initCoin = useCallback(() => { const denoms = [1, 2, 5, 10, 25], target = Math.floor(Math.random() * 90) + 10; let rem = target, count = 0; for (const d of [...denoms].sort((a, b) => b - a)) { count += Math.floor(rem / d); rem %= d; } setCoinDenoms(denoms); setCoinTarget(target); setCoinSelected([]); setCoinWon(false); setCoinOptimal(count); }, []);
  const initLinkedList = useCallback(() => { setLlTarget(Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1)); setLlNodes([]); setLlInput(''); setLlWon(false); }, []);
  const initHash = useCallback(() => { const size = 7; setHashBuckets(Array.from({ length: size }, () => [])); setHashKeys(Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1)); setHashCurrent(0); setHashScore(0); setHashSize(size); }, []);
  const initKnapsack = useCallback(() => {
    const items = [{ name: 'Laptop', weight: 3, value: 10 }, { name: 'Phone', weight: 1, value: 6 }, { name: 'Book', weight: 2, value: 4 }, { name: 'Camera', weight: 4, value: 12 }, { name: 'Watch', weight: 1, value: 3 }, { name: 'Tablet', weight: 3, value: 8 }].map(it => ({ ...it, weight: it.weight + Math.floor(Math.random() * 2), value: it.value + Math.floor(Math.random() * 3) }));
    const cap = 8 + Math.floor(Math.random() * 3), n = items.length, dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
    for (let i = 1; i <= n; i++) for (let w = 0; w <= cap; w++) { dp[i][w] = dp[i - 1][w]; if (items[i - 1].weight <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - items[i - 1].weight] + items[i - 1].value); }
    setKnapsackItems(items); setKnapsackCapacity(cap); setKnapsackSelected([]); setKnapsackWon(false); setKnapsackOptimal(dp[n][cap]);
  }, []);
  const initBST = useCallback(() => { setBstSequence(Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 1)); setBstRoot(null); setBstInserted(0); }, []);
  const initGraphColoring = useCallback(() => {
    const nodes = [{ id: 0, x: 120, y: 40, label: 'A' }, { id: 1, x: 250, y: 40, label: 'B' }, { id: 2, x: 50, y: 140, label: 'C' }, { id: 3, x: 185, y: 120, label: 'D' }, { id: 4, x: 320, y: 140, label: 'E' }, { id: 5, x: 120, y: 230, label: 'F' }, { id: 6, x: 250, y: 230, label: 'G' }];
    setGcNodes(nodes); setGcEdges([[0,1],[0,2],[0,3],[1,3],[1,4],[2,3],[2,5],[3,4],[3,5],[3,6],[4,6],[5,6]]); setGcColors({}); setGcCurrentColor(0); setGcWon(false);
  }, []);

  // ════════════════════════════════════════════════════
  //                 GAME HANDLERS
  // ════════════════════════════════════════════════════
  const swalOpts = { background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' };

  const djClickNode = (nodeId) => { if (djWon || djPath.includes(nodeId)) return; const last = djPath[djPath.length - 1]; const edge = djGraph.edges.find(e => (e.from === last && e.to === nodeId) || (e.to === last && e.from === nodeId)); if (!edge) return; const np = [...djPath, nodeId], nc = djCost + edge.w; setDjPath(np); setDjCost(nc); if (nodeId === djTarget) { setDjWon(true); Swal.fire({ ...swalOpts, icon: nc === djOptimal ? 'success' : 'info', title: nc === djOptimal ? 'Optimal Path!' : 'Path Found!', text: `Cost: ${nc} (Optimal: ${djOptimal})` }); } };
  const sortClickItem = (idx) => { if (sortSolved) return; if (sortSelected === null) { setSortSelected(idx); } else { const a = [...sortArr]; [a[sortSelected], a[idx]] = [a[idx], a[sortSelected]]; setSortArr(a); setSortSwaps(s => s + 1); setSortSelected(null); if (a.every((v, i) => i === 0 || a[i - 1] <= v)) { setSortSolved(true); Swal.fire({ ...swalOpts, icon: 'success', title: 'Sorted!', text: `Done in ${sortSwaps + 1} swaps!` }); } } };

  useEffect(() => {
    if (activeGame !== 'bfs' || phase !== 'game' || mazeWon) return;
    const handler = (e) => { const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }; const d = dirs[e.key]; if (!d) return; e.preventDefault();
      setMazePos(prev => { const nr = prev.r + d[0], nc = prev.c + d[1]; if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length || maze[nr][nc] === 1) return prev; setMazeMoves(m => m + 1); setMazeVisited(v => new Set([...v, `${nr},${nc}`])); if (nr === mazeEnd.r && nc === mazeEnd.c) { setMazeWon(true); Swal.fire({ ...swalOpts, icon: 'success', title: 'Maze Solved!', text: `Completed in ${mazeMoves + 1} moves!` }); } return { r: nr, c: nc }; }); };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [activeGame, phase, maze, mazeWon, mazeEnd, mazeMoves]);

  const submitBsGuess = () => { const num = parseInt(bsGuess); if (isNaN(num) || num < 1 || num > 100) return; const na = bsAttempts + 1; setBsAttempts(na); setBsHistory(h => [...h, { guess: num, dir: num === bsTarget ? 'correct' : num < bsTarget ? 'higher' : 'lower' }]); if (num === bsTarget) { setBsWon(true); Swal.fire({ ...swalOpts, icon: na <= 7 ? 'success' : 'info', title: 'Found it!', text: `Found in ${na} attempts` }); } else if (num < bsTarget) { setBsHint(`${num} is too LOW`); setBsLow(Math.max(bsLow, num + 1)); } else { setBsHint(`${num} is too HIGH`); setBsHigh(Math.min(bsHigh, num - 1)); } setBsGuess(''); };
  const pushBracket = (b) => { const ns = [...stackItems, b]; setStackItems(ns); if (ns.join('') === stackSequence) { setStackScore(s => s + 1); setStackLevel(l => l + 1); Swal.fire({ ...swalOpts, icon: 'success', title: 'Matched!', timer: 1200, showConfirmButton: false }); setTimeout(() => initStack(), 1300); } };
  const popBracket = () => { if (stackItems.length > 0) setStackItems(stackItems.slice(0, -1)); };
  const hanoiClickPeg = (pegIdx) => { if (hanoiWon) return; if (hanoiSelected === null) { if (hanoiPegs[pegIdx].length === 0) return; setHanoiSelected(pegIdx); } else { if (pegIdx === hanoiSelected) { setHanoiSelected(null); return; } const from = hanoiPegs[hanoiSelected], to = hanoiPegs[pegIdx], disc = from[from.length - 1]; if (to.length > 0 && to[to.length - 1] < disc) { Swal.fire({ ...swalOpts, icon: 'warning', title: 'Invalid!', timer: 1000, showConfirmButton: false }); setHanoiSelected(null); return; } const np = hanoiPegs.map(p => [...p]); np[hanoiSelected].pop(); np[pegIdx].push(disc); setHanoiPegs(np); setHanoiMoves(m => m + 1); setHanoiSelected(null); if (pegIdx === 2 && np[2].length === hanoiDiscs) { setHanoiWon(true); Swal.fire({ ...swalOpts, icon: 'success', title: 'Tower Complete!', text: `Done in ${hanoiMoves + 1} moves (optimal: ${Math.pow(2, hanoiDiscs) - 1})` }); } } };
  const addCoin = (d) => { if (coinWon) return; const ns = [...coinSelected, d], total = ns.reduce((a, b) => a + b, 0); setCoinSelected(ns); if (total === coinTarget) { setCoinWon(true); Swal.fire({ ...swalOpts, icon: ns.length <= coinOptimal ? 'success' : 'info', title: ns.length <= coinOptimal ? 'Optimal!' : 'Got it!', text: `${ns.length} coins (optimal: ${coinOptimal})` }); } else if (total > coinTarget) { Swal.fire({ ...swalOpts, icon: 'error', title: 'Over!', timer: 1000, showConfirmButton: false }); setCoinSelected([]); } };
  const llInsert = () => { const val = parseInt(llInput); if (isNaN(val)) return; const nn = [...llNodes, val]; setLlNodes(nn); setLlInput(''); if (nn.length === llTarget.length && nn.every((v, i) => v === llTarget[i])) { setLlWon(true); Swal.fire({ ...swalOpts, icon: 'success', title: 'Chain Complete!' }); } };
  const llDelete = (idx) => { setLlNodes(llNodes.filter((_, i) => i !== idx)); };
  const hashPlace = (bi) => { if (hashCurrent >= hashKeys.length) return; const key = hashKeys[hashCurrent], cb = key % hashSize; const nb = hashBuckets.map(b => [...b]); nb[bi].push(key); setHashBuckets(nb); if (bi === cb) setHashScore(s => s + 1); if (hashCurrent + 1 >= hashKeys.length) Swal.fire({ ...swalOpts, icon: 'success', title: 'Complete!', text: `Score: ${hashScore + (bi === cb ? 1 : 0)}/${hashKeys.length}` }); setHashCurrent(c => c + 1); };
  const toggleKnapsackItem = (idx) => { if (knapsackWon) return; const ns = knapsackSelected.includes(idx) ? knapsackSelected.filter(i => i !== idx) : [...knapsackSelected, idx]; if (ns.reduce((s, i) => s + knapsackItems[i].weight, 0) > knapsackCapacity) { Swal.fire({ ...swalOpts, icon: 'warning', title: 'Too Heavy!', timer: 1000, showConfirmButton: false }); return; } setKnapsackSelected(ns); };
  const submitKnapsack = () => { const tv = knapsackSelected.reduce((s, i) => s + knapsackItems[i].value, 0); setKnapsackWon(true); Swal.fire({ ...swalOpts, icon: tv === knapsackOptimal ? 'success' : 'info', title: tv === knapsackOptimal ? 'Optimal!' : 'Good try!', text: `Value: ${tv} (Optimal: ${knapsackOptimal})` }); };
  const bstInsertNode = (root, val) => { if (!root) return { val, left: null, right: null }; if (val < root.val) return { ...root, left: bstInsertNode(root.left, val) }; return { ...root, right: bstInsertNode(root.right, val) }; };
  const bstInsert = () => { if (bstInserted >= bstSequence.length) return; setBstRoot(prev => bstInsertNode(prev, bstSequence[bstInserted])); setBstInserted(i => i + 1); if (bstInserted + 1 >= bstSequence.length) Swal.fire({ ...swalOpts, icon: 'success', title: 'BST Complete!' }); };
  const renderBSTNode = (node, x, y, spread) => { if (!node) return null; return (<g key={`${x}-${y}-${node.val}`}>{node.left && <line x1={x} y1={y} x2={x - spread} y2={y + 50} stroke="#555" strokeWidth="2" />}{node.right && <line x1={x} y1={y} x2={x + spread} y2={y + 50} stroke="#555" strokeWidth="2" />}<circle cx={x} cy={y} r={18} fill="#d4a574" stroke="#222" strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">{node.val}</text>{node.left && renderBSTNode(node.left, x - spread, y + 50, spread / 2)}{node.right && renderBSTNode(node.right, x + spread, y + 50, spread / 2)}</g>); };
  const gcColorNode = (nodeId) => { if (gcWon) return; const nc = { ...gcColors, [nodeId]: gcCurrentColor }; setGcColors(nc); if (Object.keys(nc).length === gcNodes.length) { const valid = gcEdges.every(([a, b]) => nc[a] !== nc[b]); if (valid) { setGcWon(true); Swal.fire({ ...swalOpts, icon: 'success', title: 'Map Colored!' }); } else { Swal.fire({ ...swalOpts, icon: 'error', title: 'Invalid!', text: 'Adjacent nodes share a color.' }); setGcColors({}); } } };

  // ════════════════════════════════════════════════════
  //        CODE CHALLENGE SUBMISSION
  // ════════════════════════════════════════════════════
  const handleCodeSubmit = () => {
    if (!activeGame) return;
    const challenge = CODE_CHALLENGES[activeGame];
    if (!challenge) return;
    setCodeOutput('Running tests...');
    setTimeout(() => {
      const passed = challenge.validator(code);
      if (passed) {
        setCodeOutput('✓ All test cases passed! Game unlocked!');
        const newUnlocked = [...new Set([...unlockedGames, activeGame])];
        setUnlockedGames(newUnlocked);
        Swal.fire({ ...swalOpts, icon: 'success', title: 'Challenge Complete!', text: 'You can now play the game. Click "Play Game" to continue!', confirmButtonText: 'Play Game' }).then(() => {
          setPhase('game');
          const inits = { dijkstra: initDijkstra, sorting: initSorting, bfs: initMaze, binary_search: initBinarySearch, stack: initStack, recursion: initHanoi, greedy: initCoin, linkedlist: initLinkedList, hash: initHash, dp: initKnapsack, tree: initBST, graph_coloring: initGraphColoring };
          inits[activeGame]?.();
        });
      } else {
        setCodeOutput('✗ Test cases failed. Check your logic and try again.\n\nExpected results:\n' + challenge.testCases.map(tc => `  Input: ${tc.input} → Output: ${tc.expected}`).join('\n'));
      }
    }, 500);
  };

  const startGame = (id) => {
    setActiveGame(id);
    setCodeOutput('');
    setShowHint(false);
    const challenge = CODE_CHALLENGES[id];
    if (challenge) setCode(challenge.boilerplate);
    if (unlockedGames.includes(id)) {
      setPhase('game');
      const inits = { dijkstra: initDijkstra, sorting: initSorting, bfs: initMaze, binary_search: initBinarySearch, stack: initStack, recursion: initHanoi, greedy: initCoin, linkedlist: initLinkedList, hash: initHash, dp: initKnapsack, tree: initBST, graph_coloring: initGraphColoring };
      inits[id]?.();
    } else {
      setPhase('code');
    }
  };

  const goBack = () => { setActiveGame(null); setPhase('card'); };

  // ════════════════════════════════════════════════════
  //                 COMMON STYLES
  // ════════════════════════════════════════════════════
  const cardCls = 'bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]';
  const btnPrimary = 'px-4 py-2.5 rounded-xl bg-[#d4a574] text-[#1a1a1a] font-semibold text-sm hover:bg-[#c4956a] transition-colors';
  const btnSecondary = 'px-4 py-2.5 rounded-xl bg-[#222] border border-[#333] text-[#aaa] font-medium text-sm hover:bg-[#2a2a2a] hover:border-[#555] transition-colors';

  // ════════════════════════════════════════════════════
  //           CODE CHALLENGE RENDERER
  // ════════════════════════════════════════════════════
  const renderCodeChallenge = () => {
    const challenge = CODE_CHALLENGES[activeGame];
    if (!challenge) return null;
    const game = GAMES.find(g => g.id === activeGame);
    return (
      <div className="space-y-4">
        <div className={cardCls}>
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${game?.color} flex items-center justify-center flex-shrink-0`}><i className={`${game?.icon} text-white`}></i></div>
            <div>
              <h2 className="text-lg font-bold text-[#e8e8e8]">{challenge.title}</h2>
              <p className="text-xs text-[#888] mt-1">Solve this to unlock: <b className="text-[#d4a574]">{game?.title}</b></p>
            </div>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4 mb-4">
            <p className="text-sm text-[#ccc] whitespace-pre-wrap leading-relaxed">{challenge.description}</p>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-[#888]">Test Cases:</p>
            {challenge.testCases.map((tc, i) => (
              <div key={i} className="flex gap-4 text-xs bg-[#111] rounded-lg p-2.5 border border-[#2a2a2a]">
                <span className="text-[#888]">Input: <span className="text-[#d4a574] font-mono">{tc.input}</span></span>
                <span className="text-[#888]">Expected: <span className="text-green-400 font-mono">{tc.expected}</span></span>
              </div>
            ))}
          </div>
          {showHint && <div className="bg-[#d4a574]/10 border border-[#d4a574]/20 rounded-xl p-3 mb-4 text-xs text-[#d4a574]"><i className="ri-lightbulb-line mr-1"></i>{challenge.hint}</div>}
          <button onClick={() => setShowHint(!showHint)} className="text-xs text-[#888] hover:text-[#d4a574] transition-colors"><i className="ri-lightbulb-line mr-1"></i>{showHint ? 'Hide Hint' : 'Show Hint'}</button>
        </div>

        <div className={cardCls + ' !p-0 overflow-hidden'}>
          <div className="px-4 py-2.5 bg-[#111] border-b border-[#2a2a2a] flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-2 text-xs text-[#555]">solution.js</span>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} className="w-full h-[280px] bg-[#0f0f0f] text-green-400 font-mono text-sm p-4 outline-none resize-none" placeholder="// Write your solution here..." />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleCodeSubmit} className={btnPrimary + ' flex items-center gap-1.5'}><i className="ri-play-line"></i>Run & Test</button>
          <button onClick={() => setCode(challenge.boilerplate)} className={btnSecondary}>Reset Code</button>
          {unlockedGames.includes(activeGame) && <button onClick={() => { setPhase('game'); const inits = { dijkstra: initDijkstra, sorting: initSorting, bfs: initMaze, binary_search: initBinarySearch, stack: initStack, recursion: initHanoi, greedy: initCoin, linkedlist: initLinkedList, hash: initHash, dp: initKnapsack, tree: initBST, graph_coloring: initGraphColoring }; inits[activeGame]?.(); }} className={btnPrimary + ' !bg-green-500 hover:!bg-green-600 flex items-center gap-1.5'}><i className="ri-gamepad-line"></i>Play Game</button>}
        </div>

        {codeOutput && (
          <div className={`${cardCls} !p-4`}>
            <p className="text-xs font-semibold text-[#888] mb-2"><i className="ri-terminal-line mr-1"></i>Output</p>
            <pre className={`text-sm font-mono whitespace-pre-wrap ${codeOutput.startsWith('✓') ? 'text-green-400' : codeOutput.startsWith('✗') ? 'text-red-400' : 'text-[#aaa]'}`}>{codeOutput}</pre>
          </div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════════════════════
  //               GAME RENDERERS
  // ════════════════════════════════════════════════════
  const renderGame = () => {
    if (activeGame === 'dijkstra' && djGraph) return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Shortest Path Explorer</h2><p className="text-xs text-[#666] mt-1">Click nodes A→F to build the shortest path</p></div><div className="flex items-center gap-3"><span className="text-xs text-[#888]">Cost: <b className="text-[#d4a574]">{djCost}</b></span><span className="text-xs text-[#888]">Optimal: <b className="text-green-400">{djOptimal}</b></span></div></div><svg viewBox="0 0 500 300" className="w-full bg-[#111] rounded-xl border border-[#2a2a2a]">{djGraph.edges.map((e, i) => { const n1 = djGraph.nodes[e.from], n2 = djGraph.nodes[e.to]; const inPath = djPath.includes(e.from) && djPath.includes(e.to) && Math.abs(djPath.indexOf(e.from) - djPath.indexOf(e.to)) === 1; return (<g key={i}><line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={inPath ? '#d4a574' : '#333'} strokeWidth={inPath ? 3 : 1.5} /><text x={(n1.x + n2.x) / 2} y={(n1.y + n2.y) / 2 - 8} textAnchor="middle" fill="#888" fontSize="11" fontWeight="bold">{e.w}</text></g>); })}{djGraph.nodes.map(n => (<g key={n.id} onClick={() => djClickNode(n.id)} className="cursor-pointer"><circle cx={n.x} cy={n.y} r={22} fill={djPath.includes(n.id) ? '#d4a574' : n.id === djTarget ? '#22c55e' : '#222'} stroke={n.id === 0 ? '#d4a574' : '#444'} strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill={djPath.includes(n.id) ? '#1a1a1a' : '#e8e8e8'} fontSize="14" fontWeight="bold">{n.label}</text></g>))}</svg><div className="flex gap-3 mt-4"><button onClick={initDijkstra} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Graph</button><button onClick={() => { setDjPath([0]); setDjCost(0); setDjWon(false); }} className={btnSecondary}>Reset Path</button></div></div>);
    if (activeGame === 'sorting') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Sort Visualizer</h2><p className="text-xs text-[#666] mt-1">Click two bars to swap. Sort ascending!</p></div><span className="text-xs text-[#888]">Swaps: <b className="text-[#d4a574]">{sortSwaps}</b></span></div><div className="flex items-end justify-center gap-2 h-48 bg-[#111] rounded-xl border border-[#2a2a2a] p-4">{sortArr.map((val, i) => (<div key={i} onClick={() => sortClickItem(i)} className={`flex-1 rounded-t-lg cursor-pointer transition-all duration-200 flex items-end justify-center pb-1 text-xs font-bold ${sortSelected === i ? 'bg-[#d4a574] text-[#1a1a1a]' : sortSolved ? 'bg-green-500 text-white' : 'bg-[#333] text-[#aaa] hover:bg-[#444]'}`} style={{ height: `${(val / 55) * 100}%` }}>{val}</div>))}</div><div className="flex gap-3 mt-4"><button onClick={initSorting} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Array</button></div></div>);
    if (activeGame === 'bfs') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Maze Runner (BFS)</h2><p className="text-xs text-[#666] mt-1">Use arrow keys to navigate. Reach the green cell!</p></div><span className="text-xs text-[#888]">Moves: <b className="text-[#d4a574]">{mazeMoves}</b></span></div><div className="flex justify-center"><div className="inline-grid gap-0.5 bg-[#111] rounded-xl border border-[#2a2a2a] p-3" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 8}, 1fr)` }}>{maze.map((row, r) => row.map((cell, c) => { const isP = mazePos.r === r && mazePos.c === c, isE = mazeEnd.r === r && mazeEnd.c === c, isV = mazeVisited.has(`${r},${c}`); return (<div key={`${r}-${c}`} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${cell === 1 ? 'bg-[#333]' : isP ? 'bg-[#d4a574] text-[#1a1a1a]' : isE ? 'bg-green-500' : isV ? 'bg-[#d4a574]/20' : 'bg-[#1a1a1a]'}`}>{isP && <i className="ri-user-fill"></i>}{isE && !isP && <i className="ri-flag-fill text-white"></i>}</div>); }))}</div></div><div className="flex justify-center mt-4 sm:hidden"><div className="grid grid-cols-3 gap-1"><div></div><button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-up-line"></i></button><div></div><button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-left-line"></i></button><button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-down-line"></i></button><button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-right-line"></i></button></div></div><div className="flex gap-3 mt-4"><button onClick={initMaze} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Maze</button></div></div>);
    if (activeGame === 'binary_search') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Number Hunter</h2><p className="text-xs text-[#666] mt-1">Use Binary Search logic!</p></div><span className="text-xs text-[#888]">Attempts: <b className="text-[#d4a574]">{bsAttempts}</b></span></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4 text-center"><p className="text-sm text-[#888] mb-3">{bsHint}</p><div className="flex items-center gap-2 justify-center mb-4"><span className="text-xs text-[#555] bg-[#222] px-2 py-1 rounded">{bsLow}</span><div className="flex-1 h-2 bg-[#222] rounded-full max-w-xs relative"><div className="absolute h-full bg-[#d4a574] rounded-full transition-all" style={{ left: `${((bsLow - 1) / 99) * 100}%`, width: `${((bsHigh - bsLow) / 99) * 100}%` }}></div></div><span className="text-xs text-[#555] bg-[#222] px-2 py-1 rounded">{bsHigh}</span></div>{!bsWon && (<div className="flex gap-2 justify-center"><input type="number" value={bsGuess} onChange={e => setBsGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitBsGuess()} placeholder="Your guess..." className="w-32 px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] text-center text-sm outline-none focus:border-[#d4a574]" /><button onClick={submitBsGuess} className={btnPrimary}>Guess</button></div>)}{bsHistory.length > 0 && (<div className="flex flex-wrap gap-1.5 justify-center mt-3">{bsHistory.map((h, i) => (<span key={i} className={`text-xs px-2 py-1 rounded-lg ${h.dir === 'correct' ? 'bg-green-500/20 text-green-400' : h.dir === 'higher' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>{h.guess} {h.dir === 'correct' ? '✓' : h.dir === 'higher' ? '↑' : '↓'}</span>))}</div>)}</div><div className="flex gap-3 mt-4"><button onClick={initBinarySearch} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Number</button></div></div>);
    if (activeGame === 'stack') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Stack Overflow</h2><p className="text-xs text-[#666] mt-1">Build the sequence — Level {stackLevel}</p></div><span className="text-xs text-[#888]">Score: <b className="text-[#d4a574]">{stackScore}</b></span></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4"><p className="text-center font-mono text-lg text-[#d4a574] mb-4 tracking-wider">{stackSequence}</p><div className="flex items-end justify-center gap-1 h-32 mb-4">{stackItems.length === 0 ? <p className="text-[#555] text-xs">Stack is empty</p> : stackItems.map((item, i) => (<div key={i} className="w-8 h-8 bg-[#d4a574]/20 border border-[#d4a574] rounded flex items-center justify-center text-[#d4a574] font-mono text-sm font-bold">{item}</div>))}</div><div className="flex flex-wrap gap-2 justify-center">{['(', ')', '[', ']', '{', '}'].map(b => (<button key={b} onClick={() => pushBracket(b)} className="w-10 h-10 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] font-mono font-bold text-lg hover:bg-[#2a2a2a] hover:border-[#555] transition-colors">{b}</button>))}<button onClick={popBracket} className="px-3 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">Pop</button><button onClick={() => setStackItems([])} className={btnSecondary + ' h-10'}>Clear</button></div></div></div>);
    if (activeGame === 'recursion') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Tower of Hanoi</h2><p className="text-xs text-[#666] mt-1">Move all discs to Peg C</p></div><div className="flex items-center gap-3"><span className="text-xs text-[#888]">Moves: <b className="text-[#d4a574]">{hanoiMoves}</b></span><span className="text-xs text-[#888]">Min: <b className="text-green-400">{Math.pow(2, hanoiDiscs) - 1}</b></span></div></div><div className="flex gap-4 justify-center bg-[#111] rounded-xl border border-[#2a2a2a] p-4">{hanoiPegs.map((peg, pegIdx) => (<div key={pegIdx} onClick={() => hanoiClickPeg(pegIdx)} className={`flex-1 flex flex-col items-center justify-end cursor-pointer min-h-[160px] rounded-xl p-2 transition-colors ${hanoiSelected === pegIdx ? 'bg-[#d4a574]/10 border border-[#d4a574]/30' : 'hover:bg-[#1a1a1a]'}`}><div className="w-1 bg-[#444] flex-1 rounded-full mb-1"></div>{peg.map((disc, i) => { const w = 30 + disc * 20, colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6']; return (<div key={i} className="rounded-md mb-0.5" style={{ width: `${w}px`, height: '18px', backgroundColor: colors[disc - 1] || '#d4a574' }}></div>); })}<p className="text-xs text-[#555] mt-1 font-medium">Peg {['A', 'B', 'C'][pegIdx]}</p></div>))}</div><div className="flex gap-3 mt-4"><button onClick={initHanoi} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>Reset</button><select value={hanoiDiscs} onChange={e => setHanoiDiscs(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#aaa] text-sm outline-none"><option value={3}>3 Discs</option><option value={4}>4 Discs</option><option value={5}>5 Discs</option></select></div></div>);
    if (activeGame === 'greedy') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Coin Change</h2><p className="text-xs text-[#666] mt-1">Make exactly <b className="text-[#d4a574]">{coinTarget}</b> with fewest coins!</p></div><div className="flex items-center gap-2"><span className="text-xs text-[#888]">Current: <b className="text-[#d4a574]">{coinSelected.reduce((a, b) => a + b, 0)}</b></span><span className="text-xs text-[#888]">Coins: <b className="text-[#d4a574]">{coinSelected.length}</b></span></div></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4"><div className="flex gap-3 justify-center mb-4">{coinDenoms.map(d => (<button key={d} onClick={() => addCoin(d)} className="w-14 h-14 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 text-yellow-900 font-bold text-sm shadow-lg hover:scale-110 transition-transform active:scale-95">{d}¢</button>))}</div><div className="flex flex-wrap gap-1 justify-center min-h-[40px]">{coinSelected.map((c, i) => (<span key={i} className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs flex items-center justify-center font-bold">{c}</span>))}</div></div><div className="flex gap-3 mt-4"><button onClick={() => setCoinSelected([])} className={btnSecondary}>Clear</button><button onClick={initCoin} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div></div>);
    if (activeGame === 'linkedlist') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Chain Builder</h2><p className="text-xs text-[#666] mt-1">Build: [{llTarget.join(' → ')}]</p></div></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4"><div className="flex items-center gap-1 min-h-[60px] overflow-x-auto pb-2 justify-center">{llNodes.length === 0 ? <p className="text-[#555] text-xs">Empty — start inserting!</p> : llNodes.map((val, i) => (<div key={i} className="flex items-center"><div onClick={() => llDelete(i)} className="w-12 h-12 rounded-lg bg-[#d4a574]/20 border border-[#d4a574] flex items-center justify-center text-[#d4a574] font-bold cursor-pointer hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 transition-colors group" title="Click to delete"><span className="group-hover:hidden">{val}</span><i className="ri-delete-bin-line hidden group-hover:block text-sm"></i></div>{i < llNodes.length - 1 && <i className="ri-arrow-right-line text-[#555] mx-1"></i>}</div>))}</div>{!llWon && (<div className="flex gap-2 justify-center mt-3"><input type="number" value={llInput} onChange={e => setLlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && llInsert()} placeholder="Value..." className="w-24 px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] text-center text-sm outline-none focus:border-[#d4a574]" /><button onClick={llInsert} className={btnPrimary}>Insert</button></div>)}</div><div className="flex gap-3 mt-4"><button onClick={initLinkedList} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div></div>);
    if (activeGame === 'hash') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Hash Table Quest</h2><p className="text-xs text-[#666] mt-1">Place key in correct bucket: key % {hashSize}</p></div><span className="text-xs text-[#888]">Score: <b className="text-[#d4a574]">{hashScore}/{hashKeys.length}</b></span></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">{hashCurrent < hashKeys.length && (<div className="text-center mb-4"><span className="text-xs text-[#888]">Place this key:</span><p className="text-2xl font-bold text-[#d4a574]">{hashKeys[hashCurrent]}</p><p className="text-xs text-[#555]">{hashKeys[hashCurrent]} % {hashSize} = {hashKeys[hashCurrent] % hashSize}</p></div>)}<div className="grid grid-cols-7 gap-2">{hashBuckets.map((bucket, i) => (<div key={i} onClick={() => hashPlace(i)} className="cursor-pointer rounded-xl bg-[#1a1a1a] border border-[#333] p-2 min-h-[80px] hover:border-[#d4a574] transition-colors"><p className="text-[10px] text-[#555] text-center mb-1">[{i}]</p>{bucket.map((val, bi) => (<div key={bi} className="text-xs text-[#d4a574] text-center bg-[#d4a574]/10 rounded px-1 py-0.5 mb-0.5">{val}</div>))}</div>))}</div></div><div className="flex gap-3 mt-4"><button onClick={initHash} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div></div>);
    if (activeGame === 'dp') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Knapsack Packer</h2><p className="text-xs text-[#666] mt-1">Capacity: <b className="text-[#d4a574]">{knapsackCapacity} kg</b></p></div><div className="flex items-center gap-3"><span className="text-xs text-[#888]">Weight: <b className="text-[#d4a574]">{knapsackSelected.reduce((s, i) => s + knapsackItems[i].weight, 0)}/{knapsackCapacity}</b></span><span className="text-xs text-[#888]">Value: <b className="text-green-400">{knapsackSelected.reduce((s, i) => s + knapsackItems[i].value, 0)}</b></span></div></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#111] rounded-xl border border-[#2a2a2a] p-4">{knapsackItems.map((item, i) => (<div key={i} onClick={() => toggleKnapsackItem(i)} className={`rounded-xl p-3 cursor-pointer transition-all border ${knapsackSelected.includes(i) ? 'bg-[#d4a574]/20 border-[#d4a574]' : 'bg-[#1a1a1a] border-[#333] hover:border-[#555]'}`}><p className="text-sm font-semibold text-[#e8e8e8]">{item.name}</p><div className="flex justify-between mt-1 text-xs"><span className="text-[#888]">{item.weight}kg</span><span className="text-green-400">${item.value}</span></div></div>))}</div>{!knapsackWon && (<div className="flex gap-3 mt-4"><button onClick={submitKnapsack} className={btnPrimary} disabled={knapsackSelected.length === 0}>Submit</button><button onClick={() => setKnapsackSelected([])} className={btnSecondary}>Clear</button><button onClick={initKnapsack} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div>)}</div>);
    if (activeGame === 'tree') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">BST Explorer</h2><p className="text-xs text-[#666] mt-1">Insert: [{bstSequence.join(', ')}]</p></div><span className="text-xs text-[#888]">Inserted: <b className="text-[#d4a574]">{bstInserted}/{bstSequence.length}</b></span></div><div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4"><svg viewBox="0 0 400 250" className="w-full">{bstRoot ? renderBSTNode(bstRoot, 200, 25, 80) : <text x={200} y={125} textAnchor="middle" fill="#555" fontSize="14">Click Insert to start</text>}</svg></div><div className="flex gap-3 mt-4">{bstInserted < bstSequence.length && <button onClick={bstInsert} className={btnPrimary}>Insert <b>{bstSequence[bstInserted]}</b></button>}<button onClick={initBST} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Sequence</button></div></div>);
    if (activeGame === 'graph_coloring') return (<div className={cardCls}><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-[#e8e8e8]">Map Coloring</h2><p className="text-xs text-[#666] mt-1">Pick color, then click nodes</p></div><span className="text-xs text-[#888]">Colored: <b className="text-[#d4a574]">{Object.keys(gcColors).length}/{gcNodes.length}</b></span></div><div className="flex gap-2 mb-3 justify-center">{GC_PALETTE.map((color, i) => (<button key={i} onClick={() => setGcCurrentColor(i)} className={`w-8 h-8 rounded-full border-2 transition-transform ${gcCurrentColor === i ? 'scale-125 border-white' : 'border-[#333]'}`} style={{ backgroundColor: color }}></button>))}</div><svg viewBox="0 0 380 280" className="w-full bg-[#111] rounded-xl border border-[#2a2a2a]">{gcEdges.map(([a, b], i) => (<line key={i} x1={gcNodes[a].x} y1={gcNodes[a].y} x2={gcNodes[b].x} y2={gcNodes[b].y} stroke="#333" strokeWidth="2" />))}{gcNodes.map(n => (<g key={n.id} onClick={() => gcColorNode(n.id)} className="cursor-pointer"><circle cx={n.x} cy={n.y} r={24} fill={gcColors[n.id] !== undefined ? GC_PALETTE[gcColors[n.id]] : '#222'} stroke={gcColors[n.id] !== undefined ? '#fff' : '#444'} strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{n.label}</text></g>))}</svg><div className="flex gap-3 mt-4"><button onClick={() => setGcColors({})} className={btnSecondary}>Reset Colors</button><button onClick={initGraphColoring} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Graph</button></div></div>);
  };

  // ════════════════════════════════════════════════════
  //                  MAIN RENDER
  // ════════════════════════════════════════════════════
  return (
    <DashboardLayout pageTitle="Learning Games" role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#e8e8e8]">Algorithm Games</h1>
            {phase === 'card' && <p className="text-sm text-[#666] mt-1">Solve the code challenge to unlock each game — {GAMES.length} challenges</p>}
          </div>
          {activeGame && <button onClick={goBack} className={btnSecondary + ' flex items-center gap-1.5'}><i className="ri-arrow-left-line"></i>All Games</button>}
        </div>

        {activeGame && phase === 'code' && renderCodeChallenge()}
        {activeGame && phase === 'game' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setPhase('code')} className={btnSecondary + ' text-xs flex items-center gap-1'}><i className="ri-code-s-slash-line"></i>View Code</button>
              <span className="text-xs text-green-400"><i className="ri-lock-unlock-line mr-1"></i>Unlocked</span>
            </div>
            {renderGame()}
          </div>
        )}

        {!activeGame && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map(g => {
              const unlocked = unlockedGames.includes(g.id);
              return (
                <div key={g.id} onClick={() => startGame(g.id)} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden hover:border-[#d4a574]/30 transition-all cursor-pointer group hover:shadow-lg hover:shadow-[#d4a574]/5 relative">
                  <div className={`h-1.5 bg-gradient-to-r ${g.color}`}></div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${g.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><i className={`${g.icon} text-white text-lg`}></i></div>
                      <div className="flex items-center gap-2">
                        {unlocked && <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400"><i className="ri-lock-unlock-line mr-0.5"></i>Unlocked</span>}
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${g.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : g.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{g.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#e8e8e8] mb-1">{g.title}</h3>
                    <p className="text-[11px] text-[#666] mb-2">{g.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><i className="ri-code-s-slash-line text-[#d4a574] text-xs"></i><span className="text-[10px] text-[#888] font-medium">{g.algorithm}</span></div>
                      {!unlocked && <span className="text-[10px] text-[#555]"><i className="ri-lock-line mr-0.5"></i>Solve to unlock</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LearningGames;
