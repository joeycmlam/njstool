import hashlib
import time


class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index  # Block number
        self.timestamp = timestamp  # Timestamp when block is created
        self.data = data  # Transactions or data to store in the block
        self.previous_hash = previous_hash  # Hash of the previous block
        self.nonce = 0  # Random number used for proof of work
        self.hash = self.calculate_hash()  # Current block's hash

    def calculate_hash(self):
        """
        Creates a hash of the block combining its attributes.
        """
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty):
        """
        Proof of work: Finds a hash that starts with a certain number of zeroes ('difficulty').
        """
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"Block mined: {self.hash}")


class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]  # Initialize the blockchain with the genesis block
        self.difficulty = 4  # Number of leading zeroes required in hash

    def create_genesis_block(self):
        """
        Creates the first block in the blockchain.
        """
        return Block(0, time.time(), "Genesis Block", "0")

    def get_latest_block(self):
        """
        Returns the most recent block in the blockchain.
        """
        return self.chain[-1]

    def add_block(self, new_block):
        """
        Adds a new block to the blockchain after mining it.
        """
        new_block.previous_hash = self.get_latest_block().hash
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)

    def is_chain_valid(self):
        """
        Validates the blockchain by checking the hashes and links between blocks.
        """
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Check if the current block's hash is valid
            if current_block.hash != current_block.calculate_hash():
                return False

            # Check if the current block's previous hash matches the previous block's hash
            if current_block.previous_hash != previous_block.hash:
                return False

        return True


# Testing the Blockchain
if __name__ == "__main__":
    # Create a new blockchain
    my_blockchain = Blockchain()

    print("Mining block 1...")
    my_blockchain.add_block(Block(1, time.time(), "Block 1 Data", ""))

    print("Mining block 2...")
    my_blockchain.add_block(Block(2, time.time(), "Block 2 Data", ""))

    # Print the blockchain
    for block in my_blockchain.chain:
        print("\n-------------")
        print(f"Block {block.index}:")
        print(f"Timestamp: {block.timestamp}")
        print(f"Data: {block.data}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Hash: {block.hash}")

    # Validate the blockchain
    print("\nIs Blockchain Valid?", my_blockchain.is_chain_valid())