import colors from './colors';
import fs from "node:fs/promises";

class Item {
    tag: string;
    single: boolean;
    data: string;
    branch: Item[] = [];

    constructor(tag: string, s: boolean = false, data: string = "") {
        this.tag = tag;
        this.single = s;
        this.data = data;
    }

    add_branch(b: Item): void {
        if (!this.single)
        this.branch.push(b);
    }

    async create_dir(path: string[] = []) {
        path.push(this.tag);
        if (this.single) {
            console.log('create_file: ', this.tag, path.join('/'));
            Bun.write(path.join('/'), this.data);
        } else {
            console.log('create_dir:', this.tag, path.join('/'));
            fs.mkdir(path.join('/'), { recursive: true });
            this.branch.forEach((_br) => {
                _br.create_dir(path);
            })
        }
        path.pop();
    }

    traverse(indent: number = 0, is_last: boolean = true, level: number = 0, cables: number[] = []) {
        if (indent == 0)
            console.log(colors.fg.yellow + '. ' + this.tag + colors.reset);
        else {
            let text_color = this.single ? colors.fg.green : colors.fg.blue; 

            let str: string = colors.fg.yellow;
            for (let i = 0; i < level - 1; ++i) {
                if (cables.indexOf(i) != -1) {
                    str += "│   ";
                } else {
                    str += "    ";
                }
            }
            if (!is_last) str += '├── '; else { str += '└── ' };
            str += text_color + colors.bright + this.tag + colors.reset;

            console.log(str)
        }

        if (is_last) cables.splice(cables.indexOf(level - 1), 1);

        this.branch.forEach((_br, index) => {
            let _is_last = index == this.branch.length - 1;

            cables.push(level)

            _br.traverse(indent + 1, _is_last, level + 1, cables);

        })

        if (!is_last) cables.splice(cables.indexOf(level), 1);
    }
};

function generateTree(): Item {
    const root = new Item("root");

    let itemCount = 1; // Start counting from the root

    function addChildren(parent: Item, depth: number) {
        if (itemCount >= 100 || depth > 4) return;

        const numChildren = Math.min(10, 100 - itemCount); // Adjust to ensure at least 100 items

        for (let i = 0; i < numChildren; i++) {
            const child = new Item(`Item_${itemCount + 1}`);
            parent.add_branch(child);
            itemCount++;
            addChildren(child, depth + 1);
        }
    }

    addChildren(root, 1);

    return root;
}

const tree = generateTree();
tree.create_dir();

let pub = new Item("public");
let files = new Item("files");
files.add_branch(new Item("tmp"));
files.add_branch(new Item("trash"));
let images = new Item("images");
let profile = new Item("profile");
profile.add_branch(new Item("admin"));
let images_user = new Item("user");
images_user.add_branch(new Item("abel.png", true))
images_user.add_branch(new Item("maireg.png", true))
images_user.add_branch(new Item("gg.png", true))
profile.add_branch(images_user);
let posts = new Item("posts");
posts.add_branch(new Item("news"));
posts.add_branch(new Item("jobs"));
posts.add_branch(new Item("---"))
images.add_branch(profile);
images_user.add_branch(posts);
pub.add_branch(files);
pub.add_branch(images);
pub.add_branch(new Item(".env", true, "heloo"));

pub.create_dir([ "hello" ]);
pub.traverse()
