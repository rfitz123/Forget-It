from flask import render_template
from app import app


# class Tree:
#     """
#     Tree class is a node that may be a link or a directory.
#     Tree class may store a link OR a name.
#     Tree class contains parent, pointing to its parent node
#     """

#     def __init__(self, link, cargo=None, name=None, parent=None):
#         self.link = link
#         self.cargo = cargo
#         self.name = name
#         self.parent = parent

#     """
#     String is formatted as such
#     l (link) or d (directory)
#     The content, link for a link and directory name for a directory
#     The node it points to (0 if top node)

#     Ex: dNeuroscience.122
#     Ex: lwww.youtube.com/watch?v=pp-gA1FATyg.11
#     """

#     def __str__(self):
#         node_str = ""

#         if self.link:
#             node_str += "l"
#             node_str += self.cargo
#         else:
#             node_str += "d"
#             node_str += self.name

#         node_str += "."
#         node_str += self.parent

#         return node_str

# tree = {}
# tree["1"] = Tree(link=False, name="Tree", parent="0")
# tree["11"] = Tree(link=True, cargo="www.gofuckyourself.com", parent="1")
# tree["12"] = Tree(link=False, name="Cuckd", parent="1")
# tree["121"] = Tree(link=True, cargo="www.succonmydicclykaticc.com", parent="12")
# tree["122"] = Tree(link=True, cargo="www.fuckitwalter.com", parent="12")

@app.route('/')
def index():
    return render_template('index.html')