import { Particle,Fire,WaterFlow,StarMaker } from './classes.js';
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.width = innerWidth
// canvas.height = innerHeight
//c.fillStyle = 'rgb(39,39,42)'
//c.fillRect(0, 0, canvas.width, canvas.height)
const mousePos = { x: 0, y: 0 }
const areaRadius = 100

//c.fillStyle = '#0077b5'
//c.beginPath()
//c.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2)
//c.fill()
canvas.mouseX = 0
canvas.mouseY = 0
canvas.mouseDown = false
canvas.onMap = true
canvas.strike = false
canvas.spawnPowerUp = false
canvas.mouseHeldTime = 0
canvas.planetRadius = 200
canvas.p2 = {
  x:300,
  y:300,
  barnlocation: {
    startX: 310,
    endX: 340,
    startY: 387,
    endY: 410
  }
}// Barn location (x: 310-340, y: 387-410)
canvas.p1 = {x:1000,y:450}
canvas.interval = null
//console.log(canvas.mouseX)
function drawL(x,y) {
    var img = new Image();   // Create new img element
    img.onload = ()=> {
        c.drawImage(img, x, y,95,95);
    };
    img.src = "linkedin.png"; // Set source path
}
//draw()
function cdisx(y,h,k,r) {
  //(x-h)^2 + (y-k)^2 = r^2
  let res = Math.sqrt(Math.pow(r,2) - Math.pow(y-k,2)) + h
  if (res > 0 || res < 0) {return res}
  return 0
}

function cdisy(x,h,k,r) {
  //console.log(Math.sqrt(Math.pow(r,2)))
  let res = Math.sqrt(Math.pow(r,2) - Math.pow(x-h,2)) + k
  //console.log(res)
  if (res > 0 || res < 0) {return res}
  //else {console.log('null')}
  return 0
}

function createCircle(x,y,radius,color,transparency=1) {
  c.save()
  c.globalAlpha = transparency
  c.beginPath()
  c.arc(x, y, radius, 0, 2 * Math.PI)
  c.fillStyle = color
  c.fill()
  //c.lineWidth = 1;
  //c.strokeStyle = "black";
  //c.stroke();
  c.restore()
}
function outlineCircle(x,y,radius,color,width,transparency=1) {
  c.save()
  c.globalAlpha = transparency
  c.beginPath()
  c.arc(x, y, radius, 0, 2 * Math.PI)
  c.strokeStyle = color
  c.lineWidth = width
  c.stroke()
  //c.lineWidth = 1;
  //c.strokeStyle = "black";
  //c.stroke();
  c.restore()
}
class Cloud {
  // Create circular clouds
  constructor({position, color, size, velocity}) {
    this.position = position
    this.color = color
    this.size = size
    this.velocity = velocity
    this.transparency = .8
    this.xCloudEdge = 0
    this.yCloudEdge = 0
    this.life = 0
  }
  draw() {
    // Creates cloud at specified position
    createCircle(this.position.x,this.position.y,this.size,this.color,this.transparency)
    let a = this.angleTo(this.position.x+this.velocity.x,this.position.y+this.velocity.y)
    let x = this.position.x + this.size * Math.cos(a)
    let y = this.position.y + this.size * Math.sin(a)
    this.xCloudEdge = x
    this.yCloudEdge = y
    //createCircle(x,y,10,'blue')
  }
  update() {
    this.life += 1
    let a = this.angleTo(300,300)
    let r = 200
    let x = 300 + r * Math.cos(a)
    let y = 300 + r * Math.sin(a)
    let xEdge = 300 - (x - 300)
    let yEdge = 300 - (y - 300)
    //if (this.velocity.x > 1 && this.velocity.x > -1) createCircle(xEdge,yEdge,10,'red')
    // Reverses direction of cloud when point xCloudEdge, yCloudEdge
    // reaches edge of circle at point xEdge, yEdge
    if (this.life > 20) {
      if (this.velocity.x < 0) {
        if (this.xCloudEdge <= xEdge) {
          this.velocity.x *= -1
          this.position.x -= this.velocity.x
          //createCircle(xEdge,yEdge,10,'red')
        }
      } else {
        if (this.xCloudEdge >= xEdge) {
          this.velocity.x *= -1
          this.position.x -= this.velocity.x
          //createCircle(xEdge,yEdge,10,'orange')
        }
      }
      if (this.velocity.y < 0) {
        if (this.yCloudEdge <= yEdge) {
          this.velocity.y *= -1
          this.position.y -= this.velocity.y
        }
      } else {
        if (this.yCloudEdge >= yEdge) { 
          this.velocity.y *= -1
          this.position.y -= this.velocity.y
        }
      }
    }
    this.transparency *= .995
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
  angleTo(x, y) {
    return Math.atan2(y - this.position.y, x - this.position.x)
  }
}
class Planet {
  // CLoud planet
  constructor({ position }) {
      this.position = position
      this.colors = ['darkgray','gray','white']
      this.clouds = []
  }

  update() {
      this.clouds.forEach(c => c.update())
      this.addClouds()
      this.removeClouds()
  }

  draw() {
    //c.strokeStyle = 'red'
    //c.strokeRect(100,100,400,400)
    createCircle(this.position.x,this.position.y,200,'black')
    this.clouds.forEach(c => c.draw())
  }

  addClouds() {
      // Adds clouds
      if (Math.random() < 0.05) {
          const c = new Cloud({
              position: {
                  // x: position + offset + random
                  x: this.position.x + 1 + (Math.random()*120)-60,
                  y: this.position.y + 1 + (Math.random()*120)-60
              },
              color: this.colors[Math.floor(Math.random() * 3)],
              size: 50 + Math.random()*80,
              velocity: {
                x: (Math.random()*3)-1.5,
                y: (Math.random()*3)-1.5
              }
          })
          this.clouds.push(c)
      }
  }

  removeClouds() {
      if (this.clouds.length > 40) {
          this.clouds.shift()
      }
  }
}
// Snake class unused
class Snake {
  constructor({position, color, size, velocity}) {
    this.position = position
    this.color = color
    this.size = size
    this.velocity = velocity
    this.transparency = .8
    this.xCloudEdge = 0
    this.yCloudEdge = 0
    this.life = 0
  }
  draw() {
    createCircle(this.position.x,this.position.y,this.size,this.color,this.transparency)
    this.xSnakeEdge = this.position.x
    this.ySnakeEdge = this.position.y
    //createCircle(x,y,10,'blue')
  }
  update() {
    this.life += 1
    let a = this.angleTo(300,300)
    let r = 200
    let x = 300 + r * Math.cos(a)
    let y = 300 + r * Math.sin(a)
    let xEdge = 300 - (x - 300)
    let yEdge = 300 - (y - 300)
    //if (this.velocity.x > 1 && this.velocity.x > -1) createCircle(xEdge,yEdge,10,'red')
    // Reverses direction of cloud when point xCloudEdge, yCloudEdge
    // reaches edge of circle at point xEdge, yEdge
    if (this.life > 20) {
      if (this.velocity.x < 0) {
        if (this.xCloudEdge <= xEdge) {
          this.velocity.x *= -1
          this.position.x -= this.velocity.x
          //createCircle(xEdge,yEdge,10,'red')
        }
      } else {
        if (this.xCloudEdge >= xEdge) {
          this.velocity.x *= -1
          this.position.x -= this.velocity.x
          //createCircle(xEdge,yEdge,10,'orange')
        }
      }
      if (this.velocity.y < 0) {
        if (this.yCloudEdge <= yEdge) {
          this.velocity.y *= -1
          this.position.y -= this.velocity.y
        }
      } else {
        if (this.yCloudEdge >= yEdge) { 
          this.velocity.y *= -1
          this.position.y -= this.velocity.y
        }
      }
    }
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
  angleTo(x, y) {
    return Math.atan2(y - this.position.y, x - this.position.x)
  }
}
class PlanetDesc {
  constructor({position, description,offset}) {
    this.position = position
    this.description = description
    this.active = false
    this.currentChar = 0
    this.currentSentence = 0
    this.mouseX = 0
    this.mouseY = 0
    this.offset = offset
    this.outputWords = []
    for (let i = 0; i < description.length; i++) {
      this.description[i] = this.splitString(description[i])
    }
  }
  draw() {
    //this.drawText(this.position.x - 250,this.position.y-250,this.outputWords)
    for (let i = 0; i < this.outputWords.length; i++) {
      this.drawText(this.position.x - 290 + this.offset.x,(this.position.y-268 + this.offset.y)+(i*20),this.outputWords[i].join(''))
    }
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x - 250,this.position.y-250,20,20)
  }
  update() {
    let yCenter = this.position.y
    let xCenter = this.position.x
    let r = 200
    
    // onmousemove = function(e){
    //   canvas.mouseX = e.clientX
    //   canvas.mouseY = e.clientY
    // }
    var x = canvas.mouseX
    var y = canvas.mouseY
    var fromC = Math.sqrt( Math.pow((y - yCenter), 2) + Math.pow((x - xCenter), 2) );
    this.active = false
    if (fromC < r*1.2) {
      //console.log(fromC)
      this.active = true
    }
    //console.log(this.description.length)
    this.updateDesc()
    //console.log(this.outputWords.length)
  }

