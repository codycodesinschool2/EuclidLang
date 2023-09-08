let penColor;
let codeArea;
let commands = {
    DEF_POINT_BY_COORDS: (POINTNAME, X, Y) => {
        try {
            POINTVARIABLES[POINTNAME] = createVector(int(X), int(Y));
        } catch {
            return true;
        }
    },
    SET_COMPASS_RADIUS_BY_NUMBER: NUMBER => {
        try {
            COMPASS_RADIUS = float(NUMBER)*width;
        } catch {
            return true;
        }
    },
    SET_COMPASS_RADIUS_BY_TWO_POINTS: (P1,P2) => {
        try {
            let point1 = POINTVARIABLES[P1];
            let point2 = POINTVARIABLES[P2];
            COMPASS_RADIUS = p5.Vector.dist(point1,point2);
        } catch {
            return true;
        }
    },
    SET_PEN_COL: (N) => {
        try {
            c = int(N);
            colors = [255,192,128,64,0];
            stroke(colors[c])
        } catch {
            return true;
        }
    },
    DEF_CIRCLE: (CENTER, CIRCLENAME) => {
        try {
            CIRCLEVARIABLES[CIRCLENAME] = {
                radius: COMPASS_RADIUS,
                center: POINTVARIABLES[CENTER].copy()
            }
            circle(POINTVARIABLES[CENTER].x, POINTVARIABLES[CENTER].y, COMPASS_RADIUS * 2)
        } catch {
            return true;
        }
    },
    DRAW_CIRCLE_WITHOUT_DEF: CENTER => {
        try {
            circle(POINTVARIABLES[CENTER].x, POINTVARIABLES[CENTER].y, COMPASS_RADIUS * 2)

        } catch {
            return true;
        }
    },
    DRAW_LINE_BY_TWO_POINTS: (P1, P2) => {
        try {
            line(POINTVARIABLES[P1].x, POINTVARIABLES[P1].y, POINTVARIABLES[P2].x, POINTVARIABLES[P2].y)
        } catch {
            console.log("NO FIND ONE: ", P1,P2)
            return true;
        }
    },
    DEF_OVEREXTENDED_LINE_BY_TWO_POINTS: (P1,P2,NAME) => {
        try {
            let point1 = POINTVARIABLES[P1].copy();
            let point2 = POINTVARIABLES[P2].copy();
            console.log(point1,point2);
            let dx1 = point1.x-point2.x;
            let dy1 = point1.y-point2.y;
            
            let dx2 = point2.x-point1.x;
            let dy2 = point2.y-point1.y;
            point1.x += dx1;
            point1.y += dy1;
            point2.x += dx2;
            point2.y += dy2;
            console.log(point1,point2)
            line(point1.x,point1.y,point2.x,point2.y);
            LINEVARIABLES[NAME] = {
                start: point1.copy(),
                end: point2.copy()
            }
        } catch {
            return true;
        }
    },
    DEF_LINE_BY_TWO_POINTS: (P1, P2, NAME) => {
        try {
            line(POINTVARIABLES[P1].x, POINTVARIABLES[P1].y, POINTVARIABLES[P2].x, POINTVARIABLES[P2].y)
            LINEVARIABLES[NAME] = {
                start: POINTVARIABLES[P1].copy(),
                end: POINTVARIABLES[P2].copy()
            }
        } catch {
            return true;
        }
    },
    DEF_POINT_BY_CIRCLE_LINE_INTER: (CIRCLE, LINE, SORTDIR, NAME) => {
        // Get the coordinates of the two points on the line.
        let circleOb;
        let lineOb;
        try {
            circleOb = CIRCLEVARIABLES[CIRCLE];

            lineOb = LINEVARIABLES[LINE];
        } catch {
            console.log("Some bad shit")
            return true;
        }
        if(!circleOb || !lineOb) return true;
        let offsetX = circleOb.center.x;
        let offsetY = circleOb.center.y;
        let offLineOb = {
            start: createVector(lineOb.start.x-offsetX,lineOb.start.y-offsetY),
            end: createVector(lineOb.end.x-offsetX,lineOb.end.y-offsetY)

        }
        let massive = 999999;
        let r = circleOb.radius;
        let m = abs(offLineOb.start.x-offLineOb.end.x) < 0.01 ? massive : (lineOb.end.y-lineOb.start.y)/(lineOb.end.x-lineOb.start.x);
        let sb = m == massive ? 0 : (-m*offLineOb.start.x)+offLineOb.start.y;
        let a = -m;
        let b = 1;
        let c = sb;
        let disc = r*r*(a*a+b*b)-(c*c);
        if (disc < 0) {
            console.log(a,b,c);

            console.log("DIED: ",disc)

            return true;
        }
        let inters = [];
        let x1 = ((a*c)+b*(Math.sqrt(disc)))/(a*a+b*b);
        let y1 = ((b*c)-a*(Math.sqrt(disc)))/(a*a+b*b);
        let x2 = ((a*c)-b*(Math.sqrt(disc)))/(a*a+b*b);
        let y2 = ((b*c)+a*(Math.sqrt(disc)))/(a*a+b*b);
        inters.push(createVector(x1,y1));
        inters.push(createVector(x2,y2));
        try {
            let sortFuncs = [
                (a,b) => a.y-b.y,
                (a,b) => b.x-a.x,
                (a,b) => b.y-a.y,
                (a,b) => a.x-b.x
            ];
            inters.sort(sortFuncs[int(SORTDIR)]);
            inters[0].x += offsetX;
            inters[0].y += offsetY;
            POINTVARIABLES[NAME] =inters[0];
        } catch {
            return true;
        }
    },
    SET_COMPASS_RADIUS_BY_POPPING: () => {
        try {
            COMPASS_RADIUS = COMPASS_RADIUS_STACK.pop();
        } catch {
            return true;
        }
    },
    DEF_POINT_BY_XY: (X,Y,NAME) => {
        try {
            POINTVARIABLES[NAME] = createVector(float(X)*width,float(Y)*width);
        } catch {
            return true;
        }
    },
    DEF_POINT_BY_POPPING: NAME => {
        try {
            POINTVARIABLES[NAME] = POINT_STACK.pop();
        } catch {
            return true;
        }
    },
    ADD_POINT_TO_STACK: NAME => {
        if(!POINTVARIABLES[NAME]) return true;
        POINT_STACK.push(POINTVARIABLES[NAME]);
    },
    SET_COMPASS_RADIUS_TO_STACK: NAME => {
        COMPASS_RADIUS_STACK.push(COMPASS_RADIUS);
    },
    DEF_POINT_BY_CIRCLE_CIRCLE_INTER: (C1,C2,SORTDIR,NAME) => {
        let CIRC1;
        let CIRC2;
        try {
            CIRC1 = CIRCLEVARIABLES[C1];
            CIRC2 = CIRCLEVARIABLES[C2];
        } catch {
            console.log("NO FIND: ", C1,C2)
            return true;
        }
        let d = dist(CIRC1.center.x,CIRC1.center.y,CIRC2.center.x,CIRC2.center.y);
        let l = ((CIRC1.radius*CIRC1.radius)-(CIRC2.radius*CIRC2.radius)+(d*d))/(d*2)
        let h = Math.sqrt((CIRC1.radius*CIRC1.radius)-(l*l));
        let x1 = (l/d)*(CIRC2.center.x-CIRC1.center.x)+(h/d)*(CIRC2.center.y-CIRC1.center.y)+CIRC1.center.x;
        let y1 = (l/d)*(CIRC2.center.y-CIRC1.center.y)-(h/d)*(CIRC2.center.x-CIRC1.center.x)+CIRC1.center.y;
        let x2 = (l/d)*(CIRC2.center.x-CIRC1.center.x)-(h/d)*(CIRC2.center.y-CIRC1.center.y)+CIRC1.center.x;
        let y2 = (l/d)*(CIRC2.center.y-CIRC1.center.y)+(h/d)*(CIRC2.center.x-CIRC1.center.x)+CIRC1.center.y;
        let inters = [createVector(x1,y1),createVector(x2,y2)];
        if(!x1 && !x2) {
            return true;
        }
        try {
            let sortFuncs = [
                (a,b) => a.y-b.y,
                (a,b) => b.x-a.x,
                (a,b) => b.y-a.y,
                (a,b) => a.x-b.x
            ];

            inters.sort(sortFuncs[int(SORTDIR)]);
            console.log(inters);
            POINTVARIABLES[NAME] =inters[0];
        } catch {
            return true;
        }
    },
    DEF_POINT_BY_LINE_LINE_INTER: (L1,L2,NAME) => {
        try {
            let x1 = LINEVARIABLES[L1].start.x;
            let y1 = LINEVARIABLES[L1].start.y;
            let x2 = LINEVARIABLES[L1].end.x;
            let y2 = LINEVARIABLES[L1].end.y;
            let x3 = LINEVARIABLES[L2].start.x;
            let y3 = LINEVARIABLES[L2].start.y;
            let x4 = LINEVARIABLES[L2].end.x;
            let y4 = LINEVARIABLES[L2].end.y;
            
            let tTop = ((x1-x3)*(y3-y4))-((y1-y3)*(x3-x4));
            let tBottom = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));
            let t = tTop/tBottom;
        
            let uTop = ((x1-x3)*(y1-y2))-((y1-y3)*(x1-x2));
            let uBottom = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));
            let u = uTop/uBottom;
            let px = (x1 + (t*(x2-x1))) || (x3+(u*(x4-x3)));
            let py = (y1 + (t*(y2-y1))) || (y3+(u*(y4-y3)));
            POINTVARIABLES[NAME] = createVector(px,py);
        } catch {
            return true;
        }
    }
};
let POINTVARIABLES;
let CIRCLEVARIABLES;
let LINEVARIABLES;
let COMPASS_RADIUS = 100;
let COMPASS_RADIUS_STACK = [];
let POINT_STACK = [];

