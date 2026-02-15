class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.nonce = 0
    this.hash = this.calculateHash()
  }

  calculateHash() {
    // creates a hash of the block using all its data
    return CryptoJS.SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      this.data +
      this.nonce
    ).toString()
  }

  mine(difficulty) {
    // mines the block by repeatedly changing the nonce until the hash starts with enough zeros
    const target = "0".repeat(difficulty)
    const start = performance.now()

    while (!this.hash.startsWith(target)) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    return Math.round(performance.now() - start)
  }
}

class Blockchain {
  constructor() {
    this.chain = [new Block(0, new Date().toLocaleString(), "Genesis Block", "0")]
    this.difficulty = 2
  }

  addBlock(data) {
    // adds a new block to the chain after mining it
    const prev = this.chain[this.chain.length - 1]
    const block = new Block(
      this.chain.length,
      new Date().toLocaleString(),
      data,
      prev.hash
    )

    const time = block.mine(this.difficulty)
    this.chain.push(block)
    return time
  }

  isValid() {
    // checks if the entire chain is valid by checking each block's hash and connections
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i]
      const prev = this.chain[i - 1]

      if (curr.hash !== curr.calculateHash()) return false
      if (curr.previousHash !== prev.hash) return false
    }
    return true
  }
}

const blockchain = new Blockchain()
