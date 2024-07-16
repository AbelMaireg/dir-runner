

class Item {
    tag: string;
    single: boolean;
    branch: Item[] = [];

    constructor(tag: string, s: boolean = false) {
        this.tag = tag;
        this.single = s;
    }

    add_branch(b: Item): void {
        if (!this.single)
        this.branch.push(b);
    }

    doo() {
        console.log(this.tag);
    }

    traverse(indent: number = 0, is_last: boolean = false, shell: number = -1) {
        let text_color = this.single ? this.colors.fg.green : this.colors.fg.blue; 
        if (indent == 0)
        console.log(this.colors.fg.yellow + '. ' + this.tag + this.colors.reset);
        else {
            if (!is_last)
            console.log(
                this.colors.fg.yellow +
                ' '.repeat(( indent - shell ) * 4) +
                '│   '.repeat(shell) + '├──' +
                text_color +
                this.colors.bright +
                this.tag +
                this.colors.reset + 
                " shell: " + shell
            );
            else 
            console.log(
                this.colors.fg.yellow +
                ' '.repeat(( indent - shell ) * 4) +
                '│   '.repeat(shell) + '└──' +
                text_color +
                this.colors.bright +
                this.tag +
                this.colors.reset +
                " shell: " + shell
            );
        }

        if (is_last) shell--;

        this.branch.forEach((_br, index) => {
            let _is_last = index == this.branch.length - 1;
            let _is_first = index == 0;

            if (_is_first) shell++;

            _br.traverse(indent + 1, _is_last, shell);

        })
    };

    readonly colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",

        fg: {
            black: "\x1b[30m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
        },
        bg: {
            black: "\x1b[40m",
            red: "\x1b[41m",
            green: "\x1b[42m",
            yellow: "\x1b[43m",
            blue: "\x1b[44m",
            magenta: "\x1b[45m",
            cyan: "\x1b[46m",
            white: "\x1b[47m",
        }
    };
};

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
            profile.add_branch(images_user);
        let posts = new Item("posts");
            posts.add_branch(new Item("news"));
            posts.add_branch(new Item("jobs"));
        images.add_branch(profile);
        images.add_branch(posts);
pub.add_branch(files);
pub.add_branch(images);

pub.traverse();
