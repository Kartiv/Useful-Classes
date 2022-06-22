class vec2d{
    constructor(x0,x1){
        this.x0 = x0;
        this.x1 = x1;
    }

    add(v){
        return new vec2d(this.x0+v.x0, this.x1+v.x1);
    }

    sub(v){
        return new vec2d(this.x0-v.x0, this.x1-v.x1);
    }

    scale(scalar){
        return new vec2d(this.x0 * scalar, this.x1 * scalar);
    }

    dot(vec){
        return this.x0*vec.x0+this.x1*vec.x1;
    }

    norm(){
        return Math.sqrt((this.x0)**2+(this.x1)**2);
    }

    normalize(){
        if(this.norm()==0){
            return new vec2d(0,0);
        }
        return new vec2d(this.x0/this.norm(), this.x1/this.norm());
    }

    normal(){
        return (new vec2d(-this.x1, this.x0)).normalize();
    }

    project(axis){
        return this.dot(axis)/axis.norm();
    }
}