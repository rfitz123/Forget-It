from flask import render_template
from app import app


class Tree:
    """
    Tree class is a node that holds a reference to a node 
    on its left and right while holding a value itself.
    """

    def __init__(self, cargo, left=None, right=None, name=None):
        self.cargo = cargo
        self.left  = left
        self.right = right
        self.name = name

    def __str__(self):
        return str(self.cargo)

@app.route('/')
def index():
    return render_template('index.html')