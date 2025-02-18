export class Particle {
    constructor({ c, position, color, velocity = { x: 0, y: 0 }, size,alphaChange=.98}) {
        this.c = c
        this.position = position
        this.color = color
        this.velocity = velocity
        this.size = size
        this.alpha = 1
        this.alphaChange = alphaChange
    }

    update() {
        this.velocity.x *= .98
        this.velocity.y *= .98
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.alpha *= this.alphaChange
        //c.globalAlpha = .01
    }

    draw() {
        this.c.save()
        this.c.globalAlpha = this.alpha
        this.c.fillStyle = this.color
        this.c.fillRect(this.position.x, this.position.y, this.size, this.size)
        this.c.restore()
    }
}
export class ParticleEffect {
    constructor({ c, position, colors, velocity={x:0,y:0}, size=8 }) {
        this.c = c
        this.position = position
        this.colors = colors
        this.velocity = velocity
        this.size = size
        this.particles = []
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
                c: this.c,
                position: {
                    x: this.position.x + (Math.random()*20)-10,
                    y: this.position.y + (Math.random()*14)-7
                },
                color: this.colors[Math.floor(Math.random() * 3)],
                velocity: {x: vx, y: vy},
                size: this.size
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
export class Star {
    constructor({ c,position}) {
        this.c = c
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
        this.c.save()
        this.c.globalAlpha = this.alpha
        this.c.fillStyle = "white"
        this.c.shadowBlur = 5;
        this.c.shadowColor = "white";
        this.c.fillRect(this.position.x, this.position.y, 2, 5)
        this.c.fillRect(this.position.x, this.position.y, -3, 2)
        this.c.fillRect(this.position.x, this.position.y, 5, 2)
        this.c.fillRect(this.position.x, this.position.y, 2, -3)
        this.c.fillStyle = "gray"
        this.c.fillRect(this.position.x, this.position.y, 1, 1)
        this.c.restore()
    }
}
export class StarMaker {
    constructor ({c}) {
        this.c = c
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
                c: this.c,
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
export class FireParticle {
    constructor({ c, position, size=50, color}) {
        this.c = c
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
        //console.log(this.position)
        this.alpha *= .98
        if (Math.random() < .001) this.rotation = (30 * Math.PI / 180)*(Math.random()*12)
    }

    draw() {
        this.c.save()
        //c.strokeStyle = 'white'
        //c.strokeRect(this.position.x, this.position.y, this.width, this.height)
        this.c.globalAlpha = this.alpha
        this.c.fillStyle = this.color
        var rad = 30 * Math.PI / 180;
        this.c.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        this.c.rotate(this.rotation)
        this.c.translate(-this.width/2, -this.height/2);
        this.c.fillRect(0, 0, this.width, this.height)
        this.c.restore()
    }
}
export class Fire {
    constructor({ c,position,size=50 }) {
        this.c = c
        this.position = position
        this.size = 10
        this.colors = ['red','yellow','orange']
        this.fire = []
        //console.log(this.position.position.x)
    }

    update(p=this.position) {
        this.position = p
        this.fire.forEach(f => f.update())
        this.addFire()
        this.removeFires()
        //console.log(this.position)
    }

    draw() {
        this.fire.forEach(f => f.draw())
    }

    addFire() {
        // Logic to add new dire
        if (Math.random() < 0.05) { // Chance of creating a new particle
            //console.log(this.c)
            const f = new FireParticle({
                c: this.c,
                position: {
                    // fire location:
                    // x: position + offset + random
                    x: this.position.x + 15 + (Math.random()*30)-15,
                    y: this.position.y + 15 + (Math.random()*30)-15
                },
                size: this.size,
                color: this.colors[Math.floor(Math.random() * 3)]
            })
            //console.log(this.position.y)// + 15 + (Math.random()*30)-15)
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
export class Water {
    constructor({c,position={ x: 100, y: 100 },floor=innerHeight-4}) {
        this.c = c
        this.position = position
        this.floor = floor
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
        this.floor = floor
        this.pf = new ParticleEffect({
            c:this.c,
            position:this.position,
            colors:['lightblue','aliceblue','babyblue'],
            velocity:this.velocity,
            size: 3
        })
        
    }
    draw() {
        if (!this.done) {
        this.c.save()
        this.c.fillStyle = 'lightblue'
        if (this.falling) {
            this.c.fillRect(this.position.x,this.position.y,this.width,this.height)
            
        }
        else {
            if (!this.splash) this.c.fillRect(this.position.x - this.displacement,this.position.y,this.dropWidth,this.dropHeight)
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
        this.c.restore()
        }
    }
    update() {
        if (this.falling) {
            if (this.position.y > this.floor) {
                this.falling = false
                this.splash = true
            }
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
        if (this.splash) this.pf.update()
    }
}
export class WaterFlow {
    constructor({c,position={x:100,y:100},floor=window.innerHeight-4}) {
        this.c = c
        this.position = position
        this.floor = floor
        this.flow = true
        this.rain = false
        this.water = []
        
    }
    draw() {
        this.water.forEach(w => w.draw())
    }
    update(p) {
        this.position.x = p.x
        this.position.y = p.y
        this.water.forEach(w => w.update())
        if (this.flow) this.addWater()
        this.removeWaters()
    }
    addWater() {
        
        // Logic to add water
        if (Math.random() < .8) { // Chance of creating a new particle
            let position = {
                x: this.position.x+50,
                y: this.position.y+17
            }
            if (this.rain == true) {
                position = {
                    x: this.position.x+50 + (Math.random()*20-10),
                    y: this.position.y+17
                }
            }
            const w = new Water({
                c: this.c,
                position: position,
                floor: this.floor
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