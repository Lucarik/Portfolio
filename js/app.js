// grab canvas from html and get "context" to make use of canvas API
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
function createHiPPICanvas(width, height) {
    const ratio = window.devicePixelRatio;
    const canvas = document.createElement("canvas");

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").scale(ratio, ratio);

    return canvas;
}

//Create canvas with the device resolution.
//const canvas = createHiPPICanvas(100, 500);
////const c = canvas.getContext('2d')
// make canvas full width and height of the screen
canvas.width = innerWidth
canvas.height = innerHeight
c.imageSmoothingEnabled = 'false'

class Particle {
    constructor({ position, color, velocity = { x: 0, y: 0 }}) {
        this.position = position
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    update() {
        this.velocity.x *= .98
        this.velocity.y *= .98
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.alpha *= .98
        //c.globalAlpha = .01
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 8, 8)
        c.restore()
    }
}
class ParticleEffect {
    constructor({ position, colors, velocity={x:0,y:0} }) {
        this.position = position
        this.colors = colors
        this.velocity = velocity
        let p = new Particle({
            position: {
                x: center.x + 50,
                y: center.y
            },
            color: 'yellow'
        })
        this.particles = [p]
    }

    update() {
        this.particles.forEach(particle => particle.update())
        this.addParticles()
        this.removeParticles()
    }

    draw() {
        this.particles.forEach(particle => particle.draw())
    }

    addParticles() {
        // Logic to add new particles
        //console.log('hi')
        //console.log(-(this.velocity.x * (Math.random()*2)))
        let vx = -(this.velocity.x * (Math.random()*2))
        let vy = -(this.velocity.y * (Math.random()*2))
        if (Math.random() < 0.05) { // Chance of creating a new particle
            const particle = new Particle({
                position: {
                    x: this.position.x + (Math.random()*30)-15,
                    y: this.position.y + (Math.random()*30)-15
                },
                color: this.colors[Math.floor(Math.random() * 3)],
                velocity: {x: vx, y: vy}
            })
            this.particles.push(particle)
        }
    }

