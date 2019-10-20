class Node {
    /*
    Node class is a node that may be a link or a directory.
    Node class may store a link OR a name.
    Node class contains parent, pointing to its parent node.
    */

    constructor(id, link, cargo = null, name = null, parent = null, children = []) {
        this.id = id;
        this.link = link;
        this.cargo = cargo;
        this.name = name;
        this.parent = parent;
        this.children = children;
    }

    /*
    String is formatted as such
    l (link) or d (directory)
    The content, link for a link and directory name for a directory

    Ex: dNeuroscience
    Ex: lwww.youtube.com/watch?v=pp-gA1FATyg
    */

    toString() {
        node_str = "";

        if (this.link) {
            node_str += "l";
            node_str += this.cargo;
        } else {
            node_str += "d";
            node_str += this.name;
        }

        node_str += ".";
        node_str += this.parent;
        
        return node_str;
    }
}

function promptText(node) {

}

var tree = {};

/* Creates an event listener for the option to create link or directory for each node. */
/* FIX, THEY ARE NOT APPLICABLE TO LINK KEYS IF STATEMENT? */
for (var key in tree) {
    document.getElementById("bl" + tree[key].id).addEventListener("click", promptText(tree[key]));
    document.getElementById("bd" + tree[key].id).addEventListener("click", promptText(tree[key]));
}