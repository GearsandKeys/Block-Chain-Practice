const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2021", "Genesis Block", "Random Data");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){ //would also be good to have a time requirement, bitcoin uses 10 mins
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock); //normal this is more intense with P2P network
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            return true; //if it doesn't return from the two previous functions, it must be true
        }
    }
}

let speckPenny = new BlockChain(); //speckPenny.... Bitcoin... get it?
speckPenny.addBlock(new Block (1, "02/02/2021", {amount: 4}));
speckPenny.addBlock(new Block (2, "03/03/2021", {amount: 10}));

console.log(JSON.stringify(speckPenny, null, 4)); //JSON.stringify(value[, replacer[, space]])
console.log('Is blockChain valid? ' + speckPenny.isChainValid());

speckPenny.chain[1].data = {amount: 100 }; //Tampering the amount for index 1
console.log(JSON.stringify(speckPenny, null, 4)); 
console.log('Is blockChain valid? ' + speckPenny.isChainValid());