  updateDesc() {
    //console.log(this.active)
    if (this.active) {  
      // If at end
      if (this.currentSentence >= this.description.length) return
      // If moving to next sentence
      if (this.currentChar >= this.description[this.currentSentence].length) {
        this.currentSentence += 1
        if (this.currentSentence < this.description.length) this.currentChar = 0
      }
      // If at end of desc
      if (this.currentSentence >= this.description.length) return
      // If at start of a new sentence
      if (this.currentChar == 0) this.outputWords.push([])
      //console.log(this.currentSentence + ', ' + this.currentChar+ ', ' + this.description[this.currentSentence][this.currentChar])
      this.outputWords[this.currentSentence].push(this.description[this.currentSentence][this.currentChar++])
      //console.log(this.outputWords)
    } else {
      //console.log(this.outputWords.length)
      // If at end of desc
      if (this.currentSentence >= this.description.length) this.currentSentence -= 1
      if (this.outputWords.length > 0) this.outputWords[this.currentSentence].pop()
      this.currentChar -= 1
      if (this.currentChar < 1) {
        if (this.currentSentence == 0) {
          this.currentChar = 0
          this.outputWords = []
          return
        }
        this.currentSentence -= 1
        this.currentChar = this.description[this.currentSentence].length
        this.outputWords.pop()
      }
      //console.log(this.outputWords.length)
      //console.log(this.currentSentence + ', ' + this.currentChar+ ', ' + this.description[this.currentSentence][this.currentChar])
    }
    //console.log(this.outputWords)
  }
  splitString(arr) {
    var temp = []
    for (const c of arr) {
        temp.push(c)
    }
    return temp
  }
  drawText(x,y,sentece) {
    c.save()
    c.font = "15px Arial";
    c.fillStyle = 'rgb(138, 221, 233)'
    c.fillText(sentece,x,y)
    c.restore()
  }
}
class PowerUp {
  // Power up to increase snake length
  constructor({position, size}) {
    this.position = position
    this.size = size
    this.life = 1000
    let yCenter = canvas.p1.y
    let xCenter = canvas.p1.x
    let r = 200
    // Almost Redundant, most relevant checks performed in other methods
    // var fromC = Math.sqrt( Math.pow((this.position.y - yCenter), 2) + Math.pow((this.position.x - xCenter), 2) ) 
    // // Looks for valid position within planet
    // while (fromC >= r){
    //     this.position.x = Math.random()*(r*2)+xCenter
    //     this.position.y = Math.random()*(r*2)+yCenter
    //     fromC = Math.sqrt( Math.pow((this.position.y - yCenter), 2) + Math.pow((this.position.x - xCenter), 2) )
    // }
  }
  draw() {
    c.save()
    c.fillStyle = 'green'
    createCircle(this.position.x,this.position.y,this.size,'yellow')
    c.restore()
  }
  update() {
    this.life -= 1
  }
}
class TestBox {
  // Snake class
  constructor({position, size, velocity, color}) {
    this.position = position
    this.size = size
    this.color = color
    this.velocity = velocity
    this.life = 0
    this.interval = 1
    this.cooldown = 0
    this.bCooldown = 0
    this.done = false
    this.outOfBoundsNum = 0
    this.outOfBoundsCounter = 0
    this.lastCollision = 0
    this.delay = 20
    this.notConnected = 0
    this.segments = [{
      position: this.position,
      velocity: this.velocity,
      tempV: {
        x: 0,
        y: 0
      },
      delay: -2,
      delays: [],
      id: 1
    }]
    this.posx = true
    this.posy = true
  }
  draw() {
    c.save()
    c.fillStyle = this.color
    // this.segments.forEach(s => {
    //   c.fillRect(s.x-this.size/2,s.y-this.size/2,this.size,this.size)
    // })
    // Draw snake body
    if (this.life % this.interval == 0) {
      let i = 0
      for (i; i < this.segments.length; i++) {
        c.fillRect(this.segments[i].position.x-this.size/2,this.segments[i].position.y-this.size/2,this.size,this.size)
      }
      // Draw snake eyes
      c.fillStyle = 'black'
      if (this.velocity.x > 0) {
        c.fillRect(this.segments[0].position.x-0,this.segments[0].position.y-5,5,2)
        c.fillRect(this.segments[0].position.x-0,this.segments[0].position.y+3,5,2)
        //(this.segments[0].position.x-1,this.segments[0].position.y-4,5,2)
      } else if (this.velocity.x < 0) {
        c.fillRect(this.segments[0].position.x-5,this.segments[0].position.y-5,5,2)
        c.fillRect(this.segments[0].position.x-5,this.segments[0].position.y+3,5,2)
      } else if (this.velocity.y > 0) {
        c.fillRect(this.segments[0].position.x-5,this.segments[0].position.y+0,2,5)
        c.fillRect(this.segments[0].position.x+3,this.segments[0].position.y+0,2,5)
      } else {
        c.fillRect(this.segments[0].position.x-5,this.segments[0].position.y-5,2,5)
        c.fillRect(this.segments[0].position.x+3,this.segments[0].position.y-5,2,5)
      }
      //(this.segments[0].position.x-1,this.segments[0].position.y-4,5,2)
    }
    //c.fillRect(this.position.x-this.size/2,this.position.y-this.size/2,this.size,this.size)
    c.restore()
  }
  update() {
    // To fix: snake breaks randomly after hitting wall
    let yCenter = canvas.p1.y
    let xCenter = canvas.p1.x
    let r = 200
    var fromC = Math.sqrt( Math.pow((this.position.y - yCenter), 2) + Math.pow((this.position.x - xCenter), 2) ); 
    // if collision with edge of planet reverse snake velocity
    if(this.bCooldown < 1 && fromC >= r){
      this.bCooldown = 0
      this.velocity.x *= -1
      this.velocity.y *= -1
      this.segmentFollow(this.delay)
      if (this.life == this.outOfBoundsNum+1) this.outOfBoundsCounter += 1
      else this.outOfBoundsCounter = 1
      this.outOfBoundsNum = this.life
      this.lastCollision = this.life
    }
    if (this.outOfBoundsCounter > 4) {
      this.done = true
      //console.log(this.done)
    }
    // Edit delay based on last collision
    if (this.life - this.lastCollision <= 20) this.delay = this.life - this.lastCollision
    this.cooldown -= 1
    this.life += 1
    if (this.cooldown < 1) {
      // if (this.life == 100) {
      //   this.velocity.y = -this.velocity.x
      //   this.velocity.x = 0
      //   this.segmentFollow(this.delay)
      //   //console.log(this.delay)
      // }
      // if (this.life == 130) {
      //   this.velocity.x = -this.velocity.y
      //   this.velocity.y = 0
      //   this.segmentFollow(this.delay)
      //   //console.log(this.delay)
      // }



      // Change direction at random intervals
      if (Math.random() < .01 && this.life > 100){//.01) {
        this.cooldown = 30
        if (this.velocity.x != 0) {
          
          if (this.velocity.y == 0) {
            this.velocity.y = this.velocity.x
            this.velocity.x = 0
          }
          if (Math.random() < .5) this.velocity.y *= -1
        } else {
          if (this.velocity.x == 0) {
            this.velocity.x = this.velocity.y
            this.velocity.y = 0
          }
          if (Math.random() < .5) this.velocity.x *= -1
        }
        this.segmentFollow(this.delay)
      }
    } 
    // for (let i = 0; i < this.segments.length; i++) {
    //   let s = this.segments[i]
    //   let delay = {
    //     time: -1
    //   }
    //   if (s.delays.length > 0) {
    //     delay = s.delays[0]
    //   }
    //   if (delay.time == 20) this.bringBodyUp(s.id)
    //   if (delay.time == 0) {
    //     //console.log(s.delay)
    //     s.velocity.x = delay.tempV.x
    //     s.velocity.y = delay.tempV.y
    //     s.delays.shift()
    //     if (this.segments.length > s.id) {
    //       let s1 = this.segments[i+1]
    //       console.log(delay.initialTime)
    //       let s1Delay = {
    //         time: delay.initialTime,
    //         initialTime: delay.initialTime,
    //         tempV: {
    //           x: s.velocity.x,
    //           y: s.velocity.y
    //         }
    //       }
    //       s1.delays.push(s1Delay)
    //     }
    //     this.bringBodyUp(s.id)
    //     //s.delay = 0
    //   } else {
    //     s.position.x += s.velocity.x
    //     s.position.y += s.velocity.y
    //   }
    //   if (s.delays.length > 0) s.delays[0].time -= 1
    //   // if (s.delay == 0) {
    //   //   s.velocity.x = s.tempV.x
    //   //   s.velocity.y = s.tempV.y
    //   //   if (this.segments.length > s.id) {
    //   //     let s1 = this.segments[i+1]
    //   //     if (s.velocity.x != 0) s1.delay = 20
    //   //     else s1.delay = 20
    //   //     s1.tempV.x = s.velocity.x
    //   //     s1.tempV.y = s.velocity.y
    //   //   }
    //   //   this.bringBodyUp(s.id)
    //   // } else {
    //   //   s.position.x += s.velocity.x
    //   //   s.position.y += s.velocity.y
    //   // }
    //   // if (s.delay == -1) this.bringBodyUp(s.id) 
    //   // if (s.delay > -2) s.delay -= 1
    // }
    this.updateMovement()
  }
  updateMovement() {
    // Handles and updates segment movement through delayed
    // movement based on head segment
    for (let i = 0; i < this.segments.length; i++) {
      let s = this.segments[i]
      let delay = {
        time: -1
      }
      if (s.delays.length > 0) {
        delay = s.delays[0]
      }
      if (delay.time == 20) this.bringBodyUp(s.id)
      if (delay.time == 0) {
        //console.log(s.delay)
        s.velocity.x = delay.tempV.x
        s.velocity.y = delay.tempV.y
        s.delays.shift()
        if (this.segments.length > s.id) {
          let s1 = this.segments[i+1]
          //console.log(delay.initialTime)
          let s1Delay = {
            time: delay.initialTime,
            initialTime: delay.initialTime,
            tempV: {
              x: s.velocity.x,
              y: s.velocity.y
            }
          }
          s1.delays.push(s1Delay)
        }
        this.bringBodyUp(s.id)
        //s.delay = 0
      } else {
        s.position.x += s.velocity.x
        s.position.y += s.velocity.y
      }
      if (s.delays.length > 0) s.delays[0].time -= 1
    }
  }
  segmentFollow(delayTime=20) {
    // Creates a delay for segment 1 after head changes direction
    if (this.segments.length > 1) {
      let delay = {
        time: delayTime,
        initialTime: delayTime,
        tempV: {
          x: this.velocity.x,
          y: this.velocity.y
        }
      }
      //console.log(delay.initialTime)
      //console.log(this.life)
      this.segments[1].delays.push(delay)
    }
  }
  bringBodyUp(id) {
    // Moves back segments up to be in line with front
    let s = this.segments[id-1]
    let s1 = this.segments[id-2]
    this.notConnected = 0
    //if (this.life > 500 && this.life < 800) console.log(Math.abs(s1.position.x - s.position.x ))//> 20)
    // While segment is not connected to body bring closer until connected
    let resetCheck = 9
    while (Math.abs(s1.position.y - s.position.y ) > 20 ||
    Math.abs(s1.position.x - s.position.x ) > 20) {
      resetCheck += 1
      //console.log('bringBodyUp Resets: ' + resetCheck)
      //console.log(this.life)
      this.notConnected += 1
      if (this.notConnected > 7) {
        this.done = true
        break
      }
      s.position.x += s.velocity.x
      s.position.y += s.velocity.y
    }
  }
  addSegment() {
    // Adds new segment
    
    let s = this.segments[this.segments.length-1]
    let position = {
      x: (s.position.x-(s.velocity.x*20)),
      y: s.position.y-(s.velocity.y*20),
    }
    this.segments.push({
      position: position,
      velocity: {
        x: s.velocity.x,
        y: s.velocity.y
      },
      tempV: {
        x: 0,
        y: 0
      },
      delay: -1,
      delays: [],
      id: this.segments.length+1
    })
    let fromC = Math.sqrt( Math.pow((position.y - this.position.y), 2) + Math.pow((position.x - this.position.x), 2) )
    if (fromC > 200) this.done = true
  }
}
class Planet1 {
  constructor({ position }) {
    this.position = position
    this.time = 0
    this.r = 200
    this.planetdesc = new PlanetDesc({
      position: this.position,
      description: ['Github Planet',
        'Right click to create powerup',
        'Click planet to enter Github'
      ],
      offset: {
        x: 10,
        y: 30
      }
    })
    this.snakes = []
    // this.addSnake(200,300,{x: 1, y: 0},'green')
    // this.addSnake(400,300,{x: -1, y: 0},'green')
    // let p = new PowerUp({
    //   position: {
    //     x: 200,
    //     y: 300
    //   },
    //   size: 10
    // })
    // let p1 = new PowerUp({
    //   position: {
    //     x: 250,
    //     y: 300
    //   },
    //   size: 10
    // })
    this.powerups = []
  }
  update() {
    this.time += 1
    if (this.time % 3 == 0) this.planetdesc.update()
    let fromC = Math.sqrt( Math.pow((canvas.mouseY - this.position.y), 2) + Math.pow((canvas.mouseX - this.position.x), 2) )
    if (fromC < this.r*2) {
      
      
      this.snakes.forEach(s => s.update())
      this.addRandomSnake()
      this.removeSnakes()
      this.powerups.forEach(p => p.update())
      this.powerUpCollisionCheck()
      this.addRandomPowerUp()
      this.addManualPowerUp()
      this.removePowerUps()
    }
  }
  draw() {
    this.planetdesc.draw()
    createCircle(this.position.x,this.position.y,this.r+10,'lightgray')
    createCircle(this.position.x,this.position.y,this.r,'black')
    this.snakes.forEach(s => s.draw())
    this.powerups.forEach(p => p.draw())
  }
  addSnake(a, b, v,c=this.randomColor()) {
    let snake = new TestBox({
      position: {
        x: a,
        y: b
      },
      size: 20,
      velocity: v,
      color: c
    })
    snake.addSegment()
    if (Math.random() < .5) {
      snake.addSegment()
      if (Math.random() < .5) snake.addSegment()
    } 
    this.snakes.push(snake)
  }
  addRandomSnake() {
    // Adds snake to planet
    //if ()
    if (this.snakes.length < 2 || Math.random() < .007) {
      let val = this.r*1.8
      let px = Math.floor(this.position.x + Math.random()*(val) - val/2)
      let py = Math.floor(this.position.y + Math.random()*(val) - val/2)
      let fromC = Math.sqrt( Math.pow((py - this.position.y), 2) + Math.pow((px - this.position.x), 2) )
      let resetCheck = 0
      while (fromC > this.r) {
        resetCheck += 1
        if (resetCheck > 5) return
        px = Math.floor(this.position.x + Math.random()*(val) - val/2)
        py = Math.floor(this.position.y + Math.random()*(val) - val/2)
        fromC = Math.sqrt( Math.pow((py - this.position.y), 2) + Math.pow((px - this.position.x), 2) )
      }
      let v = Math.random()
      if (v < .25) v = {x: -1, y: 0}
      else if (v < .5) v = {x: 1, y: 0}
      else if (v < .75) v = {x: 0, y: -1}
      else v = {x: 0, y: 1}
      this.addSnake(px,py,v)
    }
  }
  removeSnake(i) {
    this.snakes.splice(i,1)
  }
  removeSnakes() {
    this.snakeCollisionCheck()
    let rem = []
    let i = 0
    this.snakes.forEach(s => {
        if (s.done) {
            rem.push(i)
        }
        i += 1
    })
    // Generate power ups from bodies
    rem.forEach(i => {
      let snake = this.snakes[i]
      for (let j = 0; j < snake.segments.length; j++) {
        let s = snake.segments[j]
        if (j == 0 || (Math.random() < .35)) {
          this.addPowerUp(s.position.x+Math.random()*20-10,
                          s.position.y+Math.random()*20-10)
        }
      }
    })
    // Remove dead snakes
    rem.forEach(i => this.removeSnake(i))
  }
  snakeCollisionCheck() {
    // Checks for snake collision
    if (this.time % 15 == 0) {
      let heads = []
      for (let i = 0; i < this.snakes.length; i++) {
        heads.push(this.snakes[i].segments[0])
      }
      //console.log(heads[1].position)
      for (let i = 0; i < this.snakes.length; i++) {
        let snake = this.snakes[i]
        snake.segments.forEach((segment) => {
          for (let j = 0; j < heads.length; j++) {
            if (j == i) continue
            let x = heads[j]
            let y = segment
            let size = snake.size
            if (this.hitCollisionSnake(heads[j],segment,size)) {
              this.snakes[j].done = true
              break
            }
          }
        })
      }
    }
  }
  powerUpCollisionCheck() {
    // Checks for snake to powerup collision
    if (this.time % 10 == 0) {
      this.snakes.forEach((snake) => {
        this.powerups.forEach((powerUp) => {
          
          if (this.hitCollision(snake,powerUp)) {
            powerUp.life -= 1000
            snake.addSegment()
            //snake.bringBodyUp()
          }
        })
      })
    }
  }
  addPowerUp(a,b) {
    let p = new PowerUp({
      position: {
        x: a,
        y: b
      },
      size: 10
    })
    this.powerups.push(p)
  }
  addRandomPowerUp() {
    if (this.time % 3 == 0 && Math.random() < .005) {
      let val = this.r*1.9
      let px = this.position.x + Math.random()*(val) - val/2
      let py = this.position.y + Math.random()*(val) - val/2
      let fromC = Math.sqrt( Math.pow((py - this.position.y), 2) + Math.pow((px - this.position.x), 2) )
      let resetCheck = 0
      while (fromC > this.r) {
        resetCheck += 1
        if (resetCheck > 5) return
        px = Math.random()*(val) - val/2
        py = Math.random()*(val) - val/2
        fromC = Math.sqrt( Math.pow((py - this.position.y), 2) + Math.pow((px - this.position.x), 2) )
      }
      this.addPowerUp(px,py)
    }
  }
  addManualPowerUp() {
    if (canvas.spawnPowerUp == true) {
      canvas.spawnPowerUp = false
      let fromC = Math.sqrt( Math.pow((canvas.mouseY - this.position.y), 2) + Math.pow((canvas.mouseX - this.position.x), 2) )
      if (fromC < this.r*.95) this.addPowerUp(canvas.mouseX,canvas.mouseY)
    }
  }
  removePowerUp(i) {
    this.powerups.splice(i,1)
  }
  removePowerUps() {
    let rem = []
    let i = 0
    this.powerups.forEach(p => {
        if (p.life < 1) {
            rem.push(i)
        }
        i += 1
    })
    rem.forEach(i => this.removePowerUp(i))
  }
  randomColor(){ 
    return('#'+Math.floor(Math.random()*16777215).toString(16));
  }
  hitCollision(x, y) {
    return (
      x.position.x + (x.size) >= y.position.x &&
      y.position.x + (y.size+10) >= x.position.x &&
      x.position.y + (x.size) >= y.position.y &&
      y.position.y + (y.size*1.9) >= x.position.y
    )
  }
  hitCollisionSnake(x, y, size) {
    return (
      x.position.x + (size) >= y.position.x &&
      y.position.x + (size+10) >= x.position.x &&
      x.position.y + (size) >= y.position.y &&
      y.position.y + (size*1.9) >= x.position.y
    )
  }
}
class HayBale{
  constructor({position, size=20}) {
    this.position = position
    this.size = size
    this.color = '#c2a770'
    this.burning = false
    this.type = 'haybale'
    this.water = 0
    this.fire = new Fire({
      c: c,
      position: {
          x: this.position.x-10,
          y: this.position.y-10
      }
    })
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x,this.position.y,this.size,this.size)
    if (this.burning) this.fire.draw()
  }
  update() {
    if (this.burning) {
      this.color = '#36454f'
      this.fire.update()
    }
    if (this.water > 250) {
      this.burning = false
    }
  }
}
class Flower {
  constructor({position, variety}) {
    this.position = position
    this.variety = variety
    this.growthStage = 1
    this.water = 0
    this.burnt = false
    this.type = 'flower'
  }
  draw() {
    c.save()
    let rad = 1 * Math.PI / 180
    if (this.growthStage == 0) {
      c.translate(this.position.x, this.position.y - 10);
      c.rotate(rad*29)
      c.fillStyle = '#36454f'
      c.fillRect(0,4,10,5)
      c.rotate(rad*-58)
      c.fillRect(-2,10,10,5)
    } else if (this.growthStage == 1) {
      // width, height
      c.translate(this.position.x, this.position.y - 10);
      c.rotate(rad*29)
      c.fillStyle = 'rgb(60, 181, 17)'
      c.fillRect(0,4,10,5)
      c.rotate(rad*-58)
      c.fillRect(-2,10,10,5)
      
    } else if (this.growthStage == 2) {
      if (this.variety == 'sunflower') {
        c.translate(this.position.x, this.position.y - 10);
        c.rotate(rad*29)
        c.fillStyle = 'rgb(60, 181, 17)'
        c.fillRect(0,4,10,5)
        c.rotate(rad*-58)
        c.fillRect(-2,10,10,5)
        c.rotate(rad*119)
        //c.rotate(rad*90)
        c.fillRect(-3,-8,14,4)
      //console.log('hi')
      } else if (this.variety == 'yelloworange') {
        c.translate(this.position.x, this.position.y - 10);
        c.rotate(rad*29)
        c.fillStyle = 'rgb(60, 181, 17)'
        c.fillRect(0,4,10,4)
        c.rotate(rad*-58)
        c.fillRect(-2,10,10,3)
        c.rotate(rad*89)
        c.fillRect(-2,-1,12,3)
        c.rotate(rad*50)
        c.fillRect(-2,-10,12,3)
      }
    } else if (this.growthStage == 3) {
      if (this.variety == 'sunflower') {
        c.translate(this.position.x, this.position.y - 10);
        c.rotate(rad*29)
        c.fillStyle = 'rgb(60, 181, 17)'
        c.fillRect(0,4,10,5)
        c.rotate(rad*-58)
        c.fillRect(-2,10,10,5)
        c.rotate(rad*119)
        c.fillRect(-3,-8,14,4)
        c.fillStyle = 'rgb(241, 232, 48)'
        c.fillRect(-17,-10,7,7)
        c.fillRect(-10,-3,7,7)
        c.fillRect(-10,-17,7,7)
        c.fillRect(-3,-10,7,7)
        c.fillStyle = 'rgb(86, 58, 11)'
        c.fillRect(-10,-10,7,7)
      } else if (this.variety == 'yelloworange') {
        c.translate(this.position.x, this.position.y - 10);
        c.rotate(rad*29)
        c.fillStyle = 'rgb(60, 181, 17)'
        c.fillRect(0,4,10,4)
        c.rotate(rad*-58)
        c.fillRect(-2,10,10,3)
        c.rotate(rad*89)
        c.fillRect(-2,-1,12,3)
        c,createCircle(-1,0,4,'yellow')
        c,createCircle(-1,0,3,'orange')
        c.rotate(rad*50)
        c.fillRect(-2,-10,12,3)
        c,createCircle(-4,-8,4,'yellow')
        c,createCircle(-4,-8,3,'orange')
      }
    } 
    c.restore()
  }
  update() {
    if (this.water > 250) this.growthStage = 2
    if (this.water > 500) this.growthStage = 3
    if (this.burnt) this.growthStage = 0
  }
}
class SquidLeg {
  constructor({legPositions}) {
    this.burnt = false
    this.level = 0
    this.type = 'squid'
    this.legPositions = legPositions
    this.position = {x:legPositions.p0.s3.x,y:legPositions.p0.s3.y}
  }
  draw() {
    c.save()
    let {s1,s2,s3} = this.getSegments(this.level)
    //console.log(s3.x)
    c.fillStyle = 'rgb(136, 26, 26)'
    c.fillRect(s1.x,s1.y,s1.w,s1.h)
    c.fillRect(s2.x,s2.y,s2.w,s2.h)
    c.fillRect(s3.x,s3.y,s3.w,s3.h)
    c.restore()
  }
  update() {
    if (this.burnt) {
      if (this.level < 3) {
        this.level += 1
        this.burnt = false
      }
    }
  }
  getSegments(level) {
    let p = null
    if (level == 0) {
      p = this.legPositions.p0
    } else if (level == 1) {
      p = this.legPositions.p1
    } else if (level == 2) {
      p = this.legPositions.p2
    } else {
      p = this.legPositions.p3
    }
    let s1 = p.s1, s2 = p.s2, s3 = p.s3
    this.position.x = s3.x, this.position.y = s3.y
    return {s1,s2,s3}
  }
}
class FireworkExplosion {
  constructor({position,color}) {
    this.position = position
    this.color = color
    this.start = false
    this.particles = []
  }
  draw() {
    this.particles.forEach(p => p.draw())
  }
  update() {
    this.particles.forEach(p => p.update())
  }
  initializeP(p) {
    this.position = p
    this.initializeParticles()
  }
  initializeParticles() {
    for (let i = 0; i < 10; i++) {
      const p = new Particle({
        c: c,
        position: {
          x: this.position.x,
          y: this.position.y
        },
        color: this.color,
        velocity: {
          x: Math.random()*.2 - .1,
          y: Math.random()*.2 - .1
        },
        size: 3
      })
      //console.log(p)
      this.particles.push(p)
    }
    // console.log(this.particles[0].velocity)
    // console.log(this.particles[29].velocity)
    //console.log(this.particles.length)
  }
}
class Firework {
  constructor({ position,velocity,color }) {
    this.position = position
    this.velocity = velocity
    this.color = color
    this.life = 0
    this.expand = false
    this.done = false
    this.expl = new FireworkExplosion({
      position: this.position,
      color: this.color
    })
  }
  draw() {
    if (this.expand) this.expl.draw()
    else {
      c.save()
      c.fillStyle = this.color
      c.fillRect(this.position.x,this.position.y,2,4)
      c.restore()
    }
  }
  update() {
    
    if (this.expand) {
      this.life += 1
      this.expl.update()
    } else {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.velocity.y += .01
      if (this.velocity.y >= 0) {
        if (Math.random() < .05) {
            this.expand = true
            this.expl.initializeP(this.position)
            //console.log(this.expl.color)
          }
      }
    }
    if (this.life > 300) this.done = true
    
  }
  createExplosion() {

  }
}
class FireworkCreator {
  constructor({ position }) {
    this.position = position
    this.fireworks = []
    this.active = false
  }
  draw() {
    this.fireworks.forEach(f => f.draw())
  }
  update() {
    this.fireworks.forEach(f => f.update())
    if (this.active) this.addFirework()
    this.removeFireworks()
  }
  addFirework() {
    // Logic to add firework
    if (Math.random() < .01) { 
      // Chance of creating a new firework 
      const f = new Firework({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          velocity: {
            x: Math.random()*.5 - .25,
            y: -(Math.random()*1.7 + .5)
          },
          color: this.randomColor()
      })
      this.fireworks.push(f)
    }
  }
  removeFirework(i) {
      this.fireworks.splice(i,1)
  }
  removeFireworks() {
      let rem = []
      let i = 0
      this.fireworks.forEach(f => {
          if (f.done) {
              rem.push(i)
          }
          i += 1
      })
      rem.forEach(i => this.removeFirework(i))
  }
  randomColor(){ 
    return('#'+Math.floor(Math.random()*16777215).toString(16));
  }
}
class Planet2Env2 {
  constructor({ position }) {
    // To do:
    // Change concrete x/y values to this.position.x/y + 100
    this.position = position
    this.time = 0
    this.r = 200
    this.strikeTime = 0
    this.raining = false
    this.rain = new WaterFlow({
      c: c,
      position: {
        x: 200,
        y: 165
      },
      floor: 400
    })
    this.rain.flow = false
    this.rain.rain = true
    this.firework = new FireworkCreator({
      position: {x:340,y:346}
    })
    this.firework1 = new FireworkCreator({
      position: {x:260,y:346}
    })
    this.leg1 = new SquidLeg({
      legPositions: {
        p0: {
          s1: {x: 358,y: 444,w: 25,h: 5},
          s2: {x: 380,y: 346,w: 5,h: 101},
          s3: {x: 370,y: 346,w: 19,h: 5},
        },
        p1: {
          s1: {x: 338,y: 444,w: 25,h: 5},
          s2: {x: 337,y: 346,w: 5,h: 101},
          s3: {x: 332,y: 346,w: 19,h: 5},
        },
        p2: {
          s1: {x: 290,y: 444,w: 72,h: 5},
          s2: {x: 290,y: 320,w: 5,h: 128},
          s3: {x: 280,y: 315,w: 19,h: 5},
        },
        p3: {
          s1: {x: 358,y: 444,w: 32,h: 5},
          s2: {x: 385,y: 444,w: 5,h: 10},
          s3: {x: 385,y: 449,w: 35,h: 5},
        }
      }
    })
    this.leg2 = new SquidLeg({
      legPositions: {
        p0: {
          s1: {x: 210,y: 425,w: 97,h: 5},
          s2: {x: 210,y: 347,w: 5,h: 80},
          s3: {x: 199,y: 346,w: 18,h: 5},
        },
        p1: {
          s1: {x: 225,y: 425,w: 82,h: 5},
          s2: {x: 225,y: 347,w: 5,h: 80},
          s3: {x: 220,y: 346,w: 18,h: 5},
        },
        p2: {
          s1: {x: 245,y: 425,w: 47,h: 5},
          s2: {x: 245,y: 320,w: 5,h: 110},
          s3: {x: 236,y: 315,w: 18,h: 5},
        },
        p3: {
          s1: {x: 315,y: 425,w: 47,h: 5},
          s2: {x: 358,y: 415,w: 5,h: 11},
          s3: {x: 358,y: 415,w: 58,h: 5},
        }
      }
    })
    
    this.tops = [{
      startX: 0,
      Y: 400,
      object: 'ground'
    }, {
      startX: 198,
      Y: 351,
      object: 'ground'
    }, {
      startX: 235,
      Y: 320,
      object: 'ground'
    }, {
      startX: 305,
      Y: 351,
      object: 'ground'
    }, {
      startX: 389,
      Y: 400,
      object: 'ground'
    }]
    this.env = new PlanetEnv({
      position: this.position,
      tops: this.tops,
      burnable: [this.leg1,this.leg2]
    })
  }
  update() {
    this.time += 1
    this.env.update()
    this.leg1.update()
    this.leg2.update()
    this.checkFireworkStatus()
    this.firework.update()
    this.firework1.update()
  }
  draw() {
    c.save()
    //this.planetdesc.draw()
    //createCircle(this.position.x,this.position.y,this.r+10,'lightgray')
    createCircle(this.position.x,this.position.y,this.r,'rgb(74, 117, 177)')
    // Ship
    c.fillStyle = 'rgb(182, 182, 182)'
    c.fillRect(230,390,120,10)
    var rad = 30 * Math.PI / 180;
    c.save()
    c.translate(230, 390)
    c.rotate(-rad*1.6)
    c.fillRect(59,80,65,20)
    c.rotate(rad*3.2)
    c.fillRect(-40,-13,60,20)
    c.restore()
    c.fillRect(198,351,190,13)
    c.fillRect(224,364,137,30)
    //c.fillRect(198,351,190,20)
    c.fillStyle = 'rgb(167, 166, 166)'
    c.fillRect(235,320,70,31)
    createCircle(255,336,9,'gray')
    createCircle(285,336,9,'gray')
    createCircle(255,336,7,'lightblue')
    createCircle(285,336,7,'lightblue')
    // Create ground
    c.fillStyle = 'rgb(17, 70, 123)'
    c.fillRect(120,400,360,10)
    c.fillStyle = 'rgb(23, 75, 126)'
    c.fillRect(125,410,345,10)
    c.fillRect(135,420,330,10)
    c.fillRect(145,430,315,10)
    c.fillRect(155,440,290,10)
    c.fillRect(165,450,275,10)
    c.fillRect(180,460,245,10)
    c.fillRect(195,470,210,10)
    c.fillRect(215,480,180,10)
    c.fillRect(230,490,140,10)
    // Kraken
    c.fillStyle = 'rgb(136, 26, 26)'
    c.fillRect(220,450,60,30)
    c.fillRect(270,454,60,20)
    c.fillRect(310,474,60,5)
    c.fillRect(350,479,50,5)
    c.fillRect(330,466,50,5)
    c.fillRect(330,457,30,5)
    //leg 1
    c.fillRect(358,449,5,12)
    c.fillRect(360,463,40,5)
    this.leg1.draw()
    //leg 2
    c.fillRect(328,439,5,18)
    c.fillRect(302,439,30,5)
    c.fillRect(302,425,5,18)
    this.leg2.draw()
    c.fillStyle = 'black'
    c.fillRect(228,456,8,6)
    c.fillRect(228,468,8,6)

    
    this.env.draw()
    this.firework.draw()
    this.firework1.draw()
    //this.rain.draw()
    outlineCircle(this.position.x,this.position.y,this.r+6,'#111',13,1)


    c.restore()
  }
  checkFireworkStatus() {
    if (this.leg1.level == 3 && this.leg2.level == 3) {
      this.firework.active = true
      this.firework1.active = true
    }
  }
}
class Planet2Env1 {
  constructor({ position }) {
    // To do:
    // Change concrete x/y values to this.position.x/y + 100
    this.position = position
    this.time = 0
    this.r = 200
    this.strikeTime = 0
    this.raining = false
    this.rain = new WaterFlow({
      c: c,
      position: {
        x: 200,
        y: 165
      },
      floor: 400
    })
    this.rain.flow = false
    this.rain.rain = true
    this.flower = new Flower({
      position: {
        x: 220,
        y: 400
      },
      variety: 'sunflower'
    })
    this.flower1 = new Flower({
      position: {
        x: 194,
        y: 400
      },
      variety: 'yelloworange'
    })
    this.flower2 = new Flower({
      position: {
        x: 171,
        y: 400
      },
      variety: 'yelloworange'
    })
    this.flower3 = new Flower({
      position: {
        x: 346,
        y: 400
      },
      variety: 'sunflower'
    })
    this.flower4 = new Flower({
      position: {
        x: 375,
        y: 400
      },
      variety: 'yelloworange'
    })
    //this.flower.growthStage = 3
    //this.flower1.growthStage = 3
    this.haybale = new HayBale({
      position: {
        x: 240,
        y: 380
      },
      size: 20
    })
    this.haybale1 = new HayBale({
      position: {
        x: 280,
        y: 380
      },
      size: 20
    })
    this.haybale2 = new HayBale({
      position: {
        x: 310,
        y: 380
      },
      size: 20
    })
    this.barn = {
      position: {
        x: 340,
        y: 380
      },
      size: 100,
      color: '#c2a770'
    }
    
    this.tops = [{
      startX: 0,
      Y: 400,
      object: 'ground'
    }, {
      startX: 240,
      Y: 380,
      object: this.haybale
    }, {
      startX: 260,
      Y: 400,
      object: 'ground'
    }, {
      startX: 280,
      Y: 380,
      object: this.haybale1
    }, {
      startX: 310,
      Y: 380,
      object: this.haybale2
    }, {
      startX: 330,
      Y: 400,
      object: 'ground'
    }]
    this.env = new PlanetEnv({
      position: this.position,
      tops: this.tops,
      burnable: [this.flower,this.flower1,this.flower2,this.flower3,this.flower4],
      waterable: [this.flower,this.flower1,this.flower2,this.flower3,this.flower4,this.haybale,this.haybale1,this.haybale2]
    })
  }
  update() {
    this.time += 1
    this.haybale.update()
    this.haybale1.update()
    this.flower.update()
    this.flower1.update()
    this.haybale2.update()
    this.flower2.update()
    this.flower3.update()
    this.flower4.update()
    this.env.update()
  }
  draw() {
    c.save()
    createCircle(this.position.x,this.position.y,this.r,'rgb(74, 117, 177)')
    // Create ground
    c.fillStyle = 'green'
    c.fillRect(120,400,360,10)
    c.fillStyle = 'rgb(123, 42, 4)'
    c.fillRect(125,410,345,10)
    c.fillRect(135,420,330,10)
    c.fillRect(145,430,315,10)
    c.fillRect(155,440,290,10)
    c.fillRect(165,450,275,10)
    c.fillRect(180,460,245,10)
    c.fillRect(195,470,210,10)
    c.fillRect(215,480,180,10)
    c.fillRect(230,490,140,10)
    outlineCircle(this.position.x,this.position.y,this.r+6,'#111',13,1)
    // Barn
    c.fillStyle = 'rgb(194, 71, 71)'
    c.fillRect(370,350,80,50)
    c.fillRect(390,340,40,10)
    c.fillStyle = 'rgb(239, 219, 219)'
    c.fillRect(390,335,40,5)
    c.fillRect(370,345,20,5)
    c.fillRect(430,345,20,5)
    c.fillRect(390,375,5,25)
    c.fillRect(425,375,5,25)
    c.fillRect(395,375,30,5)
    //haybale
    this.haybale.draw()
    this.haybale1.draw()
    this.flower.draw()
    this.flower1.draw()
    this.haybale2.draw()
    this.flower2.draw()
    this.flower3.draw()
    this.flower4.draw()
    this.rain.draw()

    // Create clouds
    this.env.draw()

    c.restore()
  }
}
class PlanetEnv {
  constructor({ position, tops, burnable=[], waterable=[] }) {
    // To do:
    // Change concrete x/y values to this.position.x/y + 100
    this.position = position
    this.burnable = burnable
    this.waterable = waterable
    this.time = 0
    this.r = 200
    this.strikeTime = 0
    this.raining = false
    this.rain = new WaterFlow({
      c: c,
      position: {
        x: 200,
        y: 165
      },
      floor: 400
    })
    this.rain.flow = false
    this.rain.rain = true
    
    this.tops = tops
  }
  update() {
    this.time += 1
    if (canvas.mouseHeldTime >= 10 && (canvas.mouseX > 170 && canvas.mouseX < 430)) this.raining = true
    else this.raining = false
    if (canvas.strike) { 
      this.lightningStrike(this.burnable)
      canvas.strike = false
      this.strikeTime = 5
    }
    this.rain.update({x:canvas.mouseX-50,y:165})
    if (this.raining) this.rain.flow = true
    else this.rain.flow = false
    this.checkrainlocation(this.waterable)

    //this.lightningStrike()
    //if (this.time % 10 == 0) this.planetdesc.update()
  }
  draw() {
    c.save()
    //this.planetdesc.draw()
    //createCircle(this.position.x,this.position.y,this.r,'rgb(74, 117, 177)')
    //outlineCircle(this.position.x,this.position.y,this.r+6,'#111',13,1)

    this.rain.draw()
    //this.planetdesc.draw()

    // Create clouds
    c.fillStyle = '#f9f4e8'
    c.globalAlpha = .8
    // Lightning minx: 170 maxx: 290
    // y: 160
    // Clouds
    c.fillRect(200,150,150,40)
    c.fillRect(220,120,150,60)
    c.fillRect(210,130,180,70)
    c.fillRect(250,150,180,40)
    c.fillRect(170,155,180,40)

    c.restore()
  }
  inXRange(xmin,xmax,x) {
    if (x > xmin && x < xmax) return true
    return false
  }
  addWaterGrowth(obj,x) {
    if (obj.type == 'flower') {
      if (this.inXRange(obj.position.x-4,obj.position.x+16,x)) {
        obj.water += 1
      }
    } else if (obj.type == 'haybale') {
      if (this.inXRange(obj.position.x,obj.position.x+20,x)) obj.water += 1
    }
  }
  checkrainlocation(waterable) {
    let w = this.rain.water
    if (w.length > 5) {
      for (let i = 0; i < 5; i++) {
        if (w[i].falling == false) {
          let x = w[i].position.x
          waterable.forEach(obj => {
            this.addWaterGrowth(obj,x)
          })     
        }
      }
    }
  }
  lightningStrike(burnable) {
    var x = canvas.mouseX
    //console.log(x)
    var ceiling = 165
    var floor = this.tops[0].Y
    burnable.forEach(obj => {
      let posX = obj.position.x
      if (obj.type == 'squid' && x > posX && x < posX+18) obj.burnt = true
      else if (x > posX-4 && x < posX+16) obj.burnt = true
    })
    // If in lightning x range
    if (x > 170 && x < 430) {
      //console.log('lightning')
      for (let i = 0; i < this.tops.length; i++) {
        if (this.tops[i].startX > x) {
          floor = this.tops[i-1].Y
          let obj = this.tops[i-1].object
          if (obj != 'ground' && obj.type == 'haybale') {
            obj.burning = true
          }
          break
        }
      }
      // Number of lightning segments
      let segm = 3//Math.floor(Math.random()*4)
      let segLength = (floor - ceiling) / segm
      //console.log(ceiling)
      let dev = Math.floor(segLength * .5)
      c.save()
      c.lineWidth = 5
      c.strokeStyle = 'yellow'
      c.shadowBlur = 10
      c.shadowColor = 'yellow'
      let tempdev = -20
      let cy = ceiling
      let linestart = x
      let flip = 1
      if (Math.random() < .5) flip *= -1
      //console.log(dev)
      for (let i = 0; i < segm; i++) {
        c.beginPath();
        c.moveTo(linestart,cy-2);
        cy += segLength
        tempdev = Math.random()*dev
        tempdev *= flip
        flip *= -1
        linestart += tempdev
        if (segm-1 == i) linestart = x
        c.lineTo(linestart,cy);
        c.stroke()
      }
      c.restore()

    }
  }
  randomColor(){ 
    return('#'+Math.floor(Math.random()*16777215).toString(16));
  }
}
class Planet2 {
  constructor({ position }) {
    // To do:
    // Change concrete x/y values to this.position.x/y + 100
    this.position = position
    this.time = 0
    this.inMap = true
    this.inBarn = false
    this.inShip = false
    this.r = 200
    this.barnEnv = new Planet2Env1({position:this.position})
    this.shipEnv = new Planet2Env2({position:this.position})
    this.planetdesc = new PlanetDesc({
      position: this.position,
      description: ['LinkedIn Planet',
        'Click anywhere on planet to enter linkedIn',
        'Otherwise click location to enter',
        'Hold left mouse down for rain',
        'Right click to strike lightning',
      ],
      offset: {
        x: 0,
        y: -4
      }
    })
    this.barn = {
      position: {
        x: 340,
        y: 380
      },
      size: 100,
      color: '#c2a770'
    }
  }
  update() {
    this.time += 1
    if (this.time % 3 == 0) this.planetdesc.update()
    if (this.inMap) { 
      this.enterLocation()
    }
    if (this.inBarn) {
      this.barnEnv.update()
      this.exitLocation()
    } else if (this.inShip) {
      this.shipEnv.update()
      this.exitLocation()
    }
  }
  draw() {
    c.save()
    this.planetdesc.draw()
    if (this.inMap) {
      this.createMap()
    } else if (this.inBarn) {
      this.barnEnv.draw()
      this.createReturn()
    } else if (this.inShip) {
      this.shipEnv.draw()
      this.createReturn()
    }
    c.restore()
  }
  createMap() {
    createCircle(this.position.x,this.position.y,this.r,'rgb(12, 49, 101)')
    c.fillStyle = 'rgb(8, 79, 9)'
    c.fillRect(200,200,50,100)
    c.fillRect(230,170,50,100)
    c.fillRect(180,200,50,30)
    c.fillRect(195,190,50,50)
    c.fillRect(250,200,10,80)
    c.fillRect(230,400,150,50)
    c.fillRect(240,450,100,10)
    c.fillRect(300,350,100,80)
    c.fillRect(270,380,30,30)
    c.fillRect(100,280,30,80)
    c.fillRect(130,290,20,50)
    c.fillRect(430,160,20,50)
    c.fillRect(430,165,30,50)
    c.fillRect(440,175,30,50)
    c.fillRect(460,187,20,34)
    c.fillRect(425,163,10,30)
    outlineCircle(this.position.x,this.position.y,this.r+6,'#111',13,1)
      
    // Barn location (x: 310-340, y: 387-410)
    c.fillStyle = 'rgb(194, 71, 71)'
    c.fillRect(310,390,30,20)
    c.fillRect(318,387,15,4)
    c.fillStyle = 'rgb(239, 219, 219)'
    c.fillRect(318,385,15,2)
    c.fillRect(310,388,8,2)
    c.fillRect(333,388,7,2)
    c.fillRect(318,400,2,10)
    c.fillRect(329,400,2,10)
    c.fillRect(320,400,10,2)

    // Ship location (x: 374-404, y: 250-280)
    c.fillStyle = 'rgb(182, 182, 182)'
    c.fillRect(380,260,20,10)
    var rad = 30 * Math.PI / 180;
    c.save()
    c.translate(380, 260)
    c.rotate(-rad*2)
    c.fillRect(1,12,10,10)
    c.rotate(rad*4)
    c.fillRect(-2,-4,10,10)
    c.restore()
    c.fillRect(374,257,30,5)
    c.fillStyle = 'rgb(167, 166, 166)'
    c.fillRect(379,250,20,7)
    createCircle(385,254,2,'lightblue')
    createCircle(393,254,2,'lightblue')
  }
  createReturn() {
    // x: 270-330, y: 417-443
    c.fillStyle = 'rgb(36, 35, 35)'
    c.fillRect(270,420,60,20)
    c.fillRect(280,417,40,5)
    c.fillRect(280,438,40,5)
    c.font = "bold 15px Arial";
    c.fillStyle = '#eee'
    c.fillText('Return',276,435,50)
  }
  enterLocation() {
    // Ship location (x: 374-404, y: 250-280)
    if (canvas.mouseDown == true) {
      let x = canvas.mouseX
      let y = canvas.mouseY
      if (x >= 310 && x <= 340 && y >= 387 && y <= 410) {
        this.inBarn = true
        this.inMap = false
        //canvas.onMap = false
      } else if (x >= 374 && x <= 404 && y >= 250 && y <= 280) {
        this.inShip = true
        this.inMap = false
      }
    }
  }
  exitLocation() {
    if (canvas.mouseDown == true) {
      let x = canvas.mouseX
      let y = canvas.mouseY
      
      if (x >= 270 && x <= 330 && y >= 417 && y <= 443) {
        this.inBarn = false
        this.inShip = false
        this.inMap = true
        //canvas.onMap = false
      }
    }
  }
  randomColor(){ 
    return('#'+Math.floor(Math.random()*16777215).toString(16));
  }
}
const p = new Planet({
    position: {
      x: 300,
      y: 300
  }
})
const p1 = new Planet1({
  position: {
    x: 1000,
    y: 450
  }
})
const p2 = new Planet2({
  position: {
    x: 300,
    y: 300
  }
})
const sm = new StarMaker({c})
function animate() {
    window.requestAnimationFrame(animate)
    onmousemove = function(e){
      canvas.mouseX = e.clientX
      canvas.mouseY = e.clientY
    }
    onmousedown = function(e) {
      canvas.mouseDown = true
      canvas.interval = setInterval(()=>{
          canvas.mouseHeldTime += 1
      },50)
    }
    onmouseup = function(e) {
      canvas.mouseDown = false
      if (e.button === 0 && canvas.mouseHeldTime < 4) {
        // Go to link
        let fromP1 = Math.sqrt( Math.pow((e.clientY - canvas.p1.y), 2) + Math.pow((e.clientX - canvas.p1.x), 2) )
        let fromP2 = Math.sqrt( Math.pow((e.clientY - canvas.p2.y), 2) + Math.pow((e.clientX - canvas.p2.x), 2) )
        if (fromP1 < canvas.planetRadius) window.location.href = 'https://github.com/Lucarik';
        if (fromP2 < canvas.planetRadius) {
          let x = e.clientX
          let y = e.clientY
          if (!canvas.onMap && x >= 270 && x <= 330 && y >= 417 && y <= 443) canvas.onMap = true
          else if ((canvas.onMap && x >= 310 && x <= 340 && y >= 387 && y <= 410) || 
              (canvas.onMap && x >= 374 && x <= 404 && y >= 250 && y <= 280)) canvas.onMap = false
          else window.location.href = 'https://www.linkedin.com/in/justin-sterling-06b806232';
        }
      }
      clearInterval(canvas.interval)
      canvas.interval = null;
      canvas.mouseHeldTime = 0;
      
    }
    oncontextmenu = function(e){
      clearInterval(canvas.interval)
      canvas.interval = null;
      canvas.mouseHeldTime = 0;
      let fromP1 = Math.sqrt( Math.pow((e.clientY - canvas.p1.y), 2) + Math.pow((e.clientX - canvas.p1.x), 2) )
      let fromP2 = Math.sqrt( Math.pow((e.clientY - canvas.p2.y), 2) + Math.pow((e.clientX - canvas.p2.x), 2) )
      if (fromP1 < canvas.planetRadius || fromP2 < canvas.planetRadius) e.preventDefault()
      else window.location.href = './index.html'
      if (fromP2 < canvas.planetRadius) canvas.strike = true
      canvas.spawnPowerUp = true
    
    }
    // add gray background
    c.fillStyle = 'rgb(39,39,42)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    sm.draw()
    sm.update()
    p2.draw()
    p2.update()
    if (window.innerWidth > 1000) {
      p1.draw()
      p1.update()
    }
    //drawLogo(10,300)
}
//createCircle(200,0,200,'red')
//c.fillStyle = '#000';
// c.clearRect(0, 0, c.canvas.width, c.canvas.height);
//c.fillRect(0, 0, c.canvas.width, c.canvas.height);
var mycanvas = document.createElement("canvas");
mycanvas.id = "mycanvas";
var maxWidth = window.innerWidth;
var maxHeight = window.innerHeight;
mycanvas.width = maxWidth;
mycanvas.height = maxHeight;
mycanvas.style.position = 'fixed';
mycanvas.style.zIndex = '1';
document.body.appendChild(mycanvas);
var c1 = mycanvas.getContext('2d');

