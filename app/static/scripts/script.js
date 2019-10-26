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
    , followed by the id

    Ex: dNeuroscience,132
    Ex: lwww.youtube.com/watch?v=pp-gA1FATyg,2212
    */

    toStorageString() {
        var node_str = "";

        if (this.isLink) {
            node_str += "l";
            node_str += this.link;
        } else {
            node_str += "d";
            node_str += this.name;
        }

        node_str += ",";
        node_str += this.id.substr(1);

        return node_str;
    }

    toHtml() {
        var html_str = "";

        if (this.isLink) {
            /* Makes the link more usable */
            var textValue = verifyLink(this.link);

            html_str = `
            <li>
                    <div id='div${this.id}' style='display: block; padding-bottom: 20px;'>
                        <a href=${textValue}>
                            <div class='link-leaf'>${textValue}</div>
                        </a>
                    </div>
            </li>
            `;
        } else {
            html_str = `
            <li>
                <div>
                    <ul id='${this.id}'></ul>
                    ${this.name}
                    <div style='height: calc(${10 / this.id.length}vh - 70px);'></div>
                    <div id='div${this.id}' style='display: block;'>
                        <button class='button' id=d${this.id}>
                            <i class='fas fa-folder-plus'></i>
                        </button>
                        <button class='button' id=l${this.id}>
                            <i class='fas fa-link'></i>
                        </button>
                    </div>
                </div>
            </li>
            `;
        }

        return html_str
    }
}

/* Connects Nodes */
function connectNodes() {

    /* Clear existing connections */
    document.getElementById('connection-space').innerHTML = "";

    for(var key in linkTree) {
        if(key !== "0") {
            childRect = document.getElementById("div" + key).getBoundingClientRect();
            parentRect = document.getElementById("div" + key.slice(0, -1)).getBoundingClientRect();

            console.log(key);
            console.log(childRect);
            console.log(parentRect);

            x1 = childRect.left + (childRect.width / 2);
            y1 = childRect.top + 27.5;
            x2 = parentRect.left + (parentRect.width / 2);
            y2 = parentRect.top + 27.5;
            document.getElementById('connection-space').innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#755331" stroke-width="40" stroke-linecap="round"/>`;
        }
    }
}

/* Visually lays out children of Node id */
function listChildren(id, ids) {
    for (var key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !ids.includes(key)) {
            document.getElementById(id).innerHTML += linkTree[key].toHtml();
            ids.push(key);    
        }
    }
}

/* Creates all eventhandlers under id parent */
function createEventHandlers(id) {
    for (var key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !linkTree[key].isLink) {
            console.log("key" + key);
            document.getElementById("d" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), false);
            });
            document.getElementById("l" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), true);
            });

            if (linkTree[key].children > 0) {
                createEventHandlers(key);
            }
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

        linkTree[id] = new Node(id, true, textValue, "", node.id, 0);
        window.localStorage.setItem(id, linkTree[id].toStorageString())
    } else {
        linkTree[id] = new Node(id, false, "", textValue, node.id, 0);
        window.localStorage.setItem(id, linkTree[id].toStorageString())
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

/* Visually loads tree and event listeners, reused every time an edit is made */
function loadTree() {
    for (key in linkTree) {
        if (!ids.includes(key)) {
            listChildren(key.slice(0, -1), ids);
        }
    }
    connectNodes();
}

/* Comparison function to sort localStorage items */
function compare(a, b) {
    if (a[1].split(',')[1] < b[1].split(',')[1]){
      return -1;
    }
    if (a[1].split(',')[1] < b[1].split(',')[1]){
      return 1;
    }
    return 0;
}

/* Creates an event listener for the option to create link or directory for each node. */
window.onload = function () {
    document.getElementById("d0").addEventListener("click", function () {
        promptText("0", false);
    });
    document.getElementById("l0").addEventListener("click", function () {
        promptText("0", true);
    });

    storageItems = Object.entries(localStorage);
    storageItems.sort(compare);

    for (var i = 0; i < storageItems.length; i++) {
        var code = storageItems[i][1];

        var ld = code.substr(0, 1);
        code = code.substr(1).split(',');

        /* We removed the leading 0 for storage efficiency, putting it back */
        code[1] = "0" + code[1];

        /* Create Node for either a link or a directory */
        if (ld === "l") {
            linkTree[code[1].slice(0, -1)].children++;
            linkTree[code[1]] = new Node(code[1], true, code[0], "", code[1].slice(0, -1), 0);
        } else {
            linkTree[code[1].slice(0, -1)].children++;
            linkTree[code[1]] = new Node(code[1], false, "", code[0], code[1].slice(0, -1), 0);
        }
    }

    loadTree();

    /* Prevent duplicate event handlers */
    eventHandlers = [];

    /* Create event handlers */
    for (var i = 0; i < storageItems.length; i++) {
        var code = storageItems[i][1];
        var id = "0" + storageItems[i][1].split(',')[1];
        var ld = code.substr(0, 1);

        /* Only create if directory */
        if (ld === "d" && !eventHandlers.includes(id.slice(0, -1))) {
            eventHandlers += id.slice(0, -1);
            createEventHandlers(id.slice(0, -1));
        }
    }
    connectNodes();
}