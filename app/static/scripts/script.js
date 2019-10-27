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
        let node_str = "";

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
        let html_str = "";

        if (this.isLink) {
            /* Makes the link more usable */
            let textValue = verifyLink(this.link);

            html_str = `
            <li id='li${this.id}'>
                <div class='link-div' id='div${this.id}' style='display: block; padding-bottom: 20px;'>
                    <a href=${textValue} target="_blank">
                        <div class='link-leaf' id='${this.id}'>
                            <i class='fas fa-external-link-alt'></i>
                        </div>
                    </a>
                </div>
            </li>
            `;
        } else {
            html_str = `
            <li id='li${this.id}'>
                <div style='color: white;'>
                    <ul id='${this.id}'></ul>
                    <p style='display: inline-block; padding: 0; margin: 0;'>${this.name}</p>
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

    for(let key in linkTree) {
        if(key !== "0") {
            childRect = document.getElementById("div" + key).getBoundingClientRect();
            parentRect = document.getElementById("div" + key.slice(0, -1)).getBoundingClientRect();

            x1 = childRect.left + (childRect.width / 2);
            y1 = childRect.top + 27.5;
            x2 = parentRect.left + (parentRect.width / 2);
            y2 = parentRect.top + 27.5;
            
            document.getElementById('connection-space').innerHTML += `<line class='branch' id='line-${key}' x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#755331" stroke-width="${40 / Math.sqrt(linkTree[key].id.length)}" stroke-linecap="round"/>`;
        }
    }
}

/* Recursively deletes itself and its children */
function deleteBranch(deleteKey) {
    let tempNode = linkTree[deleteKey];

    /* Delete from localStorage */
    window.localStorage.removeItem(tempNode.id);

    /* Call deleteBranch on any children. */
    if (tempNode.children > 0) {
        for (let i = 1; i <= tempNode.children; i++) {
            deleteBranch(tempNode.id + i);
        }
    }

    /* Delete the node from linkTree */
    delete linkTree[tempNode.id];

    let index = ids.indexOf(tempNode.id);

    /* Remove from ids */
    if (index > -1) {
        ids.splice(index, 1);
    }
}

/* Visually lays out children of Node id */
function listChildren(id, ids) {
    for (let key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !ids.includes(key)) {
            document.getElementById(id).innerHTML += linkTree[key].toHtml();
            ids.push(key);    
        }
    }
}

/* Creates all eventhandlers under id parent */
function createEventHandlers(id) {
    for (let key in linkTree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id && !linkTree[key].isLink) {
            document.getElementById("d" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), false);
            });
            document.getElementById("l" + key).addEventListener("click", function () {
                promptText(this.id.substr(1), true);
            });

            if (linkTree[key].children > 0) {
                createEventHandlers(key);
            }
        } else if (key.length == id.length + 1 && key.slice(0, id.length) === id) {
            document.getElementById(key).addEventListener("mouseenter", function () {

                let tempLink = linkTree[key].link;

                /* Remove leading shit to clean up visually */
                if (tempLink.includes("https://")) {
                    tempLink = tempLink.substr(8);
                } else if (tempLink.includes("http://")){
                    tempLink = tempLink.substr(7);
                }

                document.getElementById('my-text-field').value = tempLink;
            });
            document.getElementById(key).addEventListener("mouseleave", function () {
                document.getElementById('my-text-field').value = "";
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
    let node = linkTree[key];
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
    connectNodes();
}

/* Dictionary holding our tree of Nodes */
var linkTree = {
    '0': new Node('0', false, "", "", '', 0)
};

/* List holding all loaded Node ids */
var ids = ["0"];

/* Visually loads tree and event listeners, reused every time an edit is made */
function loadTree() {
    for (let key in linkTree) {
        if (!ids.includes(key)) {
            listChildren(key.slice(0, -1), ids);
        }
    }
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

    /* Redraw connections if window resized or content loads */
    window.addEventListener("resize", connectNodes);
    document.addEventListener("DOMContentLoaded", connectNodes);
    
    storageItems = Object.entries(localStorage);
    storageItems.sort(compare);

    for (let i = 0; i < storageItems.length; i++) {
        let code = storageItems[i][1];

        let ld = code.substr(0, 1);
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

    /* Recursively creates all eventhandlers */
    createEventHandlers("");

    connectNodes();

    /* Create SVG deletion eventlistener */
    document.getElementById("connection-space").addEventListener("click", function () {
        const isSvg = event.target.classList.contains('connection-space');
        if (!isSvg) {

            let tempId = event.target.id.substr(5);
            
            /* Remove already drawn elements */
            let li = document.getElementById("li" + event.target.id.substr(5));
            li.parentNode.removeChild(li);
            
            for (let key in linkTree) {
                if (key.length >= tempId.length && key.slice(0, tempId.length) === tempId) {
                    let line = document.getElementById("line-" + key);
                    line.parentNode.removeChild(line);
                }
            }

            deleteBranch(tempId);
            loadTree();
        }
    });
}