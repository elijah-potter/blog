# Lake Gregory

## Current Climate

It's obvious the Australian desert is just that: a desert.
Lake Gregory sits at the center, like the pupil of some massive, blood-stained eye.
As a lake, it's terribly salty, but the native wildlife are used to it.
It's the only source of water, and the native wildlife are used to that too.

The sand is course, dry, and startlingly orange.
It has sat there for millions of years.
On a [craton](https://en.wikipedia.org/wiki/Craton), Lake Gregory is sitting on some of the oldest land in the world.
Far from any tectonic plates, there is simply no opportunity for change.
That's why the sand is red, too.
After hundreds of millions of years, the only remaining elements in the [laterised](https://en.wikipedia.org/wiki/Laterite) dirt are iron and aluminum.
It's only fitting that a land so alien has the same chemical composition as Mars.
Because there isn't any nitrogen or phosphorous, is incredibly hard to grow anything here intentionally.
Yet, the life is used to living here.

The rain comes in bursts, punctuating vast stretches of time.
It comes as the result of cyclones, when their wight slams into West Australia.
Makes sense. 
It seems like only the force of God could get water there.

![A photo of Lake Gregory taken from space](/images/lake_gregory_nasa.jpg "A photo of Lake Gregory taken from space. Credit NASA")

The main reason it's so darn dry is because of where it sits under its global convection cell.
The cool, dry, air from the North flows down South of Lake Gregory.
The cycle forces the air back Northward along the surface of the Earth.
There isn't anything wet on the way, so it stays dry.

The sand is warm in the day, and downright frigid at night.
No moisture means no clouds. 
No clouds mean no shade in the day, and no insulating blanket at night.

![A big rock in the Australian outback](/images/australia_rock.jpg "It's just a big rock.")

## Changing Climate

It is difficult to predict what the precise changes will be to the area surrounding Lake Gregory. 
It is possible that changes in both ocean and atmospheric temperatures will change the way air flows over Australia.

In one possible scenario, the amount of moisture increases, either due to more frequent and more intense cycles, or due to a redirection of steady wind from a moist area (like the North).
In this scenario, Lake Gregory might become less salty.
After, _the solution to pollution is dilution._
It is unlikely this will have an impact on the region as a whole, but it could disrupt the local ecosystem.
Life tends to like lower salinity environments, so we may see invasive species begin to use the more “normal” environment to out-compete native wildlife.

With rising temperatures, the thermal differential between the East and West of the Pacific increases, resulting in more frequent, more extreme ENSO cycles.
For Australia, this means more flooding and more extreme droughts (depending on the cycle).
The West coast of Australia is significantly less affected, mostly due to the large swath of land sitting in the way, but it still massively impacted.

## Quick-Stats! 

### Average Temperatures

| Time | Temperature |
| ---- | ----: |
| Winter | ~68° F | 
| Spring | ~80° F | 
| Summer | ~86° F | 
| Fall | ~80° F | 

### Misc. Stats

| Name | Value |
| ---- | ----: |
| Surrounding Sand Albedo | ~40% | 
| Altitude | 200 m - 656 ft | 
| Latitude | 20° South | 

## Climate Modeling + Fluid Dynamics

I wanted to look into the details of exactly how fluid simulations work.
I spent some time looking around for good resources on the topic and found [Real-Time Fluid Dynamics for Games](https://www.researchgate.net/publication/2560062_Real-Time_Fluid_Dynamics_for_Games),
a research paper that covers, as the name suggests, how to build out a fluid simulation. 

There are generally two categories of fluid simulation: particle based, or vector-field based.

### Particle-Based

Particle-based fluid simulations work by tracing the paths of individual particles through space.
They can be the most accurate at small scales, since they follow the movement of individual molecules.
Particle-based simulations don't scale as well with many processers, since bounds-checking has to be done with multiple other particles every iteration.

### Vector Field-Based

Vector field-based approaches work by dividing space up into distince cells.
Each of these cells store abstract attributes of a fluid (temperature, density, velocity, etc.)
These scale up really well, especially in situations where you have access to many processing cores.
Real-Time Fluid Dynamics for Games used this approach.

There are generally three main steps to the method described in the paper: diffusion, advection, and divergence elimination.

#### Diffusion

Over time, the attributes of a fluid tend to equalize over time and space.
Temperature is a good example. 
Any single source of heat will eventually fill a room, circulating with the cold air until the equalizes.
