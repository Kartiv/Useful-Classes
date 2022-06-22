class Polygon{
    constructor(vertices){
        this.vertices = vertices;

        //calculate center
        this.updateCenter();
        this.order();
    }

    /**
     * updates the polygon's center to its current value
     */

    updateCenter(){
        let x = 0;
        let y = 0;
        for(let i=0; i<this.vertices.length; i++){
            x+=this.vertices[i].x0;
            y+=this.vertices[i].x1;
        }
        x /= this.vertices.length;
        y /= this.vertices.length;
        this.center = new vec2d(x,y);
    }

    /**
     * assumes vertices are ordered
     * @param {int} i 
     * @returns ith edge (vector)
     */
    edge(i){
        return this.vertices[i].sub(this.vertices[(i+1)%this.vertices.length]);
    }

    /**
     * projects polygon over axis
     * @param {vec2d} axis axis to project over
     * @returns projection along the inputed axis
     */
    project(axis){
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for(let i=0; i<this.vertices.length; i++){
            let proj = this.vertices[i].project(axis);
            min = Math.min(proj, min);
            max = Math.max(proj, max);
        }
        return([min, max]);
    }

    /**
     * 
     * @returns centralized vertices around the polygons current center
     */
    centralized(){
        let newVerts = [];
        for(let i=0; i<this.vertices.length; i++){
            newVerts[i] = this.vertices[i].sub(this.center);
        }
        return newVerts;
    }

    /**
     * orders the vertices
     */
    order(){
         let centralized = this.centralized();
         centralized.sort((a,b)=>{
            let anga = Math.atan2(a.x1, a.x0);
            let angb = Math.atan2(b.x1, b.x0);
            if(anga<0){
                anga+=2*Math.PI;
            }
            if(angb<0){
                angb+=2*Math.PI;
            }
            return anga-angb;
         })
         for(let i=0; i<this.vertices.length; i++){
            centralized[i] = centralized[i].add(this.center);
        }
        this.vertices = centralized;
     }

    /**
     * can get either x as a new center's vector and y as null, or x,y as the desired new center
     * @param {vec2d} x 
     * @param {Number} y 
     */
    moveTo(x,y){
         if(!y){
            var offset = x.sub(this.center);
         }
         else{
            var offset = new vec2d(x - this.center.x0, y - this.center.x1);
         }

         for(let i=0; i<this.vertices.length; i++){
             this.vertices[i] = this.vertices[i].add(offset);
         }
         this.updateCenter();
     }

     /**
      * generates a random convex polygon with N vertices inside a box
      * @param {int} N - Number of vertices of polygon
      * @param {Number} bound - Side length of box
      * @returns Random convex polygon
      */
     static generateConvex(N, bound){
        let X = [];
        let Y = [];
        for(let i=0; i<N; i++){
            X[i] = jsn.randint(0,bound);
            Y[i] = jsn.randint(0,bound);
        }
        X.sort((a,b)=>{
            return a-b;
        })
        Y.sort((a,b)=>{
            return a-b;
        })
        let xmin = X[0];
        let xmax = X[X.length-1];
        let ymin = Y[0];
        let ymax = Y[Y.length-1];
        let xGroups = [[xmin],[xmin]];
        let yGroups = [[ymin], [ymin]];
        for(let i=1; i<N-1; i++){
            let s1 = jsn.randint(0,2);
            let s2 = jsn.randint(0,2);
            if(s1){
                xGroups[0].push(X[i])
            }
            else{
                xGroups[1].push(X[i]);
            }
            if(s2){
                yGroups[0].push(Y[i])
            }
            else{
                yGroups[1].push(Y[i]);
            }
        }
        xGroups[0].push(xmax);
        xGroups[1].push(xmax);
        yGroups[0].push(ymax);
        yGroups[1].push(ymax);

        let xVec = [];
        let yVec = [];
        for(let i=0; i<xGroups[0].length-1; i++){
            xVec.push(xGroups[0][i+1]-xGroups[0][i]);
        }
        for(let i=0; i<xGroups[1].length-1; i++){
            xVec.push(xGroups[1][i]-xGroups[1][i+1]);
        }
        for(let i=0; i<yGroups[0].length-1; i++){
            yVec.push(yGroups[0][i+1]-yGroups[0][i]);
        }
        for(let i=0; i<yGroups[1].length-1; i++){
            yVec.push(yGroups[1][i]-yGroups[1][i+1]);
        }

        yVec = jsn.randomize(yVec);
        
        let Vectors = [];
        for(let i=0; i<xVec.length; i++){
            Vectors.push(new vec2d(xVec[i], yVec[i]));
        }
        
        Vectors.sort((a,b)=>{
            let anga = Math.atan2(a.x1, a.x0);
            let angb = Math.atan2(b.x1, b.x0);
            if(anga<0){
                anga+=2*Math.PI;
            }
            if(angb<0){
                angb+=2*Math.PI;
            }
            return anga-angb;
        })

        let verts = [Vectors[0].add(new vec2d(xmax,ymax))];
        for(let i=1; i<Vectors.length; i++){
            verts.push(verts[i-1].add(Vectors[i]));
        }

        return new Polygon(verts);
    }

    /**
     * Creates a rectangle polygon
     * @param {Number} x - x coordinate of rectangle's center
     * @param {*} y - y coordinate of rectangle's center
     * @param {*} width
     * @param {*} height
     * @returns Rectangle polygon
     */
    static createRect(x,y,width,height){
        return new Polygon([new vec2d(x-width/2, y-height/2), new vec2d(x-width/2, y+height/2), new vec2d(x+width/2, y-height/2),
            new vec2d(x+width/2, y+height/2)]);
    }

    /**
     * SAT collision detection algorithm between two given polygons
     * @param {Polygon} poly1 
     * @param {Polygon} poly2 
     * @returns 
     */
    static SAT(poly1, poly2){
        for(let i=0; i<poly1.vertices.length; i++){
            let axis = poly1.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        for(let i=0; i<poly2.vertices.length; i++){
            let axis = poly2.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        return true;
    }
}