# About 

Super basic webgl app using webgl context version 1.  
It calls 'draw' a single time, which trigger the GPU shader to raster a single point on screen.
Inside the fragment shader, we change the point size in pixel units using `gl_PointSize`.
