class jsn{

    //Random

    /**
     * 
     * @param {Number} a - Min
     * @param {Number} b - Max
     * @returns a random float in [a,b)
     */
    static random(a,b){
        return a + Math.random()*(b-a);
    }
    
    /**
     * a and b aren't technically required to be integers but then the function won't work correctly
     * @param {int} a - Min
     * @param {int} b - Max
     * @returns a random integer in [a,b)
     */
    static randint(a,b){
        return Math.ceil(a)+Math.floor(Math.random()*(b-a));
    }
    
    /**
     * 
     * @param {Array} arr 
     * @returns arr sorted randomly
     */
    static randomize(arr){
        let newarr = [];
        let m = arr.length;
        for(let i=0; i<m; i++){
            let s = jsn.randint(0,arr.length);
            newarr.push(arr.splice(s,1)[0]);
        }
        return newarr;
    }

    //List Operations
    /**
     * Checks if two lists are identical
     * @param {Array} a 
     * @param {Array} b 
     * @returns true if identical, false else
     */
    static areEqual(a,b){
        if(a.length!=b.length){
            return false;
        }
        for(let i=0; i<a.length; i++){
            if(a[i]!=b[i]){
                return false;
            }
        }
        return true;
    }

    /**
     * Array with random values
     * @param {int} n - length of array
     * @param {Number} a - lower bound for random values, defaults to -1
     * @param {Number} b - Upper bound for random values, defaults to 1
     * @returns array of length n with random elements in [a,b)
     */
    static randArr(n, a=-1, b=1){
        let lst = [];
        for(let i=0; i<n; i++){
            lst.push(jsn.random(a, b));
        }
        return lst;
    }

    /**
     * rounds all elements of an array
     * @param {Array} arr 
     * @returns array of rounded elements of input
     */
    static roundArr(arr){
        let newArr = [];
        for(let i=0; i<arr.length; i++){
            newArr.push(Math.round(arr[i]));
        }
        return newArr;
    }

    /**
     * 
     * @param {Number} a
     * @param {Number} b 
     * @param {int} n 
     * @returns uniform partition of [a,b] of length n
     */
    static linspace(a,b,n){
        let x = [];
        for(let i=0; i<n; i++){
            x.push(a+i*b/n);
        }
        return x;
    }

    /**
     * 
     * @param {Number} a 
     * @param {Number} b 
     * @param {Number} dt 
     * @returns array of numbers spaced dt apart, starting with a, with maximum value b
     */
    static arange(a,b,dt){
        let x = [];
        while(a<b){
            x.push(a);
            a+=dt;
        }
        return x;
    }

    /**
     * 
     * @param {int} n - length of array
     * @returns array of ones of length n
     */
    static ones(n){
        let a = [];
        for(let i=0; i<n; i++){
            a.push(1);
        }
        return a;
    }

    static factors(n){
        let fax = [];
        for(let i=2; i<Math.sqrt(n); i++){
            if(n%i==0){
                fax.push(i);
                fax.push(parseInt(n/i));
            }
        }
        if(n%Math.sqrt(n)==0){
            fax.push(Math.sqrt(n));
        }
        return fax.sort((a,b)=>a-b);
    }

    /**
     * 
     * @param {int} n - length of array
     * @returns array of zeros of length n
     */
    static zeros(n){
        let a = [];
        for(let i=0; i<n; i++){
            a.push(0);
        }
        return a;
    }

    /**
     * Sigmaballs
     * @param {Number} z 
     * @returns sigmoid(z)
     */
    //Relevant Functions

    static sigmoid(z){
        return 1/(1+Math.exp(-z));
        // return Math.atan(z)/Math.PI+1/2;
    }

    static transform(arr, f){
        let b = [];
        
        for(let i=0; i<arr.length; i++){
            b.push(f(arr[i]));
        }

        return arr;
    }

}

class Vector{ //vector class

    constructor(coords){
        this.coords = coords;
        this.dim = coords.length;
    } 

    /**
     * 
     * @param {Vector} v 
     * @returns adds v
     */
    add(v){ //add this vector with input vector
        if(v.dim!=this.dim){
            throw("Vector Dimensions don't Match");
        }

        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]+v.coords[i]);
        }
        return new Vector(a);
    }

    /**
     * 
     * @param {Vector} v 
     * @returns subtracts v
     */
    sub(v){ //subtract input vector from this vector
        if(v.dim!=this.dim){
            throw("Vector Dimensions don't Match");
        }

        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]-v.coords[i]);
        }
        return new Vector(a);
    }

    /**
     * 
     * @param {Number} lambda 
     * @returns multiplies vector by lambda
     */
    scale(lambda){ //multiply by scalar
        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]*lambda);
        }
        return new Vector(a);
    }

    /**
     * 
     * @param {Vector} v 
     * @returns this dotted with v
     */
    dot(v){
        if(v.dim!=this.dim){
            throw("Vector Dimensions don't Match");
        }
        let s = 0;
        for(let i=0; i<v.dim; i++){
            s+=v.coords[i]*this.coords[i];
        }
        return s;
    }

    /**
     * 
     * @returns norm of vector
     */
    norm(){ //norm of vector
        return Math.sqrt(this.dot(this));
    }

    /**
     * if the vector is the 0 vector, returns the 0 vector
     * @returns Normalized vector
     */
    normalized(){
        let norm = this.norm();
        if(norm==0){
            return this;
        }
        else{
            return this.scale(1/norm);
        }
    }

    /**
     * currently exclusive to 2d vectors
     * @returns normal vector to this vector
     */
    normal(){
        if(this.dim!=2){
            throw('Vector dimension must be 2');
        }
        else{
            return (new Vector([-this.coords[1], this.coords[0]])).normalize();
        }
    }

    /**
     * 
     * @param {Vector} v 
     * @returns length of orthogonal projection onto v
     */
    project(v){
        return this.dot(v)/v.norm();
    }
}

