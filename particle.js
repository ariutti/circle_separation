class Particle {

  constructor(_id, _x, _y, _r) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.position = createVector(this.x, this.y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = _r*0.5;
    this.maxForce = 0.5;
    this.maxSpeed = 3;

    this.readyToSettle = false;
    this.settled = false;
  }


  applyFriction(c) {
    let friction = this.velocity.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(c);
    this.applyForce( friction );
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Separation(method checks for nearby vehicles and steers away) ///////////////////////////////////////////////////////
  separate( otherVehicles ) {
    if( this.settled ) {
      return;
    };

    let sum = createVector(0.0, 0.0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i=0; i<otherVehicles.length; i++ ) { //Particle other : vehicles) {
      let desiredseparation = ( this.r+otherVehicles[i].getRadius() * 1.2);
      let d = p5.Vector.dist(this.position, otherVehicles[i].position);
      let otherID = vehicles[i].getId();

      // If the distance is less than an arbitrary amount (0 when you are yourself)
      if( this.id != otherID ) {
        //print( "my id (", this.id, ") is not the other id (", otherID,")")
        // don't do calculation for yourself
        if ( d < desiredseparation ) {
          // Calculate vector pointing away from neighbor
          let diff = p5.Vector.sub(this.position, otherVehicles[i].position);
          diff.normalize();
          if(d != 0 ) {
            diff.div(d);        // Weight by distance
          }
          sum.add(diff);
          count++;            // Keep track of how many
        }
      }
    }

    // Average -- divide by how many
    if (count > 0) {
      // Our desired vector is moving away maximum speed
      sum.setMag( this.maxspeed );
      // Implement Reynolds: Steering = Desired - Velocity
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit( this.maxforce );
      this.applyForce( steer );
    } else {
      //println("particle ", id, " is quite separated now");
      this.readyToSettle = true;
    }
  }

  getId() {
    return this.id;
  }

  getRadius() {
    return this.r;
  }

  getStatus() {
    return this.readyToSettle;
  }

  settleDown() {
    this.settled = true;
  }




  // Method to update position
  update() {
    if( ! this.settled ) {
      // Update velocity
      this.velocity.add( this.acceleration );
      // Limit speed
      this.velocity.limit( this.maxspeed );
      this.position.add( this.velocity );
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0);
    } else {
      // no need to update position if already separated
    }
  }

  display() {
    //print( this.settled )

    if( this.settled ) {
      fill(0,255,0);
    } else if( this.readyToSettle ) {
      fill(175);
    } else {
      fill(255,0,0);
    }

    stroke(0);
    push();
    translate( this.position.x, this.position.y );
    ellipse(0, 0, this.r*2, this.r*2);
    pop();
  }

  // Wraparound
  borders() {
    if ( this.position.x < - this.r) this.position.x = width+this.r;
    if ( this.position.y < - this.r) this.position.y = height+this.r;
    if ( this.position.x > width+this.r) this.position.x = -this.r;
    if ( this.position.y > height+this.r) this.position.y = -this.r;
  }
};
