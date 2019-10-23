class Node {
    /*
    Node class is a node that may be a link or a directory.
    Node class may store a link OR a name.
    Node class contains parent, pointing to its parent node.
    */

    constructor(id, isLink, link, name, parent) {
        this.id = id;
        this.isLink = isLink;
        this.link = link;
        this.name = name;
        this.parent = parent;
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
                <div style='border: 2px dashed black'>
                    <a href=${this.link}>${this.link}</a>
                </div>
            </li>
            `;
        } else {
            html_str = `
            <li>
                <div style='border: 2px dashed black'>
                    ${this.name}
                    <ul id='0${this.id}'></ul>
                </div>
            </li>
            `;
        }

        return html_str
    }
}

function listChildren(id, tree){
    for (var key in tree) {
        if (key.length == id.length + 1 && key.slice(0, id.length) === id) {
            document.getElementById('0' + id).innerHTML += tree[key].toHtml();
        }
    }
}

function promptText(node) {

}

var linkTree = {
    '1': new Node('1', true, "http://www.google.com", "", '0'), 
    '2': new Node('2', false, "","Entertainment", '0'),
    '21': new Node('21', true, "http://www.youtube.com", "", '2'),
    '22': new Node('22', false, "", "Games", '2'),
    '221': new Node('221', true, "http://addictinggames.com", "", '22')
};

listChildren('', linkTree);
listChildren('2', linkTree);
listChildren('22', linkTree);

/* Creates an event listener for the option to create link or directory for each node. */
/* FIX, THEY ARE NOT APPLICABLE TO LINK KEYS IF STATEMENT? */
// for (var key in tree) {
//     document.getElementById('list-0').innerHTML += tree[key].toHtml();
//     // document.getElementById("bl" + tree[key].id).addEventListener("click", promptText(tree[key]));
//     // document.getElementById("bd" + tree[key].id).addEventListener("click", promptText(tree[key]));
// }