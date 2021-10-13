title = "CHARGE RUSH";

description = `
Destroy enemies.
`;

// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
characters = [
  `
  pp
  ll
ccllcc
ccllcc
ccllcc
cc  cc
  `, `
rr  rr
rrrrrr
rrpprr
rrrrrr
  rr
  rr
 `, `
y  y
yyyyyy
 y  y
yyyyyy
 y  y
 `
];


const G = {
  WIDTH: 100,
  HEIGHT: 150,

  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,

  PLAYER_FIRE_RATE: 4,
  PLAYER_GUN_OFFSET: 3,
  FBULLET_SPEED: 5,

  ENEMY_MIN_BASE_SPEED: 1.0,
  ENEMY_MAX_BASE_SPEED: 2.0,
  ENEMY_FIRE_RATE: 45,

  EBULLET_SPEED: 2.0,
  EBULLET_ROTATION_SPD: 0.1
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  seed: 2,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "dark"
};

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */

/**
* @type  { Star [] }
*/
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBullet [] }
 */
let fBullets;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

// The game loop function
function update() {
  // The init function running at startup
  // A CrispGameLib function
  // First argument (number): number of times to run the second argument
  // Second argument (function): a function that returns an object. This
  // object is then added to an array. This array will eventually be
  // returned as output of the times() function.
  if (!ticks) {
    waveCount = 0;
    stars = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        // More RNG
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
      };
    });
    player = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
      firingCooldown: G.PLAYER_FIRE_RATE,
      isFiringLeft: true
    };

    fBullets = [];
    enemies = [];
    eBullets = [];


  }

  //enemies

  if (enemies.length === 0) {
    currentEnemySpeed =
      rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 9; i++) {
      const posX = rnd(0, G.WIDTH);
      const posY = -rnd(i * G.HEIGHT * 0.1);
      enemies.push({
        pos: vec(posX, posY),
        firingCooldown: G.ENEMY_FIRE_RATE
      });
    }
    waveCount++;
  }

  // Update for Star
  stars.forEach((s) => {
    // Move the star downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_black");
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });

  //update player
  player.pos = vec(input.pos.x, input.pos.y); //add pointer controls
  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT); //keep player in screen
  player.firingCooldown--;
  // Time to fire the next shot
  if (player.firingCooldown <= 0) {
    // Get the side from which the bullet is fired
    const offset = (player.isFiringLeft)
      ? -G.PLAYER_GUN_OFFSET
      : G.PLAYER_GUN_OFFSET;  //change offset value
    // Create the bullet
    fBullets.push({ pos: vec(player.pos.x + offset, player.pos.y) });
    // Reset the firing cooldown
    player.firingCooldown = G.PLAYER_FIRE_RATE;
    // Switch the side of the firing gun by flipping the boolean value
    player.isFiringLeft = !player.isFiringLeft;

    //particles
    color("yellow");
    // Generate particles
    particle(
      player.pos.x + offset, // x coordinate
      player.pos.y, // y coordinate
      4, // The number of particles
      1, // The speed of the particles
      -PI / 2, // The emitting angle
      PI / 4  // The emitting width
    );
  }

  color("black");
  char("a", player.pos);

  fBullets.forEach((fb) => {
    fb.pos.y -= G.FBULLET_SPEED;
    color("yellow");
    box(fb.pos, 2);
  });

  remove(enemies, (e) => {
    e.pos.y += currentEnemySpeed;
    e.firingCooldown--;
    if (e.firingCooldown <= 0) {
      eBullets.push({
        pos: vec(e.pos.x, e.pos.y),
        angle: e.pos.angleTo(player.pos),
        rotation: rnd()
      });
      e.firingCooldown = G.ENEMY_FIRE_RATE;
      play("select");
    }
    color("black");

    const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
    if (isCollidingWithPlayer) {
      end();
      play("powerUp");
    }

    const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;

    // Check whether to make a small particle explosin at the position
    if (isCollidingWithFBullets) {
      color("yellow");
      particle(e.pos);
      play("explosion"); // Here!
      addScore(10 * waveCount, e.pos);
    }
    return (isCollidingWithFBullets || e.pos.y > G.HEIGHT);
  });

  remove(fBullets, (fb) => {
    // Interaction from fBullets to enemies, after enemies have been drawn
    color("yellow");
    const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
    return (isCollidingWithEnemies || fb.pos.y < 0);
  });

  remove(eBullets, (eb) => {
    // Old-fashioned trigonometry to find out the velocity on each axis
    eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
    eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
    // The bullet also rotates around itself
    eb.rotation += G.EBULLET_ROTATION_SPD;

    color("red");
    const isCollidingWithPlayer
      = char("c", eb.pos, { rotation: eb.rotation }).isColliding.char.a;

    if (isCollidingWithPlayer) {
      // End the game
      end();
      // Sarcasm; also, unintedned audio that sounds good in actual gameplay
      play("powerUp");
    }
    const isCollidingWithFBullets
      = char("c", eb.pos, { rotation: eb.rotation }).isColliding.rect.yellow;
    if (isCollidingWithFBullets) addScore(1, eb.pos);

    // If eBullet is not onscreen, remove it
    return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT) || isCollidingWithFBullets);
  });


  //text(stars.length.toString(), 3, 10);
}


