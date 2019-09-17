# planetary-racer
Ships learn to go round the planet (central circle) using neuroevolution.

Uses the toy neural network https://github.com/CodingTrain/Toy-Neural-Network-JS for the nueral network.

Heavily inspired by the Code Train videos... https://www.youtube.com/watch?v=c6y21FkaUqw

Generates 2000 ships which must travel round the planet in a clockwise direction. If a ship collides with the inner or outer circle it is removed. The lines prevent a ship from travel in an anti clockwise direction. Ships colliding with these lines are removed. 

Fitness is calculted based on the amount of time they survive and the number of quadrants they move through. A generation completes either when all ships have been removed, no ships make any progress within a time limit or a global time limit passes. On completion of a generation, ships are randomly selected to make up the next generation with the successful ships being more likely. A mutation is applied to ships in next generation.

demo... https://csysja.github.io/planetary-racer/