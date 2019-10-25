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

        if (this.isLink) {
            html_str = `
            <li>
                <div>
                    <a href=${this.link}>${this.link}</a>
                </div>
            </li>
            `;
        } else {
            html_str = `
            <li>
                <div>
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

/* Visually lays out children of Node id */
function listChildren(id, ids) {
    for (var key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !ids.includes(key)) {
            document.getElementById(id).innerHTML += linkTree[key].toHtml();
        }
    }
}

/* Creates all eventhandlers under id parent */
function createEventHandlers(id) {
    for (var key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !linkTree[key].isLink) {
            document.getElementById("d" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), false);
            });
            document.getElementById("l" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), true);
            });
        }
    }
}

/* Takes a link and ensures it is in a usable form */
function verifyLink(link) {
    if (link !== " " && link.slice(0, 4) !== "http") {
        link = "http://" + link;
    }

    return link;
}

/* Prompts user text to create a folder or link */
function promptText(key, isLink) {
    var node = linkTree[key];
    node.children += 1;
    id = node.id + node.children.toString();

    textValue = document.getElementById('my-text-field').value;

    /* Create Node for either a link or a directory */
    if (isLink) {

        /* Don't make an empty link node */
        if (textValue == "") {
            return;
        }

        /* Makes the link more usable */
        textValue = verifyLink(textValue);

        linkTree[id] = new Node(id, true, textValue, "", node.id, 0);
    } else {
        linkTree[id] = new Node(id, false, "", textValue, node.id, 0);
    }

    /* Refresh text field */
    document.getElementById('my-text-field').value = "";

    loadTree();
    createEventHandlers(id.slice(0, -1));
}

/* Dictionary holding our tree of Nodes */
var linkTree = {
    '0': new Node('0', false, "", "", '', 0)
};

/* List holding all loaded Node ids */
var ids = ["0"];

/* Function to visually load tree and event listeners, reused every time an edit is made */
function loadTree() {
    for (key in linkTree) {
        if (!ids.includes(key)) {
            listChildren(key.slice(0, -1), ids);
            ids.push(key);
        }
    }
}

/* Creates an event listener for the option to create link or directory for each node. */
window.onload = function () {
    for (var key in linkTree) {
        if (!linkTree[key].link) {
            document.getElementById("d" + linkTree[key].id).addEventListener("click", function () {
                promptText(key, false);
            });
            document.getElementById("l" + linkTree[key].id).addEventListener("click", function () {
                promptText(key, true);
            });
        }
    }
}