function mp() {
    runCode(codeArea.value())
}

function setup() {
    createCanvas(windowWidth, windowHeight / 2).mousePressed(mp);
    codeArea = select("textarea");
    codeArea.style('width', `${width}px`)
    codeArea.style('height', `${height}px`)
    POINTVARIABLES = {
        RIGHT: createVector(width, height / 2),
        LEFT: createVector(0, height / 2),
        UP: createVector(width / 2, 0),
        DOWN: createVector(width / 2, height),
        CENTER: createVector(width / 2, height / 2)
    }
    CIRCLEVARIABLES = {};
    LINEVARIABLES = {};
    penColor = color(0, 0, 0);
}

function runCode(code) {
    POINTVARIABLES = {
        RIGHT: createVector(width, height / 2),
        LEFT: createVector(0, height / 2),
        UP: createVector(width / 2, 0),
        DOWN: createVector(width / 2, height),
        CENTER: createVector(width / 2, height / 2)
    }
    CIRCLEVARIABLES = {};
    LINEVARIABLES = {};

    penColor = color(0, 0, 0);

    background(255);
    stroke(penColor);
    noFill();
    let lines = code.split("\n");
    for (let line of lines) {
        if(line == "" || line.startsWith("#")) continue;
        let tokens = line.split(" ");
        if (tokens[0] in commands) {
            tokens.push("");
            tokens.push("");
            tokens.push("");
            let thing = commands[tokens[0]](tokens[1], tokens[2], tokens[3],tokens[4]);
            if (thing) {

                console.log("error on line: ", line, "internal error")
                return;
            }
        } else {
            console.log("error on line: ", line, "unkown command")
            return;
        }
    }
    console.log("Ran with no issues");
}
