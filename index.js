
import express from 'express';
import multer from 'multer';
import path from 'path';
import * as fs from 'node:fs';

const app = express();
const port = 3000;

// saving the uploaded files( storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage, dest: 'uploads/' });


// medleware functions

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('public/images'));
app.use('/src', express.static('src'));
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cards array
let currentPosts = [
    {
        id: 1,
        title: "Necklace)",
        description:
            "Quality: Steel,  Price:150Af",
        image: "images/1.jpg",
        imagePath: "",
    },
    {
        id: 2,
        title: "Pack of Rings)",
        description:
            "9 rings in one pack, Price:280Af",
        image: "images/2.jpg",
        imagePath: "",
    },
    {
        id: 3,
        title: "3 Line Necklace✨",
        description:
            "Items: 3line necklace and it's earings, Price:200Af",
        image: "images/3.jpg",
        imagePath: "",
    },
    {
        id: 4,
        title: "10 gold color rings in one pack)",
        description:
            "Quality:Steel, Price:280Af",
        image: "images/4.jpg",
        imagePath: "",
    },
    {
        id: 5,
        title: "Sunglass😎",
        description:
            "In two colors: green & brown, Price:300Af",
        image: "images/5.jpg",
        imagePath: "",
    },
    {
        id: 6,
        title: "Dior & Chanel Necklaces",
        description:
            "Price: Diffrent, come to direct😂",
        image: "images/6.jpg",
        imagePath: "",
    }
];

// rendering the first page
let posts = [...currentPosts];
app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
});
app.get('/new-post', (req, res) => {
    const card = { id: 1, title: 'Test Card', description: 'This is a test card' };
    res.render('new-post', { card: card });
});

//upload image 

app.post('/upload', upload.single('profileImage'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    posts.push({
        id: posts.length + 1,
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename, // the uploaded file name as the image property
        imagePath: `/uploads/${req.file.filename}`, // And the full path as the imagePath property

    });

    return res.redirect("/");
})

//Edit posts

app.get('/edit-post/:id', (req, res) => {
    const postId = req.params.id;
    let post;

    // Check if the post exists in posts
    post = posts.find((post) => post.id === parseInt(postId));

    if (!post) {
        // If the post is not found in posts, check if it exists in the uploaded posts directory
        const uploadedPostPath = `/uploads/${postId}.jpg`;
        if (fs.existsSync(uploadedPostPath)) {
            post = {
                id: postId,
                title: "",
                description: "",
                image: uploadedPostPath,
                imagePath: "",
            };
        } else {
            return res.status(404).send('Post not found');
        }
    }

    res.render('edit-post', { post: post });
});

app.post('/edit-post/:id', upload.single('profileImage'), (req, res) => {
    const postId = req.params.id;
    let postIndex = posts.findIndex((post) => post.id === parseInt(postId));

    if (postIndex === -1) {
        // If the post is not found in posts, update the uploaded post
        const uploadedPostPath = `/uploads/${postId}.jpg`;
        if (fs.existsSync(uploadedPostPath)) {
            if (req.file) {
                fs.writeFileSync(uploadedPostPath, req.file.buffer);
            }

            res.redirect("/");
        } else {
            return res.status(404).send('Post not found');
        }
    } else {
        const post = posts[postIndex];

        post.title = req.body.title;
        post.description = req.body.description;

        if (req.file) {
            post.image = req.file.filename;
            post.imagePath = `/uploads/${req.file.filename}`;
        }

        posts[postIndex] = post;

        res.redirect("/");
    }
});

//Delete posts
app.post("/delete/:id", (req, res) => {
    const Id = parseInt(req.params.id);
    posts = posts.filter((post) => post.id !== Id);
    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});