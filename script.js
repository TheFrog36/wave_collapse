"use strict"

const canvasSize = {
  width:  1000,
  height:  1000
}

const tileSize = 100

const canvas = document.getElementById("main-canvas")
const ctx = canvas.getContext("2d")

canvas.width = canvasSize.width
canvas.height = canvasSize.height


const tilePosition = {
  x: 0,
  y: 0
}

const tilePixel = tileSize / 10

const color = "white"
ctx.fillStyle = color



const tiles = [
  {
    points: [[3, 0, 4, 10]],
    connections: [0, 2]
  },
  {
    points: [[0, 3, 10, 4]],
    connections: [1, 3]
  },
  {
    points:  [[0, 3, 2, 4], [3, 0, 4, 10], [8, 3, 2, 4]],
    connections: [0, 1, 2, 3]
  },
  {
    points: [[0, 3, 10, 4],[3, 0, 4, 2],[3, 8, 4, 2]],
    connections: [0, 1, 2, 3]
  },
  {
    points: [[3, 3, 4, 7],[7, 3, 3, 4]],
    connections: [1, 2]
  },
  {
    points: [[3, 3, 4, 7],[0, 3, 3, 4]],
    connections: [2, 3]
  },
  {
    points: [[3, 0, 4, 7], [0, 3, 3, 4]],
    connections:[0, 3]
  },
  {
    points: [[3, 0, 4, 7],[7, 3, 3, 4]],
    connections: [0, 1]
  },
  // {
  //   points: [[3, 0, 4, 10], [0, 3, 3, 4]],
  //   connections: [0, 2, 3]
  // },
  // {
  //   points: [[3, 0, 4, 10], [7, 3, 3, 4]],
  //   connections: [0, 1, 2]
  // },
  // {
  //   points: [[0, 3, 10, 4], [3, 0, 4, 3]],
  //   connections: [0, 1, 3]
  // },
  // {
  //   points: [[0, 3, 10, 4], [3, 7, 4, 3]],
  //   connections: [1, 2, 3]
  // }
]

function drawTile(pos, tileIndex, clear=false){
  const tileData = tiles[tileIndex].points
  ctx.beginPath()
  ctx.fillStyle = color
  for(let i = 0; i < tileData.length; i++){
    const rectData = tileData[i]
    ctx.rect(pos.x+rectData[0]*tilePixel, pos.y+rectData[1]*tilePixel, rectData[2]*tilePixel, rectData[3]*tilePixel)
  }
  ctx.fill()
  ctx.closePath()
}

// drawTile(tilePosition, 3)

const gridSize = {
  x: Math.floor(canvasSize.width / tileSize),
  y: Math.floor(canvasSize.height / tileSize)
}

// const grid = new Array(gridSize.y).fill(new Array(gridSize.x))
const grid = new Array(gridSize.x)
for(let i = 0; i < grid.length; i++){
  grid[i] = new Array(gridSize.y)
}

 grid[0][0] = 4


function getGridData(){
  for(let x = 0; x < gridSize.x; x++){
    for(let y = 0; y < gridSize.y; y++){
      if(grid[x][y]!=undefined) continue
      let surroundings = {
        top: undefined,
        right: undefined,
        bottom: undefined,
        left: undefined
      }
      let top = y-1 >= 0 ? grid[x][y-1] : -1
      let right = x+1 < gridSize.x ? grid[x+1][y] : -1
      let bottom = y+1 < gridSize.y ? grid[x][y+1] : -1
      let left = x-1 >= 0 ? grid[x-1][y] : -1 
      if(top==undefined) surroundings.top = undefined
      else if(top==-1 || !tiles[top].connections.includes(2)) surroundings.top = -1
      else surroundings.top = 0

      if(right==undefined) surroundings.right = undefined
      else if(right==-1 || !tiles[right].connections.includes(3)) surroundings.right = -1
      else surroundings.right = 1

      if(bottom==undefined) surroundings.bottom = undefined
      else if(bottom==-1 || !tiles[bottom].connections.includes(0)) surroundings.bottom = -1
      else surroundings.bottom = 2

      if(left==undefined) surroundings.left = undefined
      else if(left==-1 || !tiles[left].connections.includes(1)) surroundings.left = -1
      else surroundings.left = 3
      

      // return
      grid[x][y] = getMatchingTile(surroundings)
    }
  }
}


function getMatchingTile(surroundings){
  const matchingTiles = []
  const forcedConnections = []
  const blocked = []
  for(const direction in surroundings){
    const directionValue = surroundings[direction]
    if(directionValue==-1) {
      if(direction=="top")blocked.push(0)
      if(direction=="right")blocked.push(1)
      if(direction=="bottom")blocked.push(2)
      if(direction=="left")blocked.push(3)
      
    }
    else if(directionValue !== undefined) forcedConnections.push(directionValue)
  }

  for(let i = 0; i < tiles.length; i++){
    const hasNeededConnections = forcedConnections.every(v => tiles[i].connections.includes(v));
    const hasBlockedConnecitons = !blocked.every((e) => !tiles[i].connections.includes(e))
    if(hasNeededConnections && !hasBlockedConnecitons) matchingTiles.push(i)
  }

  return matchingTiles[Math.floor(Math.random() * matchingTiles.length)]
}
async function drawGrid(){
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

  for(let x = 0; x < gridSize.x; x++){
    for(let y = 0; y < gridSize.y; y++){
      await sleep(1);

      if(grid[x][y]==undefined) continue
      const pos = {x: x*tileSize, y: y*tileSize}
      drawTile(pos, grid[x][y])
    }

  }
}
getGridData()

drawGrid()

function reset(){
  console.log("test")
  for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(gridSize.y)
  }
  getGridData()
  drawGrid()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

