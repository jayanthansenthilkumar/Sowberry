import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

// ════════════════════════════════════════════════════════════════
//  GAME DEFINITIONS — Each game is tied to an algorithm concept
// ════════════════════════════════════════════════════════════════
const GAMES = [
  { id: 'dijkstra', title: 'Shortest Path Explorer', description: 'Find the shortest path using Dijkstra\'s algorithm. Click nodes to build your route!', icon: 'ri-route-line', color: 'from-blue-500 to-cyan-500', algorithm: 'Dijkstra\'s Algorithm', difficulty: 'Medium' },
  { id: 'sorting', title: 'Sort Visualizer', description: 'Race against time! Manually sort the array using swap logic.', icon: 'ri-bar-chart-line', color: 'from-violet-500 to-purple-500', algorithm: 'Bubble Sort', difficulty: 'Easy' },
  { id: 'bfs', title: 'Maze Runner (BFS)', description: 'Navigate a maze using Breadth-First Search strategy. Find the exit!', icon: 'ri-layout-grid-line', color: 'from-green-500 to-emerald-500', algorithm: 'BFS Traversal', difficulty: 'Medium' },
  { id: 'binary_search', title: 'Number Hunter', description: 'Guess the hidden number using Binary Search logic in minimal tries.', icon: 'ri-search-line', color: 'from-amber-500 to-orange-500', algorithm: 'Binary Search', difficulty: 'Easy' },
  { id: 'stack', title: 'Stack Overflow', description: 'Manage a stack — push/pop brackets to match the valid sequence!', icon: 'ri-stack-line', color: 'from-red-500 to-rose-500', algorithm: 'Stack (LIFO)', difficulty: 'Easy' },
  { id: 'recursion', title: 'Tower of Hanoi', description: 'Move all discs from source to target using recursion rules.', icon: 'ri-building-4-line', color: 'from-teal-500 to-cyan-500', algorithm: 'Recursion', difficulty: 'Hard' },
  { id: 'greedy', title: 'Coin Change Challenge', description: 'Make exact change using fewest coins — a classic Greedy algorithm!', icon: 'ri-coin-line', color: 'from-yellow-500 to-amber-500', algorithm: 'Greedy Algorithm', difficulty: 'Easy' },
  { id: 'linkedlist', title: 'Chain Builder', description: 'Build and manipulate a linked list by inserting & deleting nodes.', icon: 'ri-links-line', color: 'from-indigo-500 to-blue-500', algorithm: 'Linked List', difficulty: 'Medium' },
  { id: 'hash', title: 'Hash Table Quest', description: 'Map keys to buckets and resolve collisions — learn hashing!', icon: 'ri-hashtag', color: 'from-pink-500 to-rose-500', algorithm: 'Hash Tables', difficulty: 'Medium' },
  { id: 'dp', title: 'Knapsack Packer', description: 'Pick items to maximize value without exceeding weight — Dynamic Programming!', icon: 'ri-briefcase-4-line', color: 'from-emerald-500 to-green-500', algorithm: 'Dynamic Programming', difficulty: 'Hard' },
  { id: 'tree', title: 'BST Explorer', description: 'Build a Binary Search Tree by inserting values. Watch it grow!', icon: 'ri-node-tree', color: 'from-orange-500 to-red-500', algorithm: 'Binary Search Tree', difficulty: 'Medium' },
  { id: 'graph_coloring', title: 'Map Coloring', description: 'Color a map so no adjacent regions share a color — Graph Coloring!', icon: 'ri-palette-line', color: 'from-fuchsia-500 to-pink-500', algorithm: 'Graph Coloring', difficulty: 'Hard' },
];