    removeParticles() {
        // Logic to remove particles
        //this.particles = this.particles.filter(particle => {
        //    return particle.position.x < this.width && particle.position.y < this.height
        //})
        if (this.particles.length > 10) {
            this.particles.shift()
        } 
    }
}
class Box extends ParticleEffect { // Inherit from ParticleEffect class
    constructor({
        position = { x: 0, y: 0 },
        color = 'red',
        colors = ['red','yellow','orange'],
        width = 100,
        height = 100,
        velocity = { x: 0, y: 0 },
        trail = false,
        stroke = false,
        deceleration = 1
    }) {
        super({ position, colors, velocity }); // Call ParticleEffect constructor
        this.width = width
        this.color = color
        this.colors = colors
        this.height = height
        this.velocity = velocity
        this.trail = trail
        this.stroke = stroke
        this.deceleration = deceleration
    }
    draw() {
            c.save()
            if (this.stroke) {
                c.strokeStyle = this.color
                c.globalAlpha = .3
                c.strokeRect(this.position.x, this.position.y, this.width, this.height)
            }
            if (this.trail) super.draw()
            c.restore()
        }
    
  
    update() {
        if (this.trail) super.update(); // Call ParticleEffect update method
        this.velocity.x *= this.deceleration
        this.velocity.y *= this.deceleration
        if (this.position.x > innerWidth || this.position.y > innerHeight) {
            this.velocity.x = 0
            this.velocity.y = 0
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class LetterBox extends Box { // Inherit from ParticleEffect class
    constructor({
        position = { x: 0, y: 0 },
        color = 'red',
        width = 70,
        height = 75,
        velocity = { x: 0, y: 0 },
        text = '',
        fontSize = 5,
        trail = false,
        deceleration = 1,
        
    }) {
        super({ position, color, velocity }); // Call ParticleEffect constructor
        this.text = text; // Call Text class constructor
        this.fontSize = fontSize
        this.width = width
        this.height = height
        this.velocity = velocity
        this.active = false
        this.trail = trail
        this.deceleration = deceleration
        this.onFire = false
        this.heldWater = 0
        this.fire = new Fire({
            position: {
                x: 0,
                y: 0
            }
        })
    }
    draw() {
        if (this.onFire) {
            this.fire.draw()
        }
        super.draw()
        c.save()
        c.globalAlpha = .8
        c.fillStyle = 'white';
        c.font = `bold ${this.fontSize}rem arial`
        c.fillText(this.text,(this.position.x + this.width/2)-22, (this.position.y+this.height/2)+25); // Draw text
        c.restore()
        
    }
    
  
    update() {
        super.update()
        if (this.heldWater > 499) {
            this.onFire = false
            this.heldWater = 0
        }
        if (this.onFire) this.fire.update(this.position)
    }
}
class Meteor extends Box {
    constructor({
        position = { x: 0, y: 0 },
        color = 'red',
        width = 50,
        height = 50,
        velocity = { x: 0, y: 0 },
        trail = true
    }) {
        super({ position, color, width, height, velocity, trail })
        this.collision = false
        this.done = false
        this.rad = 1 * Math.PI / 180
    }
    drawRect(rad,color,alpha=1) {
        c.save()
        c.shadowBlur = 20;
        c.shadowColor = color;
        c.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        c.rotate(rad*this.rad)
        c.translate(-this.width/2, -this.height/2);
        c.globalAlpha = alpha
        c.fillStyle = color
        c.fillRect(0, 0, this.width, this.height)
        c.restore()
    }
    draw() {
        //var rad = 30 * Math.PI / 180
        var rad = 5 * Math.PI / 180
        this.drawRect((rad*30),'black')
        this.drawRect((rad*30)*2,'red')
        this.drawRect((rad*30)*3,'orange',.4)
        c.save()
        c.globalAlpha = .7
        c.strokeStyle = 'white'
        //c.strokeRect(this.position.x,this.position.y,this.width,this.height)
        c.restore()
        super.draw()
        if (this.collision) {
            createCircle(this.position.x+25,this.position.y+25,80,'red',.7)
            createCircle(this.position.x+25,this.position.y+25,60,'orange',.9)
            this.done = true
        }
    }
  
    update() {
        super.update(); // Call ParticleEffect update method
        if (this.velocity.x == 0 || this.velocity.y == 0) {
            this.collision = true
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.rad > 1000) this.rad = 0
        this.rad += .1
    }
}
class MeteorMaker {
    constructor () {
        this.meteors = []
    }
    update() {
        this.meteors.forEach(meteor => meteor.update())
        this.addMeteors()
        this.removeMeteors()
    }

    draw() {
        this.meteors.forEach(meteor => meteor.draw())
    }

    addMeteors() {
        // Logic to add new meteors
        //console.log('hi')
        //console.log(-(this.velocity.x * (Math.random()*2)))
        let vx = Math.random()*2
        let vy = Math.random()*2
        if (Math.random() < 0.002) { // Chance of creating a new particle
            const meteor = new Meteor({
                position: {
                    x: Math.random()*300-150,
                    y: 0
                },
                color: 'red',
                velocity: {x: vx, y: vy}
            })
            this.meteors.push(meteor)
        }
    }

    removeMeteor(i) {
        this.meteors.splice(i,1)
    }
    removeMeteors() {
        let rem = []
        let i = 0
        //console.log(this.meteors.length)
        this.meteors.forEach(meteor => {
            if (meteor.done) {
                rem.push(i)
            }
            //console.log(rem.length)
            i += 1
            //console.log("hi")
            
        })
        //console.log(rem.length)
        rem.forEach(i => this.removeMeteor(i))
    }
}

class Star {
    constructor({ position}) {
        this.position = position
        this.alpha = .2
        this.fading = false
        this.done = false
    }

    update() {
        if (!this.fading) {
            this.alpha *= 1.01
        }
        else {
            this.alpha *= .99
        }
        if (Math.random() < 0.002) {
            this.fading = true
        }
        if (this.alpha < .2) this.done = true
        //c.globalAlpha = .01
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.fillStyle = "white"
        c.shadowBlur = 5;
        c.shadowColor = "white";
        c.fillRect(this.position.x, this.position.y, 2, 5)
        c.fillRect(this.position.x, this.position.y, -3, 2)
        c.fillRect(this.position.x, this.position.y, 5, 2)
        c.fillRect(this.position.x, this.position.y, 2, -3)
        c.fillStyle = "gray"
        c.fillRect(this.position.x, this.position.y, 1, 1)
        c.restore()
    }
}
class StarMaker {
    constructor () {
        this.stars = []
    }
    update() {
        this.stars.forEach(star => star.update())
        this.addStars()
        this.removeStars()
    }

    draw() {
        this.stars.forEach(star => star.draw())
    }

    addStars() {
        // Logic to add new stars
        if (Math.random() < 0.01) { // Chance of creating a new particle
            const star = new Star({
                position: {
                    x: Math.random()*innerWidth,
                    y: Math.random()*innerHeight
                }
            })
            this.stars.push(star)
        }
    }
    removeStar(i) {
        this.stars.splice(i,1)
    }
    removeStars() {
        let rem = []
        let i = 0
        this.stars.forEach(star => {
            if (star.done) {
                rem.push(i)
            }
            i += 1
        })
        rem.forEach(i => this.removeStar(i))
    }
}
class Water {
    constructor({position={ x: 100, y: 100 }}) {
        this.position = position
        this.width = 3
        this.height = 2
        this.velocity = { x: 0, y: 2 }
        this.falling = true
        this.dropWidth = 10
        this.dropHeight = -6
        this.displacement = 3
        this.initialSplash = true
        this.splash = false
        this.done = false
        this.pf = new ParticleEffect({
            position:this.position,
            colors:['lightblue','aliceblue','babyblue'],
            velocity:this.velocity
        })
        
    }
    draw() {
        if (!this.done) {
        c.save()
        c.fillStyle = 'lightblue'
        if (this.falling) {
            c.fillRect(this.position.x,this.position.y,this.width,this.height)
            
        }
        else {
            if (!this.splash) c.fillRect(this.position.x - this.displacement,this.position.y,this.dropWidth,this.dropHeight)
            this.dropHeight += .4
            this.dropWidth += 4
            this.displacement += 2 
            if (this.dropHeight >= 1) this.done = true
        }
        if (this.splash) {
            //console.log(this.initialSplash)
            this.pf.draw()
            //c.fillRect(this.position.x+(Math.random()*30)-15,this.position.y-(Math.random()*10),1,1)
        }
        c.restore()
        }
    }
    update() {
        if (this.falling) {
            if (this.position.y > innerHeight - 4) this.falling = false
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
        if (this.splash) this.pf.update()
    }
}
class WaterFlow {
    constructor(position={x:100,y:100}) {
        this.position = position
        this.water = []
        
    }
    draw() {
        this.water.forEach(w => w.draw())
    }
    update(p) {
        this.position.x = p.x
        this.position.y = p.y
        this.water.forEach(w => w.update())
        this.addWater()
        this.removeWaters()
    }
    addWater() {
        
        // Logic to add water
        if (Math.random() < .8) { // Chance of creating a new particle
            
            const w = new Water({
                position: {
                    x: this.position.x+50,
                    y: this.position.y+17
                }
            })
            this.water.push(w)
            //console.log(this.water.length)
        }
    }
    removeWater(i) {
        this.water.splice(i,1)
    }
    removeWaters() {
        let rem = []
        let i = 0
        this.water.forEach(w => {
            if (w.done) {
                rem.push(i)
            }
            i += 1
        })
        rem.forEach(i => this.removeWater(i))
    }
}
class Bucket{ // Inherit from ParticleEffect class
    constructor(position = { x: 50, y: 100 }) {
        this.position = position
        this.waterflow = new WaterFlow(position=this.position)
        this.width = 50
        this.height = 50
        this.active = false
        this.velocity = { x: 0, y: 2 }
        
    }
    draw() {
        c.save()
        c.fillStyle = 'gray'
        //c.strokeStyle = 'white'
        c.globalAlpha = 1
        //c.strokeRect(this.position.x, this.position.y, this.width, this.height)
        var rad = 30 * Math.PI / 180;
        c.translate(this.position.x + this.width-42, this.position.y-this.height+53)
        c.rotate(rad)
        c.fillRect(5, -10, this.width-10, this.height-10)
        c.fillStyle = 'lightblue'
        c.rotate(rad)
        c.rotate(rad)
        c.rotate(rad)
        c.fillRect(-10, -45, 2, this.height-10)
        c.restore()
        this.waterflow.draw()
    }
    
  
    update() {
        if (this.position.x > innerWidth || this.position.y > innerHeight-this.height) {
            this.velocity.x = 0
            this.velocity.y = 0
        } else {
            this.velocity.x *= .96
            this.velocity.y = 2
        }
        if (!this.active) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
        this.waterflow.update(this.position)
    }
}
class FireParticle {
    constructor({ position, size=50, color}) {
        this.position = position
        size = Math.random() * ((size+10) - (size-20)) + (size-20)
        this.height = size
        this.width = size
        this.color = color
        this.alpha = .5
        var rad = 30 * Math.PI / 180
        this.rotation = rad*(Math.random()*12)
    }

    update() {
        this.alpha *= .98
        if (Math.random() < .001) this.rotation = (30 * Math.PI / 180)*(Math.random()*12)
    }

    draw() {
        c.save()
        //c.strokeStyle = 'white'
        //c.strokeRect(this.position.x, this.position.y, this.width, this.height)
        c.globalAlpha = this.alpha
        c.fillStyle = this.color
        var rad = 30 * Math.PI / 180;
        c.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        c.rotate(this.rotation)
        c.translate(-this.width/2, -this.height/2);
        c.fillRect(0, 0, this.width, this.height)
        c.restore()
    }
}
class Fire {
    constructor({ position,on=true }) {
        this.position = {position}
        this.colors = ['red','yellow','orange']
        this.fire = []
    }

    update(p=this.position) {
        this.position = p
        this.fire.forEach(f => f.update())
        this.addFire()
        this.removeFires()
    }

    draw() {
        this.fire.forEach(f => f.draw())
    }

    addFire() {
        // Logic to add new dire
        if (Math.random() < 0.05) { // Chance of creating a new particle
            const f = new FireParticle({
                position: {
                    // fire location:
                    // x: position + offset + random
                    x: this.position.x + 25 + (Math.random()*30)-15,
                    y: this.position.y + 25 + (Math.random()*30)-15
                },
                color: this.colors[Math.floor(Math.random() * 3)]
            })
            this.fire.push(f)
        }
    }

    removeFires() {
        // Logic to remove particles
        //this.particles = this.particles.filter(particle => {
        //    return particle.position.x < this.width && particle.position.y < this.height
        //})
        if (this.fire.length > 10) {
            this.fire.shift()
        } 
    }
}
class Moon { // Inherit from ParticleEffect class
    constructor({
        position = { x: 0, y: 0 },
        color = 'white',
        width = 250,
        height = 250,
        text = 'Projects',
        fontSize = 3
    }) {
        this.position = position
        this.text = text
        this.width = width
        this.color = color
        this.height = height
        this.fontSize = fontSize
        this.fillText = false
        this.luminescence = 30
        this.minLum = this.luminescence - 20
        this.maxLum = this.luminescence + 20
    }
    draw() {
            c.save()
            //c.strokeStyle = this.color
            //c.globalAlpha = .3
            //c.strokeRect(this.position.x, this.position.y, this.width, this.height)
            c.shadowBlur = this.luminescence
            c.shadowColor = this.color
            createCircle(this.position.x+125,this.position.y+125,125,'lightgray',.9)
            createCircle(this.position.x+125,this.position.y+125,110,'#ff0',.5)
            c.globalAlpha = .7
            c.shadowColor = 'lightgray'
            c.shadowBlur = 1
            c.strokeStyle = 'lightgray'
            c.font = `bold ${this.fontSize}rem arial`
            c.strokeText(this.text,(this.position.x + this.width/2)-93, (this.position.y+this.height/2)+15)
            if (this.fillText) {
                c.fillStyle = '#d9d9d9' 
                c.fillText(this.text,(this.position.x + this.width/2)-93, (this.position.y+this.height/2)+16)
            }
            c.restore()
        }
    
  
    update() {
        var val = Math.random() * (1.5 - -1.5) + -1.5 
        if (this.luminescence + val > this.minLum && this.luminescence < this.maxLum) {
            this.luminescence += val
        } else this.luminescence -= val
    }
}
// get canvas center
const center = {

    x: canvas.width / 2,
    y: canvas.height / 2
}
const star = new Star({
    position: {
        x: center.x - 100,
        y: center.y - 50
    }
})
const sm = new StarMaker()
// instantiate box with left offset

var nameArray = "JustinSterling"

function createNameBoxes(name) {
    var temp = []
    var i = 0
    for (const character of name) {
        if (character == character.toUpperCase()) i += 70
        const box = new LetterBox({
            position: {
                x: i,
                y: center.y - 50
            },
            color: 'blue',
            deceleration: .99,
            text: character
        })
        i += 70
        temp.push(box)
    }
    return temp
}
const coords = [0,-10,-15,-22,-39,-65,-100,-98,-119,-124,-137,-157,-178,-182]
function setBoxes(boxes) {
    var i = 0
    var j = 0
    console.log(coords[i])
    boxes.forEach(box => {
        if (box.text == box.text.toUpperCase()) i += 70
        box.position = {
            x: i+coords[j],
            y: center.y - 50
        }
        box.velocity = {
            x: 0,
            y: 0
        }
        box.onFire = false
        i += 70
        j += 1
    })
}
//console.log(bxs[2].text)
const bxs = createNameBoxes(nameArray)
setBoxes(bxs)
const box1 = new LetterBox({
position: {
    x: center.x - 150,
    y: center.y - 50
},
color: 'red',
velocity: {
    x: 0,
    y: 1
},
text: 'J'
})

// instantiate box with right offset
const box2 = new LetterBox({
position: {
    x: center.x - 200,
    y: center.y - 50
},
color: 'blue',
text: 'u',
deceleration: .99
})
const box3 = new LetterBox({
    position: {
        x: center.x - 100,
        y: center.y - 50
    },
    color: 'blue',
    text: 's',
    deceleration: .99
})
const box4 = new LetterBox({
    position: {
        x: center.x + 0,
        y: center.y - 50
    },
    color: 'blue',
    text: 't',
    deceleration: .99
})
const box5 = new LetterBox({
    position: {
        x: center.x + 100,
        y: center.y - 50
    },
    color: 'blue',
    text: 'i',
    deceleration: .99
})
const box6 = new LetterBox({
    position: {
        x: center.x + 200,
        y: center.y - 50
    },
    color: 'blue',
    text: 'n',
    deceleration: .99
})
const box7 = new LetterBox({
    position: {
        x: 0,
        y: innerHeight
    },
    color: 'blue',
    text: 'a',
    deceleration: .99
})
const rbox = new LetterBox({
    position: {
        x: 10,
        y: 10
    },
    width: 60,
    height:60,
    text: '↺',
    fontSize: 4
})
const bucket = new Bucket()

//const boxes = [box1,box2,box3,box4,box5,box6,box7]
//const draggable = [box1,box2,box3,box4,box5,box6,box7,bucket]
const draggable = bxs
draggable.push(bucket)
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

function randomColor(){ 
    return('#'+Math.floor(Math.random()*16777215).toString(16));
}

function drawBoxes() {
    //console.log()
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    draggable.forEach((item) => {
        item.draw()
    });
}

function getClientCoordinates(e) {
    var canvasRect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / canvasRect.width
    var scaleY = canvas.height / canvasRect.height
    return {
        x: (e.clientX - canvasRect.left) * scaleX,
        y: (e.clientY - canvasRect.top) * scaleY,
    };
}

function IsThePointerInTheObject(x, y, object) {
    const scaledWidth = object.width
    const scaledHeight = object.height
    let centerX = object.position.x + object.width / 2
    let centerY = object.position.y + object.height / 2
    let newX = centerX - scaledWidth / 2
    let newY = centerY - scaledHeight / 2
    if (
        x >= newX &&
        x <= newX + scaledWidth &&
        y >= newY &&
        y <= newY + scaledHeight
    ) {
        return true;
    }
    return false;
}

canvas.addEventListener('mousedown', (event) => {
    let coordinates = getClientCoordinates(event);
    draggable.forEach((item) => {
        item.active = false;
    });
    for (let obj of draggable) {
        if (IsThePointerInTheObject(coordinates.x, coordinates.y, obj)) {
            //console.log('moving box1')
            isDragging = true;
            offsetX = coordinates.x - obj.position.x;
            offsetY = coordinates.y - obj.position.y;
            obj.active = true;
            break;
        }
    }
    // reset button
    if (IsThePointerInTheObject(coordinates.x, coordinates.y, rbox)) {
        setBoxes(bxs)
    }
    if (IsThePointerInTheObject(coordinates.x, coordinates.y, moon)) {
        window.location.href = './projects/projectPage.html';
    }
})

canvas.addEventListener('mousemove', (event) => {
    let coordinates = getClientCoordinates(event);
    
    if (isDragging) {
        //console.log('moving box')
        //console.log('moving box')
        let activeObject = draggable.find((dr) => dr.active === true);
        if (activeObject) {
            activeObject.position.x = coordinates.x - offsetX;
            activeObject.position.y = coordinates.y - offsetY;
        }
        drawBoxes();
    }
    if (IsThePointerInTheObject(coordinates.x, coordinates.y, moon)) {
        moon.fillText = true
    } else {
        moon.fillText = false
    }
})


canvas.addEventListener('mouseup',
    (e) => {
        isDragging = false;
        //console.log('moving box')
        drawBoxes()
})

const meteor1 = new Meteor({
    position: {
        x: center.x + 100,
        y: center.y + 100
    },
    color: 'red'
})

const particle = new ParticleEffect({
    position: {
        x: center.x + 50,
        y: center.y - 50
    },
    colors: ['red','yellow','orange'],
    velocity: {x: 2, y: 2}
})

const water = new Water({})
//const wf = new WaterFlow()
const mm = new MeteorMaker()
const moon = new Moon({
    position: {
        x: innerWidth - 300,
        y:50
    }
})

// add gray background
//c.fillStyle = 'rgb(39,39,42)'
//c.fillRect(0, 0, canvas.width, canvas.height)

// draw boxes
//box1.draw()
//box2.draw()

function createCircle(x,y,size,color,transparency=1) {
    c.save()
    c.globalAlpha = transparency
    c.beginPath()
    c.arc(x, y, size, 0, 2 * Math.PI)
    c.fillStyle = color
    c.fill()
    //c.lineWidth = 1;
    //c.strokeStyle = "black";
    //c.stroke();
    c.restore()
}
const fp = new FireParticle({
    position: {
        x: 300,
        y: 400
    },
    color: 'orange'
})
const fire = new Fire({
    position: {
        x: 300,
        y: 400
    }
})
function animate() {
    window.requestAnimationFrame(animate)
  
    // add gray background
    c.fillStyle = 'rgb(39,39,42)'
    c.fillRect(0, 0, canvas.width, canvas.height)
  
    // draw boxes
    //box1.draw()
    bxs.forEach(box => box.draw())
    //particle.draw()
    //meteor1.draw()
    
    star.draw()
    sm.draw()
    moon.draw()
    bucket.draw()
    mm.draw()
    rbox.draw()
    //fp.draw()
    //fire.draw()
    //water.draw()
    //wf.draw()
    
    box1.text = particle.particles.length
    collisionMeteor(mm,bxs)
    collisionWater(bucket,bxs)
    // update x position before render
    //box1.position.x += box1.velocity.x
    //particle.update()
    //box1.update()
    //meteor1.update()
    bxs.forEach(box  => box.update())
    mm.update()
    star.update()
    sm.update()
    bucket.update()
    rbox.update()
    moon.update()
    //fp.update()
    //fire.update()
    //water.update() 
    //wf.update()
    
    
    //box1.color = 'green'
    //box2.color = 'green'
    // detect for collision (will they collide and should we render the next frame?)
    
}
function hitcollision(x, y,mult=1,dis=10) {
    return (
        x.position.x + (x.width-dis) >= y.position.x &&
        y.position.x + (y.width*mult) >= x.position.x &&
        x.position.y + (x.height-dis/2) >= y.position.y &&
        y.position.y + (y.height*mult) >= x.position.y
    )
}
function collisionMeteor(meteorMaker, boxes) {
    let collided = false
    let i = 0
    //const meteors = meteorMaker
    const meteors = meteorMaker.meteors
    meteors.forEach(function(meteor) {
        //console.log(meteor.position)
        boxes.forEach((box) => {
            if (
                hitcollision(meteor,box)
              ) {
                //createCircle(meteor.position.x+40,meteor.position.y+50)
                box.velocity.x = meteor.velocity.x
                box.velocity.y = meteor.velocity.y
                //meteorMaker.removeMeteor(i)
                meteor.collision = true
                box.onFire = true
            }
            i += 1
        })
    })
}
function collisionWater(bucket, boxes) {
    const water = bucket.waterflow.water
    let i = 0
    //console.log('hi')
    //console.log(meteors.length)
    water.forEach(function(w) {
        boxes.forEach((box) => {
            if (
                hitcollision(w,box,.8)
              ) {
                //w.done = true
                //createCircle(box.position.x-20,box.position.y+50)
                //console.log('hi')
                w.falling = false
                w.splash = true
                box.heldWater += 1
                //meteorMaker.removeMeteor(i)
            }
            i += 1
        })
    })
}
animate()

