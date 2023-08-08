class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.userNamesAndIds = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(username, userId) {
    let node = this.root;
    for (let char of username) {
      if ("A" <= char && char <= "Z") char = char.toLowerCase();
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
    node.userNamesAndIds.push({ username, userId });
  }

  recommend(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    return this.getAllUsersFromNode(node, prefix);
  }

  getAllUsersFromNode(node, prefix) {
    const words = [];
    if (node.isEndOfWord) {
      words.push(...node.userNamesAndIds);
    }
    for (const [char, childNode] of node.children) {
      const childWords = this.getAllUsersFromNode(childNode, prefix + char);
      words.push(...childWords);
    }
    return words;
  }
}

module.exports = Trie;
