import colors from './colors';
import fs from "node:fs/promises";

export default class Walker {
    tag: string;
    single: boolean;
    data: string;
    branch: Walker[] = [];

    constructor(tag: string, s: boolean = false, data: string = "") {
        this.tag = tag;
        this.single = s;
        this.data = data;
    }

    add_branch(b: Walker): void {
        if (!this.single)
        this.branch.push(b);
    }

    async create_dir(path: string[] = []) {
        path.push(this.tag);
        if (this.single) {
            console.log('create_file: ', this.tag, path.join('/'));
            fs.writeFile(path.join('/'), this.data);
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