function flashlight(context, x, y, radius) {
    // first reset the gCO
    context.globalCompositeOperation = 'source-over';
    // Paint the canvas black.
    context.fillStyle = '#000';
    context.clearRect(0, 0, maxWidth, maxHeight);
    context.fillRect(0, 0, maxWidth, maxHeight);

    context.beginPath();
    let radialGradient = c.createRadialGradient(x, y, 1, x, y, radius);
    radialGradient.addColorStop(.8, 'rgba(255,255,255,1)');
    radialGradient.addColorStop(1, 'rgba(0,0,0,0)');

    context.globalCompositeOperation = "destination-out";

    context.fillStyle = radialGradient;
    context.arc(x, y, radius, 0, Math.PI*2, false);
    context.fill();
    context.closePath();
}
function drawLogo(x,y) {
  c.strokeStyle = 'rgb(138, 221, 233)'
  c.strokeRect(x,y,100,100)
  drawL(x+2,y+2)
}
flashlight(c1,250,550,300)
mycanvas.addEventListener('mousemove', (event) => {
  let x = event.clientX;
  let y = event.clientY;
  let radius = 300;
  flashlight(c1,x,y,radius)
})

//drawLogo(10,300)
//setInterval(render, 10)

animate()
//render()
//setInterval(render, 10)
// To do
// When mouse over planet logo and planet name/information
// appear on top-left corner. Light blue text appears slowly vn style