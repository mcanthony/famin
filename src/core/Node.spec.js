import Node from './Node';
import Vec3 from '../util/Vec3';
import SinglyLinkedList from '../util/SinglyLinkedList';

describe('Node', function() {
  beforeEach(function() {
    this.node = Node.instance();
  });

  it('should return a Node', function() {
    expect(this.node instanceof Node).toBe(true);
    expect(this.node._children instanceof SinglyLinkedList).toBe(true);
    expect(this.node._size instanceof Array).toBe(true);  // "Vec3"
  });
});

describe('Node#addChild', function() {
  beforeEach(function() {
    this.node = Node.instance();
  });

  it('should add children', function() {
    var child = Node.instance();
    child.id = 'child';
    this.node.addChild(child);
    expect(this.node._children.head.data.id).toBe('child');
  });
});

describe('Node#getChild', function() {
  it('should retrieve the child at the given index', function() {
    var node = Node.instance();
    var child0 = Node.instance(); node.addChild(child0);
    var child1 = Node.instance(); node.addChild(child1);
    expect(node.getChild(0)).toBe(child0);
    expect(node.getChild(1)).toBe(child1);
  });
});

describe('Node#eachChildren', function() {
  beforeEach(function() {
    this.node = Node.instance();
  });

  it('should run iteratively on all children', function() {
    var func = function(node) { node.wasTouched = true; };
    this.node.addChild(Node.instance());
    this.node.addChild(Node.instance());
    this.node.eachChild(func);
    expect(this.node._children.head.data.wasTouched).toBe(true);
    expect(this.node._children.tail.data.wasTouched).toBe(true);
  });
});

describe('Node#eachDescendant', function() {
  beforeEach(function() {
    this.parent = Node.instance();

    this.child1 = Node.instance(); this.parent.addChild(this.child1);
    this.child2 = Node.instance(); this.parent.addChild(this.child2);

    this.gchild1a = Node.instance(); this.child1.addChild(this.gchild1a);
    this.gchild1b = Node.instance(); this.child1.addChild(this.gchild1b);
    this.gchild2a = Node.instance(); this.child2.addChild(this.gchild2a);
    this.gchild2b = Node.instance(); this.child2.addChild(this.gchild2b);
  });

  it('should run iteratively on all descendents when returning true', function() {
    var func = function(node) { node.wasTouched = true; return true; };
    this.parent.eachDescendant(func);

    expect(this.parent.getChild(0).wasTouched).toBe(true);
    expect(this.parent.getChild(1).wasTouched).toBe(true);
    expect(this.parent.getChild(0).getChild(0).wasTouched).toBe(true);
    expect(this.parent.getChild(0).getChild(1).wasTouched).toBe(true);
    expect(this.parent.getChild(1).getChild(0).wasTouched).toBe(true);
    expect(this.parent.getChild(1).getChild(1).wasTouched).toBe(true);
  });

  it('should skip descendents when returning false', function() {
    var func = function(node) {
      node.wasTouched = true;
      return !node.skip_children;
    }
    this.child2.skip_children = true;
    this.parent.eachDescendant(func);

    expect(this.parent.getChild(0).wasTouched).toBe(true);
    expect(this.parent.getChild(1).wasTouched).toBe(true);
    expect(this.parent.getChild(0).getChild(0).wasTouched).toBe(true);
    expect(this.parent.getChild(0).getChild(1).wasTouched).toBe(true);
    expect(this.parent.getChild(1).getChild(0).wasTouched).toBe(undefined);
    expect(this.parent.getChild(1).getChild(1).wasTouched).toBe(undefined);
  });

});
