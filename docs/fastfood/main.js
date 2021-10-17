title = "Fast Food";

description = `Don't drop them
`;

characters = [
`
llllll
llllll
`,
`
llllll
llllll
`,
`
llllll
llllll
`,
`
llllll
llllll
`
];

options = {
  isPlayingBgm: true,
  seed: 1,
};

/**
 * @typedef {{
 * pos: Vector
 * }} StackedPatties
 */
/**
 * @type { StackedPatties [] }
 */
let patties;

var patty1 = false;
var patty2 = false;
var patty3 = false;

var freshPatty = 1500;
var counter1 = freshPatty;
var counter2 = freshPatty;
var counter3 = freshPatty;

var placePatty;
var stackCount = 0;
let x = 0;

function update() {
  if (!ticks) {
    color("transparent");
    char("a", 10, 50);
    patty1 = false;
    counter1 = freshPatty;

    color("transparent");
    char("b", 30, 50);
    patty2 = false;
    counter2 = freshPatty;

    color("transparent");
    char("c", 50, 50);
    patty3 = false;
    counter3 = freshPatty;

    patties = []
  }

  //grill
  color("light_black");
  rect(6, 52, 48, 40);

  color("black");
  rect(5, 50, 50, 4);

  // Table
  color("black");
  rect(60, 70, 3, 22);
  rect(60, 70, 34, 3);
  rect(92, 70, 3, 22);
  // Plate
  color("cyan");
  rect(61, 68, 10, 2);
  //color("green");
  //rect(63, 66, 6, 2);

  if (patty1 != false) {
    color("red");
    char("a", 10, 50);
    counter1--;
    if (counter1 < 1000) {
      color("green");
      char("a", 10, 50);
    }
    if (counter1 <= 0){
      color("black");
      char("a", 10, 50);
      end();
    }
  }
  if (patty2 != false) {
    color("red");
    char("b", 30, 50);
    counter2--;
    if (counter2 < 1000) {
      color("green");
      char("b", 30, 50);
    }
    if (counter2 <= 0){
      color("black");
      char("b", 30, 50);
      end();
    }
  }
  if (patty3 != false) {
    color("red");
    char("c", 50, 50);
    counter3--;
    if (counter3 < 1000) {
      color("green");
      char("c", 50, 50);
    }
    if (counter3 <= 0){
      color("black");
      char("c", 50, 50);
      end();
    }
  }

  if (patty1 == false || patty2 == false || patty3 == false) {
    console.log("patty generator")
    placePatty = rnd(1, 500) 
  }
  if (placePatty <= 5) {
    if (patty1 != true) {
      patty1 = true;
      placePatty = 100;
    } else if (patty2 != true) {
      patty2 = true;
      placePatty = 100;
    } else {
      patty3 = true;
      placePatty = 100;
    }
  } 

  if(input.isJustPressed) {
    console.log(input.pos.x);
    console.log(input.pos.y);
    if (input.pos.x > 6 && input.pos.x < 14 && input.pos.y > 46 && input.pos.y < 54){
      if (counter1 < 1000) {
        addScore(50);
        play("coin");
        color("transparent");
        char("a", 10, 50);
        patty1 = false;
        counter1 = freshPatty;
        stackCount++;
        patties.push({
          pos: vec(66, (69 - (2 * stackCount)))
        });
      }
    }
    if (input.pos.x > 26 && input.pos.x < 34 && input.pos.y > 46 && input.pos.y < 54) {
      if (counter2 < 1000) {
        addScore(50);
        play("coin");
        color("transparent");
        char("b", 30, 50);
        patty2 = false;
        counter2 = freshPatty;
        stackCount++;
        patties.push({
          pos: vec(66, (69 - (2 * stackCount)))
        });
      }
    }
    if (input.pos.x > 46 && input.pos.x < 54 && input.pos.y > 46 && input.pos.y < 54) {
      if (counter3 < 1000) {
        addScore(50);
        play("coin");
        color("transparent");
        char("c", 50, 50);
        patty3 = false;
        counter3 = freshPatty;
        stackCount++;
        patties.push({
          pos: vec(66, (69 - (2 * stackCount)))
        });
      }
    }
  }
  color("blue");
  rect(64, 82, 27, 5);
  patties = patties.reverse();
  remove(patties, (p) => {
    color("green");
    char("d", p.pos);
    color("black");
    text("Press & hold", 6, 20);
    text("the cyan plate", 4, 27);
    if(input.isPressed) {
      if (input.pos.x > 61 && input.pos.x < 71 && input.pos.y > 68 && input.pos.y < 70) {
        color("red");
        rect(64, 82, x, 5);
        if (x < 27) {
          x += rnd(0.1, 1);
        }
      }
    }
    if(input.isJustReleased) {
      if (x > 26.5) {
        x = 0;
        if (stackCount > 0) {
          stackCount--;
        }
        play("jump");
        return(true);
      }
    }
  });



}