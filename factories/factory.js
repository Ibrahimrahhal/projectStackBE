class Factory{
    constructor(isFirstInit){
        if(!isFirstInit)
            throw new Error("this is a singleton class");
    }
}



module.exports = Factory;