class Matrix{
    /**
     * 
     * @param {Array} array - must be formatted either as 2d array, or 1d array of Vector objects
     */
    constructor(array){
        if(array[0] instanceof Vector){
            let data = [];
            for(let vec of array){
                data.push(vec.coords);
            }
            this.data = data;
        }
        else{
            this.data = array;
        }
    }

    /**
     * 
     * @param {int} i 
     * @returns ith column of matrix as Vector
     */
    column(i){
        let c = [];
        for(let row of this.data){
            c.push(row[i]);
        }
        return new Vector(c);
    }

    /**
     * 
     * @param {int} i 
     * @returns ith row of matrix as Vector
     */
    row(i){
        return new Vector(this.data[i])
    }

    /**
     * Multiplies from the right by a Matrix or a Vector element
     * @param {Matrix, Vector} B
     * @returns Vector if B is a Vector, Matrix otherwise
     */
    dot(B){
        if(B instanceof Vector){
            let vec = [];
            for(let i in this.data){
                vec.push(this.row(i).dot(B));
            }
            return new Vector(vec);
        }

        else if(B instanceof Matrix){
            let arr = [];
            for(let i in this.data){
                arr.push([]);
                for(let j in B.data[0]){
                    arr[i].push(this.row(i).dot(B.column(j)));
                }
            }
            return new Matrix(arr);
        }
    }

    /**
     * Scales Matrix by constant
     * @param {Number} lamda - scalar
     * @returns Matrix scaled by lamda
     */
    scale(lamda){
        let arr = [];
        for(let i in this.data){
            arr.push([]);
            for(let j in this.data[0]){
                arr[i].push(lamda*this.data[i][j]);
            }
        }
        return new Matrix(arr);
    }

    /**
     * Add Matrix
     * @param {Matrix} B 
     * @returns this+B
     */
    add(B){
        let arr = [];
        for(let i in this.data){
            arr.push([]);
            for(let j in this.data[0]){
                arr[i].push(this.data[i][j]+B.data[i][j]);
            }
        }
        return new Matrix(arr);
    }

    /**
     * Subtract Matrix
     * @param {Matrix} B 
     * @returns this-B
     */
    sub(B){
        let arr = [];
        for(let i in this.data){
            arr.push([]);
            for(let j in this.data[0]){
                arr[i].push(this.data[i][j]-B.data[i][j]);
            }
        }
        return new Matrix(arr);
    }

    /**
     * Transpose
     * @returns Transpose of Matrix
     */
    T(){
        let arr = [];
        for(let col in this.data[0]){
            arr.push([]);
            for(let row in this.data){
                arr[col].push(this.data[row][col]);
            }
        }
        return new Matrix(arr);
    }
}


class Graph{
    /**
     * 
     * @param {Html Canvas} canvas - Canvas to draw on
     * @param {*} xmin - lowest x coordinate to display
     * @param {*} ymin - lowest y coordinate to display
     * @param {*} xmax - largest x coordinate to display
     * @param {*} ymax - largest y coordinate to display
     */
    constructor(canvas, xmin = null, ymin = null, xmax = null, ymax = null){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }
    
    /**
     * Plot Graph
     * @param {Array} xdata 
     * @param {Array} ydata 
     * @param {Html color} color 
     * @param {Number} s - line width
     */
    plot(xdata, ydata, color=null, s=2){

        let xmin = this.xmin;
        let ymin = this.ymin;
        let xmax = this.xmax;
        let ymax = this.ymax;
        if(!xmin){
            xmin = Math.min(...xdata);
        }
        if(!ymin){
            ymin = Math.min(...ydata);
        }
        if(!xmax){
            xmax = Math.max(...xdata);
        }
        if(!ymax){
            ymax = Math.max(...ydata);
        }   

        if(ymax==ymin){
            ymax+=2;
            ymin-=2;
        }

        if(xdata.length != ydata.length){ //check for error in drawing
            console.error("xdata and ydata have mismatching dimensions");
        }

        if(color==null){ //set color
            ctx.strokeStyle="blue";
        }
        else{
            ctx.strokeStyle = color;
        }

        this.ctx.lineWidth = s;
        this.ctx.beginPath();
        this.ctx.moveTo((xdata[0] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[0])/(ymax-ymin)*this.canvas.height); //minus on ydata cuz canvas flipped
        for(let i in xdata){
            this.ctx.lineTo((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * 
     * @param {Array} xdata 
     * @param {Array} ydata 
     * @param {Html color} color - if uniform color is wanted 
     * @param {Array} c - if array of colors is wanted
     * @param {Number} s - point size 
     * @returns 
     */
    scatter(xdata, ydata, color = null, c=null, s=3){

        let xmin = this.xmin;
        let ymin = this.ymin;
        let xmax = this.xmax;
        let ymax = this.ymax;
        if(!xmin){
            xmin = Math.min(...xdata);
        }
        if(!ymin){
            ymin = Math.min(...ydata);
        }
        if(!xmax){
            xmax = Math.max(...xdata);
        }
        if(!ymax){
            ymax = Math.max(...ydata);
        }

        if(xdata.length != ydata.length){ //check for error in drawing
            console.error("xdata and ydata have mismatching dimensions");
        }

        if(!c && !color){ //set color
            ctx.fillStyle="blue";
            for(let i in xdata){
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        else if(color){
            ctx.fillStyle=color;
            for(let i in xdata){
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        else{
            for(let i in xdata){
                ctx.fillStyle = c[i];
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }

        return;
    }
}