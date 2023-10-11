"use strict"

const canvasSize = {
  width: 1000,
  height: 1000
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

function drawTile3(pos){
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.rect(pos.x+tilePixel*3, pos.y, tilePixel*4, tileSize)
  ctx.rect(pos.x, pos.y+tilePixel*3, tilePixel*2, tilePixel*4)
  ctx.rect(pos.x+tilePixel*8, pos.y+tilePixel *3, tilePixel*2, tilePixel*4)
  ctx.fill()
  ctx.closePath()
}



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
  }
]

function drawTile(pos, tileIndex){
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
console.log(gridSize)

const grid = new Array(gridSize.y).fill(new Array(gridSize.x))

grid[0][0] = 4

function getGridData(){
  for(let x = 0; x < gridSize.x; x++){
    for(let y = 0; y < gridSize.y; y++){
      if(grid[x][y]!=undefined) continue
      const directions = []
      let top = y-1 >= 0 ? grid[x][y-1] : -1
      let right = x+1 < gridSize.x ? grid[x+1][y] : -1
      let bottom = y+1 < gridSize.y ? grid[x][y+1] : -1
      let left = x-1 >= 0 ? grid[x-1][y] : -1
      console.log(x, y, tiles[top])
      top = top ==undefined ? undefined : tiles[top].connections.includes(2) ? 0 : undefined
      right = right == undefined ? undefined : tiles[right].connections.includes(1) ? 3 : undefined
      bottom = bottom == undefined ? undefined : tiles[bottom].connections.includes(0) ? 2 : undefined
      left = left == undefined ? undefined : tiles[left].connections.includes(3) ? 1 : undefined
      if(top) directions.push(top)
      if(right) directions.push(right)
      if(bottom) directions.push(bottom)
      if(left) directions.push(left)
      grid[x][y] = getMatchingTile(directions)
    }
  }
}

let checked = false

function getMatchingTile(directions){
  const missingDirection = [0, 1, 2, 3].filter((e)=> !(directions.includes(e)))
  const matchingTiles = []
  for(let i = 0; i < tiles.length; i++){
    const matches = !directions.some((e) => !(tiles[i].points.includes(e)))
    if(matches) matchingTiles.push(i)
  }
  return matchingTiles[Math.floor(Math.random() * matchingTiles.length)]

}
// getGridData()
function drawGrid(){
  
  for(let i = 0; i < gridSize.y; i++){
    for(let j = 0; j < gridSize.x; j++){
      const pos = {
        x: j * tileSize,
        y: i * tileSize
      }
      drawTile(pos, grid[i][j])
    }
  }
}

drawGrid()