// ════════════════════════════════════════════════════════════════
//                          COMPONENT
// ════════════════════════════════════════════════════════════════
const LearningGames = () => {
  const [activeGame, setActiveGame] = useState(null);

  // ─────── DIJKSTRA GAME STATE ───────
  const [djGraph, setDjGraph] = useState(null);
  const [djPath, setDjPath] = useState([]);
  const [djCost, setDjCost] = useState(0);
  const [djTarget, setDjTarget] = useState(null);
  const [djWon, setDjWon] = useState(false);
  const [djOptimal, setDjOptimal] = useState(Infinity);

  // ─────── SORTING GAME STATE ───────
  const [sortArr, setSortArr] = useState([]);
  const [sortSwaps, setSortSwaps] = useState(0);
  const [sortSelected, setSortSelected] = useState(null);
  const [sortSolved, setSortSolved] = useState(false);

  // ─────── BFS MAZE STATE ───────
  const [maze, setMaze] = useState([]);
  const [mazePos, setMazePos] = useState({ r: 0, c: 0 });
  const [mazeEnd, setMazeEnd] = useState({ r: 0, c: 0 });
  const [mazeMoves, setMazeMoves] = useState(0);
  const [mazeWon, setMazeWon] = useState(false);
  const [mazeVisited, setMazeVisited] = useState(new Set());

  // ─────── BINARY SEARCH STATE ───────
  const [bsTarget, setBsTarget] = useState(0);
  const [bsLow, setBsLow] = useState(1);
  const [bsHigh, setBsHigh] = useState(100);
  const [bsGuess, setBsGuess] = useState('');
  const [bsAttempts, setBsAttempts] = useState(0);
  const [bsHint, setBsHint] = useState('');
  const [bsWon, setBsWon] = useState(false);
  const [bsHistory, setBsHistory] = useState([]);

  // ─────── STACK GAME STATE ───────
  const [stackItems, setStackItems] = useState([]);
  const [stackSequence, setStackSequence] = useState('');
  const [stackScore, setStackScore] = useState(0);
  const [stackLevel, setStackLevel] = useState(1);

  // ─────── TOWER OF HANOI STATE ───────
  const [hanoiPegs, setHanoiPegs] = useState([[], [], []]);
  const [hanoiMoves, setHanoiMoves] = useState(0);
  const [hanoiDiscs, setHanoiDiscs] = useState(3);
  const [hanoiSelected, setHanoiSelected] = useState(null);
  const [hanoiWon, setHanoiWon] = useState(false);

  // ─────── GREEDY COIN STATE ───────
  const [coinTarget, setCoinTarget] = useState(0);
  const [coinDenoms, setCoinDenoms] = useState([]);
  const [coinSelected, setCoinSelected] = useState([]);
  const [coinWon, setCoinWon] = useState(false);
  const [coinOptimal, setCoinOptimal] = useState(0);

  // ─────── LINKED LIST STATE ───────
  const [llNodes, setLlNodes] = useState([]);
  const [llInput, setLlInput] = useState('');
  const [llTarget, setLlTarget] = useState([]);
  const [llWon, setLlWon] = useState(false);

  // ─────── HASH TABLE STATE ───────
  const [hashBuckets, setHashBuckets] = useState([]);
  const [hashKeys, setHashKeys] = useState([]);
  const [hashCurrent, setHashCurrent] = useState(null);
  const [hashScore, setHashScore] = useState(0);
  const [hashSize, setHashSize] = useState(7);

  // ─────── DP KNAPSACK STATE ───────
  const [knapsackItems, setKnapsackItems] = useState([]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(0);
  const [knapsackSelected, setKnapsackSelected] = useState([]);
  const [knapsackWon, setKnapsackWon] = useState(false);
  const [knapsackOptimal, setKnapsackOptimal] = useState(0);

  // ─────── BST STATE ───────
  const [bstRoot, setBstRoot] = useState(null);
  const [bstSequence, setBstSequence] = useState([]);
  const [bstInserted, setBstInserted] = useState(0);

  // ─────── GRAPH COLORING STATE ───────
  const [gcNodes, setGcNodes] = useState([]);
  const [gcEdges, setGcEdges] = useState([]);
  const [gcColors, setGcColors] = useState({});
  const [gcCurrentColor, setGcCurrentColor] = useState(0);
  const [gcWon, setGcWon] = useState(false);
  const GC_PALETTE = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

  // ════════════════════════════════════════════════════
  //                   GAME INITIALIZERS
  // ════════════════════════════════════════════════════

  const initDijkstra = useCallback(() => {
    const nodes = [
      { id: 0, x: 50, y: 150, label: 'A' }, { id: 1, x: 180, y: 60, label: 'B' },
      { id: 2, x: 180, y: 240, label: 'C' }, { id: 3, x: 320, y: 60, label: 'D' },
      { id: 4, x: 320, y: 240, label: 'E' }, { id: 5, x: 450, y: 150, label: 'F' },
    ];
    const edges = [
      { from: 0, to: 1, w: 2 + Math.floor(Math.random() * 5) },
      { from: 0, to: 2, w: 4 + Math.floor(Math.random() * 4) },
      { from: 1, to: 3, w: 1 + Math.floor(Math.random() * 6) },
      { from: 1, to: 2, w: 3 + Math.floor(Math.random() * 3) },
      { from: 2, to: 4, w: 2 + Math.floor(Math.random() * 5) },
      { from: 3, to: 5, w: 3 + Math.floor(Math.random() * 4) },
      { from: 4, to: 5, w: 1 + Math.floor(Math.random() * 5) },
      { from: 3, to: 4, w: 2 + Math.floor(Math.random() * 3) },
    ];
    const dist = Array(6).fill(Infinity);
    dist[0] = 0;
    const visited = new Set();
    for (let i = 0; i < 6; i++) {
      let u = -1;
      for (let v = 0; v < 6; v++) {
        if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) u = v;
      }
      visited.add(u);
      for (const e of edges) {
        if (e.from === u && dist[u] + e.w < dist[e.to]) dist[e.to] = dist[u] + e.w;
        if (e.to === u && dist[u] + e.w < dist[e.from]) dist[e.from] = dist[u] + e.w;
      }
    }
    setDjGraph({ nodes, edges });
    setDjPath([0]); setDjCost(0); setDjTarget(5); setDjWon(false); setDjOptimal(dist[5]);
  }, []);

  const initSorting = useCallback(() => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 5);
    setSortArr(arr); setSortSwaps(0); setSortSelected(null); setSortSolved(false);
  }, []);

  const initMaze = useCallback(() => {
    const rows = 8, cols = 8;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const wallCount = Math.floor(rows * cols * 0.3);
    for (let i = 0; i < wallCount; i++) {
      const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
      if ((r === 0 && c === 0) || (r === rows - 1 && c === cols - 1)) continue;
      grid[r][c] = 1;
    }
    const bfs = (g) => {
      const q = [[0, 0]]; const vis = new Set(['0,0']);
      while (q.length) {
        const [cr, cc] = q.shift();
        if (cr === rows - 1 && cc === cols - 1) return true;
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !vis.has(`${nr},${nc}`) && g[nr][nc] === 0) {
            vis.add(`${nr},${nc}`); q.push([nr, nc]);
          }
        }
      }
      return false;
    };
    while (!bfs(grid)) { const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols); grid[r][c] = 0; }
    setMaze(grid); setMazePos({ r: 0, c: 0 }); setMazeEnd({ r: rows - 1, c: cols - 1 });
    setMazeMoves(0); setMazeWon(false); setMazeVisited(new Set(['0,0']));
  }, []);

  const initBinarySearch = useCallback(() => {
    setBsTarget(Math.floor(Math.random() * 100) + 1); setBsLow(1); setBsHigh(100);
    setBsGuess(''); setBsAttempts(0); setBsHint('Guess a number between 1 and 100');
    setBsWon(false); setBsHistory([]);
  }, []);

  const initStack = useCallback(() => {
    const brackets = ['()', '[]', '{}'];
    let seq = '';
    for (let i = 0; i < 3 + stackLevel; i++) {
      const b = brackets[Math.floor(Math.random() * brackets.length)];
      const pos = Math.floor(Math.random() * (seq.length + 1));
      seq = seq.slice(0, pos) + b + seq.slice(pos);
    }
    setStackSequence(seq); setStackItems([]);
  }, [stackLevel]);

  const initHanoi = useCallback(() => {
    const discs = Array.from({ length: hanoiDiscs }, (_, i) => hanoiDiscs - i);
    setHanoiPegs([discs, [], []]); setHanoiMoves(0); setHanoiSelected(null); setHanoiWon(false);
  }, [hanoiDiscs]);

  const initCoin = useCallback(() => {
    const denoms = [1, 2, 5, 10, 25];
    const target = Math.floor(Math.random() * 90) + 10;
    let rem = target, count = 0;
    const sorted = [...denoms].sort((a, b) => b - a);
    for (const d of sorted) { count += Math.floor(rem / d); rem %= d; }
    setCoinDenoms(denoms); setCoinTarget(target); setCoinSelected([]); setCoinWon(false); setCoinOptimal(count);
  }, []);

  const initLinkedList = useCallback(() => {
    const target = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setLlTarget(target); setLlNodes([]); setLlInput(''); setLlWon(false);
  }, []);

  const initHash = useCallback(() => {
    const size = 7;
    const keys = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
    setHashBuckets(Array.from({ length: size }, () => []));
    setHashKeys(keys); setHashCurrent(0); setHashScore(0); setHashSize(size);
  }, []);

  const initKnapsack = useCallback(() => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      name: ['Laptop', 'Phone', 'Book', 'Camera', 'Watch', 'Tablet'][i],
      weight: [3, 1, 2, 4, 1, 3][i] + Math.floor(Math.random() * 2),
      value: [10, 6, 4, 12, 3, 8][i] + Math.floor(Math.random() * 3)
    }));
    const cap = 8 + Math.floor(Math.random() * 3);
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= cap; w++) {
        dp[i][w] = dp[i - 1][w];
        if (items[i - 1].weight <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - items[i - 1].weight] + items[i - 1].value);
      }
    }
    setKnapsackItems(items); setKnapsackCapacity(cap); setKnapsackSelected([]);
    setKnapsackWon(false); setKnapsackOptimal(dp[n][cap]);
  }, []);

  const initBST = useCallback(() => {
    const seq = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 1);
    setBstSequence(seq); setBstRoot(null); setBstInserted(0);
  }, []);

  const initGraphColoring = useCallback(() => {
    const nodes = [
      { id: 0, x: 120, y: 40, label: 'A' }, { id: 1, x: 250, y: 40, label: 'B' },
      { id: 2, x: 50, y: 140, label: 'C' }, { id: 3, x: 185, y: 120, label: 'D' },
      { id: 4, x: 320, y: 140, label: 'E' }, { id: 5, x: 120, y: 230, label: 'F' },
      { id: 6, x: 250, y: 230, label: 'G' },
    ];
    const edges = [[0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [2, 5], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6]];
    setGcNodes(nodes); setGcEdges(edges); setGcColors({}); setGcCurrentColor(0); setGcWon(false);
  }, []);

  // ════════════════════════════════════════════════════
  //                   GAME HANDLERS
  // ════════════════════════════════════════════════════

  const djClickNode = (nodeId) => {
    if (djWon || djPath.includes(nodeId)) return;
    const lastNode = djPath[djPath.length - 1];
    const edge = djGraph.edges.find(e => (e.from === lastNode && e.to === nodeId) || (e.to === lastNode && e.from === nodeId));
    if (!edge) return;
    const newPath = [...djPath, nodeId];
    const newCost = djCost + edge.w;
    setDjPath(newPath); setDjCost(newCost);
    if (nodeId === djTarget) {
      setDjWon(true);
      Swal.fire({ icon: newCost === djOptimal ? 'success' : 'info', title: newCost === djOptimal ? 'Optimal Path!' : 'Path Found!', text: `Cost: ${newCost} (Optimal: ${djOptimal})`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
    }
  };

  const sortClickItem = (idx) => {
    if (sortSolved) return;
    if (sortSelected === null) { setSortSelected(idx); } else {
      const newArr = [...sortArr];
      [newArr[sortSelected], newArr[idx]] = [newArr[idx], newArr[sortSelected]];
      setSortArr(newArr); setSortSwaps(s => s + 1); setSortSelected(null);
      if (newArr.every((v, i) => i === 0 || newArr[i - 1] <= v)) {
        setSortSolved(true);
        Swal.fire({ icon: 'success', title: 'Sorted!', text: `Done in ${sortSwaps + 1} swaps!`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
      }
    }
  };

  useEffect(() => {
    if (activeGame !== 'bfs' || mazeWon) return;
    const handler = (e) => {
      const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      setMazePos(prev => {
        const nr = prev.r + d[0], nc = prev.c + d[1];
        if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length || maze[nr][nc] === 1) return prev;
        setMazeMoves(m => m + 1);
        setMazeVisited(v => new Set([...v, `${nr},${nc}`]));
        if (nr === mazeEnd.r && nc === mazeEnd.c) {
          setMazeWon(true);
          Swal.fire({ icon: 'success', title: 'Maze Solved!', text: `Completed in ${mazeMoves + 1} moves!`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
        }
        return { r: nr, c: nc };
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeGame, maze, mazeWon, mazeEnd, mazeMoves]);

  const submitBsGuess = () => {
    const num = parseInt(bsGuess);
    if (isNaN(num) || num < 1 || num > 100) return;
    const newAttempts = bsAttempts + 1;
    setBsAttempts(newAttempts);
    setBsHistory(h => [...h, { guess: num, dir: num === bsTarget ? 'correct' : num < bsTarget ? 'higher' : 'lower' }]);
    if (num === bsTarget) {
      setBsWon(true);
      Swal.fire({ icon: newAttempts <= 7 ? 'success' : 'info', title: 'Found it!', text: `Found in ${newAttempts} attempts (optimal: 7)`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
    } else if (num < bsTarget) {
      setBsHint(`${num} is too LOW — try higher!`); setBsLow(Math.max(bsLow, num + 1));
    } else {
      setBsHint(`${num} is too HIGH — try lower!`); setBsHigh(Math.min(bsHigh, num - 1));
    }
    setBsGuess('');
  };

  const pushBracket = (bracket) => {
    const newStack = [...stackItems, bracket];
    setStackItems(newStack);
    if (newStack.join('') === stackSequence) {
      setStackScore(s => s + 1); setStackLevel(l => l + 1);
      Swal.fire({ icon: 'success', title: 'Matched!', text: `Level ${stackLevel} complete!`, timer: 1200, showConfirmButton: false, background: '#0f0f0f', color: '#e8e8e8' });
      setTimeout(() => initStack(), 1300);
    }
  };
  const popBracket = () => { if (stackItems.length > 0) setStackItems(stackItems.slice(0, -1)); };

  const hanoiClickPeg = (pegIdx) => {
    if (hanoiWon) return;
    if (hanoiSelected === null) { if (hanoiPegs[pegIdx].length === 0) return; setHanoiSelected(pegIdx); } else {
      if (pegIdx === hanoiSelected) { setHanoiSelected(null); return; }
      const from = hanoiPegs[hanoiSelected], to = hanoiPegs[pegIdx], disc = from[from.length - 1];
      if (to.length > 0 && to[to.length - 1] < disc) {
        Swal.fire({ icon: 'warning', title: 'Invalid Move', text: 'Can\'t place larger disc on smaller one!', timer: 1200, showConfirmButton: false, background: '#0f0f0f', color: '#e8e8e8' });
        setHanoiSelected(null); return;
      }
      const newPegs = hanoiPegs.map(p => [...p]); newPegs[hanoiSelected].pop(); newPegs[pegIdx].push(disc);
      setHanoiPegs(newPegs); setHanoiMoves(m => m + 1); setHanoiSelected(null);
      if (pegIdx === 2 && newPegs[2].length === hanoiDiscs) {
        setHanoiWon(true);
        Swal.fire({ icon: 'success', title: 'Tower Complete!', text: `Done in ${hanoiMoves + 1} moves (optimal: ${Math.pow(2, hanoiDiscs) - 1})`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
      }
    }
  };

  const addCoin = (denom) => {
    if (coinWon) return;
    const newSelected = [...coinSelected, denom];
    const total = newSelected.reduce((a, b) => a + b, 0);
    setCoinSelected(newSelected);
    if (total === coinTarget) {
      setCoinWon(true);
      Swal.fire({ icon: newSelected.length <= coinOptimal ? 'success' : 'info', title: newSelected.length <= coinOptimal ? 'Optimal!' : 'Got it!', text: `Used ${newSelected.length} coins (optimal: ${coinOptimal})`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
    } else if (total > coinTarget) {
      Swal.fire({ icon: 'error', title: 'Over!', text: `Total ${total} exceeds target ${coinTarget}`, timer: 1200, showConfirmButton: false, background: '#0f0f0f', color: '#e8e8e8' });
      setCoinSelected([]);
    }
  };

  const llInsert = () => {
    const val = parseInt(llInput); if (isNaN(val)) return;
    const newNodes = [...llNodes, val]; setLlNodes(newNodes); setLlInput('');
    if (newNodes.length === llTarget.length && newNodes.every((v, i) => v === llTarget[i])) {
      setLlWon(true);
      Swal.fire({ icon: 'success', title: 'Chain Complete!', text: 'Linked list matches the target!', background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
    }
  };
  const llDelete = (idx) => { setLlNodes(llNodes.filter((_, i) => i !== idx)); };

  const hashPlace = (bucketIdx) => {
    if (hashCurrent >= hashKeys.length) return;
    const key = hashKeys[hashCurrent]; const correctBucket = key % hashSize;
    const newBuckets = hashBuckets.map(b => [...b]); newBuckets[bucketIdx].push(key);
    setHashBuckets(newBuckets);
    if (bucketIdx === correctBucket) setHashScore(s => s + 1);
    if (hashCurrent + 1 >= hashKeys.length)
      Swal.fire({ icon: 'success', title: 'Complete!', text: `Score: ${hashScore + (bucketIdx === correctBucket ? 1 : 0)}/${hashKeys.length}`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
    setHashCurrent(c => c + 1);
  };

  const toggleKnapsackItem = (idx) => {
    if (knapsackWon) return;
    const newSelected = knapsackSelected.includes(idx) ? knapsackSelected.filter(i => i !== idx) : [...knapsackSelected, idx];
    const totalWeight = newSelected.reduce((sum, i) => sum + knapsackItems[i].weight, 0);
    if (totalWeight > knapsackCapacity) {
      Swal.fire({ icon: 'warning', title: 'Too Heavy!', text: 'Exceeds capacity!', timer: 1000, showConfirmButton: false, background: '#0f0f0f', color: '#e8e8e8' }); return;
    }
    setKnapsackSelected(newSelected);
  };
  const submitKnapsack = () => {
    const totalValue = knapsackSelected.reduce((sum, i) => sum + knapsackItems[i].value, 0);
    setKnapsackWon(true);
    Swal.fire({ icon: totalValue === knapsackOptimal ? 'success' : 'info', title: totalValue === knapsackOptimal ? 'Optimal!' : 'Good try!', text: `Value: ${totalValue} (Optimal: ${knapsackOptimal})`, background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
  };

  const bstInsertNode = (root, val) => {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) return { ...root, left: bstInsertNode(root.left, val) };
    return { ...root, right: bstInsertNode(root.right, val) };
  };
  const bstInsert = () => {
    if (bstInserted >= bstSequence.length) return;
    setBstRoot(prev => bstInsertNode(prev, bstSequence[bstInserted]));
    setBstInserted(i => i + 1);
    if (bstInserted + 1 >= bstSequence.length)
      Swal.fire({ icon: 'success', title: 'BST Complete!', text: 'All values inserted!', background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' });
  };

  const renderBSTNode = (node, x, y, spread) => {
    if (!node) return null;
    return (
      <g key={`${x}-${y}-${node.val}`}>
        {node.left && <line x1={x} y1={y} x2={x - spread} y2={y + 50} stroke="#555" strokeWidth="2" />}
        {node.right && <line x1={x} y1={y} x2={x + spread} y2={y + 50} stroke="#555" strokeWidth="2" />}
        <circle cx={x} cy={y} r={18} fill="#d4a574" stroke="#222" strokeWidth="2" />
        <text x={x} y={y + 5} textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">{node.val}</text>
        {node.left && renderBSTNode(node.left, x - spread, y + 50, spread / 2)}
        {node.right && renderBSTNode(node.right, x + spread, y + 50, spread / 2)}
      </g>
    );
  };

  const gcColorNode = (nodeId) => {
    if (gcWon) return;
    const newColors = { ...gcColors, [nodeId]: gcCurrentColor };
    setGcColors(newColors);
    if (Object.keys(newColors).length === gcNodes.length) {
      const valid = gcEdges.every(([a, b]) => newColors[a] !== newColors[b]);
      if (valid) { setGcWon(true); Swal.fire({ icon: 'success', title: 'Map Colored!', text: 'No adjacent nodes share a color!', background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' }); }
      else { Swal.fire({ icon: 'error', title: 'Invalid!', text: 'Adjacent nodes have same color. Try again!', background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' }); setGcColors({}); }
    }
  };

  // ════════════════════════════════════════════════════
  //                    GAME STARTER
  // ════════════════════════════════════════════════════
  const startGame = (id) => {
    setActiveGame(id);
    const inits = { dijkstra: initDijkstra, sorting: initSorting, bfs: initMaze, binary_search: initBinarySearch, stack: initStack, recursion: initHanoi, greedy: initCoin, linkedlist: initLinkedList, hash: initHash, dp: initKnapsack, tree: initBST, graph_coloring: initGraphColoring };
    inits[id]?.();
  };

  // ════════════════════════════════════════════════════
  //                 COMMON STYLES
  // ════════════════════════════════════════════════════
  const cardCls = 'bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]';
  const btnPrimary = 'px-4 py-2.5 rounded-xl bg-[#d4a574] text-[#1a1a1a] font-semibold text-sm hover:bg-[#c4956a] transition-colors';
  const btnSecondary = 'px-4 py-2.5 rounded-xl bg-[#222] border border-[#333] text-[#aaa] font-medium text-sm hover:bg-[#2a2a2a] hover:border-[#555] transition-colors';

  // ════════════════════════════════════════════════════
  //                    GAME RENDERERS
  // ════════════════════════════════════════════════════
  const renderGame = () => {
    if (activeGame === 'dijkstra' && djGraph) return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Shortest Path Explorer</h2><p className="text-xs text-[#666] mt-1">Click nodes A→F to build the shortest path</p></div>
          <div className="flex items-center gap-3"><span className="text-xs text-[#888]">Cost: <b className="text-[#d4a574]">{djCost}</b></span><span className="text-xs text-[#888]">Optimal: <b className="text-green-400">{djOptimal}</b></span></div>
        </div>
        <svg viewBox="0 0 500 300" className="w-full bg-[#111] rounded-xl border border-[#2a2a2a]">
          {djGraph.edges.map((e, i) => { const n1 = djGraph.nodes[e.from], n2 = djGraph.nodes[e.to]; const inPath = djPath.includes(e.from) && djPath.includes(e.to) && Math.abs(djPath.indexOf(e.from) - djPath.indexOf(e.to)) === 1; return (<g key={i}><line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={inPath ? '#d4a574' : '#333'} strokeWidth={inPath ? 3 : 1.5} /><text x={(n1.x + n2.x) / 2} y={(n1.y + n2.y) / 2 - 8} textAnchor="middle" fill="#888" fontSize="11" fontWeight="bold">{e.w}</text></g>); })}
          {djGraph.nodes.map(n => (<g key={n.id} onClick={() => djClickNode(n.id)} className="cursor-pointer"><circle cx={n.x} cy={n.y} r={22} fill={djPath.includes(n.id) ? '#d4a574' : n.id === djTarget ? '#22c55e' : '#222'} stroke={n.id === 0 ? '#d4a574' : '#444'} strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill={djPath.includes(n.id) ? '#1a1a1a' : '#e8e8e8'} fontSize="14" fontWeight="bold">{n.label}</text></g>))}
        </svg>
        <div className="flex gap-3 mt-4">
          <button onClick={initDijkstra} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Graph</button>
          <button onClick={() => { setDjPath([0]); setDjCost(0); setDjWon(false); }} className={btnSecondary}>Reset Path</button>
        </div>
      </div>
    );

    if (activeGame === 'sorting') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Sort Visualizer</h2><p className="text-xs text-[#666] mt-1">Click two bars to swap them. Sort ascending!</p></div>
          <span className="text-xs text-[#888]">Swaps: <b className="text-[#d4a574]">{sortSwaps}</b></span>
        </div>
        <div className="flex items-end justify-center gap-2 h-48 bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          {sortArr.map((val, i) => (<div key={i} onClick={() => sortClickItem(i)} className={`flex-1 rounded-t-lg cursor-pointer transition-all duration-200 flex items-end justify-center pb-1 text-xs font-bold ${sortSelected === i ? 'bg-[#d4a574] text-[#1a1a1a]' : sortSolved ? 'bg-green-500 text-white' : 'bg-[#333] text-[#aaa] hover:bg-[#444]'}`} style={{ height: `${(val / 55) * 100}%` }}>{val}</div>))}
        </div>
        <div className="flex gap-3 mt-4"><button onClick={initSorting} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Array</button></div>
      </div>
    );

    if (activeGame === 'bfs') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Maze Runner (BFS)</h2><p className="text-xs text-[#666] mt-1">Use arrow keys to navigate. Reach the green cell!</p></div>
          <span className="text-xs text-[#888]">Moves: <b className="text-[#d4a574]">{mazeMoves}</b></span>
        </div>
        <div className="flex justify-center">
          <div className="inline-grid gap-0.5 bg-[#111] rounded-xl border border-[#2a2a2a] p-3" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 8}, 1fr)` }}>
            {maze.map((row, r) => row.map((cell, c) => { const isP = mazePos.r === r && mazePos.c === c, isE = mazeEnd.r === r && mazeEnd.c === c, isV = mazeVisited.has(`${r},${c}`); return (<div key={`${r}-${c}`} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${cell === 1 ? 'bg-[#333]' : isP ? 'bg-[#d4a574] text-[#1a1a1a]' : isE ? 'bg-green-500' : isV ? 'bg-[#d4a574]/20' : 'bg-[#1a1a1a]'}`}>{isP && <i className="ri-user-fill"></i>}{isE && !isP && <i className="ri-flag-fill text-white"></i>}</div>); }))}
          </div>
        </div>
        {mazeWon && <p className="text-center text-green-400 font-semibold mt-3 text-sm">Maze solved!</p>}
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="grid grid-cols-3 gap-1">
            <div></div><button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-up-line"></i></button><div></div>
            <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-left-line"></i></button>
            <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-down-line"></i></button>
            <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))} className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#aaa]"><i className="ri-arrow-right-line"></i></button>
          </div>
        </div>
        <div className="flex gap-3 mt-4"><button onClick={initMaze} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Maze</button></div>
      </div>
    );

    if (activeGame === 'binary_search') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Number Hunter</h2><p className="text-xs text-[#666] mt-1">Use Binary Search: guess the midpoint each time!</p></div>
          <span className="text-xs text-[#888]">Attempts: <b className="text-[#d4a574]">{bsAttempts}</b></span>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4 text-center">
          <p className="text-sm text-[#888] mb-3">{bsHint}</p>
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="text-xs text-[#555] bg-[#222] px-2 py-1 rounded">{bsLow}</span>
            <div className="flex-1 h-2 bg-[#222] rounded-full max-w-xs relative"><div className="absolute h-full bg-[#d4a574] rounded-full transition-all" style={{ left: `${((bsLow - 1) / 99) * 100}%`, width: `${((bsHigh - bsLow) / 99) * 100}%` }}></div></div>
            <span className="text-xs text-[#555] bg-[#222] px-2 py-1 rounded">{bsHigh}</span>
          </div>
          {!bsWon && (<div className="flex gap-2 justify-center"><input type="number" value={bsGuess} onChange={e => setBsGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitBsGuess()} placeholder="Your guess..." className="w-32 px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] text-center text-sm outline-none focus:border-[#d4a574]" /><button onClick={submitBsGuess} className={btnPrimary}>Guess</button></div>)}
          {bsHistory.length > 0 && (<div className="flex flex-wrap gap-1.5 justify-center mt-3">{bsHistory.map((h, i) => (<span key={i} className={`text-xs px-2 py-1 rounded-lg ${h.dir === 'correct' ? 'bg-green-500/20 text-green-400' : h.dir === 'higher' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>{h.guess} {h.dir === 'correct' ? '\u2713' : h.dir === 'higher' ? '\u2191' : '\u2193'}</span>))}</div>)}
        </div>
        <div className="flex gap-3 mt-4"><button onClick={initBinarySearch} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Number</button></div>
      </div>
    );

    if (activeGame === 'stack') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Stack Overflow</h2><p className="text-xs text-[#666] mt-1">Build the bracket sequence using push/pop — Level {stackLevel}</p></div>
          <span className="text-xs text-[#888]">Score: <b className="text-[#d4a574]">{stackScore}</b></span>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          <p className="text-center font-mono text-lg text-[#d4a574] mb-4 tracking-wider">{stackSequence}</p>
          <div className="flex items-end justify-center gap-1 h-32 mb-4">
            {stackItems.length === 0 ? <p className="text-[#555] text-xs">Stack is empty</p> : stackItems.map((item, i) => (<div key={i} className="w-8 h-8 bg-[#d4a574]/20 border border-[#d4a574] rounded flex items-center justify-center text-[#d4a574] font-mono text-sm font-bold">{item}</div>))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['(', ')', '[', ']', '{', '}'].map(b => (<button key={b} onClick={() => pushBracket(b)} className="w-10 h-10 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] font-mono font-bold text-lg hover:bg-[#2a2a2a] hover:border-[#555] transition-colors">{b}</button>))}
            <button onClick={popBracket} className="px-3 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">Pop</button>
            <button onClick={() => setStackItems([])} className={btnSecondary + ' h-10'}>Clear</button>
          </div>
        </div>
      </div>
    );

    if (activeGame === 'recursion') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Tower of Hanoi</h2><p className="text-xs text-[#666] mt-1">Move all discs to Peg C. Click source peg, then destination.</p></div>
          <div className="flex items-center gap-3"><span className="text-xs text-[#888]">Moves: <b className="text-[#d4a574]">{hanoiMoves}</b></span><span className="text-xs text-[#888]">Min: <b className="text-green-400">{Math.pow(2, hanoiDiscs) - 1}</b></span></div>
        </div>
        <div className="flex gap-4 justify-center bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          {hanoiPegs.map((peg, pegIdx) => (
            <div key={pegIdx} onClick={() => hanoiClickPeg(pegIdx)} className={`flex-1 flex flex-col items-center justify-end cursor-pointer min-h-[160px] rounded-xl p-2 transition-colors ${hanoiSelected === pegIdx ? 'bg-[#d4a574]/10 border border-[#d4a574]/30' : 'hover:bg-[#1a1a1a]'}`}>
              <div className="w-1 bg-[#444] flex-1 rounded-full mb-1"></div>
              {peg.map((disc, i) => { const w = 30 + disc * 20; const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6']; return (<div key={i} className="rounded-md mb-0.5" style={{ width: `${w}px`, height: '18px', backgroundColor: colors[disc - 1] || '#d4a574' }}></div>); })}
              <p className="text-xs text-[#555] mt-1 font-medium">Peg {['A', 'B', 'C'][pegIdx]}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={initHanoi} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>Reset</button>
          <select value={hanoiDiscs} onChange={e => setHanoiDiscs(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#aaa] text-sm outline-none"><option value={3}>3 Discs</option><option value={4}>4 Discs</option><option value={5}>5 Discs</option></select>
        </div>
      </div>
    );

    if (activeGame === 'greedy') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Coin Change Challenge</h2><p className="text-xs text-[#666] mt-1">Make exactly <b className="text-[#d4a574]">{coinTarget}</b> using the fewest coins!</p></div>
          <div className="flex items-center gap-2"><span className="text-xs text-[#888]">Current: <b className="text-[#d4a574]">{coinSelected.reduce((a, b) => a + b, 0)}</b></span><span className="text-xs text-[#888]">Coins: <b className="text-[#d4a574]">{coinSelected.length}</b></span></div>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          <div className="flex gap-3 justify-center mb-4">{coinDenoms.map(d => (<button key={d} onClick={() => addCoin(d)} className="w-14 h-14 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 text-yellow-900 font-bold text-sm shadow-lg hover:scale-110 transition-transform active:scale-95">{d}¢</button>))}</div>
          <div className="flex flex-wrap gap-1 justify-center min-h-[40px]">{coinSelected.map((c, i) => (<span key={i} className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs flex items-center justify-center font-bold">{c}</span>))}</div>
        </div>
        <div className="flex gap-3 mt-4"><button onClick={() => setCoinSelected([])} className={btnSecondary}>Clear</button><button onClick={initCoin} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div>
      </div>
    );

    if (activeGame === 'linkedlist') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Chain Builder</h2><p className="text-xs text-[#666] mt-1">Build this linked list: [{llTarget.join(' \u2192 ')}]</p></div>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          <div className="flex items-center gap-1 min-h-[60px] overflow-x-auto pb-2 justify-center">
            {llNodes.length === 0 ? <p className="text-[#555] text-xs">Empty list — start inserting!</p> : llNodes.map((val, i) => (
              <div key={i} className="flex items-center">
                <div onClick={() => llDelete(i)} className="w-12 h-12 rounded-lg bg-[#d4a574]/20 border border-[#d4a574] flex items-center justify-center text-[#d4a574] font-bold cursor-pointer hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 transition-colors group" title="Click to delete"><span className="group-hover:hidden">{val}</span><i className="ri-delete-bin-line hidden group-hover:block text-sm"></i></div>
                {i < llNodes.length - 1 && <i className="ri-arrow-right-line text-[#555] mx-1"></i>}
              </div>
            ))}
          </div>
          {!llWon && (<div className="flex gap-2 justify-center mt-3"><input type="number" value={llInput} onChange={e => setLlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && llInsert()} placeholder="Value..." className="w-24 px-3 py-2 rounded-xl bg-[#222] border border-[#333] text-[#e8e8e8] text-center text-sm outline-none focus:border-[#d4a574]" /><button onClick={llInsert} className={btnPrimary}>Insert</button></div>)}
        </div>
        <div className="flex gap-3 mt-4"><button onClick={initLinkedList} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div>
      </div>
    );

    if (activeGame === 'hash') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Hash Table Quest</h2><p className="text-xs text-[#666] mt-1">Place key in correct bucket: key % {hashSize}</p></div>
          <span className="text-xs text-[#888]">Score: <b className="text-[#d4a574]">{hashScore}/{hashKeys.length}</b></span>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          {hashCurrent < hashKeys.length && (<div className="text-center mb-4"><span className="text-xs text-[#888]">Place this key:</span><p className="text-2xl font-bold text-[#d4a574]">{hashKeys[hashCurrent]}</p><p className="text-xs text-[#555]">{hashKeys[hashCurrent]} % {hashSize} = {hashKeys[hashCurrent] % hashSize}</p></div>)}
          <div className="grid grid-cols-7 gap-2">{hashBuckets.map((bucket, i) => (<div key={i} onClick={() => hashPlace(i)} className="cursor-pointer rounded-xl bg-[#1a1a1a] border border-[#333] p-2 min-h-[80px] hover:border-[#d4a574] transition-colors"><p className="text-[10px] text-[#555] text-center mb-1">[{i}]</p>{bucket.map((val, bi) => (<div key={bi} className="text-xs text-[#d4a574] text-center bg-[#d4a574]/10 rounded px-1 py-0.5 mb-0.5">{val}</div>))}</div>))}</div>
        </div>
        <div className="flex gap-3 mt-4"><button onClick={initHash} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div>
      </div>
    );

    if (activeGame === 'dp') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Knapsack Packer</h2><p className="text-xs text-[#666] mt-1">Capacity: <b className="text-[#d4a574]">{knapsackCapacity} kg</b> — maximize value!</p></div>
          <div className="flex items-center gap-3"><span className="text-xs text-[#888]">Weight: <b className="text-[#d4a574]">{knapsackSelected.reduce((s, i) => s + knapsackItems[i].weight, 0)}/{knapsackCapacity}</b></span><span className="text-xs text-[#888]">Value: <b className="text-green-400">{knapsackSelected.reduce((s, i) => s + knapsackItems[i].value, 0)}</b></span></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          {knapsackItems.map((item, i) => (<div key={i} onClick={() => toggleKnapsackItem(i)} className={`rounded-xl p-3 cursor-pointer transition-all border ${knapsackSelected.includes(i) ? 'bg-[#d4a574]/20 border-[#d4a574]' : 'bg-[#1a1a1a] border-[#333] hover:border-[#555]'}`}><p className="text-sm font-semibold text-[#e8e8e8]">{item.name}</p><div className="flex justify-between mt-1 text-xs"><span className="text-[#888]">{item.weight}kg</span><span className="text-green-400">${item.value}</span></div></div>))}
        </div>
        {!knapsackWon && (<div className="flex gap-3 mt-4"><button onClick={submitKnapsack} className={btnPrimary} disabled={knapsackSelected.length === 0}>Submit</button><button onClick={() => setKnapsackSelected([])} className={btnSecondary}>Clear</button><button onClick={initKnapsack} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New</button></div>)}
      </div>
    );

    if (activeGame === 'tree') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">BST Explorer</h2><p className="text-xs text-[#666] mt-1">Insert values: [{bstSequence.join(', ')}]</p></div>
          <span className="text-xs text-[#888]">Inserted: <b className="text-[#d4a574]">{bstInserted}/{bstSequence.length}</b></span>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-4">
          <svg viewBox="0 0 400 250" className="w-full">{bstRoot ? renderBSTNode(bstRoot, 200, 25, 80) : <text x={200} y={125} textAnchor="middle" fill="#555" fontSize="14">Tree is empty — click Insert</text>}</svg>
        </div>
        <div className="flex gap-3 mt-4">
          {bstInserted < bstSequence.length && <button onClick={bstInsert} className={btnPrimary}>Insert <b>{bstSequence[bstInserted]}</b></button>}
          <button onClick={initBST} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Sequence</button>
        </div>
      </div>
    );

    if (activeGame === 'graph_coloring') return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-[#e8e8e8]">Map Coloring</h2><p className="text-xs text-[#666] mt-1">Pick a color, then click nodes. No adjacent nodes same color!</p></div>
          <span className="text-xs text-[#888]">Colored: <b className="text-[#d4a574]">{Object.keys(gcColors).length}/{gcNodes.length}</b></span>
        </div>
        <div className="flex gap-2 mb-3 justify-center">{GC_PALETTE.map((color, i) => (<button key={i} onClick={() => setGcCurrentColor(i)} className={`w-8 h-8 rounded-full border-2 transition-transform ${gcCurrentColor === i ? 'scale-125 border-white' : 'border-[#333]'}`} style={{ backgroundColor: color }}></button>))}</div>
        <svg viewBox="0 0 380 280" className="w-full bg-[#111] rounded-xl border border-[#2a2a2a]">
          {gcEdges.map(([a, b], i) => (<line key={i} x1={gcNodes[a].x} y1={gcNodes[a].y} x2={gcNodes[b].x} y2={gcNodes[b].y} stroke="#333" strokeWidth="2" />))}
          {gcNodes.map(n => (<g key={n.id} onClick={() => gcColorNode(n.id)} className="cursor-pointer"><circle cx={n.x} cy={n.y} r={24} fill={gcColors[n.id] !== undefined ? GC_PALETTE[gcColors[n.id]] : '#222'} stroke={gcColors[n.id] !== undefined ? '#fff' : '#444'} strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{n.label}</text></g>))}
        </svg>
        <div className="flex gap-3 mt-4"><button onClick={() => setGcColors({})} className={btnSecondary}>Reset Colors</button><button onClick={initGraphColoring} className={btnSecondary}><i className="ri-refresh-line mr-1"></i>New Graph</button></div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════
  //                    MAIN RENDER
  // ════════════════════════════════════════════════════
  return (
    <DashboardLayout pageTitle="Learning Games" role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#e8e8e8]">Algorithm Games</h1>
            {!activeGame && <p className="text-sm text-[#666] mt-1">Learn algorithms by playing - {GAMES.length} interactive challenges</p>}
          </div>
          {activeGame && (<button onClick={() => setActiveGame(null)} className={btnSecondary + ' flex items-center gap-1.5'}><i className="ri-arrow-left-line"></i>All Games</button>)}
        </div>

        {activeGame ? renderGame() : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map(g => (
              <div key={g.id} onClick={() => startGame(g.id)} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden hover:border-[#d4a574]/30 transition-all cursor-pointer group hover:shadow-lg hover:shadow-[#d4a574]/5">
                <div className={`h-1.5 bg-gradient-to-r ${g.color}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${g.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><i className={`${g.icon} text-white text-lg`}></i></div>
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${g.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : g.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{g.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-[#e8e8e8] mb-1">{g.title}</h3>
                  <p className="text-[11px] text-[#666] mb-2">{g.description}</p>
                  <div className="flex items-center gap-1.5"><i className="ri-code-s-slash-line text-[#d4a574] text-xs"></i><span className="text-[10px] text-[#888] font-medium">{g.algorithm}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LearningGames;
