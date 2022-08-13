state = {
    planets: [],
    shadow: false
}

const G = 0.5

const drawBg = () => {
    background(120);
}

function setup() {
    createCanvas(500, 500);

    angleMode(DEGREES)

    state.min = createVector(0, 0)
    state.max = createVector(0, 0)

    const c = getPlanet()
    c.static = true
    c.vel = createVector(0, 0)
    c.pos.x = width / 2
    c.pos.y = height / 2

    c.m = 10
    state.planets.push(c)


    const p = getPlanet()
    p.pos.y = width / 2
    p.pos.x = width * 0.75
    p.vel = createVector(0, -10)
    state.planets.push(p)

    for (let x = 0; x < 10; x++) {
        const p = getPlanet()
        p.pos.y = height / 2
        p.pos.x = (width / 10) * x

        p.vel.y = x >= 5 ? -2 : 2

        state.planets.push(p)
    }

    state.i = 0
}


function draw() {
    if (state.shadow) {
        background(20, 61, 89, 5)
    } else {
        background(20, 61, 89)
    }

    state.planets.filter(p => !p.static).forEach(p => {
        updateVel(p, state.planets.filter(other => other !== p))
        p.pos.add(p.vel)
        //const mappedX = map(p.pos.x, state.min.x, state.max.x, 0, width)
        //const mappedY = map(p.pos.y, state.min.y, state.max.y, 0, height)
    })

    for (let i = 0; i < state.planets.length; i++) {
        const p = state.planets[i]
        fill(244, 180, 26)
        stroke(244, 180, 26)
        ellipse(p.pos.x, p.pos.y, p.m, p.m)
    }

    handleCollisions()

    state.planets.forEach(p => {
        state.max.x = p.pos.x > state.max.x ? p.pos.x : state.max.x
        state.max.y = p.pos.y > state.max.y ? p.pos.y : state.max.y

        state.min.x = p.pos.x < state.min.x ? p.pos.x : state.min.x
        state.min.y = p.pos.y < state.min.y ? p.pos.y : state.min.y
    })
}

function mousePressed() {
    const p = getPlanet()
    p.pos.x = mouseX
    p.pos.y = mouseY
    state.planets.push(p)
}

function getPlanet() {
    return {
        vel: createVector(0, 0),
        pos: createVector(random(width), random(height)),
        m: 0.5,
        static: false
    }
}

function handleCollisions() {
    const toRemove = []
    state.planets.forEach(p1 => {
        state.planets.forEach(p2 => {
            if (p1 !== p2) {
                if (p1.pos.dist(p2.pos) < 2) {
                    if (p1.m > p2.m || p1.static) {
                        p1.m += p2.m
                        toRemove.push(p2)
                    } else {
                        p2.m += p1.m
                        toRemove.push(p1)
                    }
                }
            }

        })
    })

    state.planets = state.planets.filter(p => !toRemove.includes(p))
}

function updateVel(p, others) {
    const acc = createVector(0, 0)

    others.forEach(o => {
        const direction = o.pos.copy().sub(p.pos)
        const dist = p.pos.dist(o.pos)
        direction.mult(G * ((p.m, o.m) / (dist * dist)))
        acc.add(direction)
    })

    p.vel.add(acc)
}

function toggleBgDraw() {
    state.shadow = !state.shadow
}