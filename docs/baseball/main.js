title = "BASEBALL";

description = `
[Tap] Swing
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
  theme: "crt",
  //viewSize: { x: 150, y: 150 },
};

let balls, bombs;
let bombAppTicks;
let ballAppTicks;
let multiplier;
let side;

function update() {
  if (!ticks) {
    balls = [];
    bombs = [];
    bombAppTicks = ballAppTicks = 0;
    multiplier = 1;
  }
  color("light_black");
  line(50, 60, 10, 0);
  color("light_black");
  line(50, 60, 90, 0);
  color("blue");
  line(99, 75, 75, 86);
  if (input.isJustPressed) {
    play("laser");
    line(70, 89, 50, 80);
    multiplier = 1;
  } else {
    line(70, 89, 50, 98);
  }
  color("purple");
  ballAppTicks -= 0.5;
  if (ballAppTicks < -20) {
    balls.push({ p: vec(99, 70), v: vec(-1, 0.5).mul(difficulty), s: 0 });
    ballAppTicks = 60;
    side = rndi(1, 4);
  }
  balls = balls.filter((b) => {
    //console.log(side);
    if (side == 1) {
      color("yellow");
      box(2, 0, 2, 130);
    } else if (side == 2) {
      color("yellow");
      box(45, 2, 68, 2);
    } else {
      color("yellow");
      box(100, 0, 3, 130);
    }

    b.p.add(b.v);
    color(b.s === 0 ? "blue" : "cyan");
    if (b.s === 0) {
      if (b.p.x < 70) {
        if (input.isJustPressed) {
          b.v.set(4, -4).rotate((b.p.x - 70) * 0.06);
          b.s = 1;
        }
      } else if (b.p.x < 50) {
        b.s = 1;
      }
    } else {
      particle(b.p, 1, b.v.length, b.v.angle + PI, 0.1);
    }
    if (box(b.p, 3, 3).isColliding.rect.purple) {
      return false;
    }

    if (side == 1) {
      color("yellow");
      box(0, 0, 10, 130);
      if (box(b.p, 3, 3).isColliding.rect.yellow) {
        play("hit");
        addScore(multiplier, b.p);
        return b.p.isInRect(0, 0, 99, 99);
      } else if (!(b.p.isInRect(0, 0, 99, 99))) {
        end();
      }
    } else if (side == 2) {
      color("yellow");
      box(49, 0, 73, 10);
      if (box(b.p, 3, 3).isColliding.rect.yellow) {
        play("hit");
        addScore(multiplier, b.p);
        return b.p.isInRect(0, 0, 99, 99);
      } else if (!(b.p.isInRect(0, 0, 99, 99))) {
        end();
      }
    } else {
      color("yellow");
      box(100, 0, 5, 130);
      if (box(b.p, 3, 3).isColliding.rect.yellow) {
        play("hit");
        addScore(multiplier, b.p);
        return b.p.isInRect(0, 0, 99, 99);
      } else if (!(b.p.isInRect(0, 0, 99, 99))) {
        end();
      }
    }
    //text(balls.length.toString(), 3, 10);
    return b.p.isInRect(0, 0, 99, 99);
  });
}
