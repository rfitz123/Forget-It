class Node {
    /*
    Node class is a node that may be a link or a directory.
    Node class may store a link OR a name.
    Node class contains parent, pointing to its parent node.
    */

    constructor(id, isLink, link, name, parent, children) {
        this.id = id;
        this.isLink = isLink;
        this.link = link;
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
        var node_str = "";

        if (this.isLink) {
            node_str += "l";
            node_str += this.link;
        } else {
            node_str += "d";
            node_str += this.name;
        }

        node_str += ".";
        node_str += this.parent;
        
        return node_str;
    }

    toHtml() {
        var html_str = "";
        console.log(this);

        if (this.isLink) {
            html_str = `
            <li>
                <div style='border: 2px dashed black'>
                    <a href=${this.link}>${this.link}</a>
                </div>
            </li>
            `;
        } else {
            console.log(this.id);
            html_str = `
            <li>
                <div style='border: 2px dashed black'>
                        ${this.name}
                    <ul id='${this.id}'></ul>
                    <button class='button' id=d${this.id}>
                        <i class='fas fa-folder-plus'></i>
                    </button>
                    <button class='button' id=l${this.id}>
                        <i class='fas fa-link'></i>
                    </button>
                </div>
            </li>
            `;
        }

        return html_str
    }
}

/* Visually lays out children of  */
function listChildren(id, tree){
    for (var key in tree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id) {
            document.getElementById(id).innerHTML += tree[key].toHtml();
        }
    }
}

/* Prompts user text to create a folder or link */
function promptText(node, isLink) {
    node.children += 1;

    /* Looks long because we ensure link text is " " rather than null */
    linkTree[node.id + node.children.toString()] = new Node(node.id + node.children.toString(), isLink, 
        document.getElementById('text-field').value == "" ? " " : document.getElementById('text-field').value, "", node.id, 0);

    /* Refresh text field */
    document.getElementById('text-field').value = "";

    loadTree();

    console.log("d" + node.id + node.children.toString());
    
    if (!linkTree[node.id + node.children.toString()].isLink) {
        document.getElementById("d" + node.id + node.children.toString()).addEventListener("click", function () {
            promptText(linkTree[node.id + node.children.toString()], false);
        });
        document.getElementById("l" + node.id + node.children.toString()).addEventListener("click", function () {
            promptText(linkTree[node.id + node.children.toString()], true);
        });
    }
}

/* Dictionary holding our tree of Nodes */
var linkTree = {
    '0': new Node('0', false, "", "", '', 0)
};

/* Function to visually load tree and event listeners, reused every time an edit is made */
function loadTree() {
    document.getElementById('0').innerHTML = "";
        
    ids = [];

    for (key in linkTree) {
        if (!ids.includes(key)) {
            ids.push(key);
        }
    }

    for (i = 0; i < ids.length; i++) {
        listChildren(ids[i], linkTree);
    }
}

/* Creates an event listener for the option to create link or directory for each node. */
window.onload = function () {
    console.log("onload");
    for (var key in linkTree) {
        if (!linkTree[key].link) {
            document.getElementById("d" + linkTree[key].id).addEventListener("click", function () {
                promptText(linkTree[key], false);
            });
            document.getElementById("l" + linkTree[key].id).addEventListener("click", function () {
                promptText(linkTree[key], true);
            });
        }
    }
}