let vehicles = [];
let N_VEHICLES = 1400;
let everythingOnItsRigthPlace = false;


function setup() {
  createCanvas(1200, 800);

  //vehicles = new ArrayList<Vehicle>();
  for (let i = 0; i < N_VEHICLES; i++) {
    vehicles.push(new Particle(i, random(width),random(height), random(2, 20)));
    //vehicles.push(new Particle(i, width*0.5 + random(-1.0, 1.0), height*0.5 + random(-1.0, 1.0), random(5, 30)) );
  }
  print( vehicles.length )
}

function draw() {
  background(155);

  for (let i = 0; i < N_VEHICLES; i++) {
    // Path following and separation are worked on in this function
    vehicles[i].separate( vehicles );
    vehicles[i].applyFriction(0.1);
    // Call the generic run method (update, borders, display, etc.)
    vehicles[i].update();
    //vehicles[i].borders();
    vehicles[i].display();
  }


  let particleLookingForPlace = N_VEHICLES;
  for (let i = 0; i < N_VEHICLES; i++) {
    if( !vehicles[i].getStatus() ) {
      //println("particle ", v.getId(), " didn't find its position yet");
      particleLookingForPlace -= 1;
    }
  }


  if( !everythingOnItsRigthPlace) {
    print(particleLookingForPlace);
    if( particleLookingForPlace == N_VEHICLES) {
      //print( "everything is on its own place");
      everythingOnItsRigthPlace = true;
      for (let i = 0; i < N_VEHICLES; i++) {
        vehicles[i].settleDown();
      }
    }
  }

